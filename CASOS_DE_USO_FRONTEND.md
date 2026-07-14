# Casos de uso essenciais do frontend

## UC-01 — Cadastrar aluno

**Entrada:** dados pessoais, foto, digital, plano e pagamento inicial.

**Comportamento:**

1. Validar os campos obrigatórios.
2. Capturar quatro amostras ou receber o template final do backend.
3. Montar o JSON do aluno.
4. Enviar para `POST /api/alunos`.
5. Ler o JSON da resposta.
6. Adicionar o aluno retornado à interface.

## UC-02 — Aguardar digital

**Estado inicial:** leitor conectado e mensagem “Aguardando digital”.

**Comportamento:** o frontend mantém uma requisição de espera em `/api/biometria/aguardar`. Não é necessário selecionar o aluno manualmente.

## UC-03 — Digital reconhecida e acesso permitido

**Condições:** aluno encontrado, cadastro ativo, mensalidade válida e dentro do horário.

**Resultado:**

- Mostrar foto e nome.
- Mostrar “Acesso liberado”.
- Chamar a liberação da catraca.
- Registrar o acesso.
- Atualizar a segunda tela.
- Voltar à espera automaticamente.

## UC-04 — Mensalidade vencida

**Resultado:** mostrar foto, nome, vencimento e “Acesso negado — mensalidade vencida”. Não liberar a catraca.

## UC-05 — Cadastro bloqueado

**Resultado:** mostrar o cliente e informar que o cadastro está bloqueado. Não liberar a catraca.

## UC-06 — Fora do horário

**Resultado:** informar o horário permitido e negar o acesso.

## UC-07 — Digital desconhecida

**Resultado:** mostrar “Digital não reconhecida”, orientar a procurar a recepção e registrar a tentativa negada.

## UC-08 — Falha na catraca

**Resultado:** informar que o aluno foi identificado, mas a catraca não respondeu. No modo real, o acesso não deve aparecer como concluído.

## UC-09 — Backend desconectado

**Resultado:** mostrar estado offline. No modo misto, permitir demonstração; no modo real, aguardar reconexão automática.

## UC-10 — Segunda tela

**Resultado:** exibir somente as informações importantes para o aluno: foto, nome, liberado/negado e mensagem. Após alguns segundos, retornar à animação “Aguardando digital”.
