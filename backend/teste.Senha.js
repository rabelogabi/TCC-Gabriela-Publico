
const bcrypt = require("bcrypt");

// TESTE DE CRIPTOGRAFIA DE SENHAS

async function testar() {
  try {
    // Senha fictícia utilizada apenas para teste
    const senhaTeste = "ExemploTeste@2026!";

    // Gerar um hash para a senha de teste
    const senhaCriptografada = await bcrypt.hash(
      senhaTeste,
      10
    );

    // Verificar se a senha corresponde ao hash
    const resultado = await bcrypt.compare(
      senhaTeste,
      senhaCriptografada
    );

    console.log("Senha correta:", resultado);

  } catch (erro) {
    console.error("Erro ao verificar a senha.");
  }
}

testar();
