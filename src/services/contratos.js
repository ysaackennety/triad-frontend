import { formatarValorParaCampo } from "../utils/helpers";

export function montarPayloadAluno({ formulario, pagamentoInicial }) {
  return {
    nome: formulario.nome.trim(),
    cpf: formulario.cpf.trim(),
    nascimento: formulario.nascimento,
    email: formulario.email.trim() || null,
    telefone: formulario.telefone.trim() || null,
    emergencia: formulario.emergencia.trim() || null,
    endereco: {
      cidade: formulario.cidade.trim() || null,
      bairro: formulario.bairro.trim() || null,
      rua: formulario.rua.trim() || null,
      numero: formulario.numero.trim() || null,
    },
    foto: formulario.foto,
    biometria: {
      templateId:
        typeof formulario.digital === "string"
          ? formulario.digital
          : formulario.digital?.templateId || formulario.digital?.id,
      leitor: formulario.digital?.leitor || "Futronic FS88",
      qualidade: formulario.digital?.qualidade || null,
    },
    plano: {
      valor: formulario.valorPlano,
      vencimento: formulario.vencimento,
      ativo: true,
    },
    pagamentoInicial: pagamentoInicial
      ? {
          valor: formatarValorParaCampo(pagamentoInicial.valorNumerico),
          valorRecebido: formatarValorParaCampo(
            pagamentoInicial.valorRecebidoNumerico
          ),
          troco: formatarValorParaCampo(pagamentoInicial.trocoNumerico),
          forma: pagamentoInicial.forma,
          data: pagamentoInicial.data,
          horario: pagamentoInicial.horario,
        }
      : null,
  };
}

export function normalizarAlunoBackend(resposta, fallback = {}) {
  const aluno = resposta?.aluno || resposta?.data || resposta || {};
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
      biometria.templateId ??
      biometria.id ??
      fallback.digital ??
      "",
    valorPlano:
      aluno.valorPlano ?? plano.valor ?? fallback.valorPlano ?? "0,00",
    vencimento:
      aluno.vencimento ?? plano.vencimento ?? fallback.vencimento ?? "",
    ativo: aluno.ativo ?? plano.ativo ?? fallback.ativo,
    pagamentos: aluno.pagamentos ?? fallback.pagamentos ?? [],
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
    qualidade:
      eventoBiometria?.qualidade || eventoBiometria?.score || null,
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
