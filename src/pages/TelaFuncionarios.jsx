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

export default function TelaFuncionarios({
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
              <label>Usuário de acesso</label>
              <input
                type="text"
                name="usuario"
                placeholder="Ex: joao.recepcao"
                value={funcionarioForm.usuario}
                onChange={alterarCampoFuncionario}
              />
            </div>

            <div className="formGroup">
              <label>Senha de acesso</label>
              <input
                type="password"
                name="senha"
                placeholder="Crie uma senha"
                value={funcionarioForm.senha}
                onChange={alterarCampoFuncionario}
              />
            </div>

            <div className="formGroup">
              <label>Permissão no sistema</label>
              <select
                name="permissao"
                value={funcionarioForm.permissao}
                onChange={alterarCampoFuncionario}
              >
                <option value="admin">Administrador</option>
                <option value="recepcao">Recepção</option>
                <option value="financeiro">Financeiro</option>
                <option value="professor">Professor</option>
                <option value="operador">Operador</option>
              </select>
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
                  <span>Usuário: {funcionario.usuario || "Sem usuário"} • Permissão: {formatarPermissao(funcionario.permissao)}</span>
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
