# Contrato Frontend ↔ Backend — TRIAD Academia

O frontend usa JSON em todas as rotas. Base padrão: `http://localhost:3001`.
É possível alterar pelo arquivo `.env` usando `VITE_API_URL`.

## 1. Salvar aluno

`POST /api/alunos`

```json
{
  "nome": "Carlos Eduardo Silva",
  "cpf": "123.456.789-00",
  "nascimento": "1998-04-12",
  "email": "carlos@email.com",
  "telefone": "(89) 99999-1111",
  "emergencia": "(89) 98888-1111",
  "endereco": {
    "cidade": "São Raimundo Nonato",
    "bairro": "Centro",
    "rua": "Rua Principal",
    "numero": "100"
  },
  "foto": "data:image/png;base64,...",
  "biometria": {
    "templateId": "BIO-2b1a8d",
    "leitor": "Futronic FS88",
    "qualidade": 96
  },
  "plano": {
    "valor": "120,00",
    "vencimento": "2026-08-14",
    "ativo": true
  },
  "pagamentoInicial": {
    "valor": "120,00",
    "valorRecebido": "120,00",
    "troco": "0,00",
    "forma": "PIX",
    "data": "2026-07-14",
    "horario": "11:45"
  }
}
```

Resposta esperada:

```json
{
  "sucesso": true,
  "aluno": {
    "id": 37,
    "nome": "Carlos Eduardo Silva",
    "foto": "data:image/png;base64,...",
    "biometria": { "templateId": "BIO-2b1a8d" },
    "plano": { "valor": "120,00", "vencimento": "2026-08-14" }
  }
}
```

## 2. Capturar/cadastrar digital

`POST /api/biometria/capturar`

```json
{
  "tipoPessoa": "aluno",
  "pessoaId": null,
  "leituraNumero": 1,
  "totalLeituras": 4,
  "leitor": "Futronic FS88"
}
```

Durante o cadastro, o backend pode devolver uma amostra:

```json
{
  "status": "amostra_capturada",
  "numero": 1,
  "total": 4,
  "qualidade": 94
}
```

Na última leitura deve devolver:

```json
{
  "status": "concluido",
  "templateId": "BIO-2b1a8d",
  "qualidade": 96,
  "leitor": "Futronic FS88"
}
```

## 3. Tela esperando uma digital

`GET /api/biometria/aguardar?tipo=aluno&timeout=25000`

A rota pode usar long polling: segura a resposta até uma digital ser lida ou até o tempo acabar.

Sem leitura:

```json
{ "status": "aguardando" }
```

Digital não encontrada:

```json
{
  "status": "nao_identificado",
  "eventoId": "EVT-1001",
  "qualidade": 91
}
```

Digital identificada — resposta preferencial:

```json
{
  "status": "identificado",
  "eventoId": "EVT-1002",
  "alunoId": 37,
  "qualidade": 96,
  "aluno": {
    "id": 37,
    "nome": "Carlos Eduardo Silva",
    "cpf": "123.456.789-00",
    "foto": "data:image/png;base64,...",
    "valorPlano": "120,00",
    "vencimento": "2026-08-14",
    "digital": "BIO-2b1a8d"
  }
}
```

O frontend também aceita somente `alunoId`. Nesse caso ele chama `GET /api/alunos/:id`.

## 4. Buscar aluno

`GET /api/alunos/:id`

```json
{
  "sucesso": true,
  "aluno": {
    "id": 37,
    "nome": "Carlos Eduardo Silva",
    "foto": "data:image/png;base64,...",
    "valorPlano": "120,00",
    "vencimento": "2026-08-14",
    "digital": "BIO-2b1a8d"
  }
}
```

## 5. Registrar tentativa de acesso

`POST /api/acessos`

```json
{
  "eventoId": "EVT-1002",
  "alunoId": 37,
  "biometriaId": "BIO-2b1a8d",
  "qualidade": 96,
  "liberado": true,
  "motivo": "Acesso liberado",
  "dataHora": "2026-07-14T14:45:00.000Z",
  "equipamento": {
    "leitor": "Futronic FS88",
    "portaCatraca": "COM3",
    "velocidadeCatraca": 9600,
    "comandoLiberacao": "0x00"
  }
}
```

## 6. Liberar catraca

`POST /api/catraca/liberar`

```json
{
  "alunoId": 37,
  "eventoId": "EVT-1002",
  "porta": "COM3",
  "velocidade": 9600,
  "comando": "0x00"
}
```

Resposta:

```json
{
  "sucesso": true,
  "status": "liberada",
  "mensagem": "Catraca liberada"
}
```

## Fluxo de acesso

1. Frontend mostra “Aguardando digital”.
2. Frontend chama `/api/biometria/aguardar`.
3. Backend lê a digital e procura no banco.
4. Backend devolve o aluno em JSON ou apenas o `alunoId`.
5. Frontend confere vencimento e horário.
6. Frontend mostra foto, nome e acesso liberado/negado.
7. Se liberado, frontend chama `/api/catraca/liberar`.
8. Frontend registra o resultado em `/api/acessos`.
9. Depois de alguns segundos, volta a “Aguardando digital”.
