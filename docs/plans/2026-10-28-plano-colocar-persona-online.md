# Plano para colocar o Persona online e validar o agente

Data: 28/10/2026  
Escopo operacional: `persona_mvp_v2` (`apps/web`) e projeto Vercel `persona-mvp-v2`.

## ONDE ESTAMOS

### VERIFIED

- O projeto de aplicação é `yan1405/persona_mvp_V2`; `persona-contexto` é um repositório separado de memória e contexto, não o código executável.
- O Claude Design fornecido abre em `T4.1 — Início`. É uma referência de interface; o próprio protótipo identifica o Agente Persona como “em protótipo”.
- O domínio `https://persona-mvp-v2.vercel.app` responde e a rota pública `/entrar` entrega a tela de autenticação Microsoft.
- O deployment de produção consultado está `READY`, mas usa o commit `06de045` (`docs: record production performance recovery`).
- O checkout `main` contém `45379b8` (`feat(fase-7): usar NVIDIA no Persona Live`) e este plano em `78cb904`; ambos foram publicados na branch remota de Preview `codex/persona-preview-20261028`, sem alterar `origin/main`.
- No checkout, lint, typecheck, build de produção e 32 testes automatizados passaram nesta data.
- O Preview `dpl_EdXaf2aMTzqwkCmbjkYLF88MjE3N` terminou `READY` no commit `78cb904`; o build confirmou `apps/web` como diretório de aplicação.
- No Preview, `/` e `/entrar` responderam 200; `/app/live` redirecionou para a entrada; `/auth/iniciar` respondeu 307 para o fluxo Azure do Supabase. Isso não valida login completo nem callback.
- O scan de erros de runtime da Vercel nas últimas 24h e o log de erros do Preview consultado não mostraram eventos.
- A integração local de Persona Live usa `NVIDIA_API_KEY` e o modelo `z-ai/glm-5.3-flash`; a Vercel não lista `NVIDIA_API_KEY` no inventário consultado.
- A listagem NVIDIA `/v1/models` respondeu 200 e incluiu o modelo configurado. Chamadas POST de inferência, inclusive streaming com raciocínio reduzido, não receberam resposta em 45s/90s e foram encerradas por timeout.
- A Fase 9 tem migração preparada no repositório, mas a documentação do projeto registra que ela ainda não foi aplicada ao Supabase real e que o teste RLS com duas contas está pendente.
- A API do GitHub identifica `MarcBuzatto/persona-contexto` como público, embora seu README diga que não deve ser público. Não copiar ou publicar dados desse cofre como parte do deploy.

### APPROVED

- O pedido atual autoriza preparar a publicação do Persona no domínio Vercel existente e testar o que puder ser comprovado sem dados reais.
- O design T4.1 pode orientar a tela Início; não substitui validação visual da aplicação implementada.

### HYPOTHESIS

- A experiência pública pode estar saudável enquanto fluxos autenticados ou chamadas de IA falham; uma resposta HTTP 200 na página pública não valida a aplicação completa.

### PENDING

- Obter resposta de inferência do modelo NVIDIA e medir latência compatível com a execução da função Vercel.
- Confirmar as variáveis necessárias de Production e Preview sem revelar valores; provisionar chave rotacionada como segredo só após a inferência passar.
- Executar autenticação Microsoft com conta sintética autorizada e percorrer os fluxos críticos contra as dependências reais.
- Confirmar que a URL de callback do Preview está permitida no Supabase e completar OAuth com conta sintética.
- Confirmar a migração Fase 9 e suas políticas RLS em ambiente apropriado.
- Fazer revisão visual da implementação da aplicação contra T4.1 nos tamanhos priorizados.

### BLOCKERS

- A inferência NVIDIA está inconclusiva/indisponível neste teste: o endpoint de catálogo respondeu, mas o chat não respondeu em até 90s. O Preview não possui `NVIDIA_API_KEY` no inventário e o agente não pode ser validado nele.
- O deployment testado é Preview; Production continua no commit `06de045`. Não promover enquanto o agente, OAuth ponta a ponta, persistência e gates RLS não forem validados.
- Migração e teste RLS da Fase 9 são pendências explícitas do projeto. Não aplicar uma migração que inclui operações sensíveis de privacidade sem checkpoint próprio e validação de rollback.
- `persona-contexto` contradiz sua própria instrução de privacidade ao estar publicamente visível. O usuário deve decidir se quer alterar a visibilidade; este plano não altera esse repositório.

