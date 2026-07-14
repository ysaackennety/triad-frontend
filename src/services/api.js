const API_BASE_URL = String(
  import.meta.env.VITE_API_URL || "http://localhost:3001"
).replace(/\/$/, "");

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

  const response = await fetch(`${API_BASE_URL}${caminho}`, {
    ...opcoes,
    headers,
  });

  const data = await lerResposta(response);

  if (!response.ok) {
    throw new ApiError(
      data?.mensagem || data?.message || `Erro HTTP ${response.status}`,
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
    null
  );
}

export function extrairAlunoId(resposta) {
  return (
    resposta?.alunoId ||
    resposta?.clienteId ||
    resposta?.membroId ||
    resposta?.usuarioId ||
    resposta?.data?.alunoId ||
    extrairAluno(resposta)?.id ||
    null
  );
}

export function extrairStatusBiometria(resposta) {
  return String(
    resposta?.status || resposta?.situacao || resposta?.data?.status || ""
  ).toLowerCase();
}

export async function criarAluno(payload, signal) {
  return requisicao("/api/alunos", {
    method: "POST",
    body: JSON.stringify(payload),
    signal,
  });
}

export async function buscarAlunoPorId(alunoId, signal) {
  return requisicao(`/api/alunos/${encodeURIComponent(alunoId)}`, { signal });
}

export async function capturarBiometria(payload, signal) {
  return requisicao("/api/biometria/capturar", {
    method: "POST",
    body: JSON.stringify(payload),
    signal,
  });
}

export async function aguardarBiometria(signal) {
  return requisicao("/api/biometria/aguardar?tipo=aluno&timeout=25000", {
    method: "GET",
    signal,
    cache: "no-store",
  });
}

export async function registrarAcesso(payload, signal) {
  return requisicao("/api/acessos", {
    method: "POST",
    body: JSON.stringify(payload),
    signal,
  });
}

export async function liberarCatraca(payload, signal) {
  return requisicao("/api/catraca/liberar", {
    method: "POST",
    body: JSON.stringify(payload),
    signal,
  });
}

export async function testarEquipamentos(payload, signal) {
  return requisicao("/api/equipamentos/testar", {
    method: "POST",
    body: JSON.stringify(payload),
    signal,
  });
}
