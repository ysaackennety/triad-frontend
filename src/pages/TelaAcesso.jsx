import {
  AlertTriangle,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Clock3,
  Fingerprint,
  List,
  MonitorUp,
  Pause,
  Play,
  Plus,
  Search,
  Trash2,
  UsersRound,
} from "lucide-react";
import { configuracoesPadrao } from "../data/defaults";
import {
  calcularIdade,
  formatarData,
  verificarAtivoComTolerancia,
} from "../utils/helpers";
import Card from "../components/Card";

const textosBackend = {
  online: "Leitor conectado",
  offline: "Backend desconectado",
  conectando: "Conectando ao leitor",
  simulacao: "Modo demonstração",
};

export default function TelaAcesso({
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
  statusBackend,
  monitorBiometriaAtivo,
  setMonitorBiometriaAtivo,
  abrirTelaAluno,
  excluirMembro,
}) {
  const permiteDemonstracao =
    configuracoes.modoLeitorBiometrico === "simulacao" ||
    configuracoes.modoLeitorBiometrico === "misto";

  return (
    <>
      <header className="header">
        <div>
          <h2>{configuracoes.nomeAbaAcesso}</h2>
          <p>
            {configuracoes.nomeAcademia} • {configuracoes.sloganAcademia}
          </p>
        </div>

        <div className="headerActions">
          <div className="timeBox">
            <Clock3 size={18} />
            <span>{hora}</span>
          </div>

          <button className="secondaryButton" onClick={abrirTelaAluno}>
            <MonitorUp size={19} />
            Tela do aluno
          </button>

          <button onClick={abrirCadastro}>
            <Plus size={19} />
            Adicionar membro
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
          <div className="panelHeader acessoPanelHeader">
            <div>
              <Fingerprint size={20} />
              <span>LEITOR BIOMÉTRICO</span>
            </div>

            <div className="equipamentoAcoes">
              <span className={`backendBadge ${statusBackend}`}>
                <i></i>
                {textosBackend[statusBackend] || "Verificando"}
              </span>

              {configuracoes.modoLeitorBiometrico !== "simulacao" && (
                <button
                  type="button"
                  className="monitorToggleButton"
                  onClick={() => setMonitorBiometriaAtivo((ativo) => !ativo)}
                  title={monitorBiometriaAtivo ? "Pausar leitor" : "Ativar leitor"}
                >
                  {monitorBiometriaAtivo ? <Pause size={16} /> : <Play size={16} />}
                </button>
              )}
            </div>
          </div>

          <div
            className={`fingerArea leitorPremium ${statusLeitura} ${
              permiteDemonstracao ? "clicavel" : ""
            }`}
            onClick={permiteDemonstracao ? simularLeitura : undefined}
            role={permiteDemonstracao ? "button" : undefined}
            tabIndex={permiteDemonstracao ? 0 : undefined}
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

            {(statusLeitura === "lendo" || statusLeitura === "aguardando") && (
              <div className="scannerLine"></div>
            )}

            <p>{mensagemLeitor}</p>

            {statusLeitura === "lendo" && (
              <span className="scannerText">Buscando aluno no banco...</span>
            )}

            {statusLeitura === "aguardando" && (
              <span className="scannerText">Pronto para receber uma digital</span>
            )}

            {permiteDemonstracao && (
              <small className="demoHint">
                Clique aqui para simular a digital do aluno selecionado.
              </small>
            )}
          </div>

          {ultimoAcesso ? (
            <div
              className={`acessoResultado ${
                ultimoAcesso.liberado ? "liberado" : "negado"
              }`}
            >
              <div className="acessoFotoBox">
                {ultimoAcesso.foto ? (
                  <img src={ultimoAcesso.foto} alt={ultimoAcesso.nome} />
                ) : (
                  <div className="acessoSemFoto">
                    <Fingerprint size={58} />
                  </div>
                )}

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
                <strong>{ultimoAcesso.nome}</strong>
                <p>{ultimoAcesso.mensagem || ultimoAcesso.motivo}</p>

                {ultimoAcesso.vencimento && (
                  <small>
                    Plano R$ {ultimoAcesso.valorPlano} • Vence{" "}
                    {formatarData(ultimoAcesso.vencimento)}
                  </small>
                )}
              </div>
            </div>
          ) : (
            membroSelecionado &&
            permiteDemonstracao && (
              <div className="selectedUser">
                <img src={membroSelecionado.foto} alt={membroSelecionado.nome} />
                <div>
                  <strong>{membroSelecionado.nome}</strong>
                  <span>
                    CPF: {membroSelecionado.cpf} • Nasc.:{" "}
                    {formatarData(membroSelecionado.nascimento)} • Idade:{" "}
                    {calcularIdade(membroSelecionado.nascimento)}
                  </span>
                  <span>Selecionado somente para testar a demonstração.</span>
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
              placeholder="Buscar por nome, CPF ou telefone..."
              value={busca}
              onChange={(evento) => setBusca(evento.target.value)}
            />
          </div>

          <div className="memberList">
            {membrosFiltrados.map((membro) => {
              const ativo = verificarAtivoComTolerancia(
                membro.vencimento,
                configuracoes.diasTolerancia
              );
              const selecionado = membroSelecionado?.id === membro.id;

              return (
                <div
                  key={membro.id}
                  onClick={() => {
                    setMembroSelecionado(membro);
                    setStatusLeitura("aguardando");
                    setUltimoAcesso(null);
                    setMensagemLeitor(
                      permiteDemonstracao
                        ? "Aluno selecionado para o teste. Clique no leitor."
                        : "O acesso real não precisa selecionar o aluno. Aguarde a digital."
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
                      CPF: {membro.cpf || "Não informado"} • Digital:{" "}
                      {membro.digital ? "OK" : "Pendente"}
                    </span>
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
