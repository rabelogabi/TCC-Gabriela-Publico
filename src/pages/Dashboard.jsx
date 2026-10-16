
import { useEffect, useState } from "react";
import {
  Activity,
  HeartPulse,
  CalendarDays,
  Users,
  ChevronLeft,
  ChevronRight,
  Lock,
} from "lucide-react";

import "../styles/dashboard.css";

// A versão pública não utiliza o backend original.
// Uma API independente poderá ser configurada futuramente.
const API_URL =
  import.meta.env.VITE_API_URL?.trim().replace(/\/+$/, "") || "";

const imagens = [
  {
    src: "/dashboard/regioesIncidencia.png",
    titulo: "Taxa de incidência por região",
    descricao:
      "Evolução da taxa de incidência dos casos de dengue nas regiões brasileiras.",
  },
  {
    src: "/dashboard/mortalidadeRegiao.png",
    titulo: "Mortalidade por região",
    descricao:
      "Distribuição da mortalidade por dengue entre as regiões brasileiras.",
  },
  {
    src: "/dashboard/SerieBrasil.png",
    titulo: "Evolução dos casos no Brasil",
    descricao:
      "Série temporal dos casos de dengue registrados no Brasil.",
  },
  {
    src: "/dashboard/FaixaEtaria.png",
    titulo: "Casos por faixa etária",
    descricao:
      "Distribuição dos casos de dengue segundo a faixa etária.",
  },
  {
    src: "/dashboard/MascFem.png",
    titulo: "Distribuição por sexo",
    descricao:
      "Distribuição dos casos de dengue entre os sexos.",
  },
  {
    src: "/dashboard/idade 100 mil.png",
    titulo: "Incidência por idade",
    descricao:
      "Taxa de incidência de dengue segundo a faixa etária.",
  },
  {
    src: "/dashboard/mortalidadeFaixa.png",
    titulo: "Mortalidade por faixa etária",
    descricao:
      "Distribuição dos óbitos por dengue segundo a faixa etária.",
  },
  {
    src: "/dashboard/letalidadeRegioes.png",
    titulo: "Letalidade por região",
    descricao:
      "Análise da letalidade dos casos de dengue nas regiões brasileiras.",
  },
  {
    src: "/dashboard/top10municipios.png",
    titulo: "Municípios com maior incidência",
    descricao:
      "Municípios brasileiros com destaque nos registros de dengue.",
  },
  {
    src: "/dashboard/top10CentroOeste.png",
    titulo: "Centro-Oeste",
    descricao:
      "Principais municípios da região Centro-Oeste.",
  },
  {
    src: "/dashboard/SerieRaca.png",
    titulo: "Distribuição por raça",
    descricao:
      "Distribuição dos casos de dengue segundo raça/cor.",
  },
  {
    src: "/dashboard/SerieRaca - Copia.png",
    titulo: "Análise por raça",
    descricao:
      "Visualização complementar dos registros segundo raça/cor.",
  },
];

