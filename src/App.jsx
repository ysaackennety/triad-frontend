import { useCallback, useEffect, useMemo, useRef, useState } from "react";
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
  configuracoesPadrao,
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
  pegarPermissaoPorTipo,
  verificarHorarioPermitido,
  carregarHistoricoAcessosSalvo,
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
import {
  aguardarBiometria,
  buscarAlunoPorId,
  capturarBiometria,
  criarAluno,
  extrairAluno,
  extrairAlunoId,
  extrairStatusBiometria,
  liberarCatraca,
  registrarAcesso,
  testarEquipamentos,
} from "./services/api";
import {
  montarPayloadAcesso,
  montarPayloadAluno,
  normalizarAlunoBackend,
} from "./services/contratos";
import TelaAluno from "./pages/TelaAluno";

export default function App() {
  const ehTelaAluno = new URLSearchParams(window.location.search).get("tela") === "aluno";
  const [paginaAtual, setPaginaAtual] = useState("acesso");
  const [membros, setMembros] = useState(carregarMembrosSalvos);
  const [membroSelecionado, setMembroSelecionado] = useState(null);
  const [mensagemLeitor, setMensagemLeitor] = useState(
    "Aguardando o aluno colocar o dedo no leitor"
  );
  const [statusLeitura, setStatusLeitura] = useState("aguardando");
  const [ultimoAcesso, setUltimoAcesso] = useState(null);
  const [historicoAcessos, setHistoricoAcessos] = useState(
    carregarHistoricoAcessosSalvo
  );
  const [acessosHoje, setAcessosHoje] = useState(() => {
    const hoje = pegarDataHoje();
    return carregarHistoricoAcessosSalvo().filter(
      (acesso) => acesso.liberado && String(acesso.dataHora || "").startsWith(hoje)
    ).length;
  });
  const [statusBackend, setStatusBackend] = useState("conectando");
  const [monitorBiometriaAtivo, setMonitorBiometriaAtivo] = useState(true);
  const resetAcessoTimerRef = useRef(null);
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

  useEffect(() => {
    localStorage.setItem(
      "triad_historico_acessos",
      JSON.stringify(historicoAcessos.slice(0, 500))
    );
  }, [historicoAcessos]);

  useEffect(() => {
    return () => {
      if (resetAcessoTimerRef.current) {
        clearTimeout(resetAcessoTimerRef.current);
      }
    };
  }, []);

  const membrosFiltrados = useMemo(() => {
    const termo = String(busca || "").trim().toLowerCase();

    if (!termo) return membros;

    return membros.filter((membro) =>
      [membro.nome, membro.cpf, membro.telefone, membro.email]
        .filter(Boolean)
        .some((valor) => String(valor).toLowerCase().includes(termo))
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

  const publicarResultadoTelaAluno = useCallback((resultado) => {
    if (resultado) {
      localStorage.setItem("triad_ultimo_acesso_tela", JSON.stringify(resultado));
    } else {
      localStorage.removeItem("triad_ultimo_acesso_tela");
    }

    if ("BroadcastChannel" in window) {
      const canal = new BroadcastChannel("triad-acesso-aluno");
      canal.postMessage(resultado);
      canal.close();
    }
  }, []);

  const voltarParaEsperaBiometria = useCallback(() => {
    setStatusLeitura("aguardando");
    setUltimoAcesso(null);
    setMembroSelecionado(null);
    setMensagemLeitor("Aguardando o aluno colocar o dedo no leitor");
    publicarResultadoTelaAluno(null);
  }, [publicarResultadoTelaAluno]);

  const agendarVoltaParaEspera = useCallback(() => {
    if (resetAcessoTimerRef.current) {
      clearTimeout(resetAcessoTimerRef.current);
    }

    resetAcessoTimerRef.current = setTimeout(
      voltarParaEsperaBiometria,
      Number(configuracoes.tempoExibicaoResultado || 6000)
    );
  }, [configuracoes.tempoExibicaoResultado, voltarParaEsperaBiometria]);

  const salvarResultadoAcesso = useCallback(
    (resultado) => {
      setUltimoAcesso(resultado);
      setHistoricoAcessos((historicoAtual) => [
        resultado,
        ...historicoAtual,
      ].slice(0, 500));
      publicarResultadoTelaAluno(resultado);
      agendarVoltaParaEspera();
    },
    [agendarVoltaParaEspera, publicarResultadoTelaAluno]
  );

  const processarAlunoIdentificado = useCallback(
    async (alunoRecebido, eventoBiometria = {}) => {
      const aluno = normalizarAlunoBackend(alunoRecebido);

      setStatusLeitura("lendo");
      setUltimoAcesso(null);
      setMembroSelecionado(aluno);
      setMensagemLeitor(configuracoes.mensagemLeitura);

      await new Promise((resolve) =>
        setTimeout(resolve, Math.min(Number(configuracoes.tempoLeituraBiometria || 900), 1200))
      );

      const mensalidadeAtiva = verificarAtivoComTolerancia(
        aluno.vencimento,
        configuracoes.diasTolerancia
      );
      const dentroDoHorario = verificarHorarioPermitido(
        configuracoes.horarioAbertura,
        configuracoes.horarioFechamento
      );
      const cadastroAtivo = aluno.ativo !== false && aluno.ativo !== "nao";

      let liberado = true;
      let motivo = "Acesso liberado";

      if (!cadastroAtivo) {
        liberado = false;
        motivo = "Cadastro bloqueado";
      } else if (configuracoes.bloquearVencidos === "sim" && !mensalidadeAtiva) {
        liberado = false;
        motivo = "Mensalidade vencida";
      } else if (!dentroDoHorario) {
        liberado = false;
        motivo = `Fora do horário permitido (${configuracoes.horarioAbertura} às ${configuracoes.horarioFechamento})`;
      }

      const payloadAcesso = montarPayloadAcesso({
        eventoBiometria,
        aluno,
        liberado,
        motivo,
        configuracoes,
      });

      if (
        liberado &&
        configuracoes.modoLeitorBiometrico !== "simulacao" &&
        eventoBiometria.origem !== "simulacao"
      ) {
        try {
          await liberarCatraca({
            alunoId: aluno.id,
            eventoId: payloadAcesso.eventoId,
            porta: configuracoes.portaCatraca,
            velocidade: Number(configuracoes.velocidadeCatraca || 9600),
            comando: configuracoes.comandoLiberacao,
          });
        } catch (erro) {
          liberado = false;
          motivo = "Aluno autorizado, mas a catraca não respondeu";
          payloadAcesso.liberado = false;
          payloadAcesso.motivo = motivo;
          console.error("Falha ao liberar catraca:", erro);
        }
      }

      const mensagem = liberado
        ? `${textoComAluno(configuracoes.mensagemBoasVindas, aluno.nome)} ${configuracoes.mensagemBomTreino}`
        : `${motivo}. ${configuracoes.mensagemAcessoNegado}`;

      const resultado = {
        ...aluno,
        ...payloadAcesso,
        liberado,
        motivo,
        mensagem,
        dataHora: new Date().toISOString(),
      };

      setStatusLeitura(liberado ? "sucesso" : "erro");
      setMensagemLeitor(mensagem);
      salvarResultadoAcesso(resultado);

      if (liberado) {
        setAcessosHoje((valorAtual) => valorAtual + 1);
      }

      if (
        configuracoes.modoLeitorBiometrico !== "simulacao" &&
        eventoBiometria.origem !== "simulacao"
      ) {
        registrarAcesso(payloadAcesso).catch((erro) => {
          console.error("Não foi possível registrar o acesso no backend:", erro);
        });
      }
    },
    [configuracoes, salvarResultadoAcesso]
  );

  const mostrarDigitalNaoReconhecida = useCallback(
    (eventoBiometria = {}) => {
      const resultado = {
        id: null,
        alunoId: null,
        nome: "Digital não reconhecida",
        foto: "",
        valorPlano: "0,00",
        vencimento: "",
        liberado: false,
        motivo: "Biometria não encontrada no banco de dados",
        mensagem: "Digital não reconhecida. Procure a recepção.",
        eventoId: eventoBiometria.eventoId || eventoBiometria.id || `front-${Date.now()}`,
        qualidade: eventoBiometria.qualidade || null,
        dataHora: new Date().toISOString(),
      };

      setMembroSelecionado(null);
      setStatusLeitura("erro");
      setMensagemLeitor(resultado.mensagem);
      salvarResultadoAcesso(resultado);

      if (configuracoes.modoLeitorBiometrico !== "simulacao") {
        registrarAcesso(resultado).catch(() => {});
      }
    },
    [configuracoes.modoLeitorBiometrico, salvarResultadoAcesso]
  );

  const processarEventoBiometria = useCallback(
    async (eventoBiometria) => {
      const status = extrairStatusBiometria(eventoBiometria);

      if (!eventoBiometria || status === "aguardando" || status === "timeout") {
        setStatusLeitura("aguardando");
        setMensagemLeitor("Aguardando o aluno colocar o dedo no leitor");
        return;
      }

      if (
        status.includes("nao_identificado") ||
        status.includes("não_identificado") ||
        status.includes("desconhecido")
      ) {
        mostrarDigitalNaoReconhecida(eventoBiometria);
        return;
      }

      setStatusLeitura("lendo");
      setMensagemLeitor(configuracoes.mensagemLeitura);

      let aluno = extrairAluno(eventoBiometria);
      const alunoId = extrairAlunoId(eventoBiometria);

      if (!aluno && alunoId) {
        try {
          const respostaAluno = await buscarAlunoPorId(alunoId);
          aluno = extrairAluno(respostaAluno) || respostaAluno;
        } catch (erro) {
          aluno = membros.find((membro) => String(membro.id) === String(alunoId));
          if (!aluno) console.error("Aluno identificado, mas não encontrado:", erro);
        }
      }

      if (!aluno) {
        mostrarDigitalNaoReconhecida(eventoBiometria);
        return;
      }

      await processarAlunoIdentificado(aluno, eventoBiometria);
    },
    [configuracoes.mensagemLeitura, membros, mostrarDigitalNaoReconhecida, processarAlunoIdentificado]
  );

  useEffect(() => {
    const modo = configuracoes.modoLeitorBiometrico;

    if (
      ehTelaAluno ||
      !usuarioLogado ||
      paginaAtual !== "acesso" ||
      !monitorBiometriaAtivo ||
      modo === "simulacao"
    ) {
      if (modo === "simulacao") setStatusBackend("simulacao");
      return undefined;
    }

    let ativo = true;
    const controller = new AbortController();

    async function monitorar() {
      setStatusBackend("conectando");
      setStatusLeitura("aguardando");
      setMensagemLeitor("Conectando ao leitor biométrico...");

      while (ativo) {
        try {
          const evento = await aguardarBiometria(controller.signal);
          if (!ativo) return;

          setStatusBackend("online");
          await processarEventoBiometria(evento);
        } catch (erro) {
          if (!ativo || erro?.name === "AbortError") return;

          setStatusBackend("offline");
          setStatusLeitura("offline");
          setMensagemLeitor(
            modo === "misto"
              ? "Backend desconectado. O modo de demonstração continua disponível."
              : "Leitor/backend desconectado. Verifique o serviço local."
          );
          await new Promise((resolve) => setTimeout(resolve, 3000));
        }
      }
    }

    monitorar();

    return () => {
      ativo = false;
      controller.abort();
    };
  }, [
    configuracoes.modoLeitorBiometrico,
    ehTelaAluno,
    monitorBiometriaAtivo,
    paginaAtual,
    processarEventoBiometria,
    usuarioLogado,
  ]);

  function abrirTelaAluno() {
    const url = new URL(window.location.href);
    url.searchParams.set("tela", "aluno");
    window.open(url.toString(), "triad-tela-aluno", "width=1100,height=720");
  }

  async function capturarDigitalIntegrada({ leituraNumero, totalLeituras, tipoPessoa = "aluno" }) {
    if (configuracoes.modoLeitorBiometrico === "simulacao") return null;

    try {
      const resposta = await capturarBiometria({
        tipoPessoa,
        pessoaId: null,
        leituraNumero,
        totalLeituras,
        leitor: configuracoes.leitorBiometrico,
      });
      setStatusBackend("online");
      return resposta;
    } catch (erro) {
      setStatusBackend("offline");

      if (configuracoes.modoLeitorBiometrico === "real") {
        throw erro;
      }

      return null;
    }
  }

  async function testarIntegracaoEquipamentos() {
    if (configuracoes.modoLeitorBiometrico === "simulacao") {
      alert(
        "O sistema está no modo Simulação. Altere para Misto ou Leitor real para testar o backend e a catraca."
      );
      return;
    }

    try {
      const resposta = await testarEquipamentos({
        leitor: configuracoes.leitorBiometrico,
        porta: configuracoes.portaCatraca,
        velocidade: Number(configuracoes.velocidadeCatraca || 9600),
        comando: configuracoes.comandoLiberacao,
      });
      setStatusBackend("online");
      alert(resposta?.mensagem || "Backend, leitor e catraca responderam ao teste.");
    } catch (erro) {
      setStatusBackend("offline");
      alert(`Falha no teste dos equipamentos: ${erro.message}`);
    }
  }

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

  async function cadastrarMembro(evento) {
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

    const cpfNormalizado = String(formulario.cpf || "").replace(/\D/g, "");
    const cpfJaCadastrado = membros.some(
      (membro) =>
        String(membro.cpf || "").replace(/\D/g, "") === cpfNormalizado
    );

    if (cpfJaCadastrado) {
      alert("Já existe um aluno cadastrado com este CPF.");
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

    const novoMembroLocal = {
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
      digital:
        typeof formulario.digital === "string"
          ? formulario.digital
          : formulario.digital?.templateId || formulario.digital?.id,
      cidade: formulario.cidade,
      bairro: formulario.bairro,
      rua: formulario.rua,
      numero: formulario.numero,
      pagamentos: novoPagamentoCadastro ? [novoPagamentoCadastro] : [],
    };

    let novoMembro = novoMembroLocal;

    if (configuracoes.modoLeitorBiometrico !== "simulacao") {
      const payloadAluno = montarPayloadAluno({
        formulario: { ...formulario, valorPlano: valorPlanoFinal },
        pagamentoInicial: novoPagamentoCadastro
          ? {
              valorNumerico: valorMensalidade,
              valorRecebidoNumerico: valorRecebido,
              trocoNumerico: valorDevolvido,
              forma: novoPagamentoCadastro.forma,
              data: novoPagamentoCadastro.data,
              horario: novoPagamentoCadastro.horario,
            }
          : null,
      });

      try {
        const resposta = await criarAluno(payloadAluno);
        novoMembro = normalizarAlunoBackend(
          extrairAluno(resposta) || resposta,
          novoMembroLocal
        );
        setStatusBackend("online");
      } catch (erro) {
        setStatusBackend("offline");

        console.error("Erro ao salvar aluno no backend:", erro);
        console.error("Dados do erro:", erro?.data);

        alert(
          `Não foi possível salvar o aluno no servidor.\n\n` +
            `Erro: ${erro?.message || "Erro desconhecido"}\n` +
            `Status: ${erro?.status || "sem resposta"}\n\n` +
            `O cadastro NÃO foi salvo.`
        );

        return;
      }
    }

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

    const alunoParaSimular =
      membroSelecionado || membros.find((membro) => Boolean(membro.digital));

    if (!alunoParaSimular) {
      setStatusLeitura("erro");
      setMensagemLeitor(
        "Cadastre um aluno com digital para testar o modo de demonstração."
      );
      return;
    }

    processarAlunoIdentificado(alunoParaSimular, {
      eventoId: `SIM-${Date.now()}`,
      biometriaId: alunoParaSimular.digital,
      qualidade: 98,
      status: "identificado",
      origem: "simulacao",
    });
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

  if (ehTelaAluno) {
    return <TelaAluno configuracoes={configuracoes} />;
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
              capturarDigitalIntegrada={capturarDigitalIntegrada}
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
            <TelaRelatorios membros={membros} acessosHoje={acessosHoje} historicoAcessos={historicoAcessos} configuracoes={configuracoes} vendasBalcao={vendasBalcao} />
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
              testarIntegracaoEquipamentos={testarIntegracaoEquipamentos}
              statusBackend={statusBackend}
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
              statusBackend={statusBackend}
              monitorBiometriaAtivo={monitorBiometriaAtivo}
              setMonitorBiometriaAtivo={setMonitorBiometriaAtivo}
              abrirTelaAluno={abrirTelaAluno}
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
