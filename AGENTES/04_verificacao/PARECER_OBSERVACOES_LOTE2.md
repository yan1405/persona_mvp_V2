# Parecer sobre as observações — Lote 2

- Autor: Persona — Verificação Independente. Data: 08/11/2026.
- Base: relatórios `RELATORIO_backend_4b4650d.md`, `RELATORIO_agente-nvidia_cba617a.md`, `RELATORIO_interface_e6b3e5c.md` e `RELATORIO_interface_d71f2a7.md`. Cada relatório vale só para o seu SHA; este parecer é opinião de priorização e **não aprova nada**.
- Classes: **(A)** corrigir antes da integração local · **(B)** integrar e registrar como ressalva · **(C)** só observação. Esforço: **P** (≲ 1 h, poucas linhas), **M** (algumas horas, vários arquivos ou um roteiro), **G** (exige harness novo ou decisão de desenho).
- "Medido" = reproduzido por mim com comando, mutação ou CSS real. "HYPOTHESIS" = depende de banco, tela autenticada ou método de aplicação que eu não executei.

## 1. Tabela

| Item | Sev. | Classe | Esforço | Medido ou HYPOTHESIS | Justificativa |
|---|---|:-:|:-:|---|---|
| **BK2-1** `begin`/`commit` na migração B-1 | S3 | **A** | P | HYPOTHESIS (o efeito com `supabase db push` não foi executado; a contagem 0/7 migrações é medida) | Retirar duas linhas custa quase nada **antes** de a migração ser aplicada e registrada; depois de aplicada, editar o arquivo vira problema de histórico. O `DO` abortante continua desfazendo tudo dentro da transação do CLI. Se o método for o SQL Editor, manter também funciona (HYPOTHESIS), então a correção não piora esse caminho. |
| **BK2-2** textos e roteiro de QA ainda dizem "1b não aborta" | S3 | **A** (roteiros operacionais) / B (HANDOFFs históricos) | M | Medido (`git grep` + leitura) | Quem seguir `LOTE-1_BACKEND_DECISOES.md` §2 ou "Como rodar" de `RELATORIO_TESTE_RLS.md` leva `FALHOU B-1` e não chega ao passo 8 (R1). Falha fechada, mas o roteiro engana a pessoa que vai operar o QA. Os `HANDOFF_LOTE1` são histórico e podem ficar com nota de topo. |
| **BK2-3** `STATUS.md` do Backend mistura Lotes; SHA não literal | S3 | B | P | Medido | Sem efeito de segurança ou de execução; vai de carona se houver nova rodada do Backend por BK2-1/BK2-2. |
| **BK2-4** B-1 antes de R1 | S4 | C | P | Leitura | Acoplamento documentado e falha fechada; serve só ao planejamento do QA. |
| **AG2-1** timeout/`signal` não fixados | S3 | **A** | P | **Medido** (mutações `sem_signal` e `timeout_30` sobrevivem 10/10) | Uma asserção em `init.signal` fecha. O código **atual** tem o `signal` de 15 s (lido), então não é defeito presente; é uma regressão sem rede de segurança, e o pior caso de ≈ 30 s da comparação Groq × NVIDIA depende dele. |
| **AG2-2** action não testada, só `describeLiveFailure` | S3 | B | G | Medido (leitura; sem teste executável) | Exige Next + Supabase simulados, desproporcional ao lote. A equivalência foi conferida por leitura; fica como ressalva e como item do QA de aceite com chamada real (gate de Yan). |
| **AG2-3** `nvidia-chat.ts` sem `server-only` | S3 | B | P | Medido (leitura) | A guarda existe na casca que o produto importa; a chave não é `NEXT_PUBLIC_`, então não há vazamento. Comentário no topo ou `no-restricted-imports` resolve; não bloqueia. |
| **AG2-4** `STATUS` sem o contexto do parser | S4 | C | P | Leitura | Só alerta o Orquestrador a não ler `WAITING_APPROVAL` como "S2 do parser resolvido" (A-1/A-7/L-1 seguem abertos fora deste SHA). |
| **IF2-2** barra estoura o cartão em janelas baixas | S3 | B | P | Medido (800 × 400 px: 411 × 368; re-medido em `d71f2a7`) | `overflow-y: auto` em `.app-sidebar-nav`. Conteúdo fica alcançável pela rolagem da página; afeta janelas < ≈ 445 px de altura. |
| **IF2-3** `<main>` ausente em Configurações; frase do doc falsa | S3 | B | P | Medido (`git grep`; 12 páginas têm, as de Configurações não) | Corrigir a **frase** é grátis; adicionar `<main>` toca telas de outra fatia, então fica como ressalva para a próxima fatia da Interface. |
| **IF2-5** transição de largura, `aria-controls`, "Registrar agora" = "Diário" | S4 | C | P | Medido | Cosmético ou decisão de produto; nenhum bloqueia. |

