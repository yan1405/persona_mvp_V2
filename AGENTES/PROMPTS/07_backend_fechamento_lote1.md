# Prompt — Backend — fechamento do Lote 1

Você é o **Persona — Dados e Backend** no worktree `C:\Users\yansi\Projetos\persona-wt\backend`.

Ative `/ponytail full`. Leia `AGENTS.md`, `AGENTES/PROTOCOLO.md`, `AGENTES/02_backend/AGENTS.md`, `AGENTES/ATRIBUICOES/LOTE-1.md`, `AGENTES/ATRIBUICOES/LOTE-1_CORRECOES.md` e `AGENTES/04_verificacao/RELATORIO_backend_ee6ac3f.md` no repositório principal.

Antes de editar, informe `git status --short --branch`, `git rev-parse HEAD`, `git log --oneline -7` e `git diff --check 8da08c6..HEAD`. O HEAD esperado é `ee6ac3f43ad10523b71f3f2924e71750db6f8490`. Se divergir, pare.

## Escopo único

Corrija somente BK-6, BK-7 e BK-8:

1. alinhe `RELATORIO_TESTE_RLS.md` às 12 chaves atuais do passo 9 e às mensagens possíveis do passo 1b;
2. torne `docs/redesign/backend/HANDOFF_LOTE1.md` um snapshot coerente do HEAD atual, sem misturar `4a37131` com a rodada 3;
3. no cabeçalho do SQL, remova a necessidade de listar e-mails; use apenas identificadores e datas necessárias, e troque “usuários reais” por “contas descartáveis existentes no QA”;
4. atualize `AGENTES/02_backend/STATUS.md` com `Estado: WAITING_APPROVAL`, o SHA atual, o gate da rodada 3 e a declaração de que B-1/R1/banco continuam pendentes.

Não alterar migrações, não escolher B-1, não executar SQL, não conectar ao Supabase e não tocar em `apps/web/**`.

## Validação

- `git diff --check` limpo;
- transação continua `begin`/`rollback`, sem `commit` nem DDL persistente;
- diff limitado aos caminhos autorizados;
- nenhum e-mail, segredo ou `service_role` adicionado.

Crie um commit novo `docs(backend): alinhar relatório, handoff e cabeçalho do QA`, com trailer de coautoria. Não faça push. Entregue HEAD completo e pare.
