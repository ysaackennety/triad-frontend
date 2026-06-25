import { useEffect, useMemo, useState } from "react";
import Login from "./components/Login/Login";
import {
  carregarSessaoLogin,
  salvarSessaoLogin,
  limparSessaoLogin,
  prepararFuncionarioParaSessao,
} from "./utils/authLogin";
import {
  Fingerprint,
  UsersRound,
  Plus,
  BarChart3,
  PieChart,
  UserRoundCheck,
  Dumbbell,
  LogOut,
} from "lucide-react";
import "./App.css";

import {
  membrosMock,
  formularioInicial,
  pagamentoInicial,
  funcionarioInicial,
  produtoBalcaoInicial,
  vendaBalcaoInicial,
} from "./data/defaults";
import {
  carregarConfiguracoesSalvas,
  carregarMembrosSalvos,
  carregarFuncionariosSalvos,
  carregarProdutosBalcaoSalvos,
  carregarVendasBalcaoSalvas,
  verificarAtivoComTolerancia,
  montarVariaveisTema,
  converterValor,
  formatarDinheiro,
  formatarValorParaCampo,
  formatarFormaPagamento,
  calcularNovoVencimento,
  pegarDataHoje,
  textoComAluno,
  formatarData,
  formatarPermissao,
  calcularTotalVendaBalcao,
} from "./utils/helpers";

import MenuItem from "./components/MenuItem";
import TelaAcesso from "./pages/TelaAcesso";
import TelaAplicacoes from "./pages/TelaAplicacoes";
import TelaListaClientes from "./pages/TelaListaClientes";
import TelaFinanceiro from "./pages/TelaFinanceiro";
import ModalPagamento from "./pages/ModalPagamento";
import TelaRelatorios from "./pages/TelaRelatorios";
import TelaConfiguracoes from "./pages/TelaConfiguracoes";
import TelaVendasBalcao from "./pages/TelaVendasBalcao";
import TelaFuncionarios from "./pages/TelaFuncionarios";
import CadastroMembro from "./pages/CadastroMembro";

