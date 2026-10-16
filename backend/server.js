
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const bcrypt = require("bcrypt");
const pool = require("./db");

dotenv.config();

const app = express();

// CONFIGURAÇÕES DO SERVIDOR

const origensPermitidas = (process.env.CORS_ORIGIN || "")
  .split(",")
  .map((origem) => origem.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (
        !origin ||
        origensPermitidas.includes(origin)
      ) {
        return callback(null, true);
      }

      return callback(null, false);
    },
  })
);

app.use(express.json({ limit: "100kb" }));

// ROTA PRINCIPAL

app.get("/", (req, res) => {
  res.send(
    "API do Sistema de Monitoramento da Dengue funcionando!"
  );
});

// TESTE DE CONEXÃO COM O BANCO

app.get("/teste-banco", async (req, res) => {
  try {
    const resultado = await pool.query("SELECT NOW()");

    res.json({
      sucesso: true,
      mensagem: "Conectado ao PostgreSQL!",
      servidor: resultado.rows[0].now,
    });

  } catch (erro) {
    console.error("Erro ao conectar ao banco de dados.");

    res.status(500).json({
      sucesso: false,
      mensagem: "Erro ao conectar ao banco.",
    });
  }
});

// INDICADORES EPIDEMIOLÓGICOS

app.get("/indicadores", async (req, res) => {
  try {
    const resultado = await pool.query(`
      SELECT
        casos_dengue,
        obitos,
        periodo_analisado,
        sexo_predominante,
        total_sexo_predominante
      FROM tb_indicadores_dashboard
      LIMIT 1;
    `);

    if (resultado.rows.length === 0) {
      return res.status(404).json({
        sucesso: false,
        mensagem: "Nenhum indicador encontrado.",
      });
    }

    const dados = resultado.rows[0];

    res.json({
      sucesso: true,
      casos: Number(dados.casos_dengue),
      obitos: Number(dados.obitos),
      periodo: dados.periodo_analisado,
      sexoPredominante: dados.sexo_predominante,
      totalSexoPredominante: Number(
        dados.total_sexo_predominante
      ),
    });

  } catch (erro) {
    console.error("Erro ao buscar indicadores.");

    res.status(500).json({
      sucesso: false,
      mensagem: "Erro ao buscar indicadores.",
    });
  }
});

// CADASTRO DE USUÁRIOS

app.post("/cadastro", async (req, res) => {
  const { nome, email, senha } = req.body || {};

  // Validação dos dados recebidos
  if (
    typeof nome !== "string" ||
    typeof email !== "string" ||
    typeof senha !== "string" ||
    !nome.trim() ||
    !email.trim() ||
    !senha
  ) {
    return res.status(400).json({
      mensagem: "Preencha todos os campos obrigatórios.",
    });
  }

  const nomeNormalizado = nome.trim();
  const emailNormalizado = email.trim().toLowerCase();

  const emailValido =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailNormalizado);

  if (!emailValido) {
    return res.status(400).json({
      mensagem: "Informe um e-mail válido.",
    });
  }

  if (
    Buffer.byteLength(senha, "utf8") < 8 ||
    Buffer.byteLength(senha, "utf8") > 72
  ) {
    return res.status(400).json({
      mensagem:
        "A senha deve ter entre 8 e 72 bytes.",
    });
  }

  if (nomeNormalizado.length > 150) {
    return res.status(400).json({
      mensagem: "Nome muito longo.",
    });
  }

  try {
    // Verificar se o e-mail já está cadastrado
    const usuarioExiste = await pool.query(
      "SELECT id FROM usuarios WHERE email = $1",
      [emailNormalizado]
    );

    if (usuarioExiste.rows.length > 0) {
      return res.status(400).json({
        mensagem: "E-mail já cadastrado.",
      });
    }

    // Criptografar a senha
    const senhaCriptografada = await bcrypt.hash(
      senha,
      10
    );

    // Inserir o usuário no banco
    await pool.query(
      `
      INSERT INTO usuarios (
        nome,
        email,
        senha
      )
      VALUES ($1, $2, $3)
      `,
      [
        nomeNormalizado,
        emailNormalizado,
        senhaCriptografada,
      ]
    );

    res.status(201).json({
      mensagem: "Usuário cadastrado com sucesso!",
    });

  } catch (erro) {
    if (erro.code === "23505") {
      return res.status(400).json({
        mensagem: "E-mail já cadastrado.",
      });
    }

    console.error("Erro ao cadastrar usuário.");

    res.status(500).json({
      mensagem: "Erro ao cadastrar usuário.",
    });
  }
});

// LOGIN DE USUÁRIOS

app.post("/login", async (req, res) => {
  const { email, senha } = req.body || {};

  // Verificar campos obrigatórios
  if (
    typeof email !== "string" ||
    typeof senha !== "string" ||
    !email.trim() ||
    !senha
  ) {
    return res.status(400).json({
      mensagem: "Informe e-mail e senha.",
    });
  }

  const emailNormalizado = email.trim().toLowerCase();

  try {
    // Buscar usuário pelo e-mail
    const resultado = await pool.query(
      `
      SELECT
        id,
        nome,
        email,
        senha,
        perfil
      FROM usuarios
      WHERE email = $1
      `,
      [emailNormalizado]
    );

    if (resultado.rows.length === 0) {
      return res.status(401).json({
        mensagem: "E-mail ou senha inválidos.",
      });
    }

    const usuario = resultado.rows[0];

    // Comparar senha com o hash armazenado
    const senhaCorreta = await bcrypt.compare(
      senha,
      usuario.senha
    );

    if (!senhaCorreta) {
      return res.status(401).json({
        mensagem: "E-mail ou senha inválidos.",
      });
    }

    // Retornar somente os dados necessários
    res.status(200).json({
      mensagem: "Login realizado com sucesso!",
      usuario: {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        perfil: usuario.perfil,
      },
    });

  } catch (erro) {
    console.error("Erro ao realizar login.");

    res.status(500).json({
      mensagem: "Erro ao realizar login.",
    });
  }
});

// ROTA NÃO ENCONTRADA

app.use((req, res) => {
  res.status(404).json({
    mensagem: "Rota não encontrada.",
  });
});

// TRATAMENTO DE ERROS

app.use((erro, req, res, next) => {
  console.error("Erro interno do servidor.");

  res.status(500).json({
    mensagem: "Erro interno do servidor.",
  });
});

// INICIAR SERVIDOR

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
