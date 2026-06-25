import { configuracoesPadrao, funcionariosPadrao, produtosBalcaoPadrao, membrosMock } from "../data/defaults";

export function carregarConfiguracoesSalvas() {
  try {
    const dadosSalvos = localStorage.getItem("triad_configuracoes");

    if (!dadosSalvos) {
      return configuracoesPadrao;
    }

    return {
      ...configuracoesPadrao,
      ...JSON.parse(dadosSalvos),
    };
  } catch {
    return configuracoesPadrao;
  }
}

export function gerarUsuarioPadraoFuncionario(funcionario) {
  if (funcionario.usuario) return funcionario.usuario;

  if (String(funcionario.email || "").includes("@")) {
    return String(funcionario.email).split("@")[0].toLowerCase();
  }

  if (funcionario.cpf) {
    return String(funcionario.cpf).replace(/\D/g, "");
  }

  return "";
}

export function pegarPermissaoPorTipo(tipoFuncionario) {
  const tipo = String(tipoFuncionario || "").toLowerCase();

  if (tipo.includes("admin")) return "admin";
  if (tipo.includes("financeiro")) return "financeiro";
  if (tipo.includes("professor") || tipo.includes("personal")) return "professor";
  if (tipo.includes("recep")) return "recepcao";

  return "operador";
}

export function formatarPermissao(permissao) {
  if (permissao === "admin") return "Administrador";
  if (permissao === "financeiro") return "Financeiro";
  if (permissao === "professor") return "Professor";
  if (permissao === "recepcao") return "Recepção";
  return "Operador";
}

export function prepararFuncionarioLogin(funcionario, index = 0) {
  const ehAdminPadrao =
    funcionario?.id === 1 ||
    String(funcionario?.email || "").toLowerCase() === "admin@triad.com" ||
    String(funcionario?.tipoFuncionario || "").toLowerCase().includes("admin");

  return {
    ...funcionario,
    usuario: funcionario.usuario || (ehAdminPadrao ? "admin" : gerarUsuarioPadraoFuncionario(funcionario)),
    senha: funcionario.senha || (ehAdminPadrao && index === 0 ? "123456" : ""),
    permissao: funcionario.permissao || pegarPermissaoPorTipo(funcionario.tipoFuncionario),
  };
}


export function carregarMembrosSalvos() {
  try {
    const dadosSalvos = localStorage.getItem("triad_membros");

    if (!dadosSalvos) {
      return membrosMock;
    }

    const membros = JSON.parse(dadosSalvos);

    if (!Array.isArray(membros)) {
      return membrosMock;
    }

    return membros;
  } catch {
    return membrosMock;
  }
}

export function carregarFuncionariosSalvos() {
  try {
    const dadosSalvos = localStorage.getItem("triad_funcionarios");

    if (!dadosSalvos) {
      return funcionariosPadrao.map((funcionario, index) => prepararFuncionarioLogin(funcionario, index));
    }

    const funcionarios = JSON.parse(dadosSalvos);

    if (!Array.isArray(funcionarios) || funcionarios.length === 0) {
      return funcionariosPadrao.map((funcionario, index) => prepararFuncionarioLogin(funcionario, index));
    }

    return funcionarios.map((funcionario, index) => prepararFuncionarioLogin(funcionario, index));
  } catch {
    return funcionariosPadrao.map((funcionario, index) => prepararFuncionarioLogin(funcionario, index));
  }
}

export function carregarProdutosBalcaoSalvos() {
  try {
    const dadosSalvos = localStorage.getItem("triad_produtos_balcao");

    if (!dadosSalvos) {
      return produtosBalcaoPadrao;
    }

    const produtos = JSON.parse(dadosSalvos);

    if (!Array.isArray(produtos) || produtos.length === 0) {
      return produtosBalcaoPadrao;
    }

    return produtos;
  } catch {
    return produtosBalcaoPadrao;
  }
}

export function carregarVendasBalcaoSalvas() {
  try {
    const dadosSalvos = localStorage.getItem("triad_vendas_balcao");

    if (!dadosSalvos) {
      return [];
    }

    const vendas = JSON.parse(dadosSalvos);

    return Array.isArray(vendas) ? vendas : [];
  } catch {
    return [];
  }
}

export function verificarAtivo(vencimento) {
  if (!vencimento) return false;

  const hoje = new Date();
  const dataVencimento = new Date(vencimento + "T23:59:59");

  return dataVencimento >= hoje;
}

