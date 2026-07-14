export const membrosMock = [
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

export const formularioInicial = {
  nome: "",
  cpf: "",
  nascimento: "",
  email: "",
  telefone: "",
  emergencia: "",
  valorPlano: "",
  vencimento: "",
  receberPagamentoCadastro: "sim",
  formaPagamentoCadastro: "PIX",
  valorRecebidoCadastro: "",
  foto: "",
  digital: "",
  cidade: "",
  bairro: "",
  rua: "",
  numero: "",
};

export const pagamentoInicial = {
  valor: "",
  valorRecebido: "",
  forma: "PIX",
};

export const funcionarioInicial = {
  nome: "",
  usuario: "",
  senha: "",
  permissao: "recepcao",
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

export const produtoBalcaoInicial = {
  nome: "",
  categoria: "Bebidas",
  quantidade: "",
  valorCompra: "",
  valorVenda: "",
  ativo: "sim",
};

export const vendaBalcaoInicial = {
  produtoId: "",
  quantidade: "1",
  valorRecebido: "",
  forma: "DINHEIRO",
};

export const produtosBalcaoPadrao = [
  {
    id: 1,
    nome: "Água mineral",
    categoria: "Bebidas",
    quantidade: 24,
    valorCompra: "1,50",
    valorVenda: "3,00",
    ativo: "sim",
  },
  {
    id: 2,
    nome: "Creatina",
    categoria: "Suplementos",
    quantidade: 8,
    valorCompra: "45,00",
    valorVenda: "75,00",
    ativo: "sim",
  },
  {
    id: 3,
    nome: "Tônico energético",
    categoria: "Bebidas",
    quantidade: 12,
    valorCompra: "4,00",
    valorVenda: "8,00",
    ativo: "sim",
  },
];

export const funcionariosPadrao = [
  {
    id: 1,
    nome: "Administrador TRIAD",
    usuario: "admin",
    senha: "123456",
    permissao: "admin",
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


export const configuracoesPadrao = {
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
  nomeAbaVendasBalcao: "Vendas de Balcão",
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
  modoLeitorBiometrico: "misto",
  tempoLeituraBiometria: "1700",
  tempoExibicaoResultado: "6000",
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

  // VENDAS DE BALCÃO
  controlarEstoqueBalcao: "sim",
  controlarTrocoVendasBalcao: "sim",
  produtoPadraoBalcao: "Água mineral",
};
