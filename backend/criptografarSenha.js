
const bcrypt = require("bcrypt");

async function gerarSenha() {
  const senha = process.env.SENHA_TESTE;

  if (!senha) {
    console.error(
      "Informe a variável de ambiente SENHA_TESTE."
    );
    return;
  }

  try {
    const senhaCriptografada = await bcrypt.hash(
      senha,
      10
    );

    console.log("Hash gerado:");
    console.log(senhaCriptografada);

  } catch (erro) {
    console.error("Erro ao gerar o hash da senha.");
  }
}

gerarSenha();
