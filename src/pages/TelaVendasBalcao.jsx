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

export default function TelaVendasBalcao({
  produtosBalcao,
  produtoBalcaoForm,
  vendaBalcaoForm,
  vendasBalcao,
  alterarCampoProdutoBalcao,
  cadastrarProdutoBalcao,
  excluirProdutoBalcao,
  alternarStatusProdutoBalcao,
  alterarCampoVendaBalcao,
  registrarVendaBalcao,
  configuracoes = configuracoesPadrao,
}) {
  const produtosAtivos = produtosBalcao.filter((produto) => produto.ativo !== "nao");
  const produtoSelecionado = produtosBalcao.find(
    (produto) => String(produto.id) === String(vendaBalcaoForm.produtoId)
  );
  const quantidadeVenda = Number(vendaBalcaoForm.quantidade || 0);
  const totalVenda = produtoSelecionado
    ? calcularTotalVendaBalcao(produtoSelecionado, quantidadeVenda)
    : 0;
  const controlarTroco = configuracoes.controlarTrocoVendasBalcao !== "nao";
  const valorRecebido = controlarTroco
    ? converterValor(vendaBalcaoForm.valorRecebido || formatarValorParaCampo(totalVenda))
    : totalVenda;
  const valorDevolvido = controlarTroco ? Math.max(valorRecebido - totalVenda, 0) : 0;
  const faltaReceber = controlarTroco ? Math.max(totalVenda - valorRecebido, 0) : 0;
  const vendasDoMes = pegarVendasBalcaoDoMes(vendasBalcao);
  const totalVendasMes = vendasDoMes.reduce((total, venda) => total + converterValor(venda.total), 0);
  const totalItensEstoque = produtosBalcao.reduce((total, produto) => total + Number(produto.quantidade || 0), 0);

  return (
    <div className="vendasBalcaoPage">
      <header className="header">
        <div>
          <h2>{configuracoes.nomeAbaVendasBalcao}</h2>
          <p>Cadastre produtos, controle estoque e registre vendas rápidas no balcão</p>
        </div>

        <div className="timeBox">
          <Dumbbell size={18} />
          <span>{produtosBalcao.length} produto(s)</span>
        </div>
      </header>

      <section className="financeiroCards vendasResumoCards">
        <div className="financeiroCard">
          <Dumbbell size={26} />
          <div>
            <strong>{produtosBalcao.length}</strong>
            <span>Produtos cadastrados</span>
          </div>
        </div>

        <div className="financeiroCard">
          <List size={26} />
          <div>
            <strong>{totalItensEstoque}</strong>
            <span>Unidades em estoque</span>
          </div>
        </div>

        <div className="financeiroCard">
          <CheckCircle2 size={26} />
          <div>
            <strong>{formatarDinheiro(totalVendasMes)}</strong>
            <span>Vendas no mês</span>
          </div>
        </div>

        <div className="financeiroCard">
          <Clock3 size={26} />
          <div>
            <strong>{vendasDoMes.length}</strong>
            <span>Vendas registradas</span>
          </div>
        </div>
      </section>

      <section className="vendasBalcaoGrid">
        <form className="vendasCard" onSubmit={cadastrarProdutoBalcao}>
          <div className="configCardHeader">
            <div className="configIcon">
              <Plus size={24} />
            </div>

            <div>
              <h3>Cadastrar produto</h3>
              <p>Água, creatina, tônico, suplemento, barrinha e outros produtos</p>
            </div>
          </div>

          <div className="configFormGrid">
            <div className="formGroup full">
              <label>Nome do produto</label>
              <input
                type="text"
                name="nome"
                value={produtoBalcaoForm.nome}
                onChange={alterarCampoProdutoBalcao}
                placeholder="Ex: Água mineral"
              />
            </div>

            <div className="formGroup">
              <label>Categoria</label>
              <select
                name="categoria"
                value={produtoBalcaoForm.categoria}
                onChange={alterarCampoProdutoBalcao}
              >
                <option value="Bebidas">Bebidas</option>
                <option value="Suplementos">Suplementos</option>
                <option value="Alimentos">Alimentos</option>
                <option value="Acessórios">Acessórios</option>
                <option value="Outros">Outros</option>
              </select>
            </div>

            <div className="formGroup">
              <label>Quantidade em estoque</label>
              <input
                type="number"
                name="quantidade"
                min="0"
                value={produtoBalcaoForm.quantidade}
                onChange={alterarCampoProdutoBalcao}
                placeholder="Ex: 24"
              />
            </div>

            <div className="formGroup">
              <label>Valor de compra</label>
              <input
                type="text"
                name="valorCompra"
                value={produtoBalcaoForm.valorCompra}
                onChange={alterarCampoProdutoBalcao}
                placeholder="Ex: 1,50"
                inputMode="decimal"
              />
            </div>

            <div className="formGroup">
              <label>Valor de venda</label>
              <input
                type="text"
                name="valorVenda"
                value={produtoBalcaoForm.valorVenda}
                onChange={alterarCampoProdutoBalcao}
                placeholder="Ex: 3,00"
                inputMode="decimal"
              />
            </div>

            <div className="formGroup full">
              <label>Status</label>
              <select
                name="ativo"
                value={produtoBalcaoForm.ativo}
                onChange={alterarCampoProdutoBalcao}
              >
                <option value="sim">Ativo para venda</option>
                <option value="nao">Desativado</option>
              </select>
            </div>
          </div>

          <div className="cadastroActions">
            <button type="submit">
              <Save size={18} />
              Salvar produto
            </button>
          </div>
        </form>

        <form className="vendasCard vendaRapidaCard" onSubmit={registrarVendaBalcao}>
          <div className="configCardHeader">
            <div className="configIcon">
              <CheckCircle2 size={24} />
            </div>

            <div>
              <h3>Registrar venda</h3>
              <p>Venda rápida de balcão com baixa de estoque e relatório financeiro</p>
            </div>
          </div>

          <div className="configFormGrid">
            <div className="formGroup full">
              <label>Produto</label>
              <select
                name="produtoId"
                value={vendaBalcaoForm.produtoId}
                onChange={alterarCampoVendaBalcao}
              >
                <option value="">Selecione um produto</option>
                {produtosAtivos.map((produto) => (
                  <option value={produto.id} key={produto.id}>
                    {produto.nome} • Estoque: {produto.quantidade} • R$ {produto.valorVenda}
                  </option>
                ))}
              </select>
            </div>

            <div className="formGroup">
              <label>Quantidade vendida</label>
              <input
                type="number"
                name="quantidade"
                min="1"
                value={vendaBalcaoForm.quantidade}
                onChange={alterarCampoVendaBalcao}
              />
            </div>

            {controlarTroco && (
              <div className="formGroup">
                <label>Valor entregue pelo cliente</label>
                <input
                  type="text"
                  name="valorRecebido"
                  value={vendaBalcaoForm.valorRecebido}
                  onChange={alterarCampoVendaBalcao}
                  placeholder={formatarValorParaCampo(totalVenda)}
                  inputMode="decimal"
                />
              </div>
            )}

            <div className="formGroup full">
              <label>Forma de pagamento</label>
              <select
                name="forma"
                value={vendaBalcaoForm.forma}
                onChange={alterarCampoVendaBalcao}
              >
                <option value="DINHEIRO">Dinheiro</option>
                <option value="PIX">PIX</option>
                <option value="CREDITO">Cartão de crédito</option>
                <option value="DEBITO">Cartão de débito</option>
              </select>
            </div>
          </div>

          <div className="vendaResumoBox">
            <div>
              <span>Total da venda</span>
              <strong>{formatarDinheiro(totalVenda)}</strong>
            </div>

            {controlarTroco && (
              <>
                <div>
                  <span>Cliente entregou</span>
                  <strong>{formatarDinheiro(valorRecebido)}</strong>
                </div>

                <div className={valorDevolvido > 0 ? "trocoPositivo" : faltaReceber > 0 ? "valorInsuficiente" : ""}>
                  <span>{valorDevolvido > 0 ? "Devolver ao cliente" : faltaReceber > 0 ? "Falta receber" : "Sem devolução"}</span>
                  <strong>{formatarDinheiro(valorDevolvido > 0 ? valorDevolvido : faltaReceber)}</strong>
                </div>
              </>
            )}
          </div>

          <div className="pagamentoAviso">
            <strong>Vai para o financeiro</strong>
            <p>Ao vender, o sistema baixa o estoque, salva no histórico do balcão e soma nos relatórios financeiros.</p>
          </div>

          <div className="cadastroActions">
            <button type="submit" disabled={!produtoSelecionado || totalVenda <= 0 || faltaReceber > 0}>
              <CheckCircle size={18} />
              Registrar venda
            </button>
          </div>
        </form>
      </section>

      <section className="vendasBalcaoGrid listasBalcaoGrid">
        <div className="vendasCard">
          <div className="panelHeader vendasPanelHeader">
            <div>
              <List size={20} />
              <span>PRODUTOS CADASTRADOS</span>
            </div>
          </div>

          <div className="produtosBalcaoLista">
            {produtosBalcao.map((produto) => {
              const estoqueBaixo = Number(produto.quantidade || 0) <= 3;

              return (
                <div className="produtoBalcaoItem" key={produto.id}>
                  <div className="produtoVendaIcone">
                    <Dumbbell size={22} />
                  </div>

                  <div className="produtoBalcaoInfo">
                    <strong>{produto.nome}</strong>
                    <span>{produto.categoria} • Venda R$ {produto.valorVenda} • Compra R$ {produto.valorCompra || "0,00"}</span>
                    <span className={estoqueBaixo ? "estoqueBaixo" : ""}>Estoque: {produto.quantidade} unidade(s)</span>
                  </div>

                  <div className={`status ${produto.ativo === "sim" ? "active" : "expired"}`}>
                    {produto.ativo === "sim" ? "Ativo" : "Inativo"}
                  </div>

                  <div className="produtoBalcaoActions">
                    <button type="button" className="secondaryButton" onClick={() => alternarStatusProdutoBalcao(produto.id)}>
                      {produto.ativo === "sim" ? "Desativar" : "Ativar"}
                    </button>

                    <button type="button" className="deleteButton" onClick={() => excluirProdutoBalcao(produto.id)}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              );
            })}

            {produtosBalcao.length === 0 && (
              <div className="clientesEmpty">
                <Dumbbell size={46} />
                <strong>Nenhum produto cadastrado</strong>
                <span>Cadastre água, creatina, tônico e outros produtos para vender no balcão.</span>
              </div>
            )}
          </div>
        </div>

        <div className="vendasCard">
          <div className="panelHeader vendasPanelHeader">
            <div>
              <Clock3 size={20} />
              <span>ÚLTIMAS VENDAS</span>
            </div>
          </div>

          <div className="produtosBalcaoLista">
            {vendasBalcao.slice(0, 8).map((venda) => {
              const valorDevolvido = converterValor(venda.valorDevolvido || "0");

              return (
                <div className="produtoBalcaoItem vendaBalcaoItem" key={venda.id}>
                  <div className="produtoVendaIcone vendaIcone">
                    <CheckCircle2 size={22} />
                  </div>

                  <div className="produtoBalcaoInfo">
                    <strong>{venda.produtoNome}</strong>
                    <span>{venda.quantidade} unidade(s) • {formatarData(venda.data)} às {venda.horario || "--:--"}</span>
                    <span>{formatarFormaPagamento(venda.forma)} • Total {formatarDinheiro(converterValor(venda.total))}</span>
                    {valorDevolvido > 0 && <span className="estoqueBaixo">Devolver ao cliente: {formatarDinheiro(valorDevolvido)}</span>}
                  </div>
                </div>
              );
            })}

            {vendasBalcao.length === 0 && (
              <div className="clientesEmpty">
                <Clock3 size={46} />
                <strong>Nenhuma venda registrada</strong>
                <span>As vendas feitas no balcão aparecerão aqui.</span>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
