const CHAVE_SESSAO_LOGIN = "triad_usuario_logado";

function limparTexto(valor) {
  return String(valor || "").trim().toLowerCase();
}

function limparCpf(valor) {
  return String(valor || "").replace(/\D/g, "");
}

export function prepararFuncionarioParaSessao(funcionario) {
  if (!funcionario) return null;

  const { senha, ...funcionarioSemSenha } = funcionario;

  return funcionarioSemSenha;
}

export function autenticarFuncionario(funcionarios, usuarioDigitado, senhaDigitada) {
  const usuario = limparTexto(usuarioDigitado);
  const senha = String(senhaDigitada || "").trim();
  const cpfDigitado = limparCpf(usuarioDigitado);

  if (!usuario || !senha) {
    return {
      sucesso: false,
      mensagem: "Informe usuário, e-mail, CPF e senha para entrar.",
      usuario: null,
    };
  }

  const listaFuncionarios = Array.isArray(funcionarios) ? funcionarios : [];

  const funcionarioEncontrado = listaFuncionarios.find((funcionario) => {
    const usuarioFuncionario = limparTexto(funcionario.usuario);
    const emailFuncionario = limparTexto(funcionario.email);
    const cpfFuncionario = limparCpf(funcionario.cpf);
    const senhaFuncionario = String(funcionario.senha || "").trim();

    const loginConfere =
      usuarioFuncionario === usuario ||
      emailFuncionario === usuario ||
      (cpfDigitado && cpfFuncionario === cpfDigitado);

    return loginConfere && senhaFuncionario === senha;
  });

  if (!funcionarioEncontrado) {
    return {
      sucesso: false,
      mensagem: "Usuário ou senha incorretos.",
      usuario: null,
    };
  }

  if (funcionarioEncontrado.ativo === "nao") {
    return {
      sucesso: false,
      mensagem: "Este funcionário está bloqueado. Fale com o administrador.",
      usuario: null,
    };
  }

  return {
    sucesso: true,
    mensagem: "Login realizado com sucesso.",
    usuario: funcionarioEncontrado,
  };
}

export function salvarSessaoLogin(funcionario) {
  const funcionarioSeguro = prepararFuncionarioParaSessao(funcionario);

  if (!funcionarioSeguro) return null;

  localStorage.setItem(CHAVE_SESSAO_LOGIN, JSON.stringify(funcionarioSeguro));

  return funcionarioSeguro;
}

export function carregarSessaoLogin() {
  try {
    const dadosSalvos = localStorage.getItem(CHAVE_SESSAO_LOGIN);

    if (!dadosSalvos) {
      return null;
    }

    return JSON.parse(dadosSalvos);
  } catch {
    return null;
  }
}

export function limparSessaoLogin() {
  localStorage.removeItem(CHAVE_SESSAO_LOGIN);
}
