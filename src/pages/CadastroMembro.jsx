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
  LogOut,
} from "lucide-react";
import {
  configuracoesPadrao,
  formularioInicial,
  funcionarioInicial,
  produtoBalcaoInicial,
  vendaBalcaoInicial,
} from "../data/defaults";
import {

  verificarAtivo,
  verificarAtivoComTolerancia,
  formatarData,
  calcularIdade,
  formatarAniversario,
  pegarDataHoje,
  textoComAluno,
  converterValor,
  formatarDinheiro,
  formatarValorParaCampo,
  formatarFormaPagamento,
  calcularNovoVencimento,
  pegarPagamentosDoMes,
  pegarVendasBalcaoDoMes,
  calcularTotalVendaBalcao,
  formatarPermissao,
} from "../utils/helpers";

export default function CadastroMembro({
  formulario,
  configuracoes = configuracoesPadrao,
  alterarCampo,
  alterarFoto,
  alterarDigital,
  capturarDigitalIntegrada,
  cadastrarMembro,
  voltarParaAcesso,
}) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  const [cameraLigada, setCameraLigada] = useState(false);

  const totalLeiturasDigitais = 4;
  const [capturandoDigital, setCapturandoDigital] = useState(false);
  const [cadastroDigitalIniciado, setCadastroDigitalIniciado] = useState(false);
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
    setCadastroDigitalIniciado(true);
    setLeiturasDigital([]);
    setMensagemDigital(
      "Cadastro iniciado. Coloque o dedo no leitor para fazer a primeira leitura."
    );
  }

  async function capturarDigital() {
    if (capturandoDigital) return;
    if (!cadastroDigitalIniciado) {
      iniciarCadastroDigital();
      return;
    }
    if (leiturasDigital.length >= totalLeiturasDigitais) return;

    const numeroDaLeitura = leiturasDigital.length + 1;
    setCapturandoDigital(true);
    setMensagemDigital(
      `Aguardando a leitura ${numeroDaLeitura}. Mantenha o dedo no leitor.`
    );

    try {
      const respostaBackend = await capturarDigitalIntegrada?.({
        leituraNumero: numeroDaLeitura,
        totalLeituras: totalLeiturasDigitais,
        tipoPessoa: "aluno",
      });

      const qualidade =
        respostaBackend?.qualidade ||
        respostaBackend?.data?.qualidade ||
        Math.floor(Math.random() * 16) + 84;
      const templateId =
        respostaBackend?.templateId ||
        respostaBackend?.biometriaId ||
        respostaBackend?.digitalId ||
        respostaBackend?.data?.templateId ||
        null;
      const status = String(
        respostaBackend?.status || respostaBackend?.data?.status || ""
      ).toLowerCase();
      const concluidoPeloBackend =
        Boolean(templateId) || status === "concluido" || status === "cadastrada";

      const novaLeitura = {
        id: Date.now(),
        numero: numeroDaLeitura,
        qualidade,
      };
      const novasLeituras = [...leiturasDigital, novaLeitura];

      if (concluidoPeloBackend || novasLeituras.length >= totalLeiturasDigitais) {
        const digitalFinal = {
          templateId: templateId || `DIGITAL-DEMO-${Date.now()}`,
          qualidade,
          leitor: respostaBackend?.leitor || configuracoes.leitorBiometrico,
        };

        alterarDigital(digitalFinal);
        setLeiturasDigital(
          concluidoPeloBackend && novasLeituras.length < totalLeiturasDigitais
            ? Array.from({ length: totalLeiturasDigitais }, (_, indice) => ({
                id: Date.now() + indice,
                numero: indice + 1,
                qualidade,
              }))
            : novasLeituras
        );
        setMensagemDigital(
          "Digital cadastrada com sucesso e pronta para ser enviada no JSON do aluno."
        );
      } else {
        setLeiturasDigital(novasLeituras);
        setMensagemDigital(
          `Leitura ${numeroDaLeitura} concluída. Retire o dedo e coloque novamente.`
        );
      }
    } catch (erro) {
      setMensagemDigital(
        `Não foi possível capturar a digital: ${erro.message}. Verifique o backend e o leitor.`
      );
    } finally {
      setCapturandoDigital(false);
    }
  }

  function removerDigital() {
    alterarDigital("");
    setCadastroDigitalIniciado(false);
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

  const receberPagamentoAgora = formulario.receberPagamentoCadastro !== "nao";
  const controlarTrocoCadastro = configuracoes.controlarTrocoDevolucao !== "nao";
  const valorMensalidadeCadastro = converterValor(
    formulario.valorPlano || configuracoes.valorMensalidadePadrao || "0"
  );
  const valorRecebidoCadastro = receberPagamentoAgora
    ? converterValor(formulario.valorRecebidoCadastro || formulario.valorPlano || configuracoes.valorMensalidadePadrao || "0")
    : 0;
  const valorDevolucaoCadastro = receberPagamentoAgora && controlarTrocoCadastro
    ? Math.max(valorRecebidoCadastro - valorMensalidadeCadastro, 0)
    : 0;
  const valorFaltanteCadastro = receberPagamentoAgora && controlarTrocoCadastro
    ? Math.max(valorMensalidadeCadastro - valorRecebidoCadastro, 0)
    : 0;

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
          <BarChart3 size={20} />
          <span>Pagamento inicial</span>
        </div>

        <div className="cadastroGrid">
          <div className="formGroup">
            <label>Receber pagamento agora?</label>
            <select
              name="receberPagamentoCadastro"
              value={formulario.receberPagamentoCadastro || "sim"}
              onChange={alterarCampo}
            >
              <option value="sim">Sim, receber agora</option>
              <option value="nao">Não, deixar pendente</option>
            </select>
            <small className="formHelp">
              Se receber agora, o pagamento já entra no Financeiro e nos Relatórios.
            </small>
          </div>

          <div className="formGroup">
            <label>Forma de pagamento</label>
            <select
              name="formaPagamentoCadastro"
              value={formulario.formaPagamentoCadastro || configuracoes.formaPagamentoPadrao || "PIX"}
              onChange={alterarCampo}
              disabled={!receberPagamentoAgora}
            >
              <option value="PIX">PIX</option>
              <option value="DINHEIRO">Dinheiro</option>
              <option value="CREDITO">Cartão de crédito</option>
              <option value="DEBITO">Cartão de débito</option>
            </select>
          </div>

          <div className="formGroup">
            <label>Valor recebido do aluno</label>
            <input
              type="text"
              name="valorRecebidoCadastro"
              placeholder="Ex: 100,00"
              inputMode="decimal"
              value={formulario.valorRecebidoCadastro || ""}
              onChange={alterarCampo}
              disabled={!receberPagamentoAgora || !controlarTrocoCadastro}
            />
            <small className="formHelp">
              Exemplo: mensalidade R$ 90,00 e aluno entregou R$ 100,00.
            </small>
          </div>

          <div className="formGroup">
            <label>Status do caixa</label>
            <div className={`cadastroPagamentoStatus ${!receberPagamentoAgora ? "pendente" : valorFaltanteCadastro > 0 ? "erro" : "ok"}`}>
              {!receberPagamentoAgora
                ? "Pagamento pendente"
                : valorFaltanteCadastro > 0
                ? `Falta ${formatarDinheiro(valorFaltanteCadastro)}`
                : valorDevolucaoCadastro > 0
                ? `Devolver ${formatarDinheiro(valorDevolucaoCadastro)}`
                : "Pagamento exato"}
            </div>
          </div>
        </div>

        {receberPagamentoAgora && (
          <div className={`pagamentoResumoTroco cadastroResumoPagamento ${!controlarTrocoCadastro ? "trocoDesativado" : ""}`}>
            <div>
              <span>Mensalidade</span>
              <strong>{formatarDinheiro(valorMensalidadeCadastro)}</strong>
            </div>

            <div>
              <span>Valor entregue</span>
              <strong>{formatarDinheiro(controlarTrocoCadastro ? valorRecebidoCadastro : valorMensalidadeCadastro)}</strong>
            </div>

            <div className={valorFaltanteCadastro > 0 ? "valorInsuficiente" : valorDevolucaoCadastro > 0 ? "trocoPositivo" : ""}>
              <span>{valorFaltanteCadastro > 0 ? "Falta" : "Devolver"}</span>
              <strong>
                {valorFaltanteCadastro > 0
                  ? formatarDinheiro(valorFaltanteCadastro)
                  : formatarDinheiro(valorDevolucaoCadastro)}
              </strong>
            </div>
          </div>
        )}

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
            {!cadastroDigitalIniciado && !formulario.digital && (
              <button type="button" onClick={iniciarCadastroDigital}>
                <Fingerprint size={18} />
                Iniciar cadastro
              </button>
            )}

            {cadastroDigitalIniciado &&
              !formulario.digital &&
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