function Dashboard() {
  // Usuário salvo localmente
  const [usuario, setUsuario] = useState(() => {
    if (!API_URL) {
      return null;
    }

    try {
      const usuarioSalvo = localStorage.getItem("usuario");
      return usuarioSalvo ? JSON.parse(usuarioSalvo) : null;
    } catch (erro) {
      console.error("Erro ao recuperar usuário:", erro);
      return null;
    }
  });

  // Indicadores epidemiológicos
  const [indicadores, setIndicadores] = useState({
    casos: 0,
    obitos: 0,
    periodo: "",
    sexoPredominante: "",
    totalSexoPredominante: 0,
  });

  const [carregandoIndicadores, setCarregandoIndicadores] =
    useState(Boolean(API_URL));

  const [erroIndicadores, setErroIndicadores] =
    useState(!API_URL);

  // Atualizar informações do usuário
  useEffect(() => {
    function atualizarUsuario() {
      if (!API_URL) {
        setUsuario(null);
        return;
      }

      try {
        const usuarioSalvo = localStorage.getItem("usuario");

        setUsuario(
          usuarioSalvo ? JSON.parse(usuarioSalvo) : null
        );
      } catch (erro) {
        console.error("Erro ao recuperar usuário:", erro);
        setUsuario(null);
      }
    }

    window.addEventListener(
      "usuarioLogado",
      atualizarUsuario
    );

    window.addEventListener(
      "storage",
      atualizarUsuario
    );

    return () => {
      window.removeEventListener(
        "usuarioLogado",
        atualizarUsuario
      );

      window.removeEventListener(
        "storage",
        atualizarUsuario
      );
    };
  }, []);

  // Buscar indicadores somente com uma API configurada
  useEffect(() => {
    if (!API_URL) {
      setCarregandoIndicadores(false);
      setErroIndicadores(true);
      return;
    }

    const controlador = new AbortController();

    async function buscarIndicadores() {
      try {
        setCarregandoIndicadores(true);
        setErroIndicadores(false);

        const resposta = await fetch(
          `${API_URL}/indicadores`,
          {
            signal: controlador.signal,
          }
        );

        if (!resposta.ok) {
          throw new Error("Erro ao buscar indicadores.");
        }

        const dados = await resposta.json();

        if (!dados.sucesso) {
          throw new Error(
            dados.mensagem ||
            "Erro ao carregar indicadores."
          );
        }

        setIndicadores({
          casos: dados.casos || 0,
          obitos: dados.obitos || 0,
          periodo: dados.periodo || "",
          sexoPredominante:
            dados.sexoPredominante || "",
          totalSexoPredominante:
            dados.totalSexoPredominante || 0,
        });
      } catch (erro) {
        if (erro.name === "AbortError") {
          return;
        }

        console.error(
          "Erro ao carregar indicadores:",
          erro
        );

        setErroIndicadores(true);
      } finally {
        if (!controlador.signal.aborted) {
          setCarregandoIndicadores(false);
        }
      }
    }

    buscarIndicadores();

    return () => {
      controlador.abort();
    };
  }, []);

  // Formatar números
  function formatarNumero(numero) {
    return Number(numero).toLocaleString("pt-BR");
  }

  // Carrossel
  const [imagemAtual, setImagemAtual] = useState(0);

  function proximaImagem() {
    setImagemAtual(
      (atual) => (atual + 1) % imagens.length
    );
  }

  function imagemAnterior() {
    setImagemAtual(
      (atual) =>
        (atual - 1 + imagens.length) % imagens.length
    );
  }

  function selecionarImagem(indice) {
    setImagemAtual(indice);
  }

  function valorIndicador(valor, numerico = false) {
    if (carregandoIndicadores) {
      return "Carregando...";
    }

    if (erroIndicadores) {
      return "—";
    }

    return numerico ? formatarNumero(valor) : valor;
  }

  return (
    <main className="dashboard-page">
      <div className="dashboard-container">

        {/* CABEÇALHO */}
        <section className="dashboard-header">
          <h1>Dashboard Epidemiológico</h1>
        </section>

        {/* CARDS DE INDICADORES */}
        <section className="dashboard-resumo">
          <div className="indicadores-dashboard">

            {/* CASOS */}
            <div className="indicador-dashboard">
              <div className="indicador-dashboard-icon casos">
                <Activity size={26} />
              </div>

              <div>
                <h3>Casos de Dengue</h3>

                <strong>
                  {valorIndicador(indicadores.casos, true)}
                </strong>

                <p>Casos registrados</p>
              </div>
            </div>

            {/* ÓBITOS */}
            <div className="indicador-dashboard">
              <div className="indicador-dashboard-icon obitos">
                <HeartPulse size={26} />
              </div>

              <div>
                <h3>Óbitos</h3>

                <strong>
                  {valorIndicador(indicadores.obitos, true)}
                </strong>

                <p>Óbitos registrados</p>
              </div>
            </div>

            {/* PERÍODO */}
            <div className="indicador-dashboard">
              <div className="indicador-dashboard-icon municipios">
                <CalendarDays size={26} />
              </div>

              <div>
                <h3>Período analisado</h3>

                <strong>
                  {valorIndicador(indicadores.periodo)}
                </strong>

                <p>Período dos dados</p>
              </div>
            </div>

            {/* SEXO PREDOMINANTE */}
            <div className="indicador-dashboard">
              <div className="indicador-dashboard-icon incidencia">
                <Users size={26} />
              </div>

              <div>
                <h3>Sexo predominante</h3>

                <strong>
                  {valorIndicador(
                    indicadores.sexoPredominante
                  )}
                </strong>

                <p>
                  {carregandoIndicadores
                    ? "Carregando..."
                    : erroIndicadores
                    ? "—"
                    : `${formatarNumero(
                        indicadores.totalSexoPredominante
                      )} notificações`}
                </p>
              </div>
            </div>

          </div>
        </section>

        {/* IDENTIFICAÇÃO DOS DADOS */}
        <div className="dashboard-periodo-info">
          <p>
            <strong>
              Dados epidemiológicos referentes ao Brasil
            </strong>
            , considerando os registros de dengue
            analisados no período de 2013 a 2023.
          </p>

          {!API_URL && (
            <p>
              Versão pública demonstrativa: os
              indicadores que dependem do banco de
              dados não estão disponíveis.
            </p>
          )}
        </div>

        {/* VISUALIZAÇÃO PÚBLICA */}
        {!usuario && (
          <section className="dashboard-publico">

            {/* CARROSSEL */}
            <div className="dashboard-carrossel">

              <div className="dashboard-carrossel-header">
                <div>
                  <h3>
                    {imagens[imagemAtual].titulo}
                  </h3>

                  <p>
                    {imagens[imagemAtual].descricao}
                  </p>
                </div>
              </div>

              <div className="dashboard-carrossel-imagem">

                <button
                  className="carrossel-botao anterior"
                  onClick={imagemAnterior}
                  aria-label="Imagem anterior"
                  type="button"
                >
                  <ChevronLeft size={28} />
                </button>

                <img
                  src={imagens[imagemAtual].src}
                  alt={imagens[imagemAtual].titulo}
                />

                <button
                  className="carrossel-botao proximo"
                  onClick={proximaImagem}
                  aria-label="Próxima imagem"
                  type="button"
                >
                  <ChevronRight size={28} />
                </button>

              </div>

              <div className="carrossel-indicadores">
                {imagens.map((imagem, indice) => (
                  <button
                    key={imagem.src}
                    type="button"
                    className={
                      indice === imagemAtual
                        ? "ativo"
                        : ""
                    }
                    onClick={() =>
                      selecionarImagem(indice)
                    }
                    aria-label={
                      `Visualizar ${imagem.titulo}`
                    }
                  />
                ))}
              </div>

              <div className="carrossel-contador">
                {imagemAtual + 1} / {imagens.length}
              </div>

            </div>

            {/* AVISO DE ACESSO */}
            <div className="dashboard-login-aviso">
              <div className="dashboard-login-icone">
                <Lock size={22} />
              </div>

              <div>
                <strong>
                  Deseja realizar uma análise mais detalhada?
                </strong>

                <p>
                  Esta é uma versão demonstrativa do
                  sistema. O login e o cadastro estão
                  indisponíveis sem uma API própria.
                  As visualizações públicas podem ser
                  consultadas no carrossel e na página
                  de mapas.
                </p>
              </div>
            </div>

          </section>
        )}

        {/* VISUALIZAÇÃO INTERATIVA */}
        {usuario && (
          <section className="dashboard-interativo">

            <div className="dashboard-interativo-header">
              <div>
                <h2>
                  Dashboard Epidemiológico Interativo
                </h2>

                <p>
                  Utilize os filtros disponíveis no
                  painel para analisar os dados.
                </p>

                <p>
                  Bem-vinda,{" "}
                  <strong>{usuario.nome}</strong>.
                </p>
              </div>

              <div className="dashboard-status-login">
                <span className="dashboard-status-bolinha" />
                Usuário conectado
              </div>
            </div>

            {/* POWER BI */}
            <div className="dashboard-powerbi-wrapper">
              <iframe
                title="Dashboard Epidemiológico da Dengue"
                src="https://app.powerbi.com/view?r=eyJrIjoiN2ViNmU2MWQtMjdmOC00ZDdiLTkzNzQtZjc3MjkzMjQyMjkwIiwidCI6IjY1MGZkYzAxLTI1NGUtNDE0Yy1hNzY4LTBlMmFjYmFhMGFlNCJ9"
                frameBorder="0"
                allowFullScreen
              />
            </div>

            <div className="dashboard-powerbi-info">
              <h3>Análise dos dados</h3>

              <p>
                Utilize os filtros disponíveis no
                painel para consultar diferentes
                períodos, regiões e informações
                relacionadas aos casos de dengue.
              </p>
            </div>

          </section>
        )}

      </div>
    </main>
  );
}

export default Dashboard;
