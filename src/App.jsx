import { useEffect, useMemo, useRef, useState } from "react";
import {
  Fingerprint,
  UsersRound,
  CheckCircle2,
  CalendarDays,
  AlertTriangle,
  Plus,
  Clock3,
  BarChart3,
  List,
  PieChart,
  UserRoundCheck,
  Star,
  ChevronRight,
  Dumbbell,
  Search,
  Trash2,
  ArrowLeft,
  Save,
  Camera,
  CameraOff,
  CheckCircle,
} from "lucide-react";
import "./App.css";

const membrosMock = [
  {
    id: 1,
    nome: "Carlos Eduardo Silva",
    cpf: "123.456.789-00",
    nascimento: "1998-04-12",
    email: "carlos@email.com",
    telefone: "(89) 99999-1111",
    emergencia: "(89) 98888-1111",
    valorPlano: "120,00",
    vencimento: "2026-12-30",
    foto: "https://i.pravatar.cc/150?img=12",
    digital: "DIGITAL-001",
    cidade: "São Raimundo Nonato",
    bairro: "Centro",
    rua: "Rua Principal",
    numero: "100",
    pagamentos: [
      {
        id: 101,
        data: "2026-06-05",
        valor: "120,00",
        forma: "PIX",
        vencimentoAnterior: "2026-05-05",
        novoVencimento: "2026-07-05",
      },
    ],
  },
  {
    id: 2,
    nome: "Ana Beatriz Oliveira",
    cpf: "987.654.321-00",
    nascimento: "2001-09-18",
    email: "ana@email.com",
    telefone: "(89) 99999-2222",
    emergencia: "(89) 98888-2222",
    valorPlano: "80,00",
    vencimento: "2025-02-09",
    foto: "https://i.pravatar.cc/150?img=47",
    digital: "DIGITAL-002",
    cidade: "São Raimundo Nonato",
    bairro: "Aldeia",
    rua: "Rua das Flores",
    numero: "45",
    pagamentos: [
      {
        id: 102,
        data: "2026-06-10",
        valor: "80,00",
        forma: "DINHEIRO",
        vencimentoAnterior: "2025-02-09",
        novoVencimento: "2026-07-10",
      },
    ],
  },
];

const formularioInicial = {
  nome: "",
  cpf: "",
  nascimento: "",
  email: "",
  telefone: "",
  emergencia: "",
  valorPlano: "",
  vencimento: "",
  foto: "",
  digital: "",
  cidade: "",
  bairro: "",
  rua: "",
  numero: "",
};

const pagamentoInicial = {
  valor: "",
  valorRecebido: "",
  forma: "PIX",
};

const funcionarioInicial = {
  nome: "",
  cpf: "",
  nascimento: "",
  telefone: "",
  emergencia: "",
  email: "",
  cidade: "",
  bairro: "",
  rua: "",
  numero: "",
  tipoFuncionario: "Recepção",
  cargo: "Atendente",
  foto: "",
  digital: "",
  ativo: "sim",
};

const funcionariosPadrao = [
  {
    id: 1,
    nome: "Administrador TRIAD",
    cpf: "000.000.000-00",
    nascimento: "1995-01-01",
    telefone: "(89) 99999-0000",
    emergencia: "(89) 98888-0000",
    email: "admin@triad.com",
    cidade: "São Raimundo Nonato",
    bairro: "Centro",
    rua: "Rua Principal",
    numero: "100",
    tipoFuncionario: "Administrador",
    cargo: "Administrador do sistema",
    foto: "https://i.pravatar.cc/150?img=68",
    digital: "DIGITAL-FUNC-ADMIN",
    ativo: "sim",
    criadoEm: "2026-06-22",
  },
];


const configuracoesPadrao = {
  // IDENTIDADE VISUAL / WHITE LABEL
  nomeSistema: "TRIAD",
  subtituloSistema: "Academia",
  nomeAcademia: "TRIAD Academia",
  sloganAcademia: "Gestão inteligente para academias",
  logoAcademia: "",
  mostrarMarcaDono: "sim",
  textoMarcaDono: "Desenvolvido por TRIAD Sistemas",


  // CORES E TEMA
  corPrincipal: "#00e676",
  corSecundaria: "#00a859",
  corFundo: "#070b14",
  corPainel: "#101522",
  corTexto: "#ffffff",
  corTextoSuave: "#929bad",
  temaSistema: "escuro",
  estiloSistema: "premium",

  // NOMES DAS ABAS / MÓDULOS
  nomeAbaAcesso: "Acesso",
  nomeAbaCadastro: "Cadastro",
  nomeAbaAplicacoes: "Aplicações",
  nomeAbaClientes: "Lista Clientes",
  nomeAbaFinanceiro: "Financeiro",
  nomeAbaRelatorios: "Relatórios",
  nomeAbaFuncionarios: "Funcionários",
  nomeAbaConfiguracoes: "Configurações",
  nomeModuloAppAluno: "App do Aluno",

  // DADOS DA ACADEMIA
  telefoneAcademia: "(89) 99999-0000",
  emailAcademia: "contato@triadacademia.com",
  cidadeAcademia: "São Raimundo Nonato",
  enderecoAcademia: "Rua Principal, 100",
  cnpjAcademia: "",
  responsavelAcademia: "",
  moedaSistema: "BRL",

  // CATRACA E BIOMETRIA
  portaCatraca: "COM3",
  velocidadeCatraca: "9600",
  comandoLiberacao: "0x00",
  leitorBiometrico: "Futronic FS88",
  modoLeitorBiometrico: "simulacao",
  tempoLeituraBiometria: "1700",
  liberarSemDigital: "nao",
  mensagemLeitura: "Lendo biometria... mantenha o dedo no leitor",
  mensagemBoasVindas: "Bem-vindo, {nome}!",
  mensagemBomTreino: "Bom treino! Que hoje seja pesado e produtivo.",
  mensagemAcessoNegado: "Acesso negado. Regularize para liberar a entrada.",

  // REGRAS DE ACESSO
  bloquearVencidos: "sim",
  diasTolerancia: "0",
  horarioAbertura: "05:00",
  horarioFechamento: "22:00",
  avisoVencimento: "5",

  // FINANCEIRO
  valorMensalidadePadrao: "80,00",
  diasRenovacaoPagamento: "30",
  permitirPagamentoParcial: "sim",
  controlarTrocoDevolucao: "sim",
  formaPagamentoPadrao: "PIX",
};

