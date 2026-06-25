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

export default function TelaRelatorios({ membros, acessosHoje, configuracoes = configuracoesPadrao, vendasBalcao = [] }) {
  const [tipoRelatorio, setTipoRelatorio] = useState("mes");
  const [dataRelatorio, setDataRelatorio] = useState(pegarDataHoje());
  const [dataInicio, setDataInicio] = useState(pegarDataHoje());
  const [dataFim, setDataFim] = useState(pegarDataHoje());
  const [mesRelatorio, setMesRelatorio] = useState(pegarDataHoje().slice(0, 7));
  const [anoRelatorio, setAnoRelatorio] = useState(String(new Date().getFullYear()));

  const totalAlunos = membros.length;

  const alunosAtivos = membros.filter((membro) =>
    verificarAtivoComTolerancia(membro.vencimento, configuracoes.diasTolerancia)
  ).length;

  const alunosInativos = totalAlunos - alunosAtivos;

  const todosPagamentos = useMemo(() => {
    return membros
      .flatMap((membro) =>
        (membro.pagamentos || []).map((pagamento) => {
          const valorMensalidade = converterValor(pagamento.valor);
          const valorRecebido = pagamento.valorRecebido
            ? converterValor(pagamento.valorRecebido)
            : valorMensalidade;
          const valorDevolvido = pagamento.valorDevolvido
            ? converterValor(pagamento.valorDevolvido)
            : pagamento.troco
            ? converterValor(pagamento.troco)
            : 0;
          const controleTrocoAtivo = pagamento.controleTroco !== "nao";
          const temTroco = controleTrocoAtivo && (valorRecebido > valorMensalidade || valorDevolvido > 0);

          return {
            ...pagamento,
            alunoId: membro.id,
            alunoNome: membro.nome,
            alunoFoto: membro.foto,
            alunoCpf: membro.cpf,
            valorMensalidade,
            valorRecebido,
            troco: valorDevolvido,
            valorDevolvido,
            controleTrocoAtivo,
            temTroco,
          };
        })
      )
      .sort((a, b) => {
        const dataA = new Date(`${a.data}T00:00:00`).getTime();
        const dataB = new Date(`${b.data}T00:00:00`).getTime();

        if (dataA !== dataB) return dataB - dataA;

        return Number(b.id || 0) - Number(a.id || 0);
      });
  }, [membros]);

  function pegarInicioSemana(dataBase) {
    const data = new Date(`${dataBase}T00:00:00`);
    const diaSemana = data.getDay();
    const diferenca = diaSemana === 0 ? -6 : 1 - diaSemana;

    data.setDate(data.getDate() + diferenca);

    return data.toISOString().split("T")[0];
  }

  function somarDias(dataBase, dias) {
    const data = new Date(`${dataBase}T00:00:00`);
    data.setDate(data.getDate() + dias);

    return data.toISOString().split("T")[0];
  }

  function pagamentoDentroDoPeriodo(pagamento) {
    if (!pagamento.data) return false;

    if (tipoRelatorio === "dia") {
      return pagamento.data === dataRelatorio;
    }

    if (tipoRelatorio === "semana") {
      const inicioSemana = pegarInicioSemana(dataRelatorio);
      const fimSemana = somarDias(inicioSemana, 6);

      return pagamento.data >= inicioSemana && pagamento.data <= fimSemana;
    }

    if (tipoRelatorio === "mes") {
      return pagamento.data.startsWith(mesRelatorio);
    }

    if (tipoRelatorio === "ano") {
      return pagamento.data.startsWith(anoRelatorio);
    }

    if (tipoRelatorio === "periodo") {
      return pagamento.data >= dataInicio && pagamento.data <= dataFim;
    }

    return true;
  }

  const pagamentosFiltrados = todosPagamentos.filter(pagamentoDentroDoPeriodo);
  const vendasBalcaoFiltradas = (vendasBalcao || []).filter(pagamentoDentroDoPeriodo);

  const totalVendasBalcao = vendasBalcaoFiltradas.reduce(
    (total, venda) => total + converterValor(venda.total),
    0
  );

  const vendasBalcaoAgrupadasPorDia = vendasBalcaoFiltradas.reduce((grupos, venda) => {
    if (!grupos[venda.data]) {
      grupos[venda.data] = [];
    }

    grupos[venda.data].push(venda);

    return grupos;
  }, {});

  const diasVendasBalcao = Object.keys(vendasBalcaoAgrupadasPorDia).sort(
    (a, b) => new Date(`${b}T00:00:00`) - new Date(`${a}T00:00:00`)
  );

  const totalRecebido = pagamentosFiltrados.reduce(
    (total, pagamento) => total + pagamento.valorMensalidade,
    0
  );

  const totalDinheiroRecebido = pagamentosFiltrados.reduce(
    (total, pagamento) => total + pagamento.valorRecebido,
    0
  );

  const totalTroco = pagamentosFiltrados.reduce(
    (total, pagamento) => total + pagamento.troco,
    0
  );

  const ticketMedio =
    pagamentosFiltrados.length === 0 ? 0 : totalRecebido / pagamentosFiltrados.length;

  const totalPorForma = pagamentosFiltrados.reduce(
    (totais, pagamento) => {
      if (pagamento.forma === "PIX") totais.pix += pagamento.valorMensalidade;
      if (pagamento.forma === "CARTAO") totais.cartao += pagamento.valorMensalidade;
      if (pagamento.forma === "DINHEIRO") totais.dinheiro += pagamento.valorMensalidade;

      return totais;
    },
    { pix: 0, cartao: 0, dinheiro: 0 }
  );

  const pagamentosAgrupadosPorDia = pagamentosFiltrados.reduce((grupos, pagamento) => {
    if (!grupos[pagamento.data]) {
      grupos[pagamento.data] = [];
    }

    grupos[pagamento.data].push(pagamento);

    return grupos;
  }, {});

  const diasRelatorio = Object.keys(pagamentosAgrupadosPorDia).sort(
    (a, b) => new Date(`${b}T00:00:00`) - new Date(`${a}T00:00:00`)
  );

  const alunosVencidos = membros.filter(
    (membro) => !verificarAtivoComTolerancia(membro.vencimento, configuracoes.diasTolerancia)
  );

  const periodoTexto =
    tipoRelatorio === "dia"
      ? `Dia ${formatarData(dataRelatorio)}`
      : tipoRelatorio === "semana"
      ? `Semana de ${formatarData(pegarInicioSemana(dataRelatorio))} até ${formatarData(
          somarDias(pegarInicioSemana(dataRelatorio), 6)
        )}`
      : tipoRelatorio === "mes"
      ? `Mês ${mesRelatorio.split("-").reverse().join("/")}`
      : tipoRelatorio === "ano"
      ? `Ano ${anoRelatorio}`
      : `Período de ${formatarData(dataInicio)} até ${formatarData(dataFim)}`;

  return (
    <div className="relatoriosPage">
      <header className="header">
        <div>
          <h2>{configuracoes.nomeAbaRelatorios}</h2>
          <p>Pagamentos separados por dia, semana, mês, ano e período escolhido</p>
        </div>

        <div className="timeBox">
          <BarChart3 size={18} />
          <span>{periodoTexto}</span>
        </div>
      </header>

      <section className="relatorioHero financeiroRelatorioHero">
        <div>
          <span>RELATÓRIO FINANCEIRO</span>
          <h3>Mensalidade, valor entregue e devolução ao cliente</h3>
          <p>
            Filtre por dia, semana, mês, ano ou escolha um período. O relatório
            separa cada pagamento por data com nome do aluno, valor da mensalidade,
            valor entregue pelo cliente, valor que precisa devolver e forma de pagamento.
          </p>
        </div>

        <div className="relatorioHeroIcon">
          <PieChart size={52} />
        </div>
      </section>

      <section className="relatorioFiltrosCard">
        <div className="relatorioFiltroTitulo">
          <div>
            <CalendarDays size={20} />
            <strong>Escolher período do relatório</strong>
          </div>

          <span>{pagamentosFiltrados.length} mensalidade(s) • {vendasBalcaoFiltradas.length} venda(s)</span>
        </div>

        <div className="filtrosRelatorioGrid">
          <div className="formGroup">
            <label>Tipo de relatório</label>
            <select
              value={tipoRelatorio}
              onChange={(evento) => setTipoRelatorio(evento.target.value)}
            >
              <option value="dia">Dia</option>
              <option value="semana">Semana</option>
              <option value="mes">Mês</option>
              <option value="ano">Ano</option>
              <option value="periodo">Escolher dias</option>
            </select>
          </div>

          {(tipoRelatorio === "dia" || tipoRelatorio === "semana") && (
            <div className="formGroup">
              <label>{tipoRelatorio === "dia" ? "Escolha o dia" : "Escolha um dia da semana"}</label>
              <input
                type="date"
                value={dataRelatorio}
                onChange={(evento) => setDataRelatorio(evento.target.value)}
              />
            </div>
          )}

          {tipoRelatorio === "mes" && (
            <div className="formGroup">
              <label>Escolha o mês</label>
              <input
                type="month"
                value={mesRelatorio}
                onChange={(evento) => setMesRelatorio(evento.target.value)}
              />
            </div>
          )}

          {tipoRelatorio === "ano" && (
            <div className="formGroup">
              <label>Escolha o ano</label>
              <input
                type="number"
                min="2020"
                max="2100"
                value={anoRelatorio}
                onChange={(evento) => setAnoRelatorio(evento.target.value)}
              />
            </div>
          )}

          {tipoRelatorio === "periodo" && (
            <>
              <div className="formGroup">
                <label>Data inicial</label>
                <input
                  type="date"
                  value={dataInicio}
                  onChange={(evento) => setDataInicio(evento.target.value)}
                />
              </div>

              <div className="formGroup">
                <label>Data final</label>
                <input
                  type="date"
                  value={dataFim}
                  onChange={(evento) => setDataFim(evento.target.value)}
                />
              </div>
            </>
          )}
        </div>
      </section>

      <section className="relatorioFinanceiroResumo">
        <div className="relatorioCard destaque">
          <CheckCircle2 size={27} />
          <div>
            <strong>{formatarDinheiro(totalRecebido)}</strong>
            <span>Total em mensalidades</span>
          </div>
        </div>

        <div className="relatorioCard">
          <PieChart size={27} />
          <div>
            <strong>{formatarDinheiro(totalDinheiroRecebido)}</strong>
            <span>Total pago pelos clientes</span>
          </div>
        </div>

        <div className="relatorioCard alerta">
          <AlertTriangle size={27} />
          <div>
            <strong>{formatarDinheiro(totalTroco)}</strong>
            <span>Total para devolver aos clientes</span>
          </div>
        </div>

        <div className="relatorioCard">
          <UsersRound size={27} />
          <div>
            <strong>{pagamentosFiltrados.length}</strong>
            <span>Pagamentos no período</span>
          </div>
        </div>

        <div className="relatorioCard destaque">
          <Dumbbell size={27} />
          <div>
            <strong>{formatarDinheiro(totalVendasBalcao)}</strong>
            <span>Vendas de balcão no período</span>
          </div>
        </div>
      </section>

      <section className="financeiroMetodoCards relatorioMetodoResumo">
        <div className="financeiroMetodoCard">
          <strong>{formatarDinheiro(totalPorForma.pix)}</strong>
          <span>PIX</span>
          <p>Recebido por PIX no filtro atual</p>
        </div>

        <div className="financeiroMetodoCard">
          <strong>{formatarDinheiro(totalPorForma.cartao)}</strong>
          <span>Cartão</span>
          <p>Recebido por cartão no filtro atual</p>
        </div>

        <div className="financeiroMetodoCard">
          <strong>{formatarDinheiro(totalPorForma.dinheiro)}</strong>
          <span>Dinheiro</span>
          <p>Ticket médio: {formatarDinheiro(ticketMedio)}</p>
        </div>
      </section>

      <section className="relatorioPagamentosPanel">
        <div className="relatorioPainelHeader">
          <div>
            <List size={20} />
            <span>PAGAMENTOS SEPARADOS POR DIA</span>
          </div>
        </div>

        {diasRelatorio.length === 0 ? (
          <div className="relatorioVazioGrande">
            <PieChart size={50} />
            <strong>Nenhum pagamento encontrado</strong>
            <span>Escolha outro dia, semana, mês, ano ou período.</span>
          </div>
        ) : (
          <div className="relatorioDiasLista">
            {diasRelatorio.map((dia) => {
              const pagamentosDoDia = pagamentosAgrupadosPorDia[dia];
              const totalDia = pagamentosDoDia.reduce(
                (total, pagamento) => total + pagamento.valorMensalidade,
                0
              );
              const recebidoDia = pagamentosDoDia.reduce(
                (total, pagamento) => total + pagamento.valorRecebido,
                0
              );
              const trocoDia = pagamentosDoDia.reduce(
                (total, pagamento) => total + pagamento.troco,
                0
              );

              return (
                <div className="relatorioPagamentoDia" key={dia}>
                  <div className="relatorioDiaHeader">
                    <div>
                      <strong>{formatarData(dia)}</strong>
                      <span>{pagamentosDoDia.length} pagamento(s)</span>
                    </div>

                    <div className="relatorioDiaTotais">
                      <span>Mensalidades: {formatarDinheiro(totalDia)}</span>
                      <span>Pago pelos clientes: {formatarDinheiro(recebidoDia)}</span>
                      <span>Para devolver: {formatarDinheiro(trocoDia)}</span>
                    </div>
                  </div>

                  <div className="relatorioTabelaPagamentos">
                    {pagamentosDoDia.map((pagamento) => (
                      <div className="relatorioLinhaPagamento" key={pagamento.id}>
                        <div className="pagamentoAlunoRelatorio">
                          <img src={pagamento.alunoFoto} alt={pagamento.alunoNome} />

                          <div>
                            <strong>{pagamento.alunoNome}</strong>
                            <span>
                              CPF: {pagamento.alunoCpf || "Não informado"} • Horário:{" "}
                              {pagamento.horario || "Não salvo"}
                            </span>
                          </div>
                        </div>

                        <div
                          className={`pagamentoValoresGrid ${
                            pagamento.temTroco ? "comTroco" : "semTroco"
                          }`}
                        >
                          <div className="pagamentoValorBox mensalidade">
                            <span>Mensalidade recebida</span>
                            <strong>{formatarDinheiro(pagamento.valorMensalidade)}</strong>
                          </div>

                          {pagamento.temTroco && (
                            <>
                              <div className="pagamentoValorBox">
                                <span>Cliente entregou</span>
                                <strong>{formatarDinheiro(pagamento.valorRecebido)}</strong>
                              </div>

                              <div className="pagamentoValorBox troco">
                                <span>Devolver para o cliente</span>
                                <strong>{formatarDinheiro(pagamento.valorDevolvido)}</strong>
                              </div>
                            </>
                          )}

                          <div className="pagamentoFormaTag">
                            {formatarFormaPagamento(pagamento.forma)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      <section className="relatorioPagamentosPanel vendasRelatorioPanel">
        <div className="relatorioPainelHeader">
          <div>
            <Dumbbell size={20} />
            <span>VENDAS DE BALCÃO NO RELATÓRIO</span>
          </div>
        </div>

        {diasVendasBalcao.length === 0 ? (
          <div className="relatorioVazioGrande">
            <Dumbbell size={50} />
            <strong>Nenhuma venda de balcão encontrada</strong>
            <span>Escolha outro período ou registre vendas no balcão.</span>
          </div>
        ) : (
          <div className="relatorioDiasLista">
            {diasVendasBalcao.map((dia) => {
              const vendasDoDia = vendasBalcaoAgrupadasPorDia[dia];
              const totalDia = vendasDoDia.reduce((total, venda) => total + converterValor(venda.total), 0);

              return (
                <div className="relatorioPagamentoDia" key={dia}>
                  <div className="relatorioDiaHeader">
                    <div>
                      <strong>{formatarData(dia)}</strong>
                      <span>{vendasDoDia.length} venda(s)</span>
                    </div>

                    <div className="relatorioDiaTotais">
                      <span>Total balcão: {formatarDinheiro(totalDia)}</span>
                    </div>
                  </div>

                  <div className="relatorioTabelaPagamentos">
                    {vendasDoDia.map((venda) => {
                      const totalVenda = converterValor(venda.total);
                      const valorRecebido = converterValor(venda.valorRecebido || venda.total);
                      const valorDevolvido = converterValor(venda.valorDevolvido || "0");
                      const mostrarDevolucao = venda.controleTroco !== "nao" && valorDevolvido > 0;

                      return (
                        <div className="relatorioLinhaPagamento" key={venda.id}>
                          <div className="pagamentoAlunoRelatorio">
                            <div className="produtoVendaIcone relatorioProdutoIcone">
                              <Dumbbell size={22} />
                            </div>

                            <div>
                              <strong>{venda.produtoNome}</strong>
                              <span>
                                {venda.quantidade} unidade(s) • Categoria: {venda.categoria} • Horário: {venda.horario || "Não salvo"}
                              </span>
                            </div>
                          </div>

                          <div className={`pagamentoValoresGrid ${mostrarDevolucao ? "comTroco" : "semTroco"}`}>
                            <div className="pagamentoValorBox mensalidade">
                              <span>Total da venda</span>
                              <strong>{formatarDinheiro(totalVenda)}</strong>
                            </div>

                            {mostrarDevolucao && (
                              <>
                                <div className="pagamentoValorBox">
                                  <span>Cliente entregou</span>
                                  <strong>{formatarDinheiro(valorRecebido)}</strong>
                                </div>

                                <div className="pagamentoValorBox troco">
                                  <span>Devolver para o cliente</span>
                                  <strong>{formatarDinheiro(valorDevolvido)}</strong>
                                </div>
                              </>
                            )}

                            <div className="pagamentoFormaTag">
                              {formatarFormaPagamento(venda.forma)}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      <section className="relatorioGrid">
        <div className="relatorioPainel">
          <div className="relatorioPainelHeader">
            <div>
              <UsersRound size={20} />
              <span>ALUNOS</span>
            </div>
          </div>

          <div className="relatorioMiniCards relatorioMiniCardsSeparado">
            <div>
              <strong>{totalAlunos}</strong>
              <span>Total de alunos</span>
            </div>

            <div>
              <strong>{alunosAtivos}</strong>
              <span>Ativos</span>
            </div>

            <div>
              <strong>{alunosInativos}</strong>
              <span>Vencidos ou inativos</span>
            </div>
          </div>
        </div>

        <div className="relatorioPainel">
          <div className="relatorioPainelHeader">
            <div>
              <AlertTriangle size={20} />
              <span>ALUNOS VENCIDOS</span>
            </div>
          </div>

          <div className="vencidosLista">
            {alunosVencidos.map((membro) => (
              <div className="vencidoItem" key={membro.id}>
                <img src={membro.foto} alt={membro.nome} />

                <div>
                  <strong>{membro.nome}</strong>
                  <p>Venceu em {formatarData(membro.vencimento)}</p>
                </div>

                <span>R$ {membro.valorPlano}</span>
              </div>
            ))}

            {alunosVencidos.length === 0 && (
              <div className="relatorioVazio">
                Nenhum aluno vencido. Tudo certo!
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
