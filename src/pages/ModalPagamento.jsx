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

export default function ModalPagamento({
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
              <option value="CREDITO">Cartão de crédito</option>
              <option value="DEBITO">Cartão de débito</option>
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
