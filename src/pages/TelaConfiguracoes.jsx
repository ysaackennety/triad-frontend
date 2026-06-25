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

export default function TelaConfiguracoes({
  configuracoes,
  alterarConfiguracao,
  alterarLogoConfiguracao,
  removerLogoConfiguracao,
  salvarConfiguracoes,
  restaurarConfiguracoes,
}) {
  return (
    <div className="configuracoesPage">
      <header className="header">
        <div>
          <h2>{configuracoes.nomeAbaConfiguracoes}</h2>
          <p>
            Personalize nome, logo, cores, catraca, biometria, financeiro e
            regras sem mexer no código
          </p>
        </div>

        <div className="timeBox">
          <UserRoundCheck size={18} />
          <span>White Label</span>
        </div>
      </header>

      <section className="configHero whiteLabelHero">
        <div>
          <span>PAINEL WHITE LABEL</span>
          <h3>{configuracoes.nomeAcademia}</h3>
          <p>
            Configure o sistema para qualquer academia. Troque logo, nome,
            cores, abas, mensagens, catraca, digital, horários e financeiro
            direto por aqui.
          </p>
        </div>

        <div className="configHeroLogo">
          {configuracoes.logoAcademia ? (
            <img src={configuracoes.logoAcademia} alt="Logo da academia" />
          ) : (
            <Dumbbell size={52} />
          )}
        </div>
      </section>

      <form className="configuracoesGrid" onSubmit={salvarConfiguracoes}>
        <div className="configCard configFull">
          <div className="configCardHeader">
            <div className="configIcon">
              <Camera size={24} />
            </div>

            <div>
              <h3>Identidade visual do cliente</h3>
              <p>Logo, nome do sistema, slogan e marca da academia</p>
            </div>
          </div>

          <div className="logoConfigArea">
            <div className="logoPreviewConfig">
              {configuracoes.logoAcademia ? (
                <img src={configuracoes.logoAcademia} alt="Logo da academia" />
              ) : (
                <Dumbbell size={46} />
              )}
            </div>

            <div className="logoConfigInfo">
              <strong>{configuracoes.nomeSistema}</strong>
              <span>{configuracoes.subtituloSistema}</span>
              <p>{configuracoes.sloganAcademia}</p>

              <div className="logoConfigActions">
                <label className="uploadLogoButton">
                  Escolher logo
                  <input
                    type="file"
                    accept="image/*"
                    onChange={alterarLogoConfiguracao}
                  />
                </label>

                <button
                  type="button"
                  className="secondaryButton"
                  onClick={removerLogoConfiguracao}
                >
                  Remover logo
                </button>
              </div>
            </div>
          </div>

          <div className="configFormGrid three">
            <div className="formGroup">
              <label>Nome principal do sistema</label>
              <input
                type="text"
                name="nomeSistema"
                value={configuracoes.nomeSistema}
                onChange={alterarConfiguracao}
                placeholder="Ex: POWER FIT"
              />
            </div>

            <div className="formGroup">
              <label>Subtítulo da logo</label>
              <input
                type="text"
                name="subtituloSistema"
                value={configuracoes.subtituloSistema}
                onChange={alterarConfiguracao}
                placeholder="Ex: Academia"
              />
            </div>

            <div className="formGroup">
              <label>Nome da academia</label>
              <input
                type="text"
                name="nomeAcademia"
                value={configuracoes.nomeAcademia}
                onChange={alterarConfiguracao}
                placeholder="Ex: Academia do Cliente"
              />
            </div>

            <div className="formGroup full">
              <label>Slogan da academia</label>
              <input
                type="text"
                name="sloganAcademia"
                value={configuracoes.sloganAcademia}
                onChange={alterarConfiguracao}
                placeholder="Ex: Sua evolução começa aqui"
              />
            </div>

            <div className="formGroup">
              <label>Mostrar sua marca como dono</label>
              <select
                name="mostrarMarcaDono"
                value={configuracoes.mostrarMarcaDono}
                onChange={alterarConfiguracao}
              >
                <option value="sim">Sim, mostrar</option>
                <option value="nao">Não, esconder</option>
              </select>
            </div>

            <div className="formGroup">
              <label>Texto da sua marca</label>
              <input
                type="text"
                name="textoMarcaDono"
                value={configuracoes.textoMarcaDono}
                onChange={alterarConfiguracao}
              />
            </div>
          </div>
        </div>

        <div className="configCard configFull">
          <div className="configCardHeader">
            <div className="configIcon">
              <Star size={24} />
            </div>

            <div>
              <h3>Cores e estilo do sistema</h3>
              <p>Mude o visual inteiro para vender ou alugar para outra academia</p>
            </div>
          </div>

          <div className="configFormGrid three">
            <div className="formGroup">
              <label>Cor principal</label>
              <input
                type="color"
                name="corPrincipal"
                value={configuracoes.corPrincipal}
                onChange={alterarConfiguracao}
              />
            </div>

            <div className="formGroup">
              <label>Cor secundária</label>
              <input
                type="color"
                name="corSecundaria"
                value={configuracoes.corSecundaria}
                onChange={alterarConfiguracao}
              />
            </div>

            <div className="formGroup">
              <label>Cor do fundo</label>
              <input
                type="color"
                name="corFundo"
                value={configuracoes.corFundo}
                onChange={alterarConfiguracao}
              />
            </div>

            <div className="formGroup">
              <label>Cor dos cards</label>
              <input
                type="color"
                name="corPainel"
                value={configuracoes.corPainel}
                onChange={alterarConfiguracao}
              />
            </div>

            <div className="formGroup">
              <label>Cor do texto</label>
              <input
                type="color"
                name="corTexto"
                value={configuracoes.corTexto}
                onChange={alterarConfiguracao}
              />
            </div>

            <div className="formGroup">
              <label>Texto suave</label>
              <input
                type="color"
                name="corTextoSuave"
                value={configuracoes.corTextoSuave}
                onChange={alterarConfiguracao}
              />
            </div>

            <div className="formGroup">
              <label>Tema do sistema</label>
              <select
                name="temaSistema"
                value={configuracoes.temaSistema}
                onChange={alterarConfiguracao}
              >
                <option value="escuro">Escuro moderno</option>
                <option value="claro">Claro profissional</option>
                <option value="neon">Premium neon</option>
              </select>
            </div>

            <div className="formGroup">
              <label>Estilo visual</label>
              <select
                name="estiloSistema"
                value={configuracoes.estiloSistema}
                onChange={alterarConfiguracao}
              >
                <option value="premium">Premium arredondado</option>
                <option value="minimalista">Minimalista</option>
                <option value="corporativo">Corporativo</option>
              </select>
            </div>
          </div>

          <div className="temaPreview">
            <div>
              <span>Prévia</span>
              <strong>{configuracoes.nomeAcademia}</strong>
              <p>{configuracoes.sloganAcademia}</p>
            </div>

            <button type="button">Botão do sistema</button>
          </div>
        </div>

        <div className="configCard configFull">
          <div className="configCardHeader">
            <div className="configIcon">
              <List size={24} />
            </div>

            <div>
              <h3>Nomes das abas e módulos</h3>
              <p>Renomeie o sistema inteiro sem abrir o código</p>
            </div>
          </div>

          <div className="configFormGrid three">
            <div className="formGroup">
              <label>Aba Acesso</label>
              <input
                type="text"
                name="nomeAbaAcesso"
                value={configuracoes.nomeAbaAcesso}
                onChange={alterarConfiguracao}
              />
            </div>

            <div className="formGroup">
              <label>Aba Cadastro</label>
              <input
                type="text"
                name="nomeAbaCadastro"
                value={configuracoes.nomeAbaCadastro}
                onChange={alterarConfiguracao}
              />
            </div>

            <div className="formGroup">
              <label>Aba Aplicações</label>
              <input
                type="text"
                name="nomeAbaAplicacoes"
                value={configuracoes.nomeAbaAplicacoes}
                onChange={alterarConfiguracao}
              />
            </div>

            <div className="formGroup">
              <label>Aba Clientes</label>
              <input
                type="text"
                name="nomeAbaClientes"
                value={configuracoes.nomeAbaClientes}
                onChange={alterarConfiguracao}
              />
            </div>

            <div className="formGroup">
              <label>Aba Financeiro</label>
              <input
                type="text"
                name="nomeAbaFinanceiro"
                value={configuracoes.nomeAbaFinanceiro}
                onChange={alterarConfiguracao}
              />
            </div>

            <div className="formGroup">
              <label>Aba Relatórios</label>
              <input
                type="text"
                name="nomeAbaRelatorios"
                value={configuracoes.nomeAbaRelatorios}
                onChange={alterarConfiguracao}
              />
            </div>

            <div className="formGroup">
              <label>Aba Funcionários</label>
              <input
                type="text"
                name="nomeAbaFuncionarios"
                value={configuracoes.nomeAbaFuncionarios}
                onChange={alterarConfiguracao}
              />
            </div>

            <div className="formGroup">
              <label>Aba Vendas de Balcão</label>
              <input
                type="text"
                name="nomeAbaVendasBalcao"
                value={configuracoes.nomeAbaVendasBalcao}
                onChange={alterarConfiguracao}
              />
            </div>

            <div className="formGroup">
              <label>Aba Configurações</label>
              <input
                type="text"
                name="nomeAbaConfiguracoes"
                value={configuracoes.nomeAbaConfiguracoes}
                onChange={alterarConfiguracao}
              />
            </div>

            <div className="formGroup">
              <label>Nome App do Aluno</label>
              <input
                type="text"
                name="nomeModuloAppAluno"
                value={configuracoes.nomeModuloAppAluno}
                onChange={alterarConfiguracao}
              />
            </div>
          </div>
        </div>

        <div className="configCard">
          <div className="configCardHeader">
            <div className="configIcon">
              <Dumbbell size={24} />
            </div>

            <div>
              <h3>Dados da academia</h3>
              <p>Informações do cliente que comprou ou alugou o sistema</p>
            </div>
          </div>

          <div className="configFormGrid">
            <div className="formGroup">
              <label>Telefone</label>
              <input
                type="text"
                name="telefoneAcademia"
                value={configuracoes.telefoneAcademia}
                onChange={alterarConfiguracao}
              />
            </div>

            <div className="formGroup">
              <label>E-mail</label>
              <input
                type="email"
                name="emailAcademia"
                value={configuracoes.emailAcademia}
                onChange={alterarConfiguracao}
              />
            </div>

            <div className="formGroup">
              <label>CNPJ</label>
              <input
                type="text"
                name="cnpjAcademia"
                value={configuracoes.cnpjAcademia}
                onChange={alterarConfiguracao}
                placeholder="00.000.000/0001-00"
              />
            </div>

            <div className="formGroup">
              <label>Responsável</label>
              <input
                type="text"
                name="responsavelAcademia"
                value={configuracoes.responsavelAcademia}
                onChange={alterarConfiguracao}
              />
            </div>

            <div className="formGroup">
              <label>Cidade</label>
              <input
                type="text"
                name="cidadeAcademia"
                value={configuracoes.cidadeAcademia}
                onChange={alterarConfiguracao}
              />
            </div>

            <div className="formGroup">
              <label>Endereço</label>
              <input
                type="text"
                name="enderecoAcademia"
                value={configuracoes.enderecoAcademia}
                onChange={alterarConfiguracao}
              />
            </div>
          </div>
        </div>

        <div className="configCard">
          <div className="configCardHeader">
            <div className="configIcon">
              <Fingerprint size={24} />
            </div>

            <div>
              <h3>Catraca e biometria</h3>
              <p>Porta, velocidade, comando, leitor e modo de funcionamento</p>
            </div>
          </div>

          <div className="configFormGrid">
            <div className="formGroup">
              <label>Porta da catraca</label>
              <input
                type="text"
                name="portaCatraca"
                value={configuracoes.portaCatraca}
                onChange={alterarConfiguracao}
                placeholder="COM3"
              />
            </div>

            <div className="formGroup">
              <label>Velocidade</label>
              <select
                name="velocidadeCatraca"
                value={configuracoes.velocidadeCatraca}
                onChange={alterarConfiguracao}
              >
                <option value="9600">9600</option>
                <option value="19200">19200</option>
                <option value="38400">38400</option>
                <option value="57600">57600</option>
                <option value="115200">115200</option>
              </select>
            </div>

            <div className="formGroup">
              <label>Comando de liberação</label>
              <input
                type="text"
                name="comandoLiberacao"
                value={configuracoes.comandoLiberacao}
                onChange={alterarConfiguracao}
                placeholder="0x00"
              />
            </div>

            <div className="formGroup">
              <label>Leitor biométrico</label>
              <select
                name="leitorBiometrico"
                value={configuracoes.leitorBiometrico}
                onChange={alterarConfiguracao}
              >
                <option value="Futronic FS88">Futronic FS88</option>
                <option value="Futronic FS80">Futronic FS80</option>
                <option value="Leitor USB Genérico">Leitor USB Genérico</option>
                <option value="Simulação">Simulação</option>
              </select>
            </div>

            <div className="formGroup">
              <label>Modo do leitor</label>
              <select
                name="modoLeitorBiometrico"
                value={configuracoes.modoLeitorBiometrico}
                onChange={alterarConfiguracao}
              >
                <option value="simulacao">Simulação</option>
                <option value="real">Leitor real</option>
                <option value="misto">Misto</option>
              </select>
            </div>

            <div className="formGroup">
              <label>Tempo da leitura em ms</label>
              <input
                type="number"
                name="tempoLeituraBiometria"
                value={configuracoes.tempoLeituraBiometria}
                onChange={alterarConfiguracao}
                min="300"
              />
            </div>

            <div className="formGroup">
              <label>Liberar sem digital?</label>
              <select
                name="liberarSemDigital"
                value={configuracoes.liberarSemDigital}
                onChange={alterarConfiguracao}
              >
                <option value="nao">Não</option>
                <option value="sim">Sim</option>
              </select>
            </div>
          </div>

          <div className="configTesteBox">
            <div>
              <strong>Status do equipamento</strong>
              <span>
                Porta {configuracoes.portaCatraca}, velocidade{" "}
                {configuracoes.velocidadeCatraca}, leitor{" "}
                {configuracoes.leitorBiometrico}
              </span>
            </div>

            <button
              type="button"
              onClick={() =>
                alert(
                  `Teste enviado para ${configuracoes.portaCatraca} usando comando ${configuracoes.comandoLiberacao}`
                )
              }
            >
              Testar catraca
            </button>
          </div>
        </div>

        <div className="configCard configFull">
          <div className="configCardHeader">
            <div className="configIcon">
              <AlertTriangle size={24} />
            </div>

            <div>
              <h3>Regras de acesso e mensagens</h3>
              <p>Bloqueio, tolerância, horários e textos que aparecem no acesso</p>
            </div>
          </div>

          <div className="configFormGrid three">
            <div className="formGroup">
              <label>Bloquear aluno vencido</label>
              <select
                name="bloquearVencidos"
                value={configuracoes.bloquearVencidos}
                onChange={alterarConfiguracao}
              >
                <option value="sim">Sim, bloquear</option>
                <option value="nao">Não, permitir entrada</option>
              </select>
            </div>

            <div className="formGroup">
              <label>Dias de tolerância</label>
              <input
                type="number"
                name="diasTolerancia"
                value={configuracoes.diasTolerancia}
                onChange={alterarConfiguracao}
                min="0"
              />
            </div>

            <div className="formGroup">
              <label>Avisar antes do vencimento</label>
              <input
                type="number"
                name="avisoVencimento"
                value={configuracoes.avisoVencimento}
                onChange={alterarConfiguracao}
                min="0"
              />
            </div>

            <div className="formGroup">
              <label>Horário de abertura</label>
              <input
                type="time"
                name="horarioAbertura"
                value={configuracoes.horarioAbertura}
                onChange={alterarConfiguracao}
              />
            </div>

            <div className="formGroup">
              <label>Horário de fechamento</label>
              <input
                type="time"
                name="horarioFechamento"
                value={configuracoes.horarioFechamento}
                onChange={alterarConfiguracao}
              />
            </div>

            <div className="formGroup full">
              <label>Mensagem enquanto lê a biometria</label>
              <input
                type="text"
                name="mensagemLeitura"
                value={configuracoes.mensagemLeitura}
                onChange={alterarConfiguracao}
              />
            </div>

            <div className="formGroup">
              <label>Mensagem de boas-vindas</label>
              <input
                type="text"
                name="mensagemBoasVindas"
                value={configuracoes.mensagemBoasVindas}
                onChange={alterarConfiguracao}
                placeholder="Use {nome} para o nome do aluno"
              />
            </div>

            <div className="formGroup">
              <label>Mensagem de treino</label>
              <input
                type="text"
                name="mensagemBomTreino"
                value={configuracoes.mensagemBomTreino}
                onChange={alterarConfiguracao}
              />
            </div>

            <div className="formGroup">
              <label>Mensagem de acesso negado</label>
              <input
                type="text"
                name="mensagemAcessoNegado"
                value={configuracoes.mensagemAcessoNegado}
                onChange={alterarConfiguracao}
              />
            </div>
          </div>
        </div>

        <div className="configCard configFull">
          <div className="configCardHeader">
            <div className="configIcon">
              <PieChart size={24} />
            </div>

            <div>
              <h3>Financeiro e mensalidades</h3>
              <p>Renovação, pagamento padrão e regras financeiras</p>
            </div>
          </div>

          <div className="configFormGrid three">
            <div className="formGroup">
              <label>Valor da mensalidade (fica na academia) padrão</label>
              <input
                type="text"
                name="valorMensalidadePadrao"
                value={configuracoes.valorMensalidadePadrao}
                onChange={alterarConfiguracao}
                placeholder="Ex: 80,00"
                inputMode="decimal"
              />
            </div>

            <div className="formGroup">
              <label>Dias para renovar ao pagar</label>
              <input
                type="number"
                name="diasRenovacaoPagamento"
                value={configuracoes.diasRenovacaoPagamento}
                onChange={alterarConfiguracao}
                min="1"
              />
            </div>

            <div className="formGroup">
              <label>Pagamento padrão</label>
              <select
                name="formaPagamentoPadrao"
                value={configuracoes.formaPagamentoPadrao}
                onChange={alterarConfiguracao}
              >
                <option value="PIX">PIX</option>
                <option value="CARTAO">Cartão de crédito</option>
                <option value="DINHEIRO">Dinheiro</option>
              </select>
            </div>

            <div className="formGroup">
              <label>Permitir pagamento parcial?</label>
              <select
                name="permitirPagamentoParcial"
                value={configuracoes.permitirPagamentoParcial}
                onChange={alterarConfiguracao}
              >
                <option value="sim">Sim</option>
                <option value="nao">Não</option>
              </select>
            </div>

            <div className="formGroup">
              <label>Controlar devolução ao cliente?</label>
              <select
                name="controlarTrocoDevolucao"
                value={configuracoes.controlarTrocoDevolucao}
                onChange={alterarConfiguracao}
              >
                <option value="sim">Sim, calcular quanto devolver</option>
                <option value="nao">Não, mostrar só mensalidade</option>
              </select>
            </div>

            <div className="formGroup">
              <label>Controlar estoque do balcão?</label>
              <select
                name="controlarEstoqueBalcao"
                value={configuracoes.controlarEstoqueBalcao}
                onChange={alterarConfiguracao}
              >
                <option value="sim">Sim, baixar estoque a cada venda</option>
                <option value="nao">Não controlar estoque</option>
              </select>
            </div>

            <div className="formGroup">
              <label>Controlar devolução nas vendas?</label>
              <select
                name="controlarTrocoVendasBalcao"
                value={configuracoes.controlarTrocoVendasBalcao}
                onChange={alterarConfiguracao}
              >
                <option value="sim">Sim, mostrar valor entregue e devolução</option>
                <option value="nao">Não, mostrar só total da venda</option>
              </select>
            </div>

            <div className="formGroup">
              <label>Produto padrão do balcão</label>
              <input
                type="text"
                name="produtoPadraoBalcao"
                value={configuracoes.produtoPadraoBalcao}
                onChange={alterarConfiguracao}
                placeholder="Ex: Água mineral"
              />
            </div>
          </div>

          <div className="configResumo">
            <div>
              <strong>Resumo da catraca</strong>
              <p>
                Porta <b>{configuracoes.portaCatraca}</b>, comando{" "}
                <b>{configuracoes.comandoLiberacao}</b>, modo{" "}
                <b>{configuracoes.modoLeitorBiometrico}</b>.
              </p>
            </div>

            <div>
              <strong>Resumo do acesso</strong>
              <p>
                {configuracoes.bloquearVencidos === "sim"
                  ? `Alunos vencidos serão bloqueados com ${configuracoes.diasTolerancia} dia(s) de tolerância.`
                  : "Alunos vencidos poderão entrar mesmo com mensalidade vencida."}
              </p>
            </div>
          </div>
        </div>

        <div className="configActions">
          <button
            type="button"
            className="secondaryButton"
            onClick={restaurarConfiguracoes}
          >
            Restaurar padrão
          </button>

          <button type="submit">
            <Save size={18} />
            Salvar configurações
          </button>
        </div>
      </form>

      {configuracoes.mostrarMarcaDono === "sim" && (
        <div className="marcaDonoSistema">{configuracoes.textoMarcaDono}</div>
      )}
    </div>
  );
}
