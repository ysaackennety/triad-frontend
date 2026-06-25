import { useMemo, useRef, useState } from "react";
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
import Card from "../components/Card";

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
