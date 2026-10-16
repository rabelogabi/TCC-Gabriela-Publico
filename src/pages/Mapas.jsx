import { useEffect, useState } from "react";

import {
  ChevronLeft,
  ChevronRight,
  Lock,
} from "lucide-react";

import "../styles/dashboard.css";

function Mapas() {
  
  // USUÁRIO LOGADO

  const [usuario, setUsuario] = useState(() => {
    const usuarioSalvo = localStorage.getItem("usuario");

    if (usuarioSalvo) {
      try {
        return JSON.parse(usuarioSalvo);
      } catch (erro) {
        console.error("Erro ao recuperar usuário:", erro);
        return null;
      }
    }

    return null;
  });

  // ATUALIZAR LOGIN / LOGOUT

  useEffect(() => {
    function atualizarUsuario() {
      const usuarioSalvo = localStorage.getItem("usuario");

      if (usuarioSalvo) {
        try {
          setUsuario(JSON.parse(usuarioSalvo));
        } catch (erro) {
          console.error(
            "Erro ao recuperar usuário:",
            erro
          );
          setUsuario(null);
        }
      } else {
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

  // IMAGENS DO CARROSSEL


  const imagens = [
    {
      src: "/mapas/DengueBrasil.png",
      titulo: "Dengue no Brasil",
      descricao:
        "Visualização dos registros de dengue no Brasil.",
    },
    
    {
      src: "/mapas/COeste.png",
      titulo: "Região Centro-Oeste",
      descricao:
        "Visualização dos dados epidemiológicos de dengue na região Centro-Oeste.",
    },

    {
      src: "/mapas/Nordeste.png",
      titulo: "Região Nordeste",
      descricao:
        "Visualização dos dados epidemiológicos de dengue na região Nordeste.",
    },

    {
      src: "/mapas/Norte.png",
      titulo: "Região Norte",
      descricao:
        "Visualização dos dados epidemiológicos de dengue na região Norte.",
    },

    {
      src: "/mapas/Sudeste.png",
      titulo: "Região Sudeste",
      descricao:
        "Visualização dos dados epidemiológicos de dengue na região Sudeste.",
    },

    {
      src: "/mapas/SUL.png",
      titulo: "Região Sul",
      descricao:
        "Visualização dos dados epidemiológicos de dengue na região Sul.",
    },
  ];

  // IMAGEM ATUAL

  const [imagemAtual, setImagemAtual] = useState(0);
  
  // PRÓXIMA IMAGEM

  function proximaImagem() {
    setImagemAtual((atual) => {
      return (atual + 1) % imagens.length;
    });
  }

  // IMAGEM ANTERIOR

  function imagemAnterior() {
    setImagemAtual((atual) => {
      return (
        (atual - 1 + imagens.length) %
        imagens.length
      );
    });
  }

  // SELECIONAR IMAGEM

  function selecionarImagem(indice) {
    setImagemAtual(indice);
  }

  // PÁGINA

  return (
    <main className="dashboard-page">
      <div className="dashboard-container">

        {/* 
            CABEÇALHO
         */}

        <section className="dashboard-header">
          <h1>
            Mapas e Visualizações
          </h1>
        </section>

        {/* 
            USUÁRIO NÃO LOGADO
        */}

        {!usuario && (
          <section className="dashboard-publico">

            {/*
                CARROSSEL
           */}

            <div className="dashboard-carrossel">

              {/* CABEÇALHO */}

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

              {/* 
                  IMAGEM
               */}

              <div className="dashboard-carrossel-imagem">

                {/* BOTÃO ANTERIOR */}

                <button
                  className="carrossel-botao anterior"
                  onClick={imagemAnterior}
                  aria-label="Imagem anterior"
                >
                  <ChevronLeft size={28} />
                </button>

                {/* IMAGEM */}

                <img
                  src={imagens[imagemAtual].src}
                  alt={imagens[imagemAtual].titulo}
                  onError={(e) => {
                    console.error(
                      "Imagem não encontrada:",
                      imagens[imagemAtual].src
                    );
                  }}
                />

                {/* BOTÃO PRÓXIMO */}

                <button
                  className="carrossel-botao proximo"
                  onClick={proximaImagem}
                  aria-label="Próxima imagem"
                >
                  <ChevronRight size={28} />
                </button>

              </div>

              {/* 
                  INDICADORES
             */}

              <div className="carrossel-indicadores">
                {imagens.map((imagem, indice) => (
                  <button
                    key={indice}
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

              {/*
                  CONTADOR
              */}

              <div className="carrossel-contador">
                {imagemAtual + 1} / {imagens.length}
              </div>

            </div>

            {/* 
                AVISO DE LOGIN
            */}

            <div className="dashboard-login-aviso">

              <div className="dashboard-login-icone">
                <Lock size={22} />
              </div>

              <div>
                <strong>
                  Deseja realizar uma análise mais detalhada?
                </strong>

                <p>
                  Faça login para acessar o dashboard
                  interativo do Power BI, com mapas,
                  filtros e visualizações detalhadas.
                </p>
              </div>

            </div>

          </section>
        )}

        {/* 
            USUÁRIO LOGADO
        */}

        {usuario && (
          <section className="dashboard-interativo">

            {/* 
                CABEÇALHO DO POWER BI
            */}

            <div className="dashboard-interativo-header">

              <div>
                <h2>
                  Dashboard Epidemiológico Interativo
                </h2>

                <p>
                  Bem-vinda,{" "}
                  <strong>
                    {usuario.nome}
                  </strong>.
                </p>
              </div>

              {/* STATUS DO LOGIN */}

              <div className="dashboard-status-login">
                <span className="dashboard-status-bolinha"></span>

                Usuário conectado
              </div>

            </div>

            {/* 
                POWER BI - MAPAS
             */}

            <div className="dashboard-powerbi-wrapper">

              <iframe
                title="TCC_mapas"
                src="https://app.powerbi.com/view?r=eyJrIjoiZjA3OWE3MmItNTE3Ni00MzRlLWE3Y2YtN2U5OGYzOTIxOTdiIiwidCI6IjY1MGZkYzAxLTI1NGUtNDE0Yy1hNzY4LTBlMmFjYmFhMGFlNCJ9"
                frameBorder="0"
                allowFullScreen={true}
              />

            </div>

            {/* 
                INFORMAÇÃO
             */}

            <div className="dashboard-powerbi-info">

              <h3>
                Análise dos mapas
              </h3>

              <p>
                Utilize os filtros disponíveis no
                painel para explorar a distribuição
                dos casos de dengue entre as
                diferentes regiões e municípios
                do Brasil.
              </p>

            </div>

          </section>
        )}

      </div>
    </main>
  );
}

export default Mapas;