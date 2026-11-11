# Lote 9 — casca em uso e telas de entrada sobre o Design System

Fonte visual única: `docs/redesign/design-system/`. Componentes em `apps/web/components/ds/`, estilos em `apps/web/app/ds.css`. Telas sem mock no DS foram derivadas dos componentes (decisão de Yan, 10/11/2026); se ele desenhar alguma no Claude Design, o desenho prevalece.

## O que mudou

| Item | Onde | O que é |
|---|---|---|
| C-1 | `components/ds/**`, `app/ds.css`, `eslint.config.mjs` | correções do Lote 8 (ver `DS_LOTE8.md`, seção "Correções do Lote 9") |
| C-2 | `app/app/layout.tsx` | `AppShell` do DS: 5 destinos + Configurações no rodapé, destino ativo pela rota, "Registrar agora" para `/app/diario`, busca "Buscar ou perguntar" enviando para `/app/evidencias?q=`; sem Agente. Removidos `components/shell/app-shell.tsx` e `app/app/app-navigation.tsx` |
| C-3 | `app/entrar/page.tsx`, `app/auth/qa-entrar/**` | `/entrar` com `Logo`, `FocalCard`, `Card`, um botão brand; QA igual ao padrão, só com o gate ligado; login de QA vai a `/onboarding` com origem do `Host` |
| C-4 | `app/onboarding/**`, `components/ds/{textarea,step-flow}.tsx`, `app/dev/ds/onboarding/page.tsx` | `StepFlow` + `Input` + `Textarea` + `Chip` + `Switch` + `Card` |
| C-5 | `app/auth/erro/page.tsx` | mensagens calmas, um botão brand |
| C-6 | `app/termos/page.tsx`, `app/privacidade/page.tsx` | leitura em `Card`; conteúdo igual ao anterior (documentos em preparação), sem índice porque há uma seção só |

## Componentes e ajustes novos no DS (derivados, não vieram do DS)

- `Textarea` (`textarea.tsx`): o DS não traz campo de várias linhas; usa a caixa, o rótulo, a dica e o erro do `Input`.
- `ButtonLink native`: âncora comum, sem o `Link` do Next. Usado em `/auth/iniciar` (rota de servidor que inicia o OAuth): evita que o prefetch dispare o início do login.
- `StepFlow`: `headingLevel` (1, 2 ou 3) e foco no título a cada troca de etapa.
- `AppShell`: destino ativo pela rota (`hrefs`), `contentAs` (`div` enquanto as telas internas trazem o próprio `<main>`) e link "Ir para o conteúdo".
- Classes de página `dx-page*`, `dx-signin*`, `dx-ob*`, `dx-status*`, `dx-reading` em `app/ds.css` (só tokens).

## Decisões de texto

- Títulos ganharam ponto final: "Entre no Persona.", "Conte onde você está agora.", "Escolha um horário para registrar.", "Conte o que aconteceu na prática." (eram perguntas), "Termos da fase de testes.", "Privacidade.".
- `/auth/erro`: as quatro mensagens perderam o jargão ("Supabase", "provedor Azure") e passaram a dizer o que aconteceu sem culpar e o próximo passo.
- `/entrar`: some o bloco de demonstração "trajetória / exemplo" e o rótulo "Acesso antecipado" (não estão no pedido nem no DS); ficam a promessa, as três linhas de confiança, o botão e os links.

## Desencontros conhecidos (telas internas ainda são legado; Lotes 10 a 12)

- As telas de `/app/**` continuam com `.app-page`, `.ds-surface`, Carbon e CSS de `globals.css`: dentro do shell novo elas mantêm largura, espaçamento e títulos antigos (cada uma traz o próprio `<main>` e `<h1>`; o cabeçalho do shell não tem título para não duplicar).
- O CSS do shell antigo (`.app-shell`, `.app-sidebar`, `.nav-item`, `.skip-link`...) em `globals.css` ficou sem uso; não toquei em `globals.css` (fora da escrita). Sai no fim da reconstrução.
- A busca do cabeçalho ("Buscar ou perguntar") hoje só pesquisa Evidências; não há "perguntar" porque o Agente Persona não existe.
- `/app/diagnostico` e `/app/score` não estão no menu (o DS tem cinco destinos); seguem acessíveis por link direto.
- Sem Supabase local não há sessão: a casca em `/app` e o `/onboarding` reais não foram capturados; o onboarding foi exercitado em `/dev/ds/onboarding` (mesmo componente, dados fictícios, 404 em produção) e a casca na galeria `/dev/ds`.
- O envio real do onboarding (ação que grava no banco) não foi exercitado: sem banco, sem chave.
- Teste novo fora do script `test` do `package.json` (fora da escrita): `app/auth/qa-entrar/origin.test.ts`.
