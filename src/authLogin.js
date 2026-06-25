const CHAVE_SESSAO_LOGIN = "triad_usuario_logado";

function normalizarTexto(valor) {
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

export function salvarSessaoLogin(funcionario) {
  const funcionarioSeguro = prepararFuncionarioParaSessao(funcionario);
  if (!funcionarioSeguro) return null;

  localStorage.setItem(CHAVE_SESSAO_LOGIN, JSON.stringify(funcionarioSeguro));
  return funcionarioSeguro;
}

export function carregarSessaoLogin() {
  try {
    const dadosSalvos = localStorage.getItem(CHAVE_SESSAO_LOGIN);
    if (!dadosSalvos) return null;
    return JSON.parse(dadosSalvos);
  } catch {
    return null;
  }
}

export function limparSessaoLogin() {
  localStorage.removeItem(CHAVE_SESSAO_LOGIN);
}

export function autenticarFuncionario(funcionarios, usuarioDigitado, senhaDigitada) {
  const usuario = normalizarTexto(usuarioDigitado);
  const cpfUsuario = limparCpf(usuarioDigitado);
  const senha = String(senhaDigitada || "").trim();

  if (!usuario || !senha) {
    return {
      sucesso: false,
      mensagem: "Informe usuário e senha.",
    };
  }

  const lista = Array.isArray(funcionarios) ? funcionarios : [];

  const funcionarioEncontrado = lista.find((funcionario) => {
    const usuarioFuncionario = normalizarTexto(funcionario.usuario);
    const emailFuncionario = normalizarTexto(funcionario.email);
    const cpfFuncionario = limparCpf(funcionario.cpf);

    const bateUsuario = usuarioFuncionario && usuarioFuncionario === usuario;
    const bateEmail = emailFuncionario && emailFuncionario === usuario;
    const bateCpf = cpfFuncionario && cpfFuncionario === cpfUsuario;

    return bateUsuario || bateEmail || bateCpf;
  });

  if (!funcionarioEncontrado) {
    return {
      sucesso: false,
      mensagem: "Funcionário não encontrado.",
    };
  }

  if (funcionarioEncontrado.ativo === "nao") {
    return {
      sucesso: false,
      mensagem: "Este funcionário está bloqueado.",
    };
  }

  if (String(funcionarioEncontrado.senha || "").trim() !== senha) {
    return {
      sucesso: false,
      mensagem: "Senha incorreta.",
    };
  }

  return {
    sucesso: true,
    usuario: prepararFuncionarioParaSessao(funcionarioEncontrado),
  };
}
