# Revisão da Fase 5 — Biblioteca de Evidências

> Data: 11/08/2026
> Estado: aprovada por Yan em 11/08/2026
> Contrato: `docs/plans/2026-08-11-fase-5-biblioteca-evidencias-design.md`

## Entregue

- `/app/evidencias` com lista densa, busca e filtros por competência, nível, estado e período;
- filtros salvos `Todas` e `Para revisar`;
- registro manual de evidência;
- `/app/evidencias/[id]` com Resumo, Provas e Uso;
- edição da estrutura confirmada;
- arquivamento recuperável e restauração;
- provas por links HTTP/HTTPS;
- níveis derivados: Registrada sem link e Documentada com link;
- evidências confirmadas no Diário aparecem automaticamente;
- navegação principal de Evidências habilitada.

Arquivos, upload, Supabase Storage, exclusão definitiva, ações em lote, Validada e Certificada permanecem fora do escopo aprovado.

## Banco e segurança

A migração `supabase/migrations/20260811120000_phase_5_evidence_library.sql` foi aplicada no projeto `persona-mvp-v2`.

- `evidences.source_log_id` aceita `null` para registro manual;
- inserts manuais exigem usuário autenticado, estado confirmado e ausência de origem/sugestão;
- updates exigem proprietário e referências do mesmo usuário;
- `evidence_sources` aceita somente links, possui URL única por evidência e exclusão em cascata;
- RLS cobre select, insert, update e delete por proprietário;
- nenhuma chave, cookie, token, e-mail ou relato privado foi registrado.

Um ensaio transacional confirmou insert próprio, leitura própria e isolamento para outra identidade. A transação terminou com `phase5_rls_passed_and_rolled_back`.

## Fluxo autenticado validado

1. registrar evidência manual pela interface;
2. abrir detalhe como Registrada;
3. editar e salvar a estrutura;
4. adicionar link e observar o nível Documentada;
5. arquivar com preservação de estrutura e provas;
6. restaurar a evidência;
7. remover por SQL somente os dois registros sintéticos e seus dois links;
8. verificar `remaining_sources = 0` e `remaining_evidences = 0`.

Os dados reais existentes não foram alterados.

## Validação técnica

```text
npm.cmd run lint       aprovado
npm.cmd run typecheck  aprovado
npm.cmd test           15/15 aprovados
npm.cmd run build      aprovado
```

O primeiro build no sandbox falhou somente porque `next/font` não alcançou Google Fonts. Reexecutado com acesso de rede autorizado, compilou e gerou as rotas `/app/evidencias` e `/app/evidencias/[id]`.

## Validação visual

Capturas com dados exclusivamente sintéticos:

- `fase-5-biblioteca-evidencias/biblioteca-1024.png`;
- `fase-5-biblioteca-evidencias/biblioteca-1280.png`;
- `fase-5-biblioteca-evidencias/biblioteca-1440.png`;
- `fase-5-biblioteca-evidencias/biblioteca-1920.png`;
- `fase-5-biblioteca-evidencias/detalhe-provas-1440.png`.

O QA encontrou overflow dos filtros em largura intermediária. A correção trocou a distribuição flexível por uma malha de 12 colunas, duas colunas abaixo de 1100px e uma coluna abaixo de 820px. A matriz final registrou `scrollWidth = innerWidth` nas quatro larguras.

## Auditorias obrigatórias

### `design-sem-cara-de-ia`

- lista editorial densa em vez de grid de cards genéricos;
- uma ação primária clara e roxo reservado a ação, foco e rastreabilidade;
- sem gradiente, glassmorphism, sombra ornamental, emoji ou copy promocional vazia;
- níveis comunicados por texto e borda, não somente por cor;
- Carbon preservado como família única de ícones.

Três sinais deliberadamente removidos ou evitados: cards repetidos, pills excessivas e métricas/selos inventados.

### Ponytail `full`

- nenhuma dependência adicionada;
- nível derivado da contagem de links, sem coluna duplicada;
- filtros locais limitados aos 100 registros do MVP, com comentário explícito para paginação futura;
- runner nativo do Node preservado;
- Storage, upload e abstrações preventivas não foram introduzidos.

## Checklist para Yan

1. abrir **Evidências** no trilho lateral;
2. testar busca e combinação de filtros;
3. registrar uma evidência manual;
4. editar Resumo e salvar;
5. adicionar/remover um link em Provas;
6. confirmar a mudança Registrada → Documentada;
7. abrir Uso e conferir a comunicação das fases futuras;
8. arquivar e restaurar pelo filtro Arquivadas;
9. avaliar hierarquia, densidade, clareza e rastreabilidade.

## Gate concluído

Yan informou que validou a Biblioteca e autorizou explicitamente o avanço para a Fase 6 em 11/08/2026. Ajustes futuros da Biblioteca devem ser registrados como correções separadas.
