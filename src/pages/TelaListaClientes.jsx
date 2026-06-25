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

export default function TelaListaClientes({
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