export default function App() {
  const [paginaAtual, setPaginaAtual] = useState("acesso");
  const [membros, setMembros] = useState(carregarMembrosSalvos);
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
  const [usuarioLogado, setUsuarioLogado] = useState(carregarSessaoLogin);
  const [produtosBalcao, setProdutosBalcao] = useState(carregarProdutosBalcaoSalvos);
  const [produtoBalcaoForm, setProdutoBalcaoForm] = useState(produtoBalcaoInicial);
  const [vendasBalcao, setVendasBalcao] = useState(carregarVendasBalcaoSalvas);
  const [vendaBalcaoForm, setVendaBalcaoForm] = useState(vendaBalcaoInicial);

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
    localStorage.setItem("triad_membros", JSON.stringify(membros));
  }, [membros]);

  useEffect(() => {
    localStorage.setItem("triad_funcionarios", JSON.stringify(funcionarios));
  }, [funcionarios]);

  useEffect(() => {
    localStorage.setItem("triad_produtos_balcao", JSON.stringify(produtosBalcao));
  }, [produtosBalcao]);

  useEffect(() => {
    localStorage.setItem("triad_vendas_balcao", JSON.stringify(vendasBalcao));
  }, [vendasBalcao]);

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
    const valorPadrao = configuracoes.valorMensalidadePadrao || "";

    setFormulario({
      ...formularioInicial,
      valorPlano: valorPadrao,
      receberPagamentoCadastro: "sim",
      formaPagamentoCadastro: configuracoes.formaPagamentoPadrao || "PIX",
      valorRecebidoCadastro: valorPadrao,
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
    const receberPagamentoAgora = formulario.receberPagamentoCadastro !== "nao";
    const controlarTroco = configuracoes.controlarTrocoDevolucao !== "nao";
    const valorMensalidade = converterValor(valorPlanoFinal);
    const valorRecebido = controlarTroco
      ? converterValor(formulario.valorRecebidoCadastro || valorPlanoFinal)
      : valorMensalidade;

    if (receberPagamentoAgora) {
      if (!formulario.formaPagamentoCadastro) {
        alert("Informe a forma de pagamento inicial do aluno.");
        return;
      }

      if (valorMensalidade <= 0) {
        alert("Informe um valor válido para a mensalidade.");
        return;
      }

      if (controlarTroco && valorRecebido < valorMensalidade) {
        alert(
          `Valor entregue pelo aluno é menor que a mensalidade. Falta ${formatarDinheiro(
            valorMensalidade - valorRecebido
          )} para completar.`
        );
        return;
      }
    }

    const valorDevolvido = receberPagamentoAgora && controlarTroco
      ? Math.max(valorRecebido - valorMensalidade, 0)
      : 0;

    const dataHoje = pegarDataHoje();
    const novoPagamentoCadastro = receberPagamentoAgora
      ? {
          id: Date.now(),
          data: dataHoje,
          horario: new Date().toLocaleTimeString("pt-BR", {
            hour: "2-digit",
            minute: "2-digit",
          }),
          origem: "CADASTRO",
          valor: formatarValorParaCampo(valorMensalidade),
          valorRecebido: formatarValorParaCampo(valorRecebido),
          troco: formatarValorParaCampo(valorDevolvido),
          valorDevolvido: formatarValorParaCampo(valorDevolvido),
          controleTroco: controlarTroco ? "sim" : "nao",
          forma: formulario.formaPagamentoCadastro || configuracoes.formaPagamentoPadrao || "PIX",
          vencimentoAnterior: "Cadastro inicial",
          novoVencimento: formulario.vencimento,
        }
      : null;

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
      pagamentos: novoPagamentoCadastro ? [novoPagamentoCadastro] : [],
    };

    setMembros((listaAtual) => [novoMembro, ...listaAtual]);
    setMembroSelecionado(novoMembro);
    setMensagemLeitor(
      receberPagamentoAgora
        ? "Membro cadastrado com pagamento inicial registrado"
        : "Membro cadastrado sem pagamento inicial"
    );
    setStatusLeitura("parado");
    setUltimoAcesso(null);

    const valorPadrao = configuracoes.valorMensalidadePadrao || "";

    setFormulario({
      ...formularioInicial,
      valorPlano: valorPadrao,
      receberPagamentoCadastro: "sim",
      formaPagamentoCadastro: configuracoes.formaPagamentoPadrao || "PIX",
      valorRecebidoCadastro: valorPadrao,
    });
    setPaginaAtual("acesso");

    if (receberPagamentoAgora) {
      alert(
        controlarTroco && valorDevolvido > 0
          ? `Aluno cadastrado e pagamento inicial registrado em ${formatarFormaPagamento(
              novoPagamentoCadastro.forma
            )}. Devolver ao aluno: ${formatarDinheiro(valorDevolvido)}.`
          : `Aluno cadastrado e pagamento inicial registrado em ${formatarFormaPagamento(
              novoPagamentoCadastro.forma
            )}.`
      );
    }
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
      !funcionarioForm.usuario ||
      !funcionarioForm.senha ||
      !funcionarioForm.permissao ||
      !funcionarioForm.cpf ||
      !funcionarioForm.nascimento ||
      !funcionarioForm.telefone ||
      !funcionarioForm.emergencia ||
      !funcionarioForm.bairro ||
      !funcionarioForm.tipoFuncionario ||
      !funcionarioForm.cargo
    ) {
      alert(
        "Preencha nome, usuário, senha, permissão, CPF, nascimento, telefone, emergência, bairro, tipo e cargo do funcionário."
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

    const usuarioJaExiste = funcionarios.some((funcionario) => {
      const usuarioAtual = String(funcionario.usuario || "").trim().toLowerCase();
      const emailAtual = String(funcionario.email || "").trim().toLowerCase();
      const usuarioNovo = String(funcionarioForm.usuario || "").trim().toLowerCase();
      const emailNovo = String(funcionarioForm.email || "").trim().toLowerCase();

      return usuarioAtual === usuarioNovo || (emailNovo && emailAtual === emailNovo);
    });

    if (usuarioJaExiste) {
      alert("Já existe funcionário com este usuário ou e-mail.");
      return;
    }

    const novoFuncionario = {
      id: Date.now(),
      ...funcionarioForm,
      usuario: String(funcionarioForm.usuario).trim().toLowerCase(),
      permissao: funcionarioForm.permissao || pegarPermissaoPorTipo(funcionarioForm.tipoFuncionario),
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


  function alterarCampoProdutoBalcao(evento) {
    const { name, value } = evento.target;

    setProdutoBalcaoForm((dadosAtuais) => ({
      ...dadosAtuais,
      [name]: value,
    }));
  }

  function cadastrarProdutoBalcao(evento) {
    evento.preventDefault();

    if (!produtoBalcaoForm.nome || !produtoBalcaoForm.quantidade || !produtoBalcaoForm.valorVenda) {
      alert("Preencha nome, quantidade em estoque e valor de venda do produto.");
      return;
    }

    if (Number(produtoBalcaoForm.quantidade) < 0) {
      alert("A quantidade não pode ser negativa.");
      return;
    }

    const novoProduto = {
      id: Date.now(),
      nome: produtoBalcaoForm.nome,
      categoria: produtoBalcaoForm.categoria,
      quantidade: Number(produtoBalcaoForm.quantidade || 0),
      valorCompra: produtoBalcaoForm.valorCompra || "0,00",
      valorVenda: produtoBalcaoForm.valorVenda,
      ativo: produtoBalcaoForm.ativo,
      criadoEm: pegarDataHoje(),
    };

    setProdutosBalcao((listaAtual) => [novoProduto, ...listaAtual]);
    setProdutoBalcaoForm(produtoBalcaoInicial);
    alert("Produto cadastrado no balcão com sucesso!");
  }

  function excluirProdutoBalcao(id) {
    const confirmar = confirm("Tem certeza que deseja excluir este produto?");

    if (!confirmar) return;

    setProdutosBalcao((listaAtual) => listaAtual.filter((produto) => produto.id !== id));

    if (String(vendaBalcaoForm.produtoId) === String(id)) {
      setVendaBalcaoForm(vendaBalcaoInicial);
    }
  }

  function alternarStatusProdutoBalcao(id) {
    setProdutosBalcao((listaAtual) =>
      listaAtual.map((produto) =>
        produto.id === id
          ? {
              ...produto,
              ativo: produto.ativo === "sim" ? "nao" : "sim",
            }
          : produto
      )
    );
  }

  function alterarCampoVendaBalcao(evento) {
    const { name, value } = evento.target;

    setVendaBalcaoForm((dadosAtuais) => ({
      ...dadosAtuais,
      [name]: value,
    }));
  }

  function registrarVendaBalcao(evento) {
    evento.preventDefault();

    const produto = produtosBalcao.find(
      (item) => String(item.id) === String(vendaBalcaoForm.produtoId)
    );

    if (!produto) {
      alert("Escolha um produto para vender.");
      return;
    }

    if (produto.ativo === "nao") {
      alert("Este produto está desativado para venda.");
      return;
    }

    const quantidadeVendida = Number(vendaBalcaoForm.quantidade || 0);

    if (quantidadeVendida <= 0) {
      alert("Informe uma quantidade válida para venda.");
      return;
    }

    if (configuracoes.controlarEstoqueBalcao !== "nao" && quantidadeVendida > Number(produto.quantidade || 0)) {
      alert(`Estoque insuficiente. Disponível: ${produto.quantidade} unidade(s).`);
      return;
    }

    const controlarTroco = configuracoes.controlarTrocoVendasBalcao !== "nao";
    const totalVenda = calcularTotalVendaBalcao(produto, quantidadeVendida);
    const valorRecebido = controlarTroco
      ? converterValor(vendaBalcaoForm.valorRecebido || formatarValorParaCampo(totalVenda))
      : totalVenda;

    if (controlarTroco && valorRecebido < totalVenda) {
      alert(`Valor entregue é menor que a venda. Falta ${formatarDinheiro(totalVenda - valorRecebido)}.`);
      return;
    }

    const valorDevolvido = controlarTroco ? Math.max(valorRecebido - totalVenda, 0) : 0;
    const dataHoje = pegarDataHoje();

    const novaVenda = {
      id: Date.now(),
      produtoId: produto.id,
      produtoNome: produto.nome,
      categoria: produto.categoria,
      quantidade: quantidadeVendida,
      valorUnitario: produto.valorVenda,
      total: formatarValorParaCampo(totalVenda),
      valorRecebido: formatarValorParaCampo(valorRecebido),
      valorDevolvido: formatarValorParaCampo(valorDevolvido),
      controleTroco: controlarTroco ? "sim" : "nao",
      forma: vendaBalcaoForm.forma,
      data: dataHoje,
      horario: new Date().toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setVendasBalcao((listaAtual) => [novaVenda, ...listaAtual]);
    setProdutosBalcao((listaAtual) =>
      listaAtual.map((item) =>
        item.id === produto.id
          ? {
              ...item,
              quantidade: Math.max(Number(item.quantidade || 0) - quantidadeVendida, 0),
            }
          : item
      )
    );

    setVendaBalcaoForm(vendaBalcaoInicial);

    alert(
      valorDevolvido > 0
        ? `Venda registrada! Devolver ao cliente: ${formatarDinheiro(valorDevolvido)}.`
        : "Venda registrada com sucesso!"
    );
  }

  function entrarSistema(funcionarioAutenticado) {
    const sessao = prepararFuncionarioParaSessao(funcionarioAutenticado);

    salvarSessaoLogin(sessao);
    setUsuarioLogado(sessao);
  }

  function sairSistema() {
    const confirmar = confirm("Deseja sair do sistema?");

    if (!confirmar) return;

    limparSessaoLogin();
    setUsuarioLogado(null);
    setPaginaAtual("acesso");
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

  if (!usuarioLogado) {
    return (
      <Login
        configuracoes={configuracoes}
        funcionarios={funcionarios}
        onLogin={entrarSistema}
      />
    );
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

        <div className="sessaoUsuarioBox">
          <div className="sessaoUsuarioAvatar">
            {usuarioLogado.foto ? (
              <img src={usuarioLogado.foto} alt={usuarioLogado.nome} />
            ) : (
              <UserRoundCheck size={20} />
            )}
          </div>

          <div className="sessaoUsuarioDados">
            <strong>{usuarioLogado.nome}</strong>
            <span>{formatarPermissao(usuarioLogado.permissao)}</span>
          </div>

          <button type="button" className="sessaoSairButton" onClick={sairSistema} title="Sair do sistema">
            <LogOut size={16} />
          </button>
        </div>

        <div className="divider mini"></div>

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
            active={paginaAtual === "vendasBalcao"}
            icon={<Dumbbell size={20} />}
            text={configuracoes.nomeAbaVendasBalcao}
            onClick={() => setPaginaAtual("vendasBalcao")}
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
            <TelaFinanceiro membros={membros} abrirPagamento={abrirPagamento} configuracoes={configuracoes} vendasBalcao={vendasBalcao} />
          ) : paginaAtual === "relatorios" ? (
            <TelaRelatorios membros={membros} acessosHoje={acessosHoje} configuracoes={configuracoes} vendasBalcao={vendasBalcao} />
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
          ) : paginaAtual === "vendasBalcao" ? (
            <TelaVendasBalcao
              produtosBalcao={produtosBalcao}
              produtoBalcaoForm={produtoBalcaoForm}
              vendaBalcaoForm={vendaBalcaoForm}
              vendasBalcao={vendasBalcao}
              alterarCampoProdutoBalcao={alterarCampoProdutoBalcao}
              cadastrarProdutoBalcao={cadastrarProdutoBalcao}
              excluirProdutoBalcao={excluirProdutoBalcao}
              alternarStatusProdutoBalcao={alternarStatusProdutoBalcao}
              alterarCampoVendaBalcao={alterarCampoVendaBalcao}
              registrarVendaBalcao={registrarVendaBalcao}
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
