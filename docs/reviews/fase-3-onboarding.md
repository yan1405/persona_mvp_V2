# Revisão da Fase 3 — Onboarding funcional

> Status: aguardando avaliação de Yan  
> Data: 2026-08-10

## Escopo entregue

- `/onboarding` com quatro etapas sequenciais: contexto, privacidade, rotina e primeiro registro;
- validação imediata no navegador e repetida na Server Action;
- persistência transacional do perfil e primeiro Daily Log no Supabase;
- tabelas `profiles` e `daily_logs` com RLS por `auth.uid()`;
- `/app/inicio` com o texto original, objetivo atual e Narrative Score em estado de dados insuficientes;
- redirecionamento de onboarding já concluído para `/app/inicio`;
- padrão de checkpoint de teste e eficiência incorporado ao protocolo de todas as fases.

## Avaliação visual

- rotas avaliadas: `/onboarding` e `/app/inicio`;
- viewport executável capturado: 1280 × 720;
- estados exercitados: vazio, preenchido, foco, consentimento obrigatório, lembrete ativado, envio, sucesso e retomada após conclusão;
- referências: `design-dna.json`, `BRAND_FOUNDATION.md`, `DESIGN_DNA_ADAPTATION.md`, contrato da Fase 3 e skills visuais obrigatórias;
- screenshots:
  - `docs/reviews/fase-3-onboarding/etapa-1-contexto.png`;
  - `docs/reviews/fase-3-onboarding/etapa-4-daily-log.png`;
  - `docs/reviews/fase-3-onboarding/inicio-primeiro-registro.png`.

### Aderências

- logo oficial e paleta original do Persona;
- Geist Sans e Geist Mono nos papéis aprovados;
- composição editorial lateral, sem cards repetidos ou hero promocional;
- uma única ação primária por etapa;
- bordas e contraste de superfície no lugar de sombras decorativas;
- foco visível, labels persistentes, HTML nativo e anúncio de erro;
- Daily Log preservado como texto de autoria do usuário, sem conteúdo gerado por IA;
- score não inventado.

### Divergências e limitações conhecidas

- a sessão automatizada permitiu captura real em 1280px; 1024, 1440 e 1920px permanecem no checklist manual de Yan desta avaliação;
- o lembrete e seu horário são persistidos, mas nenhuma notificação é enviada nesta fase;
- não há estruturação de evidências, cálculo de score ou chamada à Groq nesta fase;
- o registro usado na validação permanece como primeiro Daily Log da conta de teste de Yan.

## Autocrítica `design-sem-cara-de-ia`

1. **Wizard em card central:** removido; o fluxo usa grade editorial e divisores.
2. **Progresso em pílulas coloridas:** removido; o progresso é textual, numerado e discreto.
3. **Copy motivacional vaga:** removida; perguntas e ações descrevem exatamente a tarefa.

O script `auditar_tells_ia.py` marcou o token oficial `#7C3AED` como candidato por reconhecer a palavra índigo e duas páginas legais preexistentes com largura de leitura centralizada. O primeiro é a paleta aprovada do Persona; os outros dois não pertencem ao novo fluxo e são uma escolha adequada para documentos longos. Nenhum gradiente foi implementado.

## Validações técnicas executadas

```text
npm.cmd run lint       → aprovado
npm.cmd run typecheck  → aprovado
npm.cmd test           → 4/4 testes aprovados
npm.cmd run build      → aprovado
auditar_tells_ia.py    → executado e revisado manualmente
fluxo no navegador     → Microsoft → onboarding → Supabase → /app/inicio
```

## Checkpoint para Yan

### O que testar

1. Abrir `http://localhost:3100` e entrar com a Microsoft.
2. Confirmar que uma conta com onboarding concluído vai direto para `/app/inicio`.
3. Conferir o primeiro Daily Log salvo, o objetivo e o estado `Dados insuficientes`.
4. Redimensionar a janela para aproximadamente 1024, 1440 e 1920px e verificar leitura, alinhamento e ausência de cortes.
5. Navegar por `Tab` e confirmar foco visível nos controles.

### Resultado esperado

- nenhum dado de outro usuário aparece;
- o texto original permanece sem alteração ou estruturação automática;
- o score não recebe número;
- logo, Geist e paleta roxa do Persona permanecem consistentes;
- o layout continua legível nas larguras avaliadas.

### Eficiência aplicada

- uma rota e um formulário substituem quatro páginas e estados intermediários;
- HTML nativo e validação local evitam dependências novas;
- uma função transacional impede perfil salvo sem Daily Log;
- o primeiro log usa uma chave idempotente, permitindo repetição sem duplicá-lo;
- componentes e tokens existentes foram reaproveitados;
- a Groq não foi configurada antes de existir uso real.

## Decisão

Fase 3 implementada e validada tecnicamente. Decisão de Yan: **pendente**.
