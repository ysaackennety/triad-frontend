import { useMemo, useState } from "react";
import { Dumbbell, KeyRound, Lock, Mail, ShieldCheck, UserRoundCheck } from "lucide-react";
import { autenticarFuncionario } from "./authLogin";
import "./Login.css";

export default function Login({ configuracoes, funcionarios, onLogin }) {
  const [dados, setDados] = useState({ usuario: "", senha: "" });
  const [erro, setErro] = useState("");
  const [entrando, setEntrando] = useState(false);

  const totalFuncionarios = useMemo(() => {
    return Array.isArray(funcionarios) ? funcionarios.length : 0;
  }, [funcionarios]);

  function alterarCampo(evento) {
    const { name, value } = evento.target;

    setDados((dadosAtuais) => ({
      ...dadosAtuais,
      [name]: value,
    }));
  }

  function fazerLogin(evento) {
    evento.preventDefault();

    const resultado = autenticarFuncionario(funcionarios, dados.usuario, dados.senha);

    if (!resultado.sucesso) {
      setErro(resultado.mensagem);
      return;
    }

    setErro("");
    setEntrando(true);

    setTimeout(() => {
      onLogin(resultado.usuario);
    }, 900);
  }

  return (
    <main className="loginScreenPremium">
      <div className="loginBackgroundGrid"></div>
      <div className="loginGlow loginGlowA"></div>
      <div className="loginGlow loginGlowB"></div>

      <section className="loginShellPremium">
        <div className="loginBrandPanel">
          <div className="loginLogoBox">
            <div className="loginLogoMark">
              {configuracoes?.logoAcademia ? (
                <img src={configuracoes.logoAcademia} alt="Logo da academia" />
              ) : (
                <Dumbbell size={30} />
              )}
            </div>

            <div>
              <h1>{configuracoes?.nomeSistema || "TRIAD"}</h1>
              <span>{configuracoes?.subtituloSistema || "Academia"}</span>
            </div>
          </div>

          <div className="loginCopy">
            <span className="loginBadge">
              <ShieldCheck size={16} /> ACESSO SEGURO
            </span>

            <h2>Painel inteligente para academia.</h2>
            <p>
              Entre com seu usuário de funcionário para acessar alunos, financeiro,
              vendas de balcão, relatórios, funcionários e configurações.
            </p>
          </div>

          <div className="loginStatsGrid">
            <div>
              <strong>{totalFuncionarios}</strong>
              <span>funcionário(s)</span>
            </div>
            <div>
              <strong>100%</strong>
              <span>controle local</span>
            </div>
            <div>
              <strong>PIN</strong>
              <span>acesso interno</span>
            </div>
          </div>
        </div>

        <form className="loginFormPanel" onSubmit={fazerLogin}>
          <div className="loginFormHeader">
            <div className="loginFormIcon">
              <UserRoundCheck size={25} />
            </div>
            <div>
              <h3>Entrar no sistema</h3>
              <p>Use usuário, e-mail ou CPF cadastrado no funcionário.</p>
            </div>
          </div>

          <label className="loginField">
            <span>Usuário, e-mail ou CPF</span>
            <div>
              <Mail size={18} />
              <input
                type="text"
                name="usuario"
                value={dados.usuario}
                onChange={alterarCampo}
                placeholder="Ex: admin"
                autoComplete="username"
              />
            </div>
          </label>

          <label className="loginField">
            <span>Senha</span>
            <div>
              <Lock size={18} />
              <input
                type="password"
                name="senha"
                value={dados.senha}
                onChange={alterarCampo}
                placeholder="Digite sua senha"
                autoComplete="current-password"
              />
            </div>
          </label>

          {erro && <div className="loginErrorBox">{erro}</div>}

          <button className="loginSubmitButton" type="submit" disabled={entrando}>
            <KeyRound size={19} />
            {entrando ? "Entrando..." : "Entrar no painel"}
          </button>

          <div className="loginDefaultAccess">
            <strong>Acesso inicial</strong>
            <span>Usuário: admin • Senha: 123456</span>
          </div>
        </form>
      </section>
    </main>
  );
}
