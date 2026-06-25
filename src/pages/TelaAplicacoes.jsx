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

export default function TelaAplicacoes({ setPaginaAtual, configuracoes = configuracoesPadrao }) {
  const aplicacoes = [
    {
      titulo: configuracoes.nomeAbaAcesso,
      descricao: "Gerencie entrada, catraca, biometria e acessos dos alunos.",
      status: "Ativo",
      icone: <Fingerprint size={28} />,
      acao: () => setPaginaAtual("acesso"),
    },
    {
      titulo: configuracoes.nomeAbaCadastro,
      descricao: "Cadastre alunos com foto, digital, plano e vencimento.",
      status: "Ativo",
      icone: <UsersRound size={28} />,
      acao: () => setPaginaAtual("cadastro"),
    },
    {
      titulo: configuracoes.nomeAbaClientes,
      descricao: "Veja todos os alunos cadastrados, ativos, vencidos e digitais.",
      status: "Ativo",
      icone: <List size={28} />,
      acao: () => setPaginaAtual("clientes"),
    },
    {
      titulo: configuracoes.nomeAbaFinanceiro,
      descricao: "Controle mensalidades, gráficos e recebimentos.",
      status: "Ativo",
      icone: <PieChart size={28} />,
      acao: () => setPaginaAtual("financeiro"),
    },
    {
      titulo: configuracoes.nomeAbaRelatorios,
      descricao: "Dashboard completo com gráficos, alunos, acessos e financeiro.",
      status: "Ativo",
      icone: <BarChart3 size={28} />,
      acao: () => setPaginaAtual("relatorios"),
    },
    {
      titulo: configuracoes.nomeAbaFuncionarios,
      descricao: "Cadastre funcionários com foto, biometria, dados pessoais e tipo de função.",
      status: "Ativo",
      icone: <UserRoundCheck size={28} />,
      acao: () => setPaginaAtual("funcionarios"),
    },
    {
      titulo: configuracoes.nomeAbaVendasBalcao,
      descricao: "Cadastre produtos, controle estoque e registre vendas de água, creatina, tônico e suplementos.",
      status: "Ativo",
      icone: <Dumbbell size={28} />,
      acao: () => setPaginaAtual("vendasBalcao"),
    },
    {
      titulo: configuracoes.nomeAbaConfiguracoes,
      descricao:
        "Configure catraca, leitor biométrico, dados da academia e regras.",
      status: "Ativo",
      icone: <UserRoundCheck size={28} />,
      acao: () => setPaginaAtual("configuracoes"),
    },
    {
      titulo: configuracoes.nomeModuloAppAluno,
      descricao: "Área futura para o aluno ver pagamentos, avisos e situação.",
      status: "Futuro",
      icone: <Star size={28} />,
      acao: () => alert("App do aluno será feito depois."),
    },
  ];

  return (
    <div className="aplicacoesPage">
      <header className="header">
        <div>
          <h2>{configuracoes.nomeAbaAplicacoes}</h2>
          <p>Central de módulos do sistema {configuracoes.nomeAcademia}</p>
        </div>
      </header>

      <section className="appsHero">
        <div>
          <span>Sistema modular</span>
          <h3>Escolha uma aplicação para gerenciar</h3>
          <p>
            Aqui ficam todos os módulos principais da academia. Alguns já estão
            ativos e outros serão criados nas próximas etapas.
          </p>
        </div>

        <div className="appsHeroIcon">
          <Dumbbell size={46} />
        </div>
      </section>

      <section className="appsGrid">
        {aplicacoes.map((app) => (
          <div className="appCard" key={app.titulo}>
            <div className="appCardTop">
              <div className="appIcon">{app.icone}</div>

              <span
                className={`appStatus ${
                  app.status === "Ativo" ? "ativo" : "breve"
                }`}
              >
                {app.status}
              </span>
            </div>

            <h3>{app.titulo}</h3>
            <p>{app.descricao}</p>

            <button type="button" onClick={app.acao}>
              Abrir módulo
              <ChevronRight size={18} />
            </button>
          </div>
        ))}
      </section>
    </div>
  );
}
