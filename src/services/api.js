const API_BASE_URL = String(
  import.meta.env.VITE_API_URL || "https://triadacademia.onrender.com"
).replace(/\/+$/, "");

export class ApiError extends Error {
  constructor(message, status = 0, data = null) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

async function lerResposta(response) {
  if (response.status === 204) return null;

  const contentType = response.headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    return response.json();
  }

  const texto = await response.text();
  return texto ? { mensagem: texto } : null;
}

async function requisicao(caminho, opcoes = {}) {
  const headers = {
    Accept: "application/json",
    ...(opcoes.body ? { "Content-Type": "application/json" } : {}),
    ...(opcoes.headers || {}),
  };

  let response;

  try {
    response = await fetch(`${API_BASE_URL}${caminho}`, {
      ...opcoes,
      headers,
    });
  } catch (erro) {
    if (erro?.name === "AbortError") throw erro;

    throw new ApiError(
      "Não foi possível conectar ao servidor. Verifique a internet ou o CORS da API.",
      0,
      {
        url: `${API_BASE_URL}${caminho}`,
        erroOriginal: erro?.message || String(erro),
      }
    );
  }

  const data = await lerResposta(response);

  if (!response.ok) {
    throw new ApiError(
      data?.error ||
        data?.mensagem ||
        data?.message ||
        `Erro HTTP ${response.status}`,
      response.status,
      data
    );
  }

  return data;
}

export function obterApiUrl() {
  return API_BASE_URL;
}

export function extrairAluno(resposta) {
  return (
    resposta?.aluno ||
    resposta?.cliente ||
    resposta?.membro ||
    resposta?.usuario ||
    resposta?.data?.aluno ||
    resposta?.data?.cliente ||
    resposta?.data?.membro ||
    resposta?.data?.usuario ||
    (resposta?.id && resposta?.nome ? resposta : null)
  );
}

export function extrairAlunoId(resposta) {
  return (
    resposta?.id ||
    resposta?.alunoId ||
    resposta?.clienteId ||
    resposta?.membroId ||
    resposta?.usuarioId ||
    resposta?.data?.id ||
    resposta?.data?.alunoId ||
    resposta?.data?.usuarioId ||
    extrairAluno(resposta)?.id ||
    null
  );
}

export function extrairStatusBiometria(resposta) {
  return String(
    resposta?.status || resposta?.situacao || resposta?.data?.status || ""
  ).toLowerCase();
}

export function extrairUsuarios(resposta) {
  if (Array.isArray(resposta)) return resposta;
  if (Array.isArray(resposta?.usuarios)) return resposta.usuarios;
  if (Array.isArray(resposta?.data?.usuarios)) return resposta.data.usuarios;
  return [];
}

export async function testarApi(signal) {
  return requisicao("/api/teste", {
    method: "GET",
    signal,
    cache: "no-store",
  });
}

export async function criarAluno(payload, signal) {
  return requisicao("/api/cadastrar", {
    method: "POST",
    body: JSON.stringify(payload),
    signal,
  });
}

export async function identificarUsuario(biometriaHash, signal) {
  if (!biometriaHash) {
    throw new ApiError("O hash da biometria não foi informado.", 400);
  }

  return requisicao("/api/identificar", {
    method: "POST",
    body: JSON.stringify({ biometriaHash }),
    signal,
  });
}

export async function listarUsuarios(filtros = {}, signal) {
  const parametros = new URLSearchParams();

  if (filtros.status) parametros.set("status", filtros.status);
  if (filtros.tipo) parametros.set("tipo", filtros.tipo);

  const query = parametros.toString();
  const caminho = query ? `/api/usuarios?${query}` : "/api/usuarios";

  return requisicao(caminho, {
    method: "GET",
    signal,
    cache: "no-store",
  });
}

export async function buscarUsuarioPorId(usuarioId, signal) {
  if (usuarioId === null || usuarioId === undefined || usuarioId === "") {
    throw new ApiError("O ID do usuário não foi informado.", 400);
  }

  const resposta = await listarUsuarios({}, signal);
  const usuarios = extrairUsuarios(resposta);
  const usuario = usuarios.find(
    (item) => String(item.id) === String(usuarioId)
  );

  if (!usuario) {
    throw new ApiError("Usuário não encontrado.", 404, resposta);
  }

  return usuario;
}

export async function buscarAlunoPorId(alunoId, signal) {
  return buscarUsuarioPorId(alunoId, signal);
}

export async function atualizarUsuario(usuarioId, payload, signal) {
  if (usuarioId === null || usuarioId === undefined || usuarioId === "") {
    throw new ApiError("O ID do usuário não foi informado.", 400);
  }

  return requisicao(`/api/usuarios/${encodeURIComponent(usuarioId)}`, {
    method: "PUT",
    body: JSON.stringify(payload),
    signal,
  });
}

export async function excluirUsuario(usuarioId, signal) {
  if (usuarioId === null || usuarioId === undefined || usuarioId === "") {
    throw new ApiError("O ID do usuário não foi informado.", 400);
  }

  return requisicao(`/api/usuarios/${encodeURIComponent(usuarioId)}`, {
    method: "DELETE",
    signal,
  });
}

// Estas rotas ainda não foram disponibilizadas pelo backend.
// Elas continuam exportadas para não quebrar as importações do App.jsx.
export async function capturarBiometria() {
  throw new ApiError(
    "A rota /api/biometria/capturar ainda não existe no backend.",
    501
  );
}

export async function aguardarBiometria() {
  throw new ApiError(
    "A rota /api/biometria/aguardar ainda não existe no backend.",
    501
  );
}

export async function registrarAcesso() {
  throw new ApiError(
    "A rota /api/acessos ainda não existe no backend.",
    501
  );
}

export async function liberarCatraca() {
  throw new ApiError(
    "A rota /api/catraca/liberar ainda não existe no backend.",
    501
  );
}

export async function testarEquipamentos(_payload, signal) {
  return testarApi(signal);
}
