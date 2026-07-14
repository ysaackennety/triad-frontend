# TRIAD Academia — Frontend

Frontend React/Vite para gerenciamento de academia, cadastro de alunos, biometria, catraca, financeiro, funcionários, vendas e relatórios.

## Rodar o projeto

```bash
npm install
npm run dev
```

Login inicial de demonstração:

- Usuário: `admin`
- Senha: `123456`

## Configurar o backend

Copie `.env.example` para `.env`:

```env
VITE_API_URL=http://localhost:3001
```

Depois reinicie o Vite.

## Modos da biometria

Em **Configurações → Catraca e biometria**:

- `Simulação`: funciona sem backend.
- `Misto`: tenta usar o backend e mantém demonstração quando ele estiver offline.
- `Leitor real`: exige backend e equipamento conectados.

## Fluxo de acesso

1. A tela fica em “Aguardando digital”.
2. O frontend chama `GET /api/biometria/aguardar`.
3. O backend identifica a digital no banco.
4. O backend devolve o aluno em JSON ou apenas `alunoId`.
5. O frontend confere cadastro, mensalidade e horário.
6. Mostra foto, nome e acesso liberado/negado.
7. Quando autorizado, chama `POST /api/catraca/liberar`.
8. Registra a tentativa em `POST /api/acessos`.
9. A segunda tela volta automaticamente para “Aguardando digital”.

O contrato completo está em [`CONTRATO_BACKEND.md`](./CONTRATO_BACKEND.md).

## Segunda tela

Na tela de acesso, clique em **Tela do aluno**. Uma janela separada será aberta para colocar no monitor próximo à catraca.

## Build de produção

```bash
npm run build
```

O resultado será criado na pasta `dist`.
