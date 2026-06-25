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

export default function TelaFinanceiro({ membros, abrirPagamento, configuracoes = configuracoesPadrao, vendasBalcao = [] }) {
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
  const vendasBalcaoDoMes = pegarVendasBalcaoDoMes(vendasBalcao);

  const totalVendasBalcaoMes = vendasBalcaoDoMes.reduce((total, venda) => {
    return total + converterValor(venda.total);
  }, 0);

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
            <span>Mensalidades no mês</span>
          </div>
        </div>

        <div className="financeiroCard">
          <Dumbbell size={26} />
          <div>
            <strong>{formatarDinheiro(totalVendasBalcaoMes)}</strong>
            <span>Vendas de balcão no mês</span>
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

      <section className="financeiroPanel">
        <div className="financeiroPanelHeader">
          <div>
            <Dumbbell size={20} />
            <span>VENDAS DE BALCÃO DO MÊS</span>
          </div>
        </div>

        <div className="financeiroHistorico">
          {vendasBalcaoDoMes.map((venda) => {
            const totalVenda = converterValor(venda.total);
            const valorRecebido = converterValor(venda.valorRecebido || venda.total);
            const valorDevolvido = converterValor(venda.valorDevolvido || "0");
            const mostrarDevolucao = venda.controleTroco !== "nao" && valorDevolvido > 0;

            return (
              <div className="historicoPagamentoItem vendaHistoricoItem" key={venda.id}>
                <div className="produtoVendaIcone">
                  <Dumbbell size={24} />
                </div>

                <div>
                  <strong>{venda.produtoNome}</strong>
                  <span>
                    {venda.quantidade} unidade(s) • {formatarData(venda.data)} às {venda.horario || "--:--"} • {formatarFormaPagamento(venda.forma)}
                  </span>
                </div>

                <div className={`historicoValoresPagamento ${mostrarDevolucao ? "comTroco" : "semTroco"}`}>
                  <p>{formatarDinheiro(totalVenda)}</p>

                  {mostrarDevolucao && (
                    <>
                      <span>Cliente entregou: {formatarDinheiro(valorRecebido)}</span>
                      <span>Devolver para o cliente: {formatarDinheiro(valorDevolvido)}</span>
                    </>
                  )}
                </div>
              </div>
            );
          })}

          {vendasBalcaoDoMes.length === 0 && (
            <div className="clientesEmpty">
              <Dumbbell size={46} />
              <strong>Nenhuma venda de balcão neste mês</strong>
              <span>Quando vender água, creatina, tônico ou outros produtos, vai aparecer aqui.</span>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