## Plano de execução

### 0. Proteger a base

- Preservar as alterações locais preexistentes e não misturá-las ao release sem revisão.
- Não usar dados pessoais reais para testes do agente; usar casos sintéticos.
- Manter todas as chaves fora do Git, logs, screenshots e respostas. Se uma chave já foi compartilhada em texto, rotacioná-la e usar somente o novo valor no cofre de segredos da Vercel.
- Tratar `persona-contexto` somente como fonte documental; não sincronizar seu conteúdo com o app.

### 1. Congelar o candidato

- Revisar o diff do commit `45379b8` e a integração com o provedor, incluindo limites de timeout, erros, resposta vazia e indisponibilidade.
- Adicionar/confirmar testes determinísticos do adaptador NVIDIA com respostas de sucesso e falha; não depender de chamada externa para a suíte normal.
- Executar lint, typecheck, testes e build no candidato final.
- Confirmar que o candidato é baseado no `origin/main` esperado e que os arquivos locais preexistentes não entram no release inadvertidamente.

### 2. Configurar preview

- Confirmar o root directory `apps/web`, comandos de instalação/build, versão Node e vínculo Git da Vercel.
- Provisionar em Preview as variáveis estritamente necessárias, com valores secretos definidos no Dashboard/Vercel e sem imprimi-los.
- Fazer deployment Preview e validar páginas públicas, login, callback, rotas protegidas, logs e comportamento de falha do provedor.
- Usar conta e conteúdo de teste sintéticos; não executar exclusão/exportação em conta real.

### 3. Fechar persistência e privacidade

- Em ambiente de validação, aplicar a migração pendente da Fase 9 somente após revisão de SQL, backup/recuperação e aprovação do checkpoint de banco.
- Validar isolamento RLS entre duas contas de teste, exportação e autorização de ação sensível.
- Confirmar callback Microsoft, URLs permitidas e políticas de sessão para o domínio final.

### 4. Validar interface e jornada

- Comparar as rotas existentes com os contratos do produto e a referência T4.1, sem presumir que o protótipo esteja integrado.
- Testar Diário → revisão → evidência → Persona Live → artefato, verificando que respostas se apoiam em evidências e apontam a origem.
- Validar os seis tamanhos indicados no design (1920×1080, 1536×864, 1440×900, 1366×768, 1280×800, 1024×768), estados relevantes, teclado, zoom e ausência de conteúdo cortado.
- Guardar screenshots e relatório de diferenças como evidência; não registrar dados pessoais nessas capturas.

### 5. Release de produção

- Promover somente o commit que passou os gates de Preview e dados.
- Confirmar variáveis de Production, domínio, TLS, status `READY` e commit efetivamente implantado.
- Fazer smoke test público e autenticado, testar uma chamada sintética do agente e conferir erros/runtime logs.
- Manter identificada a versão anterior como rollback; se login, persistência, isolamento ou IA falharem, reverter e registrar o incidente.

## Definição de pronto

O Persona será considerado operacionalmente publicado quando um deployment de produção do commit aprovado estiver `READY`; o domínio e TLS funcionarem; login Microsoft, persistência, RLS e jornadas críticas forem exercitados com contas sintéticas; o agente responder usando somente fontes autorizadas, com origem rastreável e erro controlado; a UI passar a revisão visual acordada; e houver evidência de smoke test, monitoramento e rollback. Isso não equivale a “100%” de validação de produto ou de uso real.

## Próximo checkpoint

Resolver primeiro a chamada real da NVIDIA e revisar o diff local. Se a chamada continuar indisponível, manter a integração fora de Production e decidir entre corrigir o acesso ao provedor ou usar o provedor já configurado na Vercel até que a NVIDIA seja validada.
