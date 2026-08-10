# Gates de qualidade, auditoria e continuidade

## 1. Pré-implementação

Antes de editar:

- [ ] ler `AGENTS.md`, `START_HERE.md`, `CURRENT_STATE.md` e `log_execução.md`;
- [ ] executar `git status --short` e preservar mudanças de terceiros;
- [ ] confirmar fase ativa e aprovação da fase anterior;
- [ ] ler briefing, arquitetura e plano relevante;
- [ ] distinguir fato implementado de plano;
- [ ] confirmar objetivo, usuário, tarefa e sucesso;
- [ ] comparar duas ou três abordagens quando houver criação de comportamento;
- [ ] registrar contrato em `docs/plans/` antes de mudança ampla;
- [ ] ler skills obrigatórias completas;
- [ ] ler documentação local do Next.js para APIs afetadas;
- [ ] identificar dados pessoais, segredo, custo ou ação externa;
- [ ] pedir confirmação imediatamente antes de ação irreversível, credencial ou recurso pago.

## 2. Gate funcional

- [ ] fluxo principal completo no app real;
- [ ] validação cliente para feedback e servidor para confiança;
- [ ] loading, disabled, sucesso e erro;
- [ ] conteúdo digitado preservado após falha;
- [ ] retry seguro e idempotência quando necessário;
- [ ] estados vazio, parcial e sem resultado;
- [ ] ação destrutiva explica impacto;
- [ ] IA possui fallback manual;
- [ ] sugestão não vira fato sem revisão;
- [ ] score não inventa número;
- [ ] fontes continuam rastreáveis.

## 3. Gate de dados e segurança

- [ ] cada tabela privada possui `user_id` ou PK vinculada ao usuário;
- [ ] RLS habilitada;
- [ ] políticas por operação são mínimas;
- [ ] teste com usuário autenticado e acesso indevido;
- [ ] Server Action/Route Handler reconfirma autenticação;
- [ ] input tem tamanho, formato e valores permitidos;
- [ ] segredo não usa prefixo público;
- [ ] log técnico não contém token, cookie, e-mail desnecessário ou relato completo;
- [ ] `.env.local` não está staged;
- [ ] upload limita tipo/tamanho e possui política de Storage;
- [ ] exclusão/exportação afeta somente o próprio usuário;
- [ ] migração SQL existe para toda alteração aplicada;
- [ ] custo e serviço externo foram autorizados.

## 4. Gate de IA

- [ ] chave somente server-side;
- [ ] modelo configurável;
- [ ] prompt versionado;
- [ ] entrada mínima necessária;
- [ ] schema de saída explícito e validado;
- [ ] timeout e falha recuperável;
- [ ] retry limitado;
- [ ] nenhuma persistência automática como fato;
- [ ] ausência de evidência gera ausência/alerta;
- [ ] modo manual permanece;
- [ ] argumentos e rascunho aparecem separados;
- [ ] fontes usadas ficam registradas;
- [ ] não enviar dados a ferramenta externa de auditoria sem autorização.

## 5. Gate visual e acessível

- [ ] `editorial-modular-app-design` aplicada;
- [ ] `design-sem-cara-de-ia` aplicada;
- [ ] Design DNA comparado;
- [ ] paleta/logos corretos;
- [ ] Geist nos papéis aprovados;
- [ ] uma ação primária por contexto;
- [ ] sem cards/gradiente/sombra genéricos;
- [ ] labels persistentes;
- [ ] HTML semântico;
- [ ] ordem de foco lógica;
- [ ] foco visível;
- [ ] contraste WCAG 2.2 AA considerado;
- [ ] estados não dependem só de cor;
- [ ] `prefers-reduced-motion` respeitado;
- [ ] 1024, 1280, 1440 e 1920px avaliados;
- [ ] sem overflow horizontal;
- [ ] texto ampliado não perde ação essencial;
- [ ] script `auditar_tells_ia.py` executado;
- [ ] três tells genéricos revisados;
- [ ] screenshots reais salvos.

## 6. Comandos mínimos

Dentro de `apps/web`:

```powershell
npm.cmd run lint
npm.cmd run typecheck
npm.cmd test
npm.cmd run build
```

Não declarar sucesso se um processo ficou sem `exit code 0`. Se build conflitar com dev, encerrar o servidor, executar build e reiniciar.

## 7. Testes atuais e expansão

### Existentes

- redirect interno permitido e externo bloqueado;
- onboarding válido;
- consentimento obrigatório;
- limite do primeiro Daily Log;
- horário condicional do lembrete.

### Adicionar quando a função entrar

- schema de saída Groq;
- IA não confirma evidência;
- RLS de `evidences` e fontes;
- consistência determinística do score;
- recuperação de evidência no Live;
- não invenção de fatos;
- vínculos de Artefato;
- exportação/exclusão;
- fluxos críticos no navegador.

Teste novo deve proteger regra real. Não criar suíte vazia ou framework sem uso.

## 8. Sessão de avaliação por fase

Produzir:

1. `docs/reviews/fase-N-<nome>.md`;
2. diretório de screenshots correspondente;
3. lista do que Yan pode testar;
4. resultado esperado;
5. limitações;
6. eficiência/simplificações;
7. decisão pendente/aprovada.

## 9. Atualização documental obrigatória

Antes do commit:

- [ ] atualizar `docs/handoff/CURRENT_STATE.md`;
- [ ] atualizar `docs/handoff/PHASES.md` se escopo/status mudou;
- [ ] atualizar `PRODUCT_SURFACE.md` se rota/área/aba mudou;
- [ ] atualizar `TECHNICAL_RUNBOOK.md` se comando, env, dado ou fluxo mudou;
- [ ] atualizar `DESIGN_AND_SKILLS.md` se token, componente ou screenshot mudou;
- [ ] atualizar revisão da fase;
- [ ] acrescentar entrada em `log_execução.md` sem apagar histórico;
- [ ] conferir links Markdown.

Não duplicar a mesma decisão em todos os arquivos. Atualize o mapa afetado e faça os outros apontarem para ele.

## 10. Formato de `log_execução.md`

Cada entrada contém:

```text
ID e data
fase/implementação
autorização do usuário
objetivo
estado anterior
ações executadas
arquivos criados/alterados
mutações externas
skills e referências
validações e resultados
screenshots
decisões
limitações/riscos
commit/mensagem
próximo gate
```

Nunca incluir segredo ou dado privado completo.

## 11. Gate Git

Antes de commit:

```powershell
git status --short
git diff --check
git diff --stat
git diff
git diff --cached
```

Confirmar:

- [ ] arquivos staged pertencem ao escopo;
- [ ] nenhum `.env*` secreto;
- [ ] nenhum `node_modules`, `.next`, log ou build;
- [ ] nenhuma chave ou token em texto;
- [ ] screenshots não expõem dado desnecessário;
- [ ] testes relevantes passaram;
- [ ] log foi atualizado;
- [ ] mensagem cita fase/objetivo;
- [ ] commit foi verificado com `git log -1 --oneline`;
- [ ] working tree está limpa ou mudanças restantes foram explicadas.

Push:

- somente para remoto correto já configurado ou aprovado;
- nunca criar/publicar repositório por inferência;
- verificar upstream e resultado;
- não tratar commit local como push remoto.

## 12. Gate de aprovação do usuário

No handoff, informar objetivamente:

- o que foi feito;
- o que Yan pode testar;
- resultado esperado;
- limitações;
- eficiência aplicada;
- comandos e evidências;
- commit criado e se houve push;
- pergunta explícita de aprovação.

Sem aprovação, não iniciar a fase seguinte.
