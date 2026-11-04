# Avaliação de `sevzq/screenshot-to-html` para o Persona

> Pesquisa em fontes primárias, verificada em 03/11/2026. Repositório avaliado no commit [`7b5469b`](https://github.com/sevzq/screenshot-to-html/tree/7b5469b2c2c95091f4c2e87f125b19f644f9aff0). Esta nota avalia adequação; não autoriza instalação, integração nem migração.

## Conclusão executiva

**Não usar `screenshot-to-html` como ferramenta de migração dos protótipos aprovados do Claude Design para o produto real.** O projeto é uma skill para um agente produzir uma réplica visual em **um arquivo HTML com CSS e JavaScript inline**, sem framework ou build. Seus dois alvos documentados são HTML vanilla e HTML com Tailwind via CDN, não React, TypeScript, Next.js, Server Components ou componentes existentes ([README, linhas 146–168](https://github.com/sevzq/screenshot-to-html/blob/7b5469b2c2c95091f4c2e87f125b19f644f9aff0/README.md#L146-L168); [SKILL.md, linhas 179–191](https://github.com/sevzq/screenshot-to-html/blob/7b5469b2c2c95091f4c2e87f125b19f644f9aff0/SKILL.md#L179-L191)).

Para o Persona, isso significa que o output não preserva automaticamente:

- Auth Microsoft, sessão Supabase, RLS, Server Actions, RPCs, validações e contratos de dados;
- componentes, tokens e convenções já mantidos em `apps/web`;
- estados reais de carregamento, vazio, erro, sucesso, salvamento e indisponibilidade;
- WCAG 2.2 AA, comportamento de teclado, leitura por tecnologia assistiva e responsividade nas larguras obrigatórias;
- gates de revisão, screenshots reais, aprovação visual, feature flag, rollback, testes e autorização separada de merge/deploy.

**Uso aceitável e limitado:** como técnica de inspeção visual ou protótipo descartável, em diretório temporário e fora do runtime do Persona. O script `shot.mjs` também aceita uma URL, então a parte de captura pode auxiliar comparações visuais do **app Next.js já integrado** em larguras determinadas ([`shot.mjs`, linhas 19–35](https://github.com/sevzq/screenshot-to-html/blob/7b5469b2c2c95091f4c2e87f125b19f644f9aff0/scripts/shot.mjs#L19-L35)). Ainda assim, o projeto não calcula uma métrica de diferença nem aprova a tela: a comparação é um ciclo conduzido pelo agente/pessoa, descrito como inspeção por regiões e correção manual ([SKILL.md, linhas 105–116](https://github.com/sevzq/screenshot-to-html/blob/7b5469b2c2c95091f4c2e87f125b19f644f9aff0/SKILL.md#L105-L116)).

## O que o projeto realmente entrega

O repositório contém uma skill de instruções, dois scripts utilitários e exemplos. O fluxo orienta o agente a inferir tokens e estrutura, escrever um HTML semântico, renderizar no Chrome, comparar visualmente e iterar. O output padrão é `index.html` ou `replica.html`; arquivos temporários ficam em `tmp/screenshot-to-html/` ([SKILL.md, linhas 193–203](https://github.com/sevzq/screenshot-to-html/blob/7b5469b2c2c95091f4c2e87f125b19f644f9aff0/SKILL.md#L193-L203)).

As dependências declaradas são apenas `playwright-core` e `sharp`: Playwright controla Chrome/Chromium para captura e `sharp` recorta regiões da imagem ([`package.json`, linhas 24–31](https://github.com/sevzq/screenshot-to-html/blob/7b5469b2c2c95091f4c2e87f125b19f644f9aff0/package.json#L24-L31)). Não há parser do Claude Design, gerador de AST React, adaptador Next.js, análise de componentes do projeto, integração com Supabase ou mecanismo de preservação de backend.

O próprio guia reconhece o limite fundamental: uma screenshot é um quadro congelado, não mostra hover, foco ou o que é clicável; o agente deve inferir apenas comportamentos óbvios e não inventar fluxos ([SKILL.md, linhas 120–133](https://github.com/sevzq/screenshot-to-html/blob/7b5469b2c2c95091f4c2e87f125b19f644f9aff0/SKILL.md#L120-L133)). Portanto, screenshots isoladas não carregam os contratos funcionais necessários para reconstruir o Persona.

## Adequação aos requisitos do Persona

| Critério | Evidência do projeto | Avaliação para o Persona |
|---|---|---|
| Fidelidade visual | Loop de renderização, screenshot e comparação por regiões; uso de tokens, flex e grid em vez de posicionamento absoluto ([README, linhas 148–154](https://github.com/sevzq/screenshot-to-html/blob/7b5469b2c2c95091f4c2e87f125b19f644f9aff0/README.md#L148-L154)). | **Útil como referência**, não como prova. Pode acelerar a leitura de composição, espaçamento e hierarquia de uma tela aprovada. |
| Output React/Next.js | O output documentado é um único HTML, vanilla ou Tailwind CDN ([SKILL.md, linhas 179–191](https://github.com/sevzq/screenshot-to-html/blob/7b5469b2c2c95091f4c2e87f125b19f644f9aff0/SKILL.md#L179-L191)). | **Inadequado.** Exigiria reescrita manual para TSX, Server/Client Components e estrutura do App Router; importar o HTML criaria uma implementação paralela. |
| Preservação do backend | Não há conhecimento de rotas, schema, sessão, RLS, Server Actions ou RPCs; as dependências confirmam o escopo de render/crop ([`package.json`](https://github.com/sevzq/screenshot-to-html/blob/7b5469b2c2c95091f4c2e87f125b19f644f9aff0/package.json)). | **Não preserva.** O backend existente deve continuar sendo a fonte de verdade e ser conectado manualmente aos componentes de produção. |
| Reuso de componentes e tokens | A skill cria tokens locais em `:root`, CSS inline e JS mínimo no próprio arquivo ([SKILL.md, linhas 90–102](https://github.com/sevzq/screenshot-to-html/blob/7b5469b2c2c95091f4c2e87f125b19f644f9aff0/SKILL.md#L90-L102)). | **Conflitante.** Não consulta nem reutiliza automaticamente os componentes, Carbon Icons, Geist, `globals.css` ou `design-dna.json` do Persona. |
| Acessibilidade | O guia pede HTML semântico, `alt`, foco visível, contraste “decente” e `prefers-reduced-motion` ([SKILL.md, linhas 120–134](https://github.com/sevzq/screenshot-to-html/blob/7b5469b2c2c95091f4c2e87f125b19f644f9aff0/SKILL.md#L120-L134)). | **Insuficiente para WCAG 2.2 AA.** São orientações, não uma auditoria normativa nem teste assistivo. |
| Verificação de interatividade | `--verify` procura elementos interativos, `cursor:pointer`, elementos “clicáveis” por nome/classe e a existência global de regras `:hover`/`:focus` ([`shot.mjs`, linhas 128–205](https://github.com/sevzq/screenshot-to-html/blob/7b5469b2c2c95091f4c2e87f125b19f644f9aff0/scripts/shot.mjs#L128-L205)). | **Heurística rasa.** Não verifica nome acessível, relação label/input, contraste, ordem de tabulação, teclado por controle, ARIA válida, leitor de tela ou comportamento funcional completo. |
| Gate de CI | O README afirma que `--verify` “fails the build on dead controls” ([README, linha 151](https://github.com/sevzq/screenshot-to-html/blob/7b5469b2c2c95091f4c2e87f125b19f644f9aff0/README.md#L151)). O código, porém, imprime `WARN` e sempre encerra esse modo com `process.exit(0)` ([`shot.mjs`, linhas 184–207](https://github.com/sevzq/screenshot-to-html/blob/7b5469b2c2c95091f4c2e87f125b19f644f9aff0/scripts/shot.mjs#L184-L207)). | **Não é gate bloqueante.** Um CI passaria mesmo com achados. A afirmação do README não corresponde ao comportamento atual do código. |
| Responsividade | O guia recomenda layout fluido e apenas uma segunda renderização de sanidade, exemplificada em 390 px ([SKILL.md, linhas 143–145](https://github.com/sevzq/screenshot-to-html/blob/7b5469b2c2c95091f4c2e87f125b19f644f9aff0/SKILL.md#L143-L145)). | **Ajuda, mas não comprova.** Não substitui validação real do Persona em 1024, 1280, 1440 e 1920 px nem estados com conteúdo variável. |
| Assets | A estratégia pode recortar a screenshot ou buscar logo oficial, Unsplash, Picsum e placeholder; Tailwind, Google Fonts e Font Awesome podem vir por CDN ([SKILL.md, linhas 179–191](https://github.com/sevzq/screenshot-to-html/blob/7b5469b2c2c95091f4c2e87f125b19f644f9aff0/SKILL.md#L179-L191)). | **Risco de divergência e proveniência.** Em eventual teste, limitar a assets já aprovados do Persona; não aceitar substitutos automáticos nem dependências CDN no produto. |
| Gates e aprovação | O repositório verifica somente sua réplica e não conhece o processo decisório do Persona. | **Não preserva.** A aprovação visual do Claude Design continua sendo especificação; cada integração ainda exige os gates operacionais vigentes. |

## Licença e proveniência

O código é MIT e permite uso, modificação e distribuição, desde que o aviso de copyright e a permissão sejam mantidos em cópias ou porções substanciais; é fornecido sem garantia ([LICENSE, linhas 1–21](https://github.com/sevzq/screenshot-to-html/blob/7b5469b2c2c95091f4c2e87f125b19f644f9aff0/LICENSE#L1-L21)). Isso cobre o código do repositório, não concede direitos sobre interfaces e imagens de terceiros. O próprio README avisa que as screenshots dos exemplos pertencem aos respectivos proprietários ([README, linhas 242–244](https://github.com/sevzq/screenshot-to-html/blob/7b5469b2c2c95091f4c2e87f125b19f644f9aff0/README.md#L242-L244)).

Consequência para o Persona: não copiar exemplos, marcas ou assets do repositório. Se a técnica for testada, usar somente capturas e assets do Claude Design/Persona cuja reutilização esteja aprovada e rastreável.

## Estado e atividade no GitHub

Consulta à API oficial do GitHub em 03/11/2026:

- repositório público, não arquivado nem desabilitado, branch padrão `main`, licença detectada MIT;
- criado em 14/06/2026; todos os 10 commits existentes ocorreram no mesmo dia; o último é `7b5469b`, de 14/06/2026;
- duas releases (`v1.0.0` e `v1.1.0`), ambas publicadas em 14/06/2026;
- 16 estrelas, 6 forks e nenhum issue/PR aberto no momento da consulta.

Fontes: [metadados oficiais do repositório](https://api.github.com/repos/sevzq/screenshot-to-html), [histórico oficial de commits](https://api.github.com/repos/sevzq/screenshot-to-html/commits?per_page=100), [releases oficiais](https://api.github.com/repos/sevzq/screenshot-to-html/releases?per_page=100) e [issues/PRs oficiais](https://api.github.com/repos/sevzq/screenshot-to-html/issues?state=all&per_page=100).

**Leitura:** o projeto é pequeno e válido como experimento, mas não há histórico suficiente para tratá-lo como ferramenta madura de migração. A ausência de issues não prova estabilidade; com dez commits concentrados no dia de lançamento e sem atividade de código posterior observada, a manutenção futura é incerta.

## Recomendação operacional mínima

1. **Não instalar no `apps/web`, não adicionar dependência e não incorporar `output.html` ao produto.** Isso evita duplicar UI, JavaScript e tokens fora da arquitetura Next.js existente.
2. Se houver interesse em experimentar, usar uma cópia efêmera fixada no commit `7b5469b`, somente com dados sintéticos e uma tela já aprovada.
3. Aproveitar apenas o método: inventário visual, tokens, comparação lado a lado e capturas em múltiplas larguras. Implementar a tela diretamente nos componentes e contratos existentes do Persona.
4. Para validação, manter os gates do projeto: comportamento real, Auth/Supabase/RLS, testes, WCAG 2.2 AA, teclado/foco, larguras 1024/1280/1440/1920, screenshots do app, revisão visual e aprovação explícita antes de avançar.
5. Tratar qualquer HTML gerado como artefato descartável de referência. Nenhuma aprovação desse HTML transfere aprovação para integração, merge ou deploy.

## Veredito

| Decisão | Resultado |
|---|---|
| Adotar como migrador Claude Design → Persona Next.js | **Não** |
| Incorporar output ao produto | **Não** |
| Instalar como dependência/runtime do Persona | **Não** |
| Usar como inspiração de processo visual | **Sim, opcional e isolado** |
| Usar `shot.mjs --url` como auxiliar de captura | **Possível, mas redundante com Playwright e sem valor de gate por si só** |
| Autorizar integração, merge ou deploy | **Não; permanece sujeito aos gates existentes** |