Fora da lista pedida mas relevante: **IF3-1** (S3, janela rola na horizontal de 1024 a ≈ 1233 px; medido com o CSS real, tela real HYPOTHESIS) e **IF3-2** (S4). Classifico IF3-1 como **B** (esforço P a M, dono Interface): aceitar por escrito ou usar trilho até 1280 px; ver `RELATORIO_interface_d71f2a7.md`.

## 2. Riscos reais para um Preview seguro

1. **Chave NVIDIA ausente** — sem `NVIDIA_API_KEY` o Live não funciona no Preview. É conferência de configuração e gate de Yan; não é defeito de código. Verificado por leitura: o código novo só existe no `main` local (`acc1f44`+), não em `origin/main` (`06de045`).
2. **Ordem e método de aplicação de B-1 (BK2-1)** — o risco mais concreto. Com `supabase db push`, o `commit` interno pode encerrar a transação do CLI antes de registrar a migração (HYPOTHESIS, não executado). Resultado possível: revokes aplicados mas migração não registrada, o que reaplica depois; ou aviso e estado ambíguo. Decidir o método **antes** do gate de aplicação e testar em QA descartável.
3. **Roteiro de QA enganoso (BK2-2)** — falha fechada, mas atrasa e pode levar a "FALHOU B-1" lido como regressão.
4. **Timeout não fixado (AG2-1)** — sem asserção, uma edição que remova o `signal` passa nos testes e uma chamada lenta pode ocupar a função até o limite da Vercel. HYPOTHESIS para o efeito em runtime; medido apenas que o teste não detecta.
5. **Casca nova (IF3-1)** — a janela rola na horizontal em 1024–1233 px. Conteúdo alcançável, mas 1024 px é largura de aceite. Real em CSS; tela real PENDING.
6. **Parser compartilhado (G5)** — A-1/A-7/L-1 seguem abertos no parser em uso, inclusive o da Groq em Production. Fora destes SHAs.

## 3. Algum item muda o gate?

**Não.** O gate de **Backend** e o de **Agente NVIDIA** continuam **liberar com ressalvas** para integração **local** de código e documentação. Os itens classe A (BK2-1, BK2-2, AG2-1) são **condições dessas ressalvas**, não bloqueios novos: nenhum deles é S1/S2, nenhum se manifesta enquanto a migração não for aplicada e o Live não for chamado de verdade, e ambos os gates já declaram que **não aprovam** aplicar a migração, Preview, Production nem chamada real. O que o parecer muda é a **ordem**: BK2-1 e BK2-2 devem ser resolvidos **antes do gate de aplicação de B-1** (e, por serem baratos, de preferência na mesma nova atribuição que fecha BK2-3). Interface: `d71f2a7` fica em **liberar com ressalvas** (sem S1/S2 aberto); o aceite visual é de Yan.

Se o Orquestrador quiser integrar sem novos SHAs: aceitável para o código local, desde que BK2-1/BK2-2/AG2-1 entrem como pendências escritas no handoff e nenhuma aplicação de migração ou chamada real ocorra antes de resolvê-las.

## 4. Não verificado

Telas reais autenticadas; SQL, banco e comportamento de `supabase db push`; chamadas reais NVIDIA/Groq; latência contra o limite da função; equivalência das fontes com o Google Fonts; aceite visual (de Yan). Esforços P/M/G são estimativas minhas, não medidas.

## 5. Decisões que continuam sendo suas

Orquestrador: aceitar ou reatribuir BK2-1/BK2-2/AG2-1 (uma rodada curta dos escritores), IF3-1. Yan: método de aplicação de B-1, gates de QA isolado, chave NVIDIA e chamada de aceite, ADR Groq→NVIDIA, aceite visual.
