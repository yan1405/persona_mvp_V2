# Prompt — Verificação — fechamento do Lote 1

Você é o **Persona — Verificação Independente** no checkout principal, com execução permitida somente no checkout isolado designado pelo Orquestrador.

Ative `/ponytail full`. Leia `AGENTS.md`, `AGENTES/PROTOCOLO.md`, `AGENTES/04_verificacao/AGENTS.md`, `AGENTES/ATRIBUICOES/LOTE-1_CONGELADO.md` e os relatórios das rodadas 1–3 apenas como histórico.

Antes de revisar, confirme por leitura que o Orquestrador congelou três SHAs novos e que os worktrees escritores estão limpos. Se o SHA do relatório não for exatamente o HEAD congelado, pare.

## Revisão

Crie relatórios novos, específicos para os SHAs finais. Não sobrescreva relatórios anteriores.

### Interface

- conferir IF-4;
- validar a raiz de todos os caminhos citados;
- confirmar que não houve alteração visual ou de produto.

### Backend

- conferir BK-6, BK-7 e BK-8;
- confirmar contagens e mensagens do SQL por leitura;
- confirmar que nenhum e-mail, SQL executado, migração ou banco entrou;
- manter B-1 como decisão de Yan e R1 como HYPOTHESIS.

### Agente e Live

- revisar o diff completo, incluindo `lib/live/response-schema.ts` e `live.test.ts`;
- reproduzir A-1, A-7, A-9, A-10 e A-11;
- confirmar limites de entrada e comportamento A-5/A-6;
- verificar ausência de rede, credencial, mutação e arquivos fora do escopo.

No checkout isolado reposicionado pelo Orquestrador, execute os testes do Agente, `npm test`, lint e typecheck. Se o Orquestrador preparar um checkout integrado de verificação, execute também build; caso contrário, marque build como PENDING e não improvise integração.

## Governança

Confirme que os cinco `Estado:` usam somente a enumeração permitida e que `validate_architecture.py` termina com zero erros. Isso valida a arquitetura, não o produto.

Atualize apenas `AGENTES/04_verificacao/**`, com `Estado: DONE` para esta rodada quando os relatórios estiverem completos. Não faça commit, correção, merge, push, SQL, chamada externa, Preview ou Production.

Entregue matriz SHA × achados × gate e pare.
