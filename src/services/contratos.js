export function montarPayloadAluno({ formulario }) {
  const digital = formulario.digital;

  const biometriaHash =
    typeof digital === "string"
      ? digital
      : digital?.biometriaHash ||
        digital?.hash ||
        digital?.templateId ||
        digital?.id ||
        "";

  return {
    nome: String(formulario.nome || "").trim(),
    cpf: String(formulario.cpf || "").replace(/\D/g, ""),
    biometriaHash: String(biometriaHash),
    email: String(formulario.email || "").trim(),
    telefone: String(formulario.telefone || "").replace(/\D/g, ""),
    tipo: "ALUNO",
  };
}

export function normalizarAlunoBackend(resposta, fallback = {}) {
  const aluno =
    resposta?.usuario ||
    resposta?.aluno ||
    resposta?.cliente ||
    resposta?.membro ||
    resposta?.data?.usuario ||
    resposta?.data?.aluno ||
    resposta?.data ||
    resposta ||
    {};

  const endereco = aluno.endereco || {};
  const plano = aluno.plano || {};
  const biometria = aluno.biometria || {};

  return {
    ...fallback,
    ...aluno,
    id: aluno.id ?? fallback.id,
    nome: aluno.nome ?? fallback.nome,
    cpf: aluno.cpf ?? fallback.cpf,
    nascimento: aluno.nascimento ?? fallback.nascimento,
    email: aluno.email ?? fallback.email ?? "",
    telefone: aluno.telefone ?? fallback.telefone ?? "",
    emergencia: aluno.emergencia ?? fallback.emergencia ?? "",
    cidade: aluno.cidade ?? endereco.cidade ?? fallback.cidade ?? "",
    bairro: aluno.bairro ?? endereco.bairro ?? fallback.bairro ?? "",
    rua: aluno.rua ?? endereco.rua ?? fallback.rua ?? "",
    numero: aluno.numero ?? endereco.numero ?? fallback.numero ?? "",
    foto: aluno.foto ?? fallback.foto ?? "",
    digital:
      aluno.digital ??
      aluno.biometriaHash ??
      biometria.templateId ??
      biometria.id ??
      fallback.digital ??
      "",
    valorPlano:
      aluno.valorPlano ?? plano.valor ?? fallback.valorPlano ?? "0,00",
    vencimento:
      aluno.vencimento ?? plano.vencimento ?? fallback.vencimento ?? "",
    ativo:
      aluno.ativo ??
      (aluno.status ? aluno.status === "ATIVO" : undefined) ??
      plano.ativo ??
      fallback.ativo,
    pagamentos: aluno.pagamentos ?? fallback.pagamentos ?? [],
    tipo: aluno.tipo ?? fallback.tipo ?? "ALUNO",
    status: aluno.status ?? fallback.status ?? "ATIVO",
  };
}

export function montarPayloadAcesso({
  eventoBiometria,
  aluno,
  liberado,
  motivo,
  configuracoes,
}) {
  return {
    eventoId:
      eventoBiometria?.eventoId ||
      eventoBiometria?.id ||
      `front-${Date.now()}`,
    alunoId: aluno?.id || null,
    biometriaId:
      eventoBiometria?.biometriaId ||
      eventoBiometria?.digitalId ||
      eventoBiometria?.templateId ||
      aluno?.digital ||
      null,
    qualidade: eventoBiometria?.qualidade || eventoBiometria?.score || null,
    liberado,
    motivo,
    dataHora: new Date().toISOString(),
    equipamento: {
      leitor: configuracoes.leitorBiometrico,
      portaCatraca: configuracoes.portaCatraca,
      velocidadeCatraca: Number(configuracoes.velocidadeCatraca || 9600),
      comandoLiberacao: configuracoes.comandoLiberacao,
    },
  };
}
