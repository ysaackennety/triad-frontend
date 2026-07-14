import { useEffect, useMemo, useState } from "react";
import { AlertTriangle, CheckCircle2, Dumbbell, Fingerprint } from "lucide-react";
import { formatarData } from "../utils/helpers";

const CHAVE_TELA = "triad_ultimo_acesso_tela";

function carregarResultado() {
  try {
    return JSON.parse(localStorage.getItem(CHAVE_TELA) || "null");
  } catch {
    return null;
  }
}

export default function TelaAluno({ configuracoes }) {
  const [resultado, setResultado] = useState(carregarResultado);

  useEffect(() => {
    let canal = null;

    const atualizarPeloStorage = (evento) => {
      if (evento.key === CHAVE_TELA) setResultado(carregarResultado());
    };

    window.addEventListener("storage", atualizarPeloStorage);

    if ("BroadcastChannel" in window) {
      canal = new BroadcastChannel("triad-acesso-aluno");
      canal.onmessage = (evento) => setResultado(evento.data || null);
    }

    return () => {
      window.removeEventListener("storage", atualizarPeloStorage);
      canal?.close();
    };
  }, []);

  const estado = useMemo(() => {
    if (!resultado) return "aguardando";
    return resultado.liberado ? "liberado" : "negado";
  }, [resultado]);

  return (
    <main className={`telaAlunoPublica ${estado}`}>
      <div className="telaAlunoMarca">
        <div>
          {configuracoes.logoAcademia ? (
            <img src={configuracoes.logoAcademia} alt="Logo da academia" />
          ) : (
            <Dumbbell size={30} />
          )}
        </div>
        <span>{configuracoes.nomeAcademia}</span>
      </div>

      {!resultado ? (
        <section className="telaAlunoEspera">
          <div className="telaAlunoDigital">
            <Fingerprint size={150} strokeWidth={1.3} />
            <span></span>
          </div>
          <h1>Aguardando digital</h1>
          <p>Coloque o dedo no leitor para entrar.</p>
        </section>
      ) : (
        <section className="telaAlunoResultado">
          <div className="telaAlunoFoto">
            {resultado.foto ? (
              <img src={resultado.foto} alt={resultado.nome} />
            ) : (
              <Fingerprint size={100} />
            )}
          </div>

          <div className="telaAlunoIcone">
            {resultado.liberado ? (
              <CheckCircle2 size={64} />
            ) : (
              <AlertTriangle size={64} />
            )}
          </div>

          <span>{resultado.liberado ? "ACESSO LIBERADO" : "ACESSO NEGADO"}</span>
          <h1>{resultado.nome || "Digital não reconhecida"}</h1>
          <p>{resultado.mensagem || resultado.motivo}</p>

          {resultado.vencimento && (
            <small>Vencimento: {formatarData(resultado.vencimento)}</small>
          )}
        </section>
      )}
    </main>
  );
}