export function formatarData(data) {
  if (!data) return "Sem data";

  const [ano, mes, dia] = data.split("-");
  return `${dia}/${mes}/${ano}`;
}

export function calcularIdade(dataNascimento) {
  if (!dataNascimento) return "Não informada";

  const nascimento = new Date(dataNascimento + "T00:00:00");
  const hoje = new Date();

  let idade = hoje.getFullYear() - nascimento.getFullYear();
  const mes = hoje.getMonth() - nascimento.getMonth();

  if (mes < 0 || (mes === 0 && hoje.getDate() < nascimento.getDate())) {
    idade -= 1;
  }

  return `${idade} ano${idade === 1 ? "" : "s"}`;
}

export function formatarAniversario(dataNascimento) {
  if (!dataNascimento) return "Não informado";

  const [, mes, dia] = dataNascimento.split("-");
  return `${dia}/${mes}`;
}

export function pegarDataHoje() {
  return new Date().toISOString().split("T")[0];
}


export function verificarAtivoComTolerancia(vencimento, diasTolerancia = 0) {
  if (!vencimento) return false;

  const hoje = new Date();
  const dataVencimento = new Date(vencimento + "T23:59:59");
  dataVencimento.setDate(dataVencimento.getDate() + Number(diasTolerancia || 0));

  return dataVencimento >= hoje;
}

export function textoComAluno(texto, nome) {
  return String(texto || "").replace("{nome}", nome || "aluno");
}

export function montarVariaveisTema(configuracoes) {
  const temaClaro = configuracoes.temaSistema === "claro";

  return {
    "--cor-principal": configuracoes.corPrincipal || "#00e676",
    "--cor-secundaria": configuracoes.corSecundaria || "#00a859",
    "--cor-fundo": temaClaro ? "#f4f7fb" : configuracoes.corFundo || "#070b14",
    "--cor-painel": temaClaro ? "#ffffff" : configuracoes.corPainel || "#101522",
    "--cor-texto": temaClaro ? "#101522" : configuracoes.corTexto || "#ffffff",
    "--cor-texto-suave": temaClaro
      ? "#5b6472"
      : configuracoes.corTextoSuave || "#929bad",
  };
}

export function converterValor(valor) {
  return Number(
    String(valor || "0")
      .replace(".", "")
      .replace(",", ".")
  );
}

export function formatarDinheiro(valor) {
  return valor.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

export function formatarValorParaCampo(valor) {
  return Number(valor || 0).toFixed(2).replace(".", ",");
}

export function formatarFormaPagamento(forma) {
  if (forma === "PIX") return "PIX";
  if (forma === "DINHEIRO") return "Dinheiro";
  if (forma === "CREDITO") return "Cartão de crédito";
  if (forma === "DEBITO") return "Cartão de débito";
  if (forma === "CARTAO") return "Cartão de crédito"; // compatibilidade com cadastros antigos
  return "Não informado";
}

export function calcularNovoVencimento(vencimentoAtual, diasRenovacao = 30) {
  const base = verificarAtivo(vencimentoAtual)
    ? new Date(vencimentoAtual + "T00:00:00")
    : new Date();

  const dias = Number(diasRenovacao || 30);
  base.setDate(base.getDate() + dias);

  return base.toISOString().split("T")[0];
}

export function pegarPagamentosDoMes(membros) {
  const hoje = new Date();
  const mesAtual = hoje.getMonth();
  const anoAtual = hoje.getFullYear();

  return membros.flatMap((membro) =>
    (membro.pagamentos || [])
      .filter((pagamento) => {
        const dataPagamento = new Date(pagamento.data + "T00:00:00");

        return (
          dataPagamento.getMonth() === mesAtual &&
          dataPagamento.getFullYear() === anoAtual
        );
      })
      .map((pagamento) => ({
        ...pagamento,
        alunoId: membro.id,
        alunoNome: membro.nome,
        alunoFoto: membro.foto,
      }))
  );
}

export function pegarVendasBalcaoDoMes(vendasBalcao) {
  const hoje = new Date();
  const mesAtual = hoje.getMonth();
  const anoAtual = hoje.getFullYear();

  return (vendasBalcao || []).filter((venda) => {
    const dataVenda = new Date(venda.data + "T00:00:00");

    return (
      dataVenda.getMonth() === mesAtual &&
      dataVenda.getFullYear() === anoAtual
    );
  });
}

export function calcularTotalVendaBalcao(produto, quantidade) {
  return converterValor(produto?.valorVenda || "0") * Number(quantidade || 0);
}