function carregarConfiguracoesSalvas() {
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

function carregarFuncionariosSalvos() {
  try {
    const dadosSalvos = localStorage.getItem("triad_funcionarios");

    if (!dadosSalvos) {
      return funcionariosPadrao;
    }

    const funcionarios = JSON.parse(dadosSalvos);

    if (!Array.isArray(funcionarios) || funcionarios.length === 0) {
      return funcionariosPadrao;
    }

    return funcionarios;
  } catch {
    return funcionariosPadrao;
  }
}

function verificarAtivo(vencimento) {
  if (!vencimento) return false;

  const hoje = new Date();
  const dataVencimento = new Date(vencimento + "T23:59:59");

  return dataVencimento >= hoje;
}

function formatarData(data) {
  if (!data) return "Sem data";

  const [ano, mes, dia] = data.split("-");
  return `${dia}/${mes}/${ano}`;
}

function calcularIdade(dataNascimento) {
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

function formatarAniversario(dataNascimento) {
  if (!dataNascimento) return "Não informado";

  const [, mes, dia] = dataNascimento.split("-");
  return `${dia}/${mes}`;
}

function pegarDataHoje() {
  return new Date().toISOString().split("T")[0];
}


function verificarAtivoComTolerancia(vencimento, diasTolerancia = 0) {
  if (!vencimento) return false;

  const hoje = new Date();
  const dataVencimento = new Date(vencimento + "T23:59:59");
  dataVencimento.setDate(dataVencimento.getDate() + Number(diasTolerancia || 0));

  return dataVencimento >= hoje;
}

function textoComAluno(texto, nome) {
  return String(texto || "").replace("{nome}", nome || "aluno");
}

function montarVariaveisTema(configuracoes) {
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

function converterValor(valor) {
  return Number(
    String(valor || "0")
      .replace(".", "")
      .replace(",", ".")
  );
}

function formatarDinheiro(valor) {
  return valor.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

function formatarValorParaCampo(valor) {
  return Number(valor || 0).toFixed(2).replace(".", ",");
}

function formatarFormaPagamento(forma) {
  if (forma === "PIX") return "PIX";
  if (forma === "CARTAO") return "Cartão de crédito";
  if (forma === "DINHEIRO") return "Dinheiro";
  return "Não informado";
}

function calcularNovoVencimento(vencimentoAtual, diasRenovacao = 30) {
  const base = verificarAtivo(vencimentoAtual)
    ? new Date(vencimentoAtual + "T00:00:00")
    : new Date();

  const dias = Number(diasRenovacao || 30);
  base.setDate(base.getDate() + dias);

  return base.toISOString().split("T")[0];
}

function pegarPagamentosDoMes(membros) {
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

export default function App() {
  const [paginaAtual, setPaginaAtual] = useState("acesso");
  const [membros, setMembros] = useState(membrosMock);
  const [membroSelecionado, setMembroSelecionado] = useState(null);
  const [mensagemLeitor, setMensagemLeitor] = useState(
    "Clique ou encoste o dedo para simular a leitura"
  );
  const [statusLeitura, setStatusLeitura] = useState("parado");
  const [ultimoAcesso, setUltimoAcesso] = useState(null);
  const [acessosHoje, setAcessosHoje] = useState(2);
  const [hora, setHora] = useState("");
  const [busca, setBusca] = useState("");
  const [formulario, setFormulario] = useState(formularioInicial);
  const [configuracoes, setConfiguracoes] = useState(carregarConfiguracoesSalvas);
  const [funcionarios, setFuncionarios] = useState(carregarFuncionariosSalvos);
  const [funcionarioForm, setFuncionarioForm] = useState(funcionarioInicial);

  const [pagamentoAberto, setPagamentoAberto] = useState(null);
  const [formularioPagamento, setFormularioPagamento] =
    useState(pagamentoInicial);

  useEffect(() => {
    const intervalo = setInterval(() => {
      const agora = new Date();

      setHora(
        agora.toLocaleTimeString("pt-BR", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
      );
    }, 1000);

    return () => clearInterval(intervalo);
  }, []);

  useEffect(() => {
    localStorage.setItem("triad_funcionarios", JSON.stringify(funcionarios));
  }, [funcionarios]);

  const membrosFiltrados = useMemo(() => {
    return membros.filter((membro) =>
      membro.nome.toLowerCase().includes(busca.toLowerCase())
    );
  }, [membros, busca]);

  const estatisticas = useMemo(() => {
    const ativos = membros.filter((membro) =>
      verificarAtivoComTolerancia(membro.vencimento, configuracoes.diasTolerancia)
    ).length;

    return {
      total: membros.length,
      acessosHoje,
      ativos,
      emAtraso: membros.length - ativos,
    };
  }, [membros, acessosHoje, configuracoes.diasTolerancia]);


  const temaSistema = useMemo(() => {
    return montarVariaveisTema(configuracoes);
  }, [configuracoes]);

  function abrirCadastro() {
    setFormulario({
      ...formularioInicial,
      valorPlano: configuracoes.valorMensalidadePadrao || "",
    });
    setPaginaAtual("cadastro");
  }

  function voltarParaAcesso() {
    setPaginaAtual("acesso");
  }

  function alterarCampo(evento) {
    const { name, value } = evento.target;

    setFormulario((dadosAtuais) => ({
      ...dadosAtuais,
      [name]: value,
    }));
  }

  function alterarFoto(fotoCapturada) {
    setFormulario((dadosAtuais) => ({
      ...dadosAtuais,
      foto: fotoCapturada,
    }));
  }

  function alterarDigital(digitalCapturada) {
    setFormulario((dadosAtuais) => ({
      ...dadosAtuais,
      digital: digitalCapturada,
    }));
  }

  function cadastrarMembro(evento) {
    evento.preventDefault();

    if (
      !formulario.nome ||
      !formulario.cpf ||
      !formulario.nascimento ||
      !(formulario.valorPlano || configuracoes.valorMensalidadePadrao) ||
      !formulario.vencimento
    ) {
      alert(
        "Preencha pelo menos Nome completo, CPF, Data de nascimento, Valor do plano e Vencimento."
      );
      return;
    }

    if (!formulario.foto) {
      alert("Tire uma foto do aluno antes de salvar o cadastro.");
      return;
    }

    if (!formulario.digital) {
      alert("Cadastre a digital do aluno antes de salvar.");
      return;
    }

    const valorPlanoFinal = formulario.valorPlano || configuracoes.valorMensalidadePadrao || "0,00";

    const novoMembro = {
      id: Date.now(),
      nome: formulario.nome,
      cpf: formulario.cpf,
      nascimento: formulario.nascimento,
      email: formulario.email,
      telefone: formulario.telefone,
      emergencia: formulario.emergencia,
      valorPlano: valorPlanoFinal,
      vencimento: formulario.vencimento,
      foto: formulario.foto,
      digital: formulario.digital,
      cidade: formulario.cidade,
      bairro: formulario.bairro,
      rua: formulario.rua,
      numero: formulario.numero,
      pagamentos: [],
    };

    setMembros((listaAtual) => [novoMembro, ...listaAtual]);
    setMembroSelecionado(novoMembro);
    setMensagemLeitor("Membro cadastrado com foto e digital");
    setStatusLeitura("parado");
    setUltimoAcesso(null);
    setFormulario({
      ...formularioInicial,
      valorPlano: configuracoes.valorMensalidadePadrao || "",
    });
    setPaginaAtual("acesso");
  }

  function simularLeitura() {
    if (statusLeitura === "lendo") return;

    if (!membroSelecionado) {
      setStatusLeitura("erro");
      setUltimoAcesso(null);
      setMensagemLeitor("Selecione um aluno primeiro na lista");
      return;
    }

    if (!membroSelecionado.digital && configuracoes.liberarSemDigital !== "sim") {
      setStatusLeitura("erro");
      setUltimoAcesso({
        ...membroSelecionado,
        liberado: false,
        motivo: "Digital não cadastrada",
      });
      setMensagemLeitor("Este aluno não possui digital cadastrada");
      return;
    }

    setStatusLeitura("lendo");
    setUltimoAcesso(null);
    setMensagemLeitor(configuracoes.mensagemLeitura);

    const tempoLeitura = Number(configuracoes.tempoLeituraBiometria || 1700);

    setTimeout(() => {
      const ativo = verificarAtivoComTolerancia(
        membroSelecionado.vencimento,
        configuracoes.diasTolerancia
      );

      if (configuracoes.bloquearVencidos === "sim" && !ativo) {
        setStatusLeitura("erro");
        setUltimoAcesso({
          ...membroSelecionado,
          liberado: false,
          motivo: "Mensalidade vencida",
        });

        setMensagemLeitor(
          `${membroSelecionado.nome} está vencido. Acesso negado.`
        );
        return;
      }

      const mensagemBoasVindas = textoComAluno(
        configuracoes.mensagemBoasVindas,
        membroSelecionado.nome
      );

      setStatusLeitura("sucesso");
      setUltimoAcesso({
        ...membroSelecionado,
        liberado: true,
        motivo: "Acesso liberado",
      });

      setMensagemLeitor(`${mensagemBoasVindas} ${configuracoes.mensagemBomTreino}`);
      setAcessosHoje((valorAtual) => valorAtual + 1);
    }, tempoLeitura);
  }

  function excluirMembro(id) {
    const confirmar = confirm("Tem certeza que deseja excluir este membro?");

    if (!confirmar) return;

    const novaLista = membros.filter((membro) => membro.id !== id);
    setMembros(novaLista);

    if (membroSelecionado?.id === id) {
      setMembroSelecionado(null);
      setMensagemLeitor("Membro excluído");
      setStatusLeitura("parado");
      setUltimoAcesso(null);
    }
  }

  function abrirPagamento(membro) {
    const valorBase = membro.valorPlano || configuracoes.valorMensalidadePadrao || "";

    setPagamentoAberto(membro);
    setFormularioPagamento({
      valor: valorBase,
      valorRecebido: valorBase,
      forma: configuracoes.formaPagamentoPadrao || "PIX",
    });
  }

  function fecharPagamento() {
    setPagamentoAberto(null);
    setFormularioPagamento(pagamentoInicial);
  }

  function alterarCampoPagamento(evento) {
    const { name, value } = evento.target;

    setFormularioPagamento((dadosAtuais) => ({
      ...dadosAtuais,
      [name]: value,
    }));
  }

  function confirmarPagamento(evento) {
    evento.preventDefault();

    if (!pagamentoAberto) return;

    const controlarTroco = configuracoes.controlarTrocoDevolucao !== "nao";
    const valorMensalidade = converterValor(formularioPagamento.valor);
    const valorRecebido = controlarTroco
      ? converterValor(formularioPagamento.valorRecebido || formularioPagamento.valor)
      : valorMensalidade;

    if (!formularioPagamento.valor || valorMensalidade <= 0) {
      alert("Informe um valor válido para a mensalidade.");
      return;
    }

    if (controlarTroco && (!formularioPagamento.valorRecebido || valorRecebido <= 0)) {
      alert("Informe o valor pago pelo cliente.");
      return;
    }

    if (controlarTroco && valorRecebido < valorMensalidade) {
      alert(`Valor entregue pelo cliente é menor que a mensalidade. Falta ${formatarDinheiro(valorMensalidade - valorRecebido)} para completar.`);
      return;
    }

    const valorDevolvido = controlarTroco ? Math.max(valorRecebido - valorMensalidade, 0) : 0;

    const novoVencimento = calcularNovoVencimento(
      pagamentoAberto.vencimento,
      configuracoes.diasRenovacaoPagamento
    );
    const dataHoje = pegarDataHoje();

    const novoPagamento = {
      id: Date.now(),
      data: dataHoje,
      horario: new Date().toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      valor: formatarValorParaCampo(valorMensalidade),
      valorRecebido: formatarValorParaCampo(valorRecebido),
      troco: formatarValorParaCampo(valorDevolvido),
      valorDevolvido: formatarValorParaCampo(valorDevolvido),
      controleTroco: controlarTroco ? "sim" : "nao",
      forma: formularioPagamento.forma,
      vencimentoAnterior: pagamentoAberto.vencimento,
      novoVencimento,
    };

    setMembros((listaAtual) =>
      listaAtual.map((membro) =>
        membro.id === pagamentoAberto.id
          ? {
              ...membro,
              vencimento: novoVencimento,
              pagamentos: [novoPagamento, ...(membro.pagamentos || [])],
            }
          : membro
      )
    );

    if (membroSelecionado?.id === pagamentoAberto.id) {
      setMembroSelecionado((membroAtual) => ({
        ...membroAtual,
        vencimento: novoVencimento,
        pagamentos: [novoPagamento, ...(membroAtual.pagamentos || [])],
      }));
    }

    alert(
      controlarTroco && valorDevolvido > 0
        ? `Pagamento confirmado em ${formatarFormaPagamento(
            formularioPagamento.forma
          )}! Devolver para o cliente: ${formatarDinheiro(valorDevolvido)}. Novo vencimento: ${formatarData(novoVencimento)}`
        : `Pagamento confirmado em ${formatarFormaPagamento(
            formularioPagamento.forma
          )}! Novo vencimento: ${formatarData(novoVencimento)}`
    );

    fecharPagamento();
  }


  function alterarCampoFuncionario(evento) {
    const { name, value } = evento.target;

    setFuncionarioForm((dadosAtuais) => ({
      ...dadosAtuais,
      [name]: value,
    }));
  }

  function alterarFotoFuncionario(fotoCapturada) {
    setFuncionarioForm((dadosAtuais) => ({
      ...dadosAtuais,
      foto: fotoCapturada,
    }));
  }

  function alterarDigitalFuncionario(digitalCapturada) {
    setFuncionarioForm((dadosAtuais) => ({
      ...dadosAtuais,
      digital: digitalCapturada,
    }));
  }

  function limparCadastroFuncionario() {
    setFuncionarioForm(funcionarioInicial);
  }

  function cadastrarFuncionario(evento) {
    evento.preventDefault();

    if (
      !funcionarioForm.nome ||
      !funcionarioForm.cpf ||
      !funcionarioForm.nascimento ||
      !funcionarioForm.telefone ||
      !funcionarioForm.emergencia ||
      !funcionarioForm.bairro ||
      !funcionarioForm.tipoFuncionario ||
      !funcionarioForm.cargo
    ) {
      alert(
        "Preencha nome, CPF, nascimento, telefone, emergência, bairro, tipo e cargo do funcionário."
      );
      return;
    }

    if (!funcionarioForm.foto) {
      alert("Tire a foto do funcionário antes de salvar.");
      return;
    }

    if (!funcionarioForm.digital) {
      alert("Cadastre a biometria do funcionário antes de salvar.");
      return;
    }

    const cpfJaExiste = funcionarios.some(
      (funcionario) =>
        String(funcionario.cpf || "").trim() === String(funcionarioForm.cpf || "").trim()
    );

    if (cpfJaExiste) {
      alert("Já existe um funcionário cadastrado com este CPF.");
      return;
    }

    const novoFuncionario = {
      id: Date.now(),
      ...funcionarioForm,
      criadoEm: pegarDataHoje(),
    };

    setFuncionarios((listaAtual) => [novoFuncionario, ...listaAtual]);
    setFuncionarioForm(funcionarioInicial);

    alert("Funcionário cadastrado com foto e biometria!");
  }

  function excluirFuncionario(id) {
    const confirmar = confirm("Tem certeza que deseja excluir este funcionário?");

    if (!confirmar) return;

    setFuncionarios((listaAtual) =>
      listaAtual.filter((funcionario) => funcionario.id !== id)
    );
  }

  function alternarStatusFuncionario(id) {
    setFuncionarios((listaAtual) =>
      listaAtual.map((funcionario) =>
        funcionario.id === id
          ? {
              ...funcionario,
              ativo: funcionario.ativo === "sim" ? "nao" : "sim",
            }
          : funcionario
      )
    );
  }

  function alterarLogoConfiguracao(evento) {
    const arquivo = evento.target.files?.[0];

    if (!arquivo) return;

    const leitor = new FileReader();

    leitor.onload = () => {
      setConfiguracoes((configuracoesAtuais) => ({
        ...configuracoesAtuais,
        logoAcademia: leitor.result,
      }));
    };

    leitor.readAsDataURL(arquivo);
    evento.target.value = "";
  }

  function removerLogoConfiguracao() {
    setConfiguracoes((configuracoesAtuais) => ({
      ...configuracoesAtuais,
      logoAcademia: "",
    }));
  }

  function alterarConfiguracao(evento) {
    const { name, value } = evento.target;

    setConfiguracoes((configuracoesAtuais) => ({
      ...configuracoesAtuais,
      [name]: value,
    }));
  }

  function salvarConfiguracoes(evento) {
    evento.preventDefault();

    localStorage.setItem("triad_configuracoes", JSON.stringify(configuracoes));

    alert("Configurações salvas com sucesso!");
  }

  function restaurarConfiguracoes() {
    const confirmar = confirm(
      "Tem certeza que deseja restaurar as configurações padrão?"
    );

    if (!confirmar) return;

    setConfiguracoes(configuracoesPadrao);
    localStorage.removeItem("triad_configuracoes");

    alert("Configurações restauradas para o padrão.");
  }

  return (
    <div
      className={`app tema-${configuracoes.temaSistema} estilo-${configuracoes.estiloSistema}`}
      style={temaSistema}
    >
      <aside className="sidebar">
        <div className="logoBox">
          <div className="logoIcon logoClienteIcon">
            {configuracoes.logoAcademia ? (
              <img src={configuracoes.logoAcademia} alt="Logo da academia" />
            ) : (
              <Dumbbell size={26} />
            )}
          </div>

          <div>
            <h1>{configuracoes.nomeSistema}</h1>
            <span>{configuracoes.subtituloSistema}</span>
          </div>
        </div>

        <div className="divider"></div>

        <nav className="menu">
          <MenuItem
            active={paginaAtual === "acesso"}
            icon={<Fingerprint size={20} />}
            text={configuracoes.nomeAbaAcesso}
            onClick={() => setPaginaAtual("acesso")}
          />

          <MenuItem
            active={paginaAtual === "cadastro"}
            icon={<Plus size={20} />}
            text={configuracoes.nomeAbaCadastro}
            onClick={abrirCadastro}
          />

          <MenuItem
            active={paginaAtual === "aplicacoes"}
            icon={<BarChart3 size={20} />}
            text={configuracoes.nomeAbaAplicacoes}
            onClick={() => setPaginaAtual("aplicacoes")}
          />

          <MenuItem
            active={paginaAtual === "clientes"}
            icon={<UsersRound size={20} />}
            text={configuracoes.nomeAbaClientes}
            onClick={() => setPaginaAtual("clientes")}
          />

          <MenuItem
            active={paginaAtual === "financeiro"}
            icon={<PieChart size={20} />}
            text={configuracoes.nomeAbaFinanceiro}
            onClick={() => setPaginaAtual("financeiro")}
          />

          <MenuItem
            active={paginaAtual === "relatorios"}
            icon={<BarChart3 size={20} />}
            text={configuracoes.nomeAbaRelatorios}
            onClick={() => setPaginaAtual("relatorios")}
          />

          <MenuItem
            active={paginaAtual === "funcionarios"}
            icon={<UserRoundCheck size={20} />}
            text={configuracoes.nomeAbaFuncionarios}
            onClick={() => setPaginaAtual("funcionarios")}
          />

          <MenuItem
            active={paginaAtual === "configuracoes"}
            icon={<UserRoundCheck size={20} />}
            text={configuracoes.nomeAbaConfiguracoes}
            onClick={() => setPaginaAtual("configuracoes")}
          />
        </nav>
      </aside>

      <main className="main">
        <div key={paginaAtual} className={`pageTransition page-${paginaAtual}`}>
          {paginaAtual === "cadastro" ? (
            <CadastroMembro
              formulario={formulario}
              configuracoes={configuracoes}
              alterarCampo={alterarCampo}
              alterarFoto={alterarFoto}
              alterarDigital={alterarDigital}
              cadastrarMembro={cadastrarMembro}
              voltarParaAcesso={voltarParaAcesso}
            />
          ) : paginaAtual === "aplicacoes" ? (
            <TelaAplicacoes setPaginaAtual={setPaginaAtual} configuracoes={configuracoes} />
          ) : paginaAtual === "clientes" ? (
            <TelaListaClientes
              configuracoes={configuracoes}
              membros={membros}
              setMembroSelecionado={setMembroSelecionado}
              setMensagemLeitor={setMensagemLeitor}
              setStatusLeitura={setStatusLeitura}
              setUltimoAcesso={setUltimoAcesso}
              setPaginaAtual={setPaginaAtual}
              excluirMembro={excluirMembro}
            />
          ) : paginaAtual === "financeiro" ? (
            <TelaFinanceiro membros={membros} abrirPagamento={abrirPagamento} configuracoes={configuracoes} />
          ) : paginaAtual === "relatorios" ? (
            <TelaRelatorios membros={membros} acessosHoje={acessosHoje} configuracoes={configuracoes} />
          ) : paginaAtual === "funcionarios" ? (
            <TelaFuncionarios
              funcionarios={funcionarios}
              funcionarioForm={funcionarioForm}
              alterarCampoFuncionario={alterarCampoFuncionario}
              alterarFotoFuncionario={alterarFotoFuncionario}
              alterarDigitalFuncionario={alterarDigitalFuncionario}
              cadastrarFuncionario={cadastrarFuncionario}
              excluirFuncionario={excluirFuncionario}
              alternarStatusFuncionario={alternarStatusFuncionario}
              limparCadastroFuncionario={limparCadastroFuncionario}
              configuracoes={configuracoes}
            />
          ) : paginaAtual === "configuracoes" ? (
            <TelaConfiguracoes
              configuracoes={configuracoes}
              alterarConfiguracao={alterarConfiguracao}
              alterarLogoConfiguracao={alterarLogoConfiguracao}
              removerLogoConfiguracao={removerLogoConfiguracao}
              salvarConfiguracoes={salvarConfiguracoes}
              restaurarConfiguracoes={restaurarConfiguracoes}
            />
          ) : (
            <TelaAcesso
              configuracoes={configuracoes}
              hora={hora}
              abrirCadastro={abrirCadastro}
              estatisticas={estatisticas}
              membrosFiltrados={membrosFiltrados}
              membroSelecionado={membroSelecionado}
              setMembroSelecionado={setMembroSelecionado}
              mensagemLeitor={mensagemLeitor}
              setMensagemLeitor={setMensagemLeitor}
              statusLeitura={statusLeitura}
              setStatusLeitura={setStatusLeitura}
              ultimoAcesso={ultimoAcesso}
              setUltimoAcesso={setUltimoAcesso}
              busca={busca}
              setBusca={setBusca}
              simularLeitura={simularLeitura}
              excluirMembro={excluirMembro}
            />
          )}
        </div>
      </main>

      {pagamentoAberto && (
        <ModalPagamento
          membro={pagamentoAberto}
          formularioPagamento={formularioPagamento}
          alterarCampoPagamento={alterarCampoPagamento}
          confirmarPagamento={confirmarPagamento}
          fecharPagamento={fecharPagamento}
          configuracoes={configuracoes}
        />
      )}
    </div>
  );
}

function TelaAcesso({
  configuracoes = configuracoesPadrao,
  hora,
  abrirCadastro,
  estatisticas,
  membrosFiltrados,
  membroSelecionado,
  setMembroSelecionado,
  mensagemLeitor,
  setMensagemLeitor,
  statusLeitura,
  setStatusLeitura,
  ultimoAcesso,
  setUltimoAcesso,
  busca,
  setBusca,
  simularLeitura,
  excluirMembro,
}) {
  return (
    <>
      <header className="header">
        <div>
          <h2>{configuracoes.nomeAbaAcesso}</h2>
          <p>{configuracoes.nomeAcademia} • {configuracoes.sloganAcademia}</p>
        </div>

        <div className="headerActions">
          <div className="timeBox">
            <Clock3 size={18} />
            <span>{hora}</span>
          </div>

          <button onClick={abrirCadastro}>
            <Plus size={19} />
            Adicionar Membro
          </button>
        </div>
      </header>

      <section className="cards">
        <Card
          icon={<UsersRound />}
          number={estatisticas.total}
          label="Total de Membros"
        />

        <Card
          icon={<CheckCircle2 />}
          number={estatisticas.acessosHoje}
          label="Acessos Hoje"
        />

        <Card
          icon={<CalendarDays />}
          number={estatisticas.ativos}
          label="Membros Ativos"
        />

        <Card
          icon={<AlertTriangle />}
          number={estatisticas.emAtraso}
          label="Em Atraso"
        />
      </section>

      <section className="contentGrid">
        <div className="panel">
          <div className="panelHeader">
            <div>
              <Fingerprint size={20} />
              <span>LEITOR BIOMÉTRICO</span>
            </div>

            <div className="online"></div>
          </div>

          <div
            className={`fingerArea leitorPremium ${statusLeitura}`}
            onClick={simularLeitura}
          >
            <div className="scannerRings">
              <span></span>
              <span></span>
              <span></span>
            </div>

            <Fingerprint
              className="scannerFingerprint"
              size={112}
              strokeWidth={1.8}
            />

            {statusLeitura === "lendo" && <div className="scannerLine"></div>}

            <p>{mensagemLeitor}</p>

            {statusLeitura === "lendo" && (
              <span className="scannerText">Verificando biometria...</span>
            )}
          </div>

          {ultimoAcesso ? (
            <div
              className={`acessoResultado ${
                ultimoAcesso.liberado ? "liberado" : "negado"
              }`}
            >
              <div className="acessoFotoBox">
                <img src={ultimoAcesso.foto} alt={ultimoAcesso.nome} />

                <div className="acessoStatusIcon">
                  {ultimoAcesso.liberado ? (
                    <CheckCircle2 size={28} />
                  ) : (
                    <AlertTriangle size={28} />
                  )}
                </div>
              </div>

              <div className="acessoResultadoInfo">
                <span>
                  {ultimoAcesso.liberado ? "ACESSO LIBERADO" : "ACESSO NEGADO"}
                </span>

                <strong>
                  {ultimoAcesso.liberado
                    ? `Bem-vindo, ${ultimoAcesso.nome}`
                    : ultimoAcesso.nome}
                </strong>

                <p>
                  {ultimoAcesso.liberado
                    ? configuracoes.mensagemBomTreino
                    : `${ultimoAcesso.motivo}. ${configuracoes.mensagemAcessoNegado}`}
                </p>

                <small>
                  Plano R$ {ultimoAcesso.valorPlano} • Vence{" "}
                  {formatarData(ultimoAcesso.vencimento)}
                </small>
              </div>
            </div>
          ) : (
            membroSelecionado && (
              <div className="selectedUser">
                <img src={membroSelecionado.foto} alt={membroSelecionado.nome} />

                <div>
                  <strong>{membroSelecionado.nome}</strong>
                  <span>
                    CPF: {membroSelecionado.cpf} • Nasc.: {formatarData(membroSelecionado.nascimento)} • Idade: {calcularIdade(membroSelecionado.nascimento)} • Plano R${" "}
                    {membroSelecionado.valorPlano} • Vence{" "}
                    {formatarData(membroSelecionado.vencimento)}
                  </span>

                  <span>
                    Digital:{" "}
                    {membroSelecionado.digital
                      ? "Cadastrada"
                      : "Não cadastrada"}
                  </span>
                </div>
              </div>
            )
          )}
        </div>

        <div className="panel">
          <div className="panelHeader">
            <div>
              <List size={20} />
              <span>LISTA DE MEMBROS</span>
            </div>

            <ChevronRight size={24} />
          </div>

          <div className="searchBox">
            <Search size={18} />
            <input
              type="text"
              placeholder="Buscar membro..."
              value={busca}
              onChange={(evento) => setBusca(evento.target.value)}
            />
          </div>

          <div className="memberList">
            {membrosFiltrados.map((membro) => {
              const ativo = verificarAtivoComTolerancia(membro.vencimento, configuracoes.diasTolerancia);
              const selecionado = membroSelecionado?.id === membro.id;

              return (
                <div
                  key={membro.id}
                  onClick={() => {
                    setMembroSelecionado(membro);
                    setStatusLeitura("parado");
                    setUltimoAcesso(null);
                    setMensagemLeitor(
                      "Aluno selecionado. Encoste o dedo para liberar o acesso."
                    );
                  }}
                  className={`memberItem ${selecionado ? "selected" : ""}`}
                >
                  <img src={membro.foto} alt={membro.nome} />

                  <div className="memberInfo">
                    <strong>{membro.nome}</strong>
                    <span>
                      Plano R$ {membro.valorPlano} | Vence:{" "}
                      {formatarData(membro.vencimento)}
                    </span>

                    <span>
                      Nascimento: {formatarData(membro.nascimento)} • Idade: {calcularIdade(membro.nascimento)}
                    </span>

                    <span>Digital: {membro.digital ? "OK" : "Pendente"}</span>
                  </div>

                  <div className={`status ${ativo ? "active" : "expired"}`}>
                    {ativo ? "Ativo" : "Expirado"}
                  </div>

                  <button
                    className="deleteButton"
                    onClick={(evento) => {
                      evento.stopPropagation();
                      excluirMembro(membro.id);
                    }}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}

function TelaAplicacoes({ setPaginaAtual, configuracoes = configuracoesPadrao }) {
  const aplicacoes = [
    {
      titulo: configuracoes.nomeAbaAcesso,
      descricao: "Gerencie entrada, catraca, biometria e acessos dos alunos.",
      status: "Ativo",
      icone: <Fingerprint size={28} />,
      acao: () => setPaginaAtual("acesso"),
    },
    {
      titulo: configuracoes.nomeAbaCadastro,
      descricao: "Cadastre alunos com foto, digital, plano e vencimento.",
      status: "Ativo",
      icone: <UsersRound size={28} />,
      acao: () => setPaginaAtual("cadastro"),
    },
    {
      titulo: configuracoes.nomeAbaClientes,
      descricao: "Veja todos os alunos cadastrados, ativos, vencidos e digitais.",
      status: "Ativo",
      icone: <List size={28} />,
      acao: () => setPaginaAtual("clientes"),
    },
    {
      titulo: configuracoes.nomeAbaFinanceiro,
      descricao: "Controle mensalidades, gráficos e recebimentos.",
      status: "Ativo",
      icone: <PieChart size={28} />,
      acao: () => setPaginaAtual("financeiro"),
    },
    {
      titulo: configuracoes.nomeAbaRelatorios,
      descricao: "Dashboard completo com gráficos, alunos, acessos e financeiro.",
      status: "Ativo",
      icone: <BarChart3 size={28} />,
      acao: () => setPaginaAtual("relatorios"),
    },
    {
      titulo: configuracoes.nomeAbaFuncionarios,
      descricao: "Cadastre funcionários com foto, biometria, dados pessoais e tipo de função.",
      status: "Ativo",
      icone: <UserRoundCheck size={28} />,
      acao: () => setPaginaAtual("funcionarios"),
    },
    {
      titulo: configuracoes.nomeAbaConfiguracoes,
      descricao:
        "Configure catraca, leitor biométrico, dados da academia e regras.",
      status: "Ativo",
      icone: <UserRoundCheck size={28} />,
      acao: () => setPaginaAtual("configuracoes"),
    },
    {
      titulo: configuracoes.nomeModuloAppAluno,
      descricao: "Área futura para o aluno ver pagamentos, avisos e situação.",
      status: "Futuro",
      icone: <Star size={28} />,
      acao: () => alert("App do aluno será feito depois."),
    },
  ];

  return (
    <div className="aplicacoesPage">
      <header className="header">
        <div>
          <h2>{configuracoes.nomeAbaAplicacoes}</h2>
          <p>Central de módulos do sistema {configuracoes.nomeAcademia}</p>
        </div>
      </header>

      <section className="appsHero">
        <div>
          <span>Sistema modular</span>
          <h3>Escolha uma aplicação para gerenciar</h3>
          <p>
            Aqui ficam todos os módulos principais da academia. Alguns já estão
            ativos e outros serão criados nas próximas etapas.
          </p>
        </div>

        <div className="appsHeroIcon">
          <Dumbbell size={46} />
        </div>
      </section>

      <section className="appsGrid">
        {aplicacoes.map((app) => (
          <div className="appCard" key={app.titulo}>
            <div className="appCardTop">
              <div className="appIcon">{app.icone}</div>

              <span
                className={`appStatus ${
                  app.status === "Ativo" ? "ativo" : "breve"
                }`}
              >
                {app.status}
              </span>
            </div>

            <h3>{app.titulo}</h3>
            <p>{app.descricao}</p>

            <button type="button" onClick={app.acao}>
              Abrir módulo
              <ChevronRight size={18} />
            </button>
          </div>
        ))}
      </section>
    </div>
  );
}

function TelaListaClientes({
  configuracoes = configuracoesPadrao,
  membros,
  setMembroSelecionado,
  setMensagemLeitor,
  setStatusLeitura,
  setUltimoAcesso,
  setPaginaAtual,
  excluirMembro,
}) {
  const [buscaCliente, setBuscaCliente] = useState("");

  const clientesFiltrados = membros.filter((membro) => {
    const textoBusca = buscaCliente.toLowerCase();

    return (
      (membro.nome || "").toLowerCase().includes(textoBusca) ||
      (membro.cpf || "").toLowerCase().includes(textoBusca) ||
      (membro.telefone || "").toLowerCase().includes(textoBusca)
    );
  });

  const clientesAtivos = membros.filter((membro) =>
    verificarAtivoComTolerancia(membro.vencimento, configuracoes.diasTolerancia)
  ).length;

  const clientesVencidos = membros.length - clientesAtivos;

  function abrirClienteNoAcesso(membro) {
    setMembroSelecionado(membro);
    setStatusLeitura("parado");
    setUltimoAcesso(null);
    setMensagemLeitor("Cliente selecionado. Agora encoste o dedo no leitor.");
    setPaginaAtual("acesso");
  }

  return (
    <div className="clientesPage">
      <header className="header">
        <div>
          <h2>{configuracoes.nomeAbaClientes}</h2>
          <p>Visualize, pesquise e gerencie os alunos cadastrados</p>
        </div>
      </header>

      <section className="clientesResumo">
        <div className="clienteResumoCard">
          <UsersRound size={26} />
          <div>
            <strong>{membros.length}</strong>
            <span>Total de clientes</span>
          </div>
        </div>

        <div className="clienteResumoCard">
          <CheckCircle2 size={26} />
          <div>
            <strong>{clientesAtivos}</strong>
            <span>Clientes ativos</span>
          </div>
        </div>

        <div className="clienteResumoCard">
          <AlertTriangle size={26} />
          <div>
            <strong>{clientesVencidos}</strong>
            <span>Clientes vencidos</span>
          </div>
        </div>
      </section>

      <section className="clientesPanel">
        <div className="clientesPanelHeader">
          <div>
            <List size={20} />
            <span>CLIENTES CADASTRADOS</span>
          </div>

          <div className="clientesSearch">
            <Search size={18} />
            <input
              type="text"
              placeholder="Buscar por nome, CPF ou telefone..."
              value={buscaCliente}
              onChange={(evento) => setBuscaCliente(evento.target.value)}
            />
          </div>
        </div>

        <div className="clientesLista">
          {clientesFiltrados.map((membro) => {
            const ativo = verificarAtivoComTolerancia(membro.vencimento, configuracoes.diasTolerancia);

            return (
              <div className="clienteCard" key={membro.id}>
                <img src={membro.foto} alt={membro.nome} />

                <div className="clienteDados">
                  <strong>{membro.nome}</strong>
                  <span>CPF: {membro.cpf || "Não informado"}</span>
                  <span>Nascimento: {formatarData(membro.nascimento)} • {calcularIdade(membro.nascimento)}</span>
                  <span>Telefone: {membro.telefone || "Não informado"}</span>
                  <span>E-mail: {membro.email || "Não informado"}</span>
                </div>

                <div className="clientePlano">
                  <strong>R$ {membro.valorPlano}</strong>
                  <span>Vence: {formatarData(membro.vencimento)}</span>
                  <span>
                    Digital: {membro.digital ? "Cadastrada" : "Pendente"}
                  </span>
                </div>

                <div className={`status ${ativo ? "active" : "expired"}`}>
                  {ativo ? "Ativo" : "Expirado"}
                </div>

                <div className="clienteActions">
                  <button
                    type="button"
                    onClick={() => abrirClienteNoAcesso(membro)}
                  >
                    Ver acesso
                  </button>

                  <button
                    type="button"
                    className="deleteButton"
                    onClick={() => excluirMembro(membro.id)}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            );
          })}

          {clientesFiltrados.length === 0 && (
            <div className="clientesEmpty">
              <UsersRound size={46} />
              <strong>Nenhum cliente encontrado</strong>
              <span>Tente buscar por outro nome, CPF ou telefone.</span>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

function TelaFinanceiro({ membros, abrirPagamento, configuracoes = configuracoesPadrao }) {
  const totalAlunos = membros.length;

  const alunosAtivos = membros.filter((membro) =>
    verificarAtivoComTolerancia(membro.vencimento, configuracoes.diasTolerancia)
  ).length;

  const alunosInativos = totalAlunos - alunosAtivos;

  const totalPrevisto = membros.reduce((total, membro) => {
    return total + converterValor(membro.valorPlano);
  }, 0);

  const totalEmDia = membros
    .filter((membro) => verificarAtivoComTolerancia(membro.vencimento, configuracoes.diasTolerancia))
    .reduce((total, membro) => {
      return total + converterValor(membro.valorPlano);
    }, 0);

  const totalAtrasado = totalPrevisto - totalEmDia;

  const pagamentosDoMes = pegarPagamentosDoMes(membros);

  const totalRecebidoMes = pagamentosDoMes.reduce((total, pagamento) => {
    return total + converterValor(pagamento.valor);
  }, 0);

  const pix = pagamentosDoMes.filter((pagamento) => pagamento.forma === "PIX");
  const cartao = pagamentosDoMes.filter(
    (pagamento) => pagamento.forma === "CARTAO"
  );
  const dinheiro = pagamentosDoMes.filter(
    (pagamento) => pagamento.forma === "DINHEIRO"
  );

  const totalPix = pix.reduce(
    (total, pagamento) => total + converterValor(pagamento.valor),
    0
  );

  const totalCartao = cartao.reduce(
    (total, pagamento) => total + converterValor(pagamento.valor),
    0
  );

  const totalDinheiro = dinheiro.reduce(
    (total, pagamento) => total + converterValor(pagamento.valor),
    0
  );

  const maiorForma = Math.max(totalPix, totalCartao, totalDinheiro, 1);

  const porcentagemAtivos =
    totalAlunos === 0 ? 0 : Math.round((alunosAtivos / totalAlunos) * 100);

  const porcentagemReceitaEmDia =
    totalPrevisto === 0 ? 0 : Math.round((totalEmDia / totalPrevisto) * 100);

  return (
    <div className="financeiroPage">
      <header className="header">
        <div>
          <h2>{configuracoes.nomeAbaFinanceiro}</h2>
          <p>Controle de mensalidades, gráficos e recebimentos</p>
        </div>
      </header>

      <section className="financeiroCards">
        <div className="financeiroCard">
          <PieChart size={26} />
          <div>
            <strong>{formatarDinheiro(totalPrevisto)}</strong>
            <span>Total previsto</span>
          </div>
        </div>

        <div className="financeiroCard">
          <CheckCircle2 size={26} />
          <div>
            <strong>{formatarDinheiro(totalRecebidoMes)}</strong>
            <span>Recebido no mês</span>
          </div>
        </div>

        <div className="financeiroCard">
          <AlertTriangle size={26} />
          <div>
            <strong>{formatarDinheiro(totalAtrasado)}</strong>
            <span>Receita atrasada</span>
          </div>
        </div>

        <div className="financeiroCard">
          <UsersRound size={26} />
          <div>
            <strong>{totalAlunos}</strong>
            <span>Total de alunos</span>
          </div>
        </div>
      </section>

      <section className="financeiroMetodoCards">
        <div className="financeiroMetodoCard">
          <strong>{formatarDinheiro(totalPix)}</strong>
          <span>PIX</span>
          <p>{pix.length} pagamento(s)</p>
        </div>

        <div className="financeiroMetodoCard">
          <strong>{formatarDinheiro(totalCartao)}</strong>
          <span>Cartão de crédito</span>
          <p>{cartao.length} pagamento(s)</p>
        </div>

        <div className="financeiroMetodoCard">
          <strong>{formatarDinheiro(totalDinheiro)}</strong>
          <span>Dinheiro</span>
          <p>{dinheiro.length} pagamento(s)</p>
        </div>
      </section>

      <section className="graficosGrid">
        <div className="graficoCard">
          <div
            className="graficoPizza"
            style={{
              background: `conic-gradient(#00e676 0% ${porcentagemAtivos}%, #ff4d7d ${porcentagemAtivos}% 100%)`,
            }}
          >
            <div>
              <strong>{porcentagemAtivos}%</strong>
              <span>Ativos</span>
            </div>
          </div>

          <div className="graficoInfo">
            <h3>Alunos ativos x inativos</h3>

            <div className="legendaItem">
              <span className="legendaCor ativo"></span>
              <p>Ativos: {alunosAtivos}</p>
            </div>

            <div className="legendaItem">
              <span className="legendaCor vencido"></span>
              <p>Inativos/Vencidos: {alunosInativos}</p>
            </div>
          </div>
        </div>

        <div className="graficoCard">
          <div
            className="graficoPizza"
            style={{
              background: `conic-gradient(#00e676 0% ${porcentagemReceitaEmDia}%, #ffc857 ${porcentagemReceitaEmDia}% 100%)`,
            }}
          >
            <div>
              <strong>{porcentagemReceitaEmDia}%</strong>
              <span>Em dia</span>
            </div>
          </div>

          <div className="graficoInfo">
            <h3>Receita em dia x atrasada</h3>

            <div className="legendaItem">
              <span className="legendaCor ativo"></span>
              <p>Em dia: {formatarDinheiro(totalEmDia)}</p>
            </div>

            <div className="legendaItem">
              <span className="legendaCor alerta"></span>
              <p>Atrasada: {formatarDinheiro(totalAtrasado)}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="financeiroPanel">
        <div className="financeiroPanelHeader">
          <div>
            <BarChart3 size={20} />
            <span>FORMAS DE PAGAMENTO DO MÊS</span>
          </div>
        </div>

        <div className="pagamentoMetodoGrafico">
          <div className="metodoBarra">
            <div>
              <strong>PIX</strong>
              <span>
                {pix.length} pagamento(s) • {formatarDinheiro(totalPix)}
              </span>
            </div>

            <div className="metodoBarraFundo">
              <div
                className="metodoPix"
                style={{ width: `${(totalPix / maiorForma) * 100}%` }}
              ></div>
            </div>
          </div>

          <div className="metodoBarra">
            <div>
              <strong>Cartão de crédito</strong>
              <span>
                {cartao.length} pagamento(s) • {formatarDinheiro(totalCartao)}
              </span>
            </div>

            <div className="metodoBarraFundo">
              <div
                className="metodoCartao"
                style={{ width: `${(totalCartao / maiorForma) * 100}%` }}
              ></div>
            </div>
          </div>

          <div className="metodoBarra">
            <div>
              <strong>Dinheiro</strong>
              <span>
                {dinheiro.length} pagamento(s) •{" "}
                {formatarDinheiro(totalDinheiro)}
              </span>
            </div>

            <div className="metodoBarraFundo">
              <div
                className="metodoDinheiro"
                style={{ width: `${(totalDinheiro / maiorForma) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>
      </section>

      <section className="financeiroPanel">
        <div className="financeiroPanelHeader">
          <div>
            <List size={20} />
            <span>MENSALIDADES</span>
          </div>
        </div>

        <div className="financeiroLista">
          {membros.map((membro) => {
            const ativo = verificarAtivoComTolerancia(membro.vencimento, configuracoes.diasTolerancia);
            const ultimoPagamento = membro.pagamentos?.[0];

            return (
              <div className="financeiroLinha" key={membro.id}>
                <img src={membro.foto} alt={membro.nome} />

                <div className="financeiroAluno">
                  <strong>{membro.nome}</strong>
                  <span>CPF: {membro.cpf}</span>
                  <span>Nascimento: {formatarData(membro.nascimento)} • {calcularIdade(membro.nascimento)}</span>

                  {ultimoPagamento && (
                    <span className="ultimoPagamento">
                      Último pagamento:{" "}
                      {formatarFormaPagamento(ultimoPagamento.forma)} em{" "}
                      {formatarData(ultimoPagamento.data)}
                    </span>
                  )}
                </div>

                <div className="financeiroValor">
                  <strong>R$ {membro.valorPlano}</strong>
                  <span>Valor do plano</span>
                </div>

                <div className="financeiroVencimento">
                  <strong>{formatarData(membro.vencimento)}</strong>
                  <span>Vencimento</span>
                </div>

                <div className={`status ${ativo ? "active" : "expired"}`}>
                  {ativo ? "Em dia" : "Vencido"}
                </div>

                <button type="button" onClick={() => abrirPagamento(membro)}>
                  Receber pagamento
                </button>
              </div>
            );
          })}

          {membros.length === 0 && (
            <div className="clientesEmpty">
              <UsersRound size={46} />
              <strong>Nenhum aluno cadastrado</strong>
              <span>Cadastre um aluno para aparecer no financeiro.</span>
            </div>
          )}
        </div>
      </section>

      <section className="financeiroPanel">
        <div className="financeiroPanelHeader">
          <div>
            <Clock3 size={20} />
            <span>HISTÓRICO DE PAGAMENTOS DO MÊS</span>
          </div>
        </div>

        <div className="financeiroHistorico">
          {pagamentosDoMes.map((pagamento) => {
            const valorMensalidade = converterValor(pagamento.valor);
            const valorRecebido = converterValor(pagamento.valorRecebido || pagamento.valor);
            const valorDevolvido = converterValor(pagamento.valorDevolvido || pagamento.troco);
            const controleTrocoAtivo = pagamento.controleTroco !== "nao";
            const mostrarPagoETroco = controleTrocoAtivo && (valorRecebido > valorMensalidade || valorDevolvido > 0);

            return (
              <div className="historicoPagamentoItem" key={pagamento.id}>
                <img src={pagamento.alunoFoto} alt={pagamento.alunoNome} />

                <div>
                  <strong>{pagamento.alunoNome}</strong>
                  <span>
                    {formatarData(pagamento.data)} •{" "}
                    {formatarFormaPagamento(pagamento.forma)}
                  </span>
                </div>

                <div className={`historicoValoresPagamento ${mostrarPagoETroco ? "comTroco" : "semTroco"}`}>
                  <p>{formatarDinheiro(valorMensalidade)}</p>

                  {mostrarPagoETroco && (
                    <>
                      <span>Cliente entregou: {formatarDinheiro(valorRecebido)}</span>
                      <span>Devolver para o cliente: {formatarDinheiro(valorDevolvido)}</span>
                    </>
                  )}
                </div>
              </div>
            );
          })}

          {pagamentosDoMes.length === 0 && (
            <div className="clientesEmpty">
              <PieChart size={46} />
              <strong>Nenhum pagamento neste mês</strong>
              <span>Quando receber pagamentos, eles aparecerão aqui.</span>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

function ModalPagamento({
  membro,
  formularioPagamento,
  alterarCampoPagamento,
  confirmarPagamento,
  fecharPagamento,
  configuracoes = configuracoesPadrao,
}) {
  const controlarTroco = configuracoes.controlarTrocoDevolucao !== "nao";
  const valorMensalidade = converterValor(formularioPagamento.valor);
  const valorRecebido = controlarTroco
    ? converterValor(formularioPagamento.valorRecebido || formularioPagamento.valor)
    : valorMensalidade;
  const diferenca = valorRecebido - valorMensalidade;
  const valorDevolvido = controlarTroco ? Math.max(diferenca, 0) : 0;
  const falta = controlarTroco ? Math.max(valorMensalidade - valorRecebido, 0) : 0;
  const recebeuMenos = controlarTroco && valorRecebido > 0 && valorRecebido < valorMensalidade;
  const recebeuMais = controlarTroco && valorRecebido > valorMensalidade;
  const podeConfirmar = valorMensalidade > 0 && (!controlarTroco || valorRecebido >= valorMensalidade);

  return (
    <div className="modalOverlay">
      <form className="pagamentoModal pagamentoModalPremium" onSubmit={confirmarPagamento}>
        <div className="pagamentoModalHeader">
          <div>
            <h3>Receber mensalidade</h3>
            <p>Informe quanto o cliente entregou. O sistema calcula automaticamente quanto devolver.</p>
          </div>

          <button type="button" className="modalClose" onClick={fecharPagamento}>
            ×
          </button>
        </div>

        <div className="pagamentoAlunoBox">
          <img src={membro.foto} alt={membro.nome} />

          <div>
            <strong>{membro.nome}</strong>
            <span>Plano R$ {membro.valorPlano}</span>
            <span>Vencimento atual: {formatarData(membro.vencimento)}</span>
          </div>
        </div>

        <div className="configFormGrid">
          <div className="formGroup">
            <label>Valor da mensalidade (fica na academia)</label>
            <input
              type="text"
              name="valor"
              value={formularioPagamento.valor}
              onChange={alterarCampoPagamento}
              placeholder="Ex: 80,00"
              inputMode="decimal"
            />
          </div>

          {controlarTroco && (
            <div className="formGroup">
              <label>Valor entregue pelo cliente</label>
              <input
                type="text"
                name="valorRecebido"
                value={formularioPagamento.valorRecebido}
                onChange={alterarCampoPagamento}
                placeholder="Ex: 150,00"
                inputMode="decimal"
              />
            </div>
          )}

          <div className="formGroup full">
            <label>Forma de pagamento</label>
            <select
              name="forma"
              value={formularioPagamento.forma}
              onChange={alterarCampoPagamento}
            >
              <option value="PIX">PIX</option>
              <option value="CARTAO">Cartão de crédito</option>
              <option value="DINHEIRO">Dinheiro</option>
            </select>
          </div>
        </div>

        <div className={`pagamentoResumoTroco ${controlarTroco ? "" : "trocoDesativado"}`}>
          <div>
            <span>Fica na academia</span>
            <strong>{formatarDinheiro(valorMensalidade)}</strong>
          </div>

          {controlarTroco ? (
            <>
              <div>
                <span>Cliente entregou</span>
                <strong>{formatarDinheiro(valorRecebido)}</strong>
              </div>

              <div
                className={
                  recebeuMais
                    ? "trocoPositivo"
                    : recebeuMenos
                    ? "valorInsuficiente"
                    : ""
                }
              >
                <span>
                  {recebeuMais
                    ? "Devolver para o cliente"
                    : recebeuMenos
                    ? "Falta receber"
                    : "Não precisa devolver"}
                </span>
                <strong>{formatarDinheiro(recebeuMenos ? falta : valorDevolvido)}</strong>
              </div>
            </>
          ) : (
            <div className="trocoDesativadoInfo">
              <span>Controle de devolução</span>
              <strong>Desativado</strong>
            </div>
          )}
        </div>

        <div className="pagamentoAviso">
          <strong>Relatório automático</strong>
          <p>
            Ao confirmar, o sistema salva o nome do aluno, dia, horário e mensalidade.
            {controlarTroco
              ? "  Também salva quanto o cliente entregou e quanto precisa devolver para ele."
              : "  O controle de valor entregue e devolução está desativado nas configurações."}
            Se o cliente entregar o valor exato, o histórico mostra somente a mensalidade.
          </p>
        </div>

        <div className="pagamentoActions">
          <button type="button" className="secondaryButton" onClick={fecharPagamento}>
            Cancelar
          </button>

          <button type="submit" disabled={!podeConfirmar}>
            <CheckCircle size={18} />
            {recebeuMenos ? "Falta receber" : recebeuMais ? `Confirmar e devolver ${formatarDinheiro(valorDevolvido)}` : "Confirmar recebimento"}
          </button>
        </div>
      </form>
    </div>
  );
}


function TelaRelatorios({ membros, acessosHoje, configuracoes = configuracoesPadrao }) {
  const [tipoRelatorio, setTipoRelatorio] = useState("mes");
  const [dataRelatorio, setDataRelatorio] = useState(pegarDataHoje());
  const [dataInicio, setDataInicio] = useState(pegarDataHoje());
  const [dataFim, setDataFim] = useState(pegarDataHoje());
  const [mesRelatorio, setMesRelatorio] = useState(pegarDataHoje().slice(0, 7));
  const [anoRelatorio, setAnoRelatorio] = useState(String(new Date().getFullYear()));

  const totalAlunos = membros.length;

  const alunosAtivos = membros.filter((membro) =>
    verificarAtivoComTolerancia(membro.vencimento, configuracoes.diasTolerancia)
  ).length;

  const alunosInativos = totalAlunos - alunosAtivos;

  const todosPagamentos = useMemo(() => {
    return membros
      .flatMap((membro) =>
        (membro.pagamentos || []).map((pagamento) => {
          const valorMensalidade = converterValor(pagamento.valor);
          const valorRecebido = pagamento.valorRecebido
            ? converterValor(pagamento.valorRecebido)
            : valorMensalidade;
          const valorDevolvido = pagamento.valorDevolvido
            ? converterValor(pagamento.valorDevolvido)
            : pagamento.troco
            ? converterValor(pagamento.troco)
            : 0;
          const controleTrocoAtivo = pagamento.controleTroco !== "nao";
          const temTroco = controleTrocoAtivo && (valorRecebido > valorMensalidade || valorDevolvido > 0);

          return {
            ...pagamento,
            alunoId: membro.id,
            alunoNome: membro.nome,
            alunoFoto: membro.foto,
            alunoCpf: membro.cpf,
            valorMensalidade,
            valorRecebido,
            troco: valorDevolvido,
            valorDevolvido,
            controleTrocoAtivo,
            temTroco,
          };
        })
      )
      .sort((a, b) => {
        const dataA = new Date(`${a.data}T00:00:00`).getTime();
        const dataB = new Date(`${b.data}T00:00:00`).getTime();

        if (dataA !== dataB) return dataB - dataA;

        return Number(b.id || 0) - Number(a.id || 0);
      });
  }, [membros]);

  function pegarInicioSemana(dataBase) {
    const data = new Date(`${dataBase}T00:00:00`);
    const diaSemana = data.getDay();
    const diferenca = diaSemana === 0 ? -6 : 1 - diaSemana;

    data.setDate(data.getDate() + diferenca);

    return data.toISOString().split("T")[0];
  }

  function somarDias(dataBase, dias) {
    const data = new Date(`${dataBase}T00:00:00`);
    data.setDate(data.getDate() + dias);

    return data.toISOString().split("T")[0];
  }

  function pagamentoDentroDoPeriodo(pagamento) {
    if (!pagamento.data) return false;

    if (tipoRelatorio === "dia") {
      return pagamento.data === dataRelatorio;
    }

    if (tipoRelatorio === "semana") {
      const inicioSemana = pegarInicioSemana(dataRelatorio);
      const fimSemana = somarDias(inicioSemana, 6);

      return pagamento.data >= inicioSemana && pagamento.data <= fimSemana;
    }

    if (tipoRelatorio === "mes") {
      return pagamento.data.startsWith(mesRelatorio);
    }

    if (tipoRelatorio === "ano") {
      return pagamento.data.startsWith(anoRelatorio);
    }

    if (tipoRelatorio === "periodo") {
      return pagamento.data >= dataInicio && pagamento.data <= dataFim;
    }

    return true;
  }

  const pagamentosFiltrados = todosPagamentos.filter(pagamentoDentroDoPeriodo);

  const totalRecebido = pagamentosFiltrados.reduce(
    (total, pagamento) => total + pagamento.valorMensalidade,
    0
  );

  const totalDinheiroRecebido = pagamentosFiltrados.reduce(
    (total, pagamento) => total + pagamento.valorRecebido,
    0
  );

  const totalTroco = pagamentosFiltrados.reduce(
    (total, pagamento) => total + pagamento.troco,
    0
  );

  const ticketMedio =
    pagamentosFiltrados.length === 0 ? 0 : totalRecebido / pagamentosFiltrados.length;

  const totalPorForma = pagamentosFiltrados.reduce(
    (totais, pagamento) => {
      if (pagamento.forma === "PIX") totais.pix += pagamento.valorMensalidade;
      if (pagamento.forma === "CARTAO") totais.cartao += pagamento.valorMensalidade;
      if (pagamento.forma === "DINHEIRO") totais.dinheiro += pagamento.valorMensalidade;

      return totais;
    },
    { pix: 0, cartao: 0, dinheiro: 0 }
  );

  const pagamentosAgrupadosPorDia = pagamentosFiltrados.reduce((grupos, pagamento) => {
    if (!grupos[pagamento.data]) {
      grupos[pagamento.data] = [];
    }

    grupos[pagamento.data].push(pagamento);

    return grupos;
  }, {});

  const diasRelatorio = Object.keys(pagamentosAgrupadosPorDia).sort(
    (a, b) => new Date(`${b}T00:00:00`) - new Date(`${a}T00:00:00`)
  );

  const alunosVencidos = membros.filter(
    (membro) => !verificarAtivoComTolerancia(membro.vencimento, configuracoes.diasTolerancia)
  );

  const periodoTexto =
    tipoRelatorio === "dia"
      ? `Dia ${formatarData(dataRelatorio)}`
      : tipoRelatorio === "semana"
      ? `Semana de ${formatarData(pegarInicioSemana(dataRelatorio))} até ${formatarData(
          somarDias(pegarInicioSemana(dataRelatorio), 6)
        )}`
      : tipoRelatorio === "mes"
      ? `Mês ${mesRelatorio.split("-").reverse().join("/")}`
      : tipoRelatorio === "ano"
      ? `Ano ${anoRelatorio}`
      : `Período de ${formatarData(dataInicio)} até ${formatarData(dataFim)}`;

  return (
    <div className="relatoriosPage">
      <header className="header">
        <div>
          <h2>{configuracoes.nomeAbaRelatorios}</h2>
          <p>Pagamentos separados por dia, semana, mês, ano e período escolhido</p>
        </div>

        <div className="timeBox">
          <BarChart3 size={18} />
          <span>{periodoTexto}</span>
        </div>
      </header>

      <section className="relatorioHero financeiroRelatorioHero">
        <div>
          <span>RELATÓRIO FINANCEIRO</span>
          <h3>Mensalidade, valor entregue e devolução ao cliente</h3>
          <p>
            Filtre por dia, semana, mês, ano ou escolha um período. O relatório
            separa cada pagamento por data com nome do aluno, valor da mensalidade,
            valor entregue pelo cliente, valor que precisa devolver e forma de pagamento.
          </p>
        </div>

        <div className="relatorioHeroIcon">
          <PieChart size={52} />
        </div>
      </section>

      <section className="relatorioFiltrosCard">
        <div className="relatorioFiltroTitulo">
          <div>
            <CalendarDays size={20} />
            <strong>Escolher período do relatório</strong>
          </div>

          <span>{pagamentosFiltrados.length} pagamento(s) encontrado(s)</span>
        </div>

        <div className="filtrosRelatorioGrid">
          <div className="formGroup">
            <label>Tipo de relatório</label>
            <select
              value={tipoRelatorio}
              onChange={(evento) => setTipoRelatorio(evento.target.value)}
            >
              <option value="dia">Dia</option>
              <option value="semana">Semana</option>
              <option value="mes">Mês</option>
              <option value="ano">Ano</option>
              <option value="periodo">Escolher dias</option>
            </select>
          </div>

          {(tipoRelatorio === "dia" || tipoRelatorio === "semana") && (
            <div className="formGroup">
              <label>{tipoRelatorio === "dia" ? "Escolha o dia" : "Escolha um dia da semana"}</label>
              <input
                type="date"
                value={dataRelatorio}
                onChange={(evento) => setDataRelatorio(evento.target.value)}
              />
            </div>
          )}

          {tipoRelatorio === "mes" && (
            <div className="formGroup">
              <label>Escolha o mês</label>
              <input
                type="month"
                value={mesRelatorio}
                onChange={(evento) => setMesRelatorio(evento.target.value)}
              />
            </div>
          )}

          {tipoRelatorio === "ano" && (
            <div className="formGroup">
              <label>Escolha o ano</label>
              <input
                type="number"
                min="2020"
                max="2100"
                value={anoRelatorio}
                onChange={(evento) => setAnoRelatorio(evento.target.value)}
              />
            </div>
          )}

          {tipoRelatorio === "periodo" && (
            <>
              <div className="formGroup">
                <label>Data inicial</label>
                <input
                  type="date"
                  value={dataInicio}
                  onChange={(evento) => setDataInicio(evento.target.value)}
                />
              </div>

              <div className="formGroup">
                <label>Data final</label>
                <input
                  type="date"
                  value={dataFim}
                  onChange={(evento) => setDataFim(evento.target.value)}
                />
              </div>
            </>
          )}
        </div>
      </section>

      <section className="relatorioFinanceiroResumo">
        <div className="relatorioCard destaque">
          <CheckCircle2 size={27} />
          <div>
            <strong>{formatarDinheiro(totalRecebido)}</strong>
            <span>Total em mensalidades</span>
          </div>
        </div>

        <div className="relatorioCard">
          <PieChart size={27} />
          <div>
            <strong>{formatarDinheiro(totalDinheiroRecebido)}</strong>
            <span>Total pago pelos clientes</span>
          </div>
        </div>

        <div className="relatorioCard alerta">
          <AlertTriangle size={27} />
          <div>
            <strong>{formatarDinheiro(totalTroco)}</strong>
            <span>Total para devolver aos clientes</span>
          </div>
        </div>

        <div className="relatorioCard">
          <UsersRound size={27} />
          <div>
            <strong>{pagamentosFiltrados.length}</strong>
            <span>Pagamentos no período</span>
          </div>
        </div>
      </section>

      <section className="financeiroMetodoCards relatorioMetodoResumo">
        <div className="financeiroMetodoCard">
          <strong>{formatarDinheiro(totalPorForma.pix)}</strong>
          <span>PIX</span>
          <p>Recebido por PIX no filtro atual</p>
        </div>

        <div className="financeiroMetodoCard">
          <strong>{formatarDinheiro(totalPorForma.cartao)}</strong>
          <span>Cartão</span>
          <p>Recebido por cartão no filtro atual</p>
        </div>

        <div className="financeiroMetodoCard">
          <strong>{formatarDinheiro(totalPorForma.dinheiro)}</strong>
          <span>Dinheiro</span>
          <p>Ticket médio: {formatarDinheiro(ticketMedio)}</p>
        </div>
      </section>

      <section className="relatorioPagamentosPanel">
        <div className="relatorioPainelHeader">
          <div>
            <List size={20} />
            <span>PAGAMENTOS SEPARADOS POR DIA</span>
          </div>
        </div>

        {diasRelatorio.length === 0 ? (
          <div className="relatorioVazioGrande">
            <PieChart size={50} />
            <strong>Nenhum pagamento encontrado</strong>
            <span>Escolha outro dia, semana, mês, ano ou período.</span>
          </div>
        ) : (
          <div className="relatorioDiasLista">
            {diasRelatorio.map((dia) => {
              const pagamentosDoDia = pagamentosAgrupadosPorDia[dia];
              const totalDia = pagamentosDoDia.reduce(
                (total, pagamento) => total + pagamento.valorMensalidade,
                0
              );
              const recebidoDia = pagamentosDoDia.reduce(
                (total, pagamento) => total + pagamento.valorRecebido,
                0
              );
              const trocoDia = pagamentosDoDia.reduce(
                (total, pagamento) => total + pagamento.troco,
                0
              );

              return (
                <div className="relatorioPagamentoDia" key={dia}>
                  <div className="relatorioDiaHeader">
                    <div>
                      <strong>{formatarData(dia)}</strong>
                      <span>{pagamentosDoDia.length} pagamento(s)</span>
                    </div>

                    <div className="relatorioDiaTotais">
                      <span>Mensalidades: {formatarDinheiro(totalDia)}</span>
                      <span>Pago pelos clientes: {formatarDinheiro(recebidoDia)}</span>
                      <span>Para devolver: {formatarDinheiro(trocoDia)}</span>
                    </div>
                  </div>

                  <div className="relatorioTabelaPagamentos">
                    {pagamentosDoDia.map((pagamento) => (
                      <div className="relatorioLinhaPagamento" key={pagamento.id}>
                        <div className="pagamentoAlunoRelatorio">
                          <img src={pagamento.alunoFoto} alt={pagamento.alunoNome} />

                          <div>
                            <strong>{pagamento.alunoNome}</strong>
                            <span>
                              CPF: {pagamento.alunoCpf || "Não informado"} • Horário:{" "}
                              {pagamento.horario || "Não salvo"}
                            </span>
                          </div>
                        </div>

                        <div
                          className={`pagamentoValoresGrid ${
                            pagamento.temTroco ? "comTroco" : "semTroco"
                          }`}
                        >
                          <div className="pagamentoValorBox mensalidade">
                            <span>Mensalidade recebida</span>
                            <strong>{formatarDinheiro(pagamento.valorMensalidade)}</strong>
                          </div>

                          {pagamento.temTroco && (
                            <>
                              <div className="pagamentoValorBox">
                                <span>Cliente entregou</span>
                                <strong>{formatarDinheiro(pagamento.valorRecebido)}</strong>
                              </div>

                              <div className="pagamentoValorBox troco">
                                <span>Devolver para o cliente</span>
                                <strong>{formatarDinheiro(pagamento.valorDevolvido)}</strong>
                              </div>
                            </>
                          )}

                          <div className="pagamentoFormaTag">
                            {formatarFormaPagamento(pagamento.forma)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      <section className="relatorioGrid">
        <div className="relatorioPainel">
          <div className="relatorioPainelHeader">
            <div>
              <UsersRound size={20} />
              <span>ALUNOS</span>
            </div>
          </div>

          <div className="relatorioMiniCards relatorioMiniCardsSeparado">
            <div>
              <strong>{totalAlunos}</strong>
              <span>Total de alunos</span>
            </div>

            <div>
              <strong>{alunosAtivos}</strong>
              <span>Ativos</span>
            </div>

            <div>
              <strong>{alunosInativos}</strong>
              <span>Vencidos ou inativos</span>
            </div>
          </div>
        </div>

        <div className="relatorioPainel">
          <div className="relatorioPainelHeader">
            <div>
              <AlertTriangle size={20} />
              <span>ALUNOS VENCIDOS</span>
            </div>
          </div>

          <div className="vencidosLista">
            {alunosVencidos.map((membro) => (
              <div className="vencidoItem" key={membro.id}>
                <img src={membro.foto} alt={membro.nome} />

                <div>
                  <strong>{membro.nome}</strong>
                  <p>Venceu em {formatarData(membro.vencimento)}</p>
                </div>

                <span>R$ {membro.valorPlano}</span>
              </div>
            ))}

            {alunosVencidos.length === 0 && (
              <div className="relatorioVazio">
                Nenhum aluno vencido. Tudo certo!
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}


function TelaConfiguracoes({
  configuracoes,
  alterarConfiguracao,
  alterarLogoConfiguracao,
  removerLogoConfiguracao,
  salvarConfiguracoes,
  restaurarConfiguracoes,
}) {
  return (
    <div className="configuracoesPage">
      <header className="header">
        <div>
          <h2>{configuracoes.nomeAbaConfiguracoes}</h2>
          <p>
            Personalize nome, logo, cores, catraca, biometria, financeiro e
            regras sem mexer no código
          </p>
        </div>

        <div className="timeBox">
          <UserRoundCheck size={18} />
          <span>White Label</span>
        </div>
      </header>

      <section className="configHero whiteLabelHero">
        <div>
          <span>PAINEL WHITE LABEL</span>
          <h3>{configuracoes.nomeAcademia}</h3>
          <p>
            Configure o sistema para qualquer academia. Troque logo, nome,
            cores, abas, mensagens, catraca, digital, horários e financeiro
            direto por aqui.
          </p>
        </div>

        <div className="configHeroLogo">
          {configuracoes.logoAcademia ? (
            <img src={configuracoes.logoAcademia} alt="Logo da academia" />
          ) : (
            <Dumbbell size={52} />
          )}
        </div>
      </section>

      <form className="configuracoesGrid" onSubmit={salvarConfiguracoes}>
        <div className="configCard configFull">
          <div className="configCardHeader">
            <div className="configIcon">
              <Camera size={24} />
            </div>

            <div>
              <h3>Identidade visual do cliente</h3>
              <p>Logo, nome do sistema, slogan e marca da academia</p>
            </div>
          </div>

          <div className="logoConfigArea">
            <div className="logoPreviewConfig">
              {configuracoes.logoAcademia ? (
                <img src={configuracoes.logoAcademia} alt="Logo da academia" />
              ) : (
                <Dumbbell size={46} />
              )}
            </div>

            <div className="logoConfigInfo">
              <strong>{configuracoes.nomeSistema}</strong>
              <span>{configuracoes.subtituloSistema}</span>
              <p>{configuracoes.sloganAcademia}</p>

              <div className="logoConfigActions">
                <label className="uploadLogoButton">
                  Escolher logo
                  <input
                    type="file"
                    accept="image/*"
                    onChange={alterarLogoConfiguracao}
                  />
                </label>

                <button
                  type="button"
                  className="secondaryButton"
                  onClick={removerLogoConfiguracao}
                >
                  Remover logo
                </button>
              </div>
            </div>
          </div>

          <div className="configFormGrid three">
            <div className="formGroup">
              <label>Nome principal do sistema</label>
              <input
                type="text"
                name="nomeSistema"
                value={configuracoes.nomeSistema}
                onChange={alterarConfiguracao}
                placeholder="Ex: POWER FIT"
              />
            </div>

            <div className="formGroup">
              <label>Subtítulo da logo</label>
              <input
                type="text"
                name="subtituloSistema"
                value={configuracoes.subtituloSistema}
                onChange={alterarConfiguracao}
                placeholder="Ex: Academia"
              />
            </div>

            <div className="formGroup">
              <label>Nome da academia</label>
              <input
                type="text"
                name="nomeAcademia"
                value={configuracoes.nomeAcademia}
                onChange={alterarConfiguracao}
                placeholder="Ex: Academia do Cliente"
              />
            </div>

            <div className="formGroup full">
              <label>Slogan da academia</label>
              <input
                type="text"
                name="sloganAcademia"
                value={configuracoes.sloganAcademia}
                onChange={alterarConfiguracao}
                placeholder="Ex: Sua evolução começa aqui"
              />
            </div>

            <div className="formGroup">
              <label>Mostrar sua marca como dono</label>
              <select
                name="mostrarMarcaDono"
                value={configuracoes.mostrarMarcaDono}
                onChange={alterarConfiguracao}
              >
                <option value="sim">Sim, mostrar</option>
                <option value="nao">Não, esconder</option>
              </select>
            </div>

            <div className="formGroup">
              <label>Texto da sua marca</label>
              <input
                type="text"
                name="textoMarcaDono"
                value={configuracoes.textoMarcaDono}
                onChange={alterarConfiguracao}
              />
            </div>
          </div>
        </div>

        <div className="configCard configFull">
          <div className="configCardHeader">
            <div className="configIcon">
              <Star size={24} />
            </div>

            <div>
              <h3>Cores e estilo do sistema</h3>
              <p>Mude o visual inteiro para vender ou alugar para outra academia</p>
            </div>
          </div>

          <div className="configFormGrid three">
            <div className="formGroup">
              <label>Cor principal</label>
              <input
                type="color"
                name="corPrincipal"
                value={configuracoes.corPrincipal}
                onChange={alterarConfiguracao}
              />
            </div>

            <div className="formGroup">
              <label>Cor secundária</label>
              <input
                type="color"
                name="corSecundaria"
                value={configuracoes.corSecundaria}
                onChange={alterarConfiguracao}
              />
            </div>

            <div className="formGroup">
              <label>Cor do fundo</label>
              <input
                type="color"
                name="corFundo"
                value={configuracoes.corFundo}
                onChange={alterarConfiguracao}
              />
            </div>

            <div className="formGroup">
              <label>Cor dos cards</label>
              <input
                type="color"
                name="corPainel"
                value={configuracoes.corPainel}
                onChange={alterarConfiguracao}
              />
            </div>

            <div className="formGroup">
              <label>Cor do texto</label>
              <input
                type="color"
                name="corTexto"
                value={configuracoes.corTexto}
                onChange={alterarConfiguracao}
              />
            </div>

            <div className="formGroup">
              <label>Texto suave</label>
              <input
                type="color"
                name="corTextoSuave"
                value={configuracoes.corTextoSuave}
                onChange={alterarConfiguracao}
              />
            </div>

            <div className="formGroup">
              <label>Tema do sistema</label>
              <select
                name="temaSistema"
                value={configuracoes.temaSistema}
                onChange={alterarConfiguracao}
              >
                <option value="escuro">Escuro moderno</option>
                <option value="claro">Claro profissional</option>
                <option value="neon">Premium neon</option>
              </select>
            </div>

            <div className="formGroup">
              <label>Estilo visual</label>
              <select
                name="estiloSistema"
                value={configuracoes.estiloSistema}
                onChange={alterarConfiguracao}
              >
                <option value="premium">Premium arredondado</option>
                <option value="minimalista">Minimalista</option>
                <option value="corporativo">Corporativo</option>
              </select>
            </div>
          </div>

          <div className="temaPreview">
            <div>
              <span>Prévia</span>
              <strong>{configuracoes.nomeAcademia}</strong>
              <p>{configuracoes.sloganAcademia}</p>
            </div>

            <button type="button">Botão do sistema</button>
          </div>
        </div>

        <div className="configCard configFull">
          <div className="configCardHeader">
            <div className="configIcon">
              <List size={24} />
            </div>

            <div>
              <h3>Nomes das abas e módulos</h3>
              <p>Renomeie o sistema inteiro sem abrir o código</p>
            </div>
          </div>

          <div className="configFormGrid three">
            <div className="formGroup">
              <label>Aba Acesso</label>
              <input
                type="text"
                name="nomeAbaAcesso"
                value={configuracoes.nomeAbaAcesso}
                onChange={alterarConfiguracao}
              />
            </div>

            <div className="formGroup">
              <label>Aba Cadastro</label>
              <input
                type="text"
                name="nomeAbaCadastro"
                value={configuracoes.nomeAbaCadastro}
                onChange={alterarConfiguracao}
              />
            </div>

            <div className="formGroup">
              <label>Aba Aplicações</label>
              <input
                type="text"
                name="nomeAbaAplicacoes"
                value={configuracoes.nomeAbaAplicacoes}
                onChange={alterarConfiguracao}
              />
            </div>

            <div className="formGroup">
              <label>Aba Clientes</label>
              <input
                type="text"
                name="nomeAbaClientes"
                value={configuracoes.nomeAbaClientes}
                onChange={alterarConfiguracao}
              />
            </div>

            <div className="formGroup">
              <label>Aba Financeiro</label>
              <input
                type="text"
                name="nomeAbaFinanceiro"
                value={configuracoes.nomeAbaFinanceiro}
                onChange={alterarConfiguracao}
              />
            </div>

            <div className="formGroup">
              <label>Aba Relatórios</label>
              <input
                type="text"
                name="nomeAbaRelatorios"
                value={configuracoes.nomeAbaRelatorios}
                onChange={alterarConfiguracao}
              />
            </div>

            <div className="formGroup">
              <label>Aba Funcionários</label>
              <input
                type="text"
                name="nomeAbaFuncionarios"
                value={configuracoes.nomeAbaFuncionarios}
                onChange={alterarConfiguracao}
              />
            </div>

            <div className="formGroup">
              <label>Aba Configurações</label>
              <input
                type="text"
                name="nomeAbaConfiguracoes"
                value={configuracoes.nomeAbaConfiguracoes}
                onChange={alterarConfiguracao}
              />
            </div>

            <div className="formGroup">
              <label>Nome App do Aluno</label>
              <input
                type="text"
                name="nomeModuloAppAluno"
                value={configuracoes.nomeModuloAppAluno}
                onChange={alterarConfiguracao}
              />
            </div>
          </div>
        </div>

        <div className="configCard">
          <div className="configCardHeader">
            <div className="configIcon">
              <Dumbbell size={24} />
            </div>

            <div>
              <h3>Dados da academia</h3>
              <p>Informações do cliente que comprou ou alugou o sistema</p>
            </div>
          </div>

          <div className="configFormGrid">
            <div className="formGroup">
              <label>Telefone</label>
              <input
                type="text"
                name="telefoneAcademia"
                value={configuracoes.telefoneAcademia}
                onChange={alterarConfiguracao}
              />
            </div>

            <div className="formGroup">
              <label>E-mail</label>
              <input
                type="email"
                name="emailAcademia"
                value={configuracoes.emailAcademia}
                onChange={alterarConfiguracao}
              />
            </div>

            <div className="formGroup">
              <label>CNPJ</label>
              <input
                type="text"
                name="cnpjAcademia"
                value={configuracoes.cnpjAcademia}
                onChange={alterarConfiguracao}
                placeholder="00.000.000/0001-00"
              />
            </div>

            <div className="formGroup">
              <label>Responsável</label>
              <input
                type="text"
                name="responsavelAcademia"
                value={configuracoes.responsavelAcademia}
                onChange={alterarConfiguracao}
              />
            </div>

            <div className="formGroup">
              <label>Cidade</label>
              <input
                type="text"
                name="cidadeAcademia"
                value={configuracoes.cidadeAcademia}
                onChange={alterarConfiguracao}
              />
            </div>

            <div className="formGroup">
              <label>Endereço</label>
              <input
                type="text"
                name="enderecoAcademia"
                value={configuracoes.enderecoAcademia}
                onChange={alterarConfiguracao}
              />
            </div>
          </div>
        </div>

        <div className="configCard">
          <div className="configCardHeader">
            <div className="configIcon">
              <Fingerprint size={24} />
            </div>

            <div>
              <h3>Catraca e biometria</h3>
              <p>Porta, velocidade, comando, leitor e modo de funcionamento</p>
            </div>
          </div>

          <div className="configFormGrid">
            <div className="formGroup">
              <label>Porta da catraca</label>
              <input
                type="text"
                name="portaCatraca"
                value={configuracoes.portaCatraca}
                onChange={alterarConfiguracao}
                placeholder="COM3"
              />
            </div>

            <div className="formGroup">
              <label>Velocidade</label>
              <select
                name="velocidadeCatraca"
                value={configuracoes.velocidadeCatraca}
                onChange={alterarConfiguracao}
              >
                <option value="9600">9600</option>
                <option value="19200">19200</option>
                <option value="38400">38400</option>
                <option value="57600">57600</option>
                <option value="115200">115200</option>
              </select>
            </div>

            <div className="formGroup">
              <label>Comando de liberação</label>
              <input
                type="text"
                name="comandoLiberacao"
                value={configuracoes.comandoLiberacao}
                onChange={alterarConfiguracao}
                placeholder="0x00"
              />
            </div>

            <div className="formGroup">
              <label>Leitor biométrico</label>
              <select
                name="leitorBiometrico"
                value={configuracoes.leitorBiometrico}
                onChange={alterarConfiguracao}
              >
                <option value="Futronic FS88">Futronic FS88</option>
                <option value="Futronic FS80">Futronic FS80</option>
                <option value="Leitor USB Genérico">Leitor USB Genérico</option>
                <option value="Simulação">Simulação</option>
              </select>
            </div>

            <div className="formGroup">
              <label>Modo do leitor</label>
              <select
                name="modoLeitorBiometrico"
                value={configuracoes.modoLeitorBiometrico}
                onChange={alterarConfiguracao}
              >
                <option value="simulacao">Simulação</option>
                <option value="real">Leitor real</option>
                <option value="misto">Misto</option>
              </select>
            </div>

            <div className="formGroup">
              <label>Tempo da leitura em ms</label>
              <input
                type="number"
                name="tempoLeituraBiometria"
                value={configuracoes.tempoLeituraBiometria}
                onChange={alterarConfiguracao}
                min="300"
              />
            </div>

            <div className="formGroup">
              <label>Liberar sem digital?</label>
              <select
                name="liberarSemDigital"
                value={configuracoes.liberarSemDigital}
                onChange={alterarConfiguracao}
              >
                <option value="nao">Não</option>
                <option value="sim">Sim</option>
              </select>
            </div>
          </div>

          <div className="configTesteBox">
            <div>
              <strong>Status do equipamento</strong>
              <span>
                Porta {configuracoes.portaCatraca}, velocidade{" "}
                {configuracoes.velocidadeCatraca}, leitor{" "}
                {configuracoes.leitorBiometrico}
              </span>
            </div>

            <button
              type="button"
              onClick={() =>
                alert(
                  `Teste enviado para ${configuracoes.portaCatraca} usando comando ${configuracoes.comandoLiberacao}`
                )
              }
            >
              Testar catraca
            </button>
          </div>
        </div>

        <div className="configCard configFull">
          <div className="configCardHeader">
            <div className="configIcon">
              <AlertTriangle size={24} />
            </div>

            <div>
              <h3>Regras de acesso e mensagens</h3>
              <p>Bloqueio, tolerância, horários e textos que aparecem no acesso</p>
            </div>
          </div>

          <div className="configFormGrid three">
            <div className="formGroup">
              <label>Bloquear aluno vencido</label>
              <select
                name="bloquearVencidos"
                value={configuracoes.bloquearVencidos}
                onChange={alterarConfiguracao}
              >
                <option value="sim">Sim, bloquear</option>
                <option value="nao">Não, permitir entrada</option>
              </select>
            </div>

            <div className="formGroup">
              <label>Dias de tolerância</label>
              <input
                type="number"
                name="diasTolerancia"
                value={configuracoes.diasTolerancia}
                onChange={alterarConfiguracao}
                min="0"
              />
            </div>

            <div className="formGroup">
              <label>Avisar antes do vencimento</label>
              <input
                type="number"
                name="avisoVencimento"
                value={configuracoes.avisoVencimento}
                onChange={alterarConfiguracao}
                min="0"
              />
            </div>

            <div className="formGroup">
              <label>Horário de abertura</label>
              <input
                type="time"
                name="horarioAbertura"
                value={configuracoes.horarioAbertura}
                onChange={alterarConfiguracao}
              />
            </div>

            <div className="formGroup">
              <label>Horário de fechamento</label>
              <input
                type="time"
                name="horarioFechamento"
                value={configuracoes.horarioFechamento}
                onChange={alterarConfiguracao}
              />
            </div>

            <div className="formGroup full">
              <label>Mensagem enquanto lê a biometria</label>
              <input
                type="text"
                name="mensagemLeitura"
                value={configuracoes.mensagemLeitura}
                onChange={alterarConfiguracao}
              />
            </div>

            <div className="formGroup">
              <label>Mensagem de boas-vindas</label>
              <input
                type="text"
                name="mensagemBoasVindas"
                value={configuracoes.mensagemBoasVindas}
                onChange={alterarConfiguracao}
                placeholder="Use {nome} para o nome do aluno"
              />
            </div>

            <div className="formGroup">
              <label>Mensagem de treino</label>
              <input
                type="text"
                name="mensagemBomTreino"
                value={configuracoes.mensagemBomTreino}
                onChange={alterarConfiguracao}
              />
            </div>

            <div className="formGroup">
              <label>Mensagem de acesso negado</label>
              <input
                type="text"
                name="mensagemAcessoNegado"
                value={configuracoes.mensagemAcessoNegado}
                onChange={alterarConfiguracao}
              />
            </div>
          </div>
        </div>

        <div className="configCard configFull">
          <div className="configCardHeader">
            <div className="configIcon">
              <PieChart size={24} />
            </div>

            <div>
              <h3>Financeiro e mensalidades</h3>
              <p>Renovação, pagamento padrão e regras financeiras</p>
            </div>
          </div>

          <div className="configFormGrid three">
            <div className="formGroup">
              <label>Valor da mensalidade (fica na academia) padrão</label>
              <input
                type="text"
                name="valorMensalidadePadrao"
                value={configuracoes.valorMensalidadePadrao}
                onChange={alterarConfiguracao}
                placeholder="Ex: 80,00"
                inputMode="decimal"
              />
            </div>

            <div className="formGroup">
              <label>Dias para renovar ao pagar</label>
              <input
                type="number"
                name="diasRenovacaoPagamento"
                value={configuracoes.diasRenovacaoPagamento}
                onChange={alterarConfiguracao}
                min="1"
              />
            </div>

            <div className="formGroup">
              <label>Pagamento padrão</label>
              <select
                name="formaPagamentoPadrao"
                value={configuracoes.formaPagamentoPadrao}
                onChange={alterarConfiguracao}
              >
                <option value="PIX">PIX</option>
                <option value="CARTAO">Cartão de crédito</option>
                <option value="DINHEIRO">Dinheiro</option>
              </select>
            </div>

            <div className="formGroup">
              <label>Permitir pagamento parcial?</label>
              <select
                name="permitirPagamentoParcial"
                value={configuracoes.permitirPagamentoParcial}
                onChange={alterarConfiguracao}
              >
                <option value="sim">Sim</option>
                <option value="nao">Não</option>
              </select>
            </div>

            <div className="formGroup">
              <label>Controlar devolução ao cliente?</label>
              <select
                name="controlarTrocoDevolucao"
                value={configuracoes.controlarTrocoDevolucao}
                onChange={alterarConfiguracao}
              >
                <option value="sim">Sim, calcular quanto devolver</option>
                <option value="nao">Não, mostrar só mensalidade</option>
              </select>
            </div>
          </div>

          <div className="configResumo">
            <div>
              <strong>Resumo da catraca</strong>
              <p>
                Porta <b>{configuracoes.portaCatraca}</b>, comando{" "}
                <b>{configuracoes.comandoLiberacao}</b>, modo{" "}
                <b>{configuracoes.modoLeitorBiometrico}</b>.
              </p>
            </div>

            <div>
              <strong>Resumo do acesso</strong>
              <p>
                {configuracoes.bloquearVencidos === "sim"
                  ? `Alunos vencidos serão bloqueados com ${configuracoes.diasTolerancia} dia(s) de tolerância.`
                  : "Alunos vencidos poderão entrar mesmo com mensalidade vencida."}
              </p>
            </div>
          </div>
        </div>

        <div className="configActions">
          <button
            type="button"
            className="secondaryButton"
            onClick={restaurarConfiguracoes}
          >
            Restaurar padrão
          </button>

          <button type="submit">
            <Save size={18} />
            Salvar configurações
          </button>
        </div>
      </form>

      {configuracoes.mostrarMarcaDono === "sim" && (
        <div className="marcaDonoSistema">{configuracoes.textoMarcaDono}</div>
      )}
    </div>
  );
}


function TelaFuncionarios({
  funcionarios,
  funcionarioForm,
  alterarCampoFuncionario,
  alterarFotoFuncionario,
  alterarDigitalFuncionario,
  cadastrarFuncionario,
  excluirFuncionario,
  alternarStatusFuncionario,
  limparCadastroFuncionario,
  configuracoes = configuracoesPadrao,
}) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  const [cameraLigada, setCameraLigada] = useState(false);
  const [buscaFuncionario, setBuscaFuncionario] = useState("");
  const [capturandoDigital, setCapturandoDigital] = useState(false);
  const [leiturasDigital, setLeiturasDigital] = useState([]);
  const [mensagemDigital, setMensagemDigital] = useState(
    "Inicie a biometria e peça para o funcionário colocar o dedo no leitor."
  );

  const totalLeiturasDigitais = 4;

  const funcionariosFiltrados = funcionarios.filter((funcionario) => {
    const busca = buscaFuncionario.toLowerCase();

    return (
      (funcionario.nome || "").toLowerCase().includes(busca) ||
      (funcionario.cpf || "").toLowerCase().includes(busca) ||
      (funcionario.tipoFuncionario || "").toLowerCase().includes(busca) ||
      (funcionario.cargo || "").toLowerCase().includes(busca)
    );
  });

  async function iniciarCamera() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false,
      });

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      setCameraLigada(true);
    } catch (erro) {
      alert("Não foi possível acessar a câmera. Clique em permitir no navegador.");
      console.log(erro);
    }
  }

  function pararCamera() {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }

    setCameraLigada(false);
  }

  function tirarFoto() {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const contexto = canvas.getContext("2d");
    contexto.drawImage(video, 0, 0, canvas.width, canvas.height);

    const fotoCapturada = canvas.toDataURL("image/png");

    alterarFotoFuncionario(fotoCapturada);
    pararCamera();
  }

  function removerFoto() {
    alterarFotoFuncionario("");
  }

  function iniciarCadastroDigital() {
    alterarDigitalFuncionario("");
    setLeiturasDigital([]);
    setMensagemDigital("Cadastro iniciado. Faça a primeira leitura da digital.");
  }

  function capturarDigital() {
    if (capturandoDigital) return;
    if (leiturasDigital.length >= totalLeiturasDigitais) return;

    setCapturandoDigital(true);
    setMensagemDigital("Lendo digital do funcionário... mantenha o dedo parado.");

    setTimeout(() => {
      setLeiturasDigital((leiturasAtuais) => {
        const numeroDaLeitura = leiturasAtuais.length + 1;
        const novaLeitura = {
          id: Date.now(),
          numero: numeroDaLeitura,
          qualidade: Math.floor(Math.random() * 14) + 86,
        };

        const novasLeituras = [...leiturasAtuais, novaLeitura];

        if (novasLeituras.length >= totalLeiturasDigitais) {
          alterarDigitalFuncionario(`DIGITAL-FUNC-${Date.now()}`);
          setMensagemDigital("Biometria do funcionário cadastrada com sucesso.");
        } else {
          setMensagemDigital(
            `Leitura ${numeroDaLeitura} confirmada. Retire o dedo e coloque novamente.`
          );
        }

        return novasLeituras;
      });

      setCapturandoDigital(false);
    }, 1200);
  }

  function removerDigital() {
    alterarDigitalFuncionario("");
    setLeiturasDigital([]);
    setMensagemDigital("Biometria removida. Cadastre novamente se precisar.");
  }

  function limparTudo() {
    limparCadastroFuncionario();
    setLeiturasDigital([]);
    setMensagemDigital(
      "Inicie a biometria e peça para o funcionário colocar o dedo no leitor."
    );
    pararCamera();
  }

  const progressoDigital =
    (leiturasDigital.length / totalLeiturasDigitais) * 100;

  const funcionariosAtivos = funcionarios.filter(
    (funcionario) => funcionario.ativo === "sim"
  ).length;

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  return (
    <div className="funcionariosPage">
      <header className="header">
        <div>
          <h2>{configuracoes.nomeAbaFuncionarios}</h2>
          <p>
            Cadastre funcionário com foto, biometria, nascimento, CPF,
            emergência, endereço e tipo de função.
          </p>
        </div>

        <div className="timeBox">
          <UserRoundCheck size={18} />
          <span>{funcionariosAtivos} ativos</span>
        </div>
      </header>

      <section className="funcionariosResumo">
        <div className="funcionarioResumoCard">
          <UsersRound size={25} />
          <div>
            <strong>{funcionarios.length}</strong>
            <span>Total de funcionários</span>
          </div>
        </div>

        <div className="funcionarioResumoCard">
          <CheckCircle2 size={25} />
          <div>
            <strong>{funcionariosAtivos}</strong>
            <span>Funcionários liberados</span>
          </div>
        </div>

        <div className="funcionarioResumoCard">
          <Fingerprint size={25} />
          <div>
            <strong>{funcionarios.filter((funcionario) => funcionario.digital).length}</strong>
            <span>Com biometria</span>
          </div>
        </div>
      </section>

      <section className="funcionariosGrid">
        <form className="funcionarioCadastroCard" onSubmit={cadastrarFuncionario}>
          <div className="funcionarioCardHeader">
            <div className="configIcon">
              <Plus size={23} />
            </div>
            <div>
              <h3>Cadastrar funcionário</h3>
              <p>Dados completos, foto e biometria de acesso</p>
            </div>
          </div>

          <div className="funcionarioMediaGrid">
            <div className="funcionarioMediaBox">
              <strong>Foto do funcionário</strong>

              {!funcionarioForm.foto && !cameraLigada && (
                <div className="funcionarioFotoEmpty">
                  <Camera size={38} />
                  <span>Nenhuma foto</span>
                  <button type="button" onClick={iniciarCamera}>
                    <Camera size={17} />
                    Abrir câmera
                  </button>
                </div>
              )}

              {cameraLigada && (
                <div className="funcionarioCameraPreview">
                  <video ref={videoRef} autoPlay playsInline />

                  <div className="cameraActions">
                    <button type="button" onClick={tirarFoto}>
                      <Camera size={17} />
                      Tirar foto
                    </button>

                    <button
                      type="button"
                      className="secondaryButton"
                      onClick={pararCamera}
                    >
                      <CameraOff size={17} />
                      Fechar
                    </button>
                  </div>
                </div>
              )}

              {funcionarioForm.foto && !cameraLigada && (
                <div className="funcionarioFotoPreview">
                  <img src={funcionarioForm.foto} alt="Foto do funcionário" />
                  <div className="cameraActions">
                    <button type="button" onClick={iniciarCamera}>
                      <Camera size={17} />
                      Nova foto
                    </button>
                    <button type="button" className="secondaryButton" onClick={removerFoto}>
                      Remover
                    </button>
                  </div>
                </div>
              )}

              <canvas ref={canvasRef} style={{ display: "none" }} />
            </div>

            <div className="funcionarioMediaBox funcionarioDigitalBox">
              <strong>Biometria do funcionário</strong>

              <div className="funcionarioDigitalReader">
                <Fingerprint size={60} />
                {capturandoDigital && <div className="digitalScanLine"></div>}
                {funcionarioForm.digital && (
                  <div className="digitalCheck">
                    <CheckCircle size={22} />
                  </div>
                )}
              </div>

              <p>{mensagemDigital}</p>

              <div className="digitalProgressText">
                {leiturasDigital.length}/{totalLeiturasDigitais} leituras concluídas
              </div>
              <div className="digitalProgress">
                <div style={{ width: `${progressoDigital}%` }}></div>
              </div>

              <div className="funcionarioDigitalActions">
                {leiturasDigital.length === 0 && !funcionarioForm.digital && (
                  <button type="button" onClick={iniciarCadastroDigital}>
                    <Fingerprint size={17} />
                    Iniciar biometria
                  </button>
                )}

                {!funcionarioForm.digital && leiturasDigital.length < totalLeiturasDigitais && (
                  <button
                    type="button"
                    onClick={capturarDigital}
                    disabled={capturandoDigital}
                  >
                    <Fingerprint size={17} />
                    {capturandoDigital ? "Lendo..." : `Leitura ${leiturasDigital.length + 1}`}
                  </button>
                )}

                {funcionarioForm.digital && (
                  <button type="button" className="secondaryButton" onClick={removerDigital}>
                    Remover digital
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="sectionTitle">
            <UsersRound size={20} />
            <span>Dados do funcionário</span>
          </div>

          <div className="cadastroGrid">
            <div className="formGroup full">
              <label>Nome completo</label>
              <input
                type="text"
                name="nome"
                placeholder="Ex: João da Recepção"
                value={funcionarioForm.nome}
                onChange={alterarCampoFuncionario}
              />
            </div>

            <div className="formGroup">
              <label>CPF</label>
              <input
                type="text"
                name="cpf"
                placeholder="000.000.000-00"
                value={funcionarioForm.cpf}
                onChange={alterarCampoFuncionario}
              />
            </div>

            <div className="formGroup">
              <label>Data de nascimento / aniversário</label>
              <input
                type="date"
                name="nascimento"
                value={funcionarioForm.nascimento}
                onChange={alterarCampoFuncionario}
              />
            </div>

            <div className="formGroup">
              <label>Telefone</label>
              <input
                type="text"
                name="telefone"
                placeholder="(89) 99999-9999"
                value={funcionarioForm.telefone}
                onChange={alterarCampoFuncionario}
              />
            </div>

            <div className="formGroup">
              <label>Número de emergência</label>
              <input
                type="text"
                name="emergencia"
                placeholder="(89) 98888-8888"
                value={funcionarioForm.emergencia}
                onChange={alterarCampoFuncionario}
              />
            </div>

            <div className="formGroup">
              <label>Tipo de funcionário</label>
              <select
                name="tipoFuncionario"
                value={funcionarioForm.tipoFuncionario}
                onChange={alterarCampoFuncionario}
              >
                <option value="Recepção">Recepção</option>
                <option value="Professor">Professor</option>
                <option value="Personal Trainer">Personal Trainer</option>
                <option value="Financeiro">Financeiro</option>
                <option value="Administrador">Administrador</option>
                <option value="Limpeza">Limpeza</option>
                <option value="Manutenção">Manutenção</option>
              </select>
            </div>

            <div className="formGroup">
              <label>Cargo/Função</label>
              <input
                type="text"
                name="cargo"
                placeholder="Ex: Atendente, Instrutor, Gerente"
                value={funcionarioForm.cargo}
                onChange={alterarCampoFuncionario}
              />
            </div>

            <div className="formGroup">
              <label>Cidade</label>
              <input
                type="text"
                name="cidade"
                placeholder="São Raimundo Nonato"
                value={funcionarioForm.cidade}
                onChange={alterarCampoFuncionario}
              />
            </div>

            <div className="formGroup">
              <label>Bairro</label>
              <input
                type="text"
                name="bairro"
                placeholder="Centro"
                value={funcionarioForm.bairro}
                onChange={alterarCampoFuncionario}
              />
            </div>

            <div className="formGroup">
              <label>Rua</label>
              <input
                type="text"
                name="rua"
                placeholder="Rua Exemplo"
                value={funcionarioForm.rua}
                onChange={alterarCampoFuncionario}
              />
            </div>

            <div className="formGroup">
              <label>Número</label>
              <input
                type="text"
                name="numero"
                placeholder="123"
                value={funcionarioForm.numero}
                onChange={alterarCampoFuncionario}
              />
            </div>

            <div className="formGroup">
              <label>Status</label>
              <select
                name="ativo"
                value={funcionarioForm.ativo}
                onChange={alterarCampoFuncionario}
              >
                <option value="sim">Liberado</option>
                <option value="nao">Bloqueado</option>
              </select>
            </div>
          </div>

          <div className="cadastroActions">
            <button type="button" className="secondaryButton" onClick={limparTudo}>
              Limpar cadastro
            </button>
            <button type="submit">
              <Save size={18} />
              Salvar funcionário
            </button>
          </div>
        </form>

        <div className="funcionariosListaCard">
          <div className="funcionarioCardHeader">
            <div className="configIcon">
              <List size={23} />
            </div>
            <div>
              <h3>Funcionários cadastrados</h3>
              <p>Controle acesso, função, foto e biometria</p>
            </div>
          </div>

          <div className="clientesSearch funcionarioSearch">
            <Search size={18} />
            <input
              type="text"
              placeholder="Buscar funcionário, CPF ou função..."
              value={buscaFuncionario}
              onChange={(evento) => setBuscaFuncionario(evento.target.value)}
            />
          </div>

          <div className="funcionariosLista">
            {funcionariosFiltrados.map((funcionario) => (
              <div className="funcionarioItem" key={funcionario.id}>
                <img src={funcionario.foto} alt={funcionario.nome} />

                <div className="funcionarioInfo">
                  <strong>{funcionario.nome}</strong>
                  <span>{funcionario.tipoFuncionario} • {funcionario.cargo}</span>
                  <span>CPF: {funcionario.cpf} • Nasc.: {formatarData(funcionario.nascimento)} • Aniv.: {formatarAniversario(funcionario.nascimento)}</span>
                  <span>Bairro: {funcionario.bairro || "Não informado"} • Emergência: {funcionario.emergencia}</span>
                  <span>Biometria: {funcionario.digital ? "Cadastrada" : "Pendente"}</span>
                </div>

                <div className="funcionarioBadges">
                  <span className={`status ${funcionario.ativo === "sim" ? "active" : "expired"}`}>
                    {funcionario.ativo === "sim" ? "Liberado" : "Bloqueado"}
                  </span>

                  <button
                    type="button"
                    className="secondaryButton"
                    onClick={() => alternarStatusFuncionario(funcionario.id)}
                  >
                    {funcionario.ativo === "sim" ? "Bloquear" : "Liberar"}
                  </button>

                  <button
                    type="button"
                    className="deleteButton"
                    onClick={() => excluirFuncionario(funcionario.id)}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}

            {funcionariosFiltrados.length === 0 && (
              <div className="clientesEmpty">
                <UsersRound size={42} />
                <strong>Nenhum funcionário encontrado</strong>
                <span>Cadastre ou ajuste a busca.</span>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

function CadastroMembro({
  formulario,
  configuracoes = configuracoesPadrao,
  alterarCampo,
  alterarFoto,
  alterarDigital,
  cadastrarMembro,
  voltarParaAcesso,
}) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  const [cameraLigada, setCameraLigada] = useState(false);

  const totalLeiturasDigitais = 4;
  const [capturandoDigital, setCapturandoDigital] = useState(false);
  const [leiturasDigital, setLeiturasDigital] = useState([]);
  const [mensagemDigital, setMensagemDigital] = useState(
    "Inicie o cadastro e peça para o aluno colocar o dedo no leitor."
  );

  async function iniciarCamera() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false,
      });

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      setCameraLigada(true);
    } catch (erro) {
      alert("Não foi possível acessar a câmera. Clique em permitir no navegador.");
      console.log(erro);
    }
  }

  function pararCamera() {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }

    setCameraLigada(false);
  }

  function tirarFoto() {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const contexto = canvas.getContext("2d");
    contexto.drawImage(video, 0, 0, canvas.width, canvas.height);

    const fotoCapturada = canvas.toDataURL("image/png");

    alterarFoto(fotoCapturada);
    pararCamera();
  }

  function removerFoto() {
    alterarFoto("");
  }

  function iniciarCadastroDigital() {
    alterarDigital("");
    setLeiturasDigital([]);
    setMensagemDigital(
      "Cadastro iniciado. Coloque o dedo no leitor para fazer a primeira leitura."
    );
  }

  function capturarDigital() {
    if (capturandoDigital) return;
    if (leiturasDigital.length >= totalLeiturasDigitais) return;

    setCapturandoDigital(true);
    setMensagemDigital("Lendo digital... mantenha o dedo no leitor.");

    setTimeout(() => {
      setLeiturasDigital((leiturasAtuais) => {
        const numeroDaLeitura = leiturasAtuais.length + 1;

        const novaLeitura = {
          id: Date.now(),
          numero: numeroDaLeitura,
          qualidade: Math.floor(Math.random() * 16) + 84,
        };

        const novasLeituras = [...leiturasAtuais, novaLeitura];

        if (novasLeituras.length >= totalLeiturasDigitais) {
          const codigoDigital = `DIGITAL-${Date.now()}`;

          alterarDigital(codigoDigital);
          setMensagemDigital(
            "Digital cadastrada com sucesso. Todas as leituras foram confirmadas."
          );
        } else {
          setMensagemDigital(
            `Leitura ${numeroDaLeitura} concluída. Retire o dedo e coloque novamente para a próxima leitura.`
          );
        }

        return novasLeituras;
      });

      setCapturandoDigital(false);
    }, 1500);
  }

  function removerDigital() {
    alterarDigital("");
    setLeiturasDigital([]);
    setMensagemDigital(
      "Digital removida. Inicie novamente o cadastro biométrico."
    );
  }

  const progressoDigital =
    (leiturasDigital.length / totalLeiturasDigitais) * 100;

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  return (
    <div className="cadastroPage">
      <header className="cadastroHeader">
        <div>
          <button className="backButton" onClick={voltarParaAcesso}>
            <ArrowLeft size={18} />
            Voltar
          </button>

          <h2>Cadastro de Membro</h2>
          <p>Preencha os dados, tire a foto e cadastre a digital</p>
        </div>
      </header>

      <form className="cadastroCard" onSubmit={cadastrarMembro}>
        <div className="sectionTitle">
          <UsersRound size={20} />
          <span>Dados pessoais</span>
        </div>

        <div className="cadastroGrid">
          <div className="formGroup full">
            <label>Nome completo</label>
            <input
              type="text"
              name="nome"
              placeholder="Ex: Isaac Kennety"
              value={formulario.nome}
              onChange={alterarCampo}
            />
          </div>

          <div className="formGroup">
            <label>CPF</label>
            <input
              type="text"
              name="cpf"
              placeholder="000.000.000-00"
              value={formulario.cpf}
              onChange={alterarCampo}
            />
          </div>

          <div className="formGroup">
            <label>Data de nascimento</label>
            <input
              type="date"
              name="nascimento"
              value={formulario.nascimento}
              onChange={alterarCampo}
            />
          </div>

          <div className="formGroup">
            <label>E-mail</label>
            <input
              type="email"
              name="email"
              placeholder="email@exemplo.com"
              value={formulario.email}
              onChange={alterarCampo}
            />
          </div>

          <div className="formGroup">
            <label>Telefone</label>
            <input
              type="text"
              name="telefone"
              placeholder="(89) 99999-9999"
              value={formulario.telefone}
              onChange={alterarCampo}
            />
          </div>

          <div className="formGroup">
            <label>Número de emergência</label>
            <input
              type="text"
              name="emergencia"
              placeholder="(89) 98888-8888"
              value={formulario.emergencia}
              onChange={alterarCampo}
            />
          </div>
        </div>

        <div className="sectionTitle">
          <CalendarDays size={20} />
          <span>Plano e vencimento</span>
        </div>

        <div className="cadastroGrid">
          <div className="formGroup">
            <label>Valor da mensalidade (fica na academia)</label>
            <input
              type="text"
              name="valorPlano"
              placeholder={`Padrão: ${configuracoes.valorMensalidadePadrao || "80,00"}`}
              inputMode="decimal"
              value={formulario.valorPlano}
              onChange={alterarCampo}
            />
            <small className="formHelp">
              Valor padrão vindo das configurações: R$ {configuracoes.valorMensalidadePadrao || "80,00"}
            </small>
          </div>

          <div className="formGroup">
            <label>Vencimento</label>
            <input
              type="date"
              name="vencimento"
              value={formulario.vencimento}
              onChange={alterarCampo}
            />
          </div>
        </div>

        <div className="sectionTitle">
          <Camera size={20} />
          <span>Foto do aluno</span>
        </div>

        <div className="cameraBox">
          {!formulario.foto && !cameraLigada && (
            <div className="cameraEmpty">
              <Camera size={54} />
              <p>Nenhuma foto capturada</p>

              <button type="button" onClick={iniciarCamera}>
                <Camera size={18} />
                Abrir câmera
              </button>
            </div>
          )}

          {cameraLigada && (
            <div className="cameraPreview">
              <video ref={videoRef} autoPlay playsInline />

              <div className="cameraActions">
                <button type="button" onClick={tirarFoto}>
                  <Camera size={18} />
                  Tirar foto
                </button>

                <button
                  type="button"
                  className="secondaryButton"
                  onClick={pararCamera}
                >
                  <CameraOff size={18} />
                  Fechar câmera
                </button>
              </div>
            </div>
          )}

          {formulario.foto && !cameraLigada && (
            <div className="fotoCapturada">
              <img src={formulario.foto} alt="Foto capturada do aluno" />

              <div className="cameraActions">
                <button type="button" onClick={iniciarCamera}>
                  <Camera size={18} />
                  Tirar outra foto
                </button>

                <button
                  type="button"
                  className="secondaryButton"
                  onClick={removerFoto}
                >
                  Remover foto
                </button>
              </div>
            </div>
          )}

          <canvas ref={canvasRef} style={{ display: "none" }} />
        </div>

        <div className="sectionTitle">
          <Fingerprint size={20} />
          <span>Cadastro da digital</span>
        </div>

        <div className="digitalBox">
          <div className="digitalTop">
            <div className="digitalReader">
              <Fingerprint size={92} />

              {capturandoDigital && <div className="digitalScanLine"></div>}

              {formulario.digital && (
                <div className="digitalCheck">
                  <CheckCircle size={26} />
                </div>
              )}
            </div>

            <div className="digitalInfo">
              <strong>
                {formulario.digital
                  ? "Digital cadastrada"
                  : "Leitura biométrica"}
              </strong>

              <p>{mensagemDigital}</p>

              <div className="digitalProgressText">
                {leiturasDigital.length}/{totalLeiturasDigitais} leituras
                concluídas
              </div>

              <div className="digitalProgress">
                <div style={{ width: `${progressoDigital}%` }}></div>
              </div>
            </div>
          </div>

          <div className="digitalSteps">
            {[1, 2, 3, 4].map((numero) => {
              const leitura = leiturasDigital.find(
                (item) => item.numero === numero
              );

              return (
                <div
                  key={numero}
                  className={`digitalStep ${leitura ? "done" : ""}`}
                >
                  <span>{numero}</span>

                  <div>
                    <strong>Leitura {numero}</strong>
                    <p>
                      {leitura
                        ? `Qualidade ${leitura.qualidade}%`
                        : "Aguardando dedo"}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="digitalActions">
            {leiturasDigital.length === 0 && !formulario.digital && (
              <button type="button" onClick={iniciarCadastroDigital}>
                <Fingerprint size={18} />
                Iniciar cadastro
              </button>
            )}

            {!formulario.digital &&
              leiturasDigital.length < totalLeiturasDigitais && (
                <button
                  type="button"
                  onClick={capturarDigital}
                  disabled={capturandoDigital}
                >
                  <Fingerprint size={18} />
                  {capturandoDigital
                    ? "Lendo..."
                    : `Capturar leitura ${leiturasDigital.length + 1}`}
                </button>
              )}

            {formulario.digital && (
              <button
                type="button"
                className="secondaryButton"
                onClick={removerDigital}
              >
                Remover digital
              </button>
            )}
          </div>
        </div>

        <div className="sectionTitle">
          <CalendarDays size={20} />
          <span>Endereço</span>
        </div>

        <div className="cadastroGrid">
          <div className="formGroup">
            <label>Cidade</label>
            <input
              type="text"
              name="cidade"
              placeholder="São Raimundo Nonato"
              value={formulario.cidade}
              onChange={alterarCampo}
            />
          </div>

          <div className="formGroup">
            <label>Bairro</label>
            <input
              type="text"
              name="bairro"
              placeholder="Centro"
              value={formulario.bairro}
              onChange={alterarCampo}
            />
          </div>

          <div className="formGroup">
            <label>Rua</label>
            <input
              type="text"
              name="rua"
              placeholder="Rua Exemplo"
              value={formulario.rua}
              onChange={alterarCampo}
            />
          </div>

          <div className="formGroup">
            <label>Número</label>
            <input
              type="text"
              name="numero"
              placeholder="123"
              value={formulario.numero}
              onChange={alterarCampo}
            />
          </div>
        </div>

        <div className="cadastroActions">
          <button
            type="button"
            className="secondaryButton"
            onClick={voltarParaAcesso}
          >
            Cancelar
          </button>

          <button type="submit">
            <Save size={18} />
            Salvar cadastro
          </button>
        </div>
      </form>
    </div>
  );
}

function MenuItem({ icon, text, active, onClick }) {
  return (
    <div className={`menuItem ${active ? "active" : ""}`} onClick={onClick}>
      {icon}
      <span>{text}</span>
    </div>
  );
}

function Card({ icon, number, label }) {
  return (
    <div className="card">
      <div className="cardIcon">{icon}</div>
      <h3>{number}</h3>
      <p>{label}</p>
    </div>
  );
} 