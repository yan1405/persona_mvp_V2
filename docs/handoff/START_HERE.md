# Comece aqui — continuidade do Persona MVP v2

Este é o ponto de entrada para qualquer IA ou pessoa que precise auditar, corrigir ou continuar o Persona a partir de qualquer fase.

## 1. Local oficial

Trabalhe somente em:

```text
C:\Users\yansi\OneDrive\Persona_Geral\persona_mvp_v2
```

`../99_lixo/persona_v1/` é histórico. Pode informar requisitos confirmados, mas não fornece stack, código, identidade ou composição visual automaticamente aprovados para a v2. Nunca modifique o legado sem autorização explícita.

## 2. Ponto exato de parada

Em 11/08/2026:

- Fases 1 e 2 estão aprovadas;
- Fase 3 está implementada, tecnicamente validada e aprovada para avanço;
- Yan autorizou explicitamente o início da Fase 4;
- a Fase 4 está implementada, tecnicamente validada e aprovada por Yan;
- a Fase 5 está implementada e tecnicamente validada com provas por link; arquivos/Storage continuam adiados;
- a avaliação e aprovação de Yan é o gate atual; a Fase 6 ainda não está autorizada;
- o contrato aprovado está em `docs/plans/2026-08-11-fase-5-biblioteca-evidencias-design.md`;
- o design técnico da Fase 4 está em `docs/plans/2026-08-10-fase-4-diario-estruturacao-design.md`;
- a fronteira Groq server-only, o schema estrito e a chamada real foram validados; a chave existe somente no `.env.local` ignorado pelo Git;
- o Supabase possui `evidence_suggestions`, `evidences`, `evidence_sources`, RLS e a RPC transacional da Fase 4;
- o primeiro Daily Log da conta de teste foi persistido durante a validação;
- o projeto usa a porta `3100`, nunca `3000`.

Não amplie a Fase 4 além do contrato aprovado sem nova confirmação de Yan.

## 3. Ordem obrigatória de leitura

Leia integralmente, nesta ordem:

1. [`../../AGENTS.md`](../../AGENTS.md);
2. [`CURRENT_STATE.md`](CURRENT_STATE.md);
3. [`../../log_execução.md`](../../log_execução.md);
4. [`PHASES.md`](PHASES.md);
5. [`PRODUCT_SURFACE.md`](PRODUCT_SURFACE.md);
6. [`TECHNICAL_RUNBOOK.md`](TECHNICAL_RUNBOOK.md);
7. [`DESIGN_AND_SKILLS.md`](DESIGN_AND_SKILLS.md);
8. [`QUALITY_GATES.md`](QUALITY_GATES.md);
9. documentos de produto, arquitetura, plano e revisão apontados pela fase ativa.

Não leia somente este resumo e comece a escrever código. O estado real do repositório e os documentos da fase prevalecem sobre qualquer resumo antigo.

## 4. Auditoria de retomada em 15 minutos

Execute antes de propor alterações:

```powershell
cd C:\Users\yansi\OneDrive\Persona_Geral\persona_mvp_v2
git status --short
git log -5 --oneline
git remote -v

cd apps\web
npm.cmd run lint
npm.cmd run typecheck
npm.cmd test
```

Depois:

1. confira `package.json`, a árvore de `app/` e a migração mais recente;
2. compare o status encontrado com `CURRENT_STATE.md` e `log_execução.md`;
3. abra a revisão da última fase em `docs/reviews/`;
4. confirme se existe aprovação explícita de Yan;
5. verifique se há mudanças não commitadas de outro autor;
6. leia a documentação local do Next.js 16 em `apps/web/node_modules/next/dist/docs/` antes de alterar APIs do framework;
7. nunca imprima `.env.local`, tokens, cookies, client secrets ou chaves privadas.

## 5. Regra para continuar qualquer fase

Para uma fase já concluída:

- confirme a aprovação registrada;
- reproduza o problema antes de corrigir;
- preserve contratos públicos, banco e screenshots anteriores;
- registre a correção como nova implementação no log e em novo commit.

Para uma fase pendente:

- leia o plano e a revisão da fase;
- termine somente o que estiver dentro do contrato aprovado;
- apresente o checkpoint ao usuário;
- aguarde aprovação antes da próxima fase.

Para uma fase não iniciada:

- confirme objetivo, fluxo, dados, estados e critério de sucesso;
- compare duas ou três abordagens e registre a escolhida;
- crie `docs/plans/YYYY-MM-DD-fase-N-<nome>-design.md`;
- obtenha aprovação antes de mudanças amplas;
- implemente, valide, atualize documentação e faça commit.

## 6. Fontes da verdade por assunto

| Assunto | Fonte principal |
|---|---|
| Regras e permissões | `AGENTS.md` |
| Estado vivo e próximo gate | `docs/handoff/CURRENT_STATE.md` |
| Histórico executado | `log_execução.md` |
| Definição do produto | `docs/PRODUCT_BRIEF.md` |
| Rotas, áreas e abas | `docs/architecture/INFORMATION_ARCHITECTURE.md` |
| Stack, dados e segurança | `docs/architecture/TECHNICAL_ARCHITECTURE.md` |
| Sequência de entrega | `docs/handoff/PHASES.md` |
| Marca e tokens | `docs/design/BRAND_FOUNDATION.md` e `docs/design/design-dna.json` |
| Aplicação do DNA | `docs/design/DESIGN_DNA_ADAPTATION.md` |
| Evidência visual e aprovação | `docs/reviews/` e `docs/design/VISUAL_REVIEW_PROTOCOL.md` |
| Código em execução | `apps/web/` e `supabase/migrations/` |

## 7. Invariantes que não podem ser reinterpretados

- autenticação exclusiva pela Microsoft via Supabase Auth;
- nenhuma experiência, resultado ou número inventado;
- IA sugere; usuário revisa antes de confirmar evidência;
- argumentos reais e rascunho gerado aparecem separados e rastreáveis;
- Narrative Score insuficiente não recebe número artificial;
- desktop-first nas larguras 1024, 1280, 1440 e 1920px;
- somente paleta e logos do Persona antigo; demais decisões visuais vêm da v2;
- Persona v1 não é referência visual;
- sem billing, paywall, PWA ou integração produtiva com reuniões no MVP atual;
- toda tabela privada usa RLS e vínculo com o usuário;
- toda fase termina com screenshots, revisão, checkpoint, log e commit;
- nenhum segredo pode entrar em Markdown, log, screenshot, commit ou saída de terminal.

## 8. Condição atual para avançar

A Fase 5 está implementada e validada. A próxima IA deve abrir `docs/reviews/fase-5-biblioteca-evidencias.md`, confirmar o estado vivo e tratar apenas ajustes solicitados por Yan. Não iniciar a Fase 6 nem criar Storage/upload antes da aprovação explícita da Fase 5 e de um novo contrato.
