# Fase 10 — Hardening e entrega

> Estado: **rascunho para aprovação de Yan**. Nada aqui está implementado nem autorizado.
> Pré-condição: Fase 9 aprovada (migração aplicada, teste RLS com dois usuários e Sessão de Avaliação Visual concluídos).

## 1. Objetivo e critério de sucesso

Preparar o MVP existente (Fases 1–9) para a banca do Empreenda Senac e para testes controlados, sem adicionar funcionalidade de produto nova. Hardening, consistência e uma narrativa de demonstração segura — não um recurso a mais.

A fase está correta quando:

1. o ciclo principal completo (Microsoft → onboarding → Diário → sugestão → evidência → Início/Score → Live → Artefatos → Configurações) roda do início ao fim sem intervenção manual em banco;
2. RLS foi revisada em todas as tabelas privadas das Fases 3–9, com teste de dois usuários repetido;
3. dependências e segredos foram auditados sem nenhum valor sensível exposto;
4. existe um conjunto de dados de demonstração explicitamente fictício ou autorizado, isolado da conta pessoal de Yan;
5. screenshots finais em 1024/1280/1440/1920px cobrem o ciclo principal;
6. Yan aprovou explicitamente escopo público, dados de demonstração, custo e narrativa da banca antes de qualquer deploy final.

## 2. Decisões que só Yan pode tomar (bloqueiam o início real da fase)

Não vou inferir nenhuma destas. Preciso da resposta antes de aprofundar o plano:

1. **Data-limite da banca/entrega.** Não encontrei uma data registrada em `docs/PRODUCT_BRIEF.md` nem nos planos anteriores. Sem ela não dá para calibrar o que é essencial versus o que é polimento.
2. **Modo Automático:** confirmar que continua fora do MVP (é o que `PHASES.md` já registra) ou que vale um protótipo isolado — o que exigiria um contrato de consentimento e privacidade próprio antes de qualquer código.
3. **Dados de demonstração:** usar a conta real de Yan com dados já existentes (Fases 1–9), criar uma conta de demonstração separada com dados fictícios, ou as duas — uma para a banca testar ao vivo e outra só para screenshots.
4. **Deploy final:** manter o projeto Vercel/Supabase atual (`persona-mvp-v2`) como o ambiente da banca, ou criar um ambiente isolado de apresentação. Qualquer recurso pago novo precisa de aprovação de custo explícita antes de existir.
5. **Uso do Strix:** só é permitido em alvo autorizado, efêmero/staging, com regras de engajamento aprovadas por Yan antes da execução (`AGENTS.md` §5). Preciso saber se há orçamento/tempo para isso nesta fase ou se o hardening fica só com revisão manual.

## 3. Abordagens avaliadas para o hardening de segurança

### Só revisão manual (checklist)

Menor custo e mais rápida, mas depende inteiramente de não esquecer nada; sem ferramenta que force cobertura sistemática de RLS/dependências.

### Strix completo em todas as rotas

Cobertura ampla, mas exige Docker, um provedor de LLM externo recebendo estrutura do código, orçamento e tempo — desproporcional para um MVP que ainda não processa dados de terceiros nem pagamento.

### Checklist manual dirigido por risco + Strix pontual (recomendada)

Checklist cobre 100% das tabelas/RLS e das rotas autenticadas manualmente (é o que as Fases 4–9 já fizeram fase a fase); Strix entra só nas superfícies de maior risco novo desta fase — exclusão de conta, exportação de dados e as Route Handlers de autenticação — em ambiente staging isolado, com dados de teste, após autorização explícita de escopo e regras de engajamento. Reproduz o padrão já usado no projeto sem herdar o custo de uma varredura total.

## 4. Abordagens avaliadas para dados de demonstração

### Reaproveitar só a conta real de Yan

Não exige nenhum trabalho novo, mas mistura dado de uso real do fundador com material de demonstração pública — arriscado se a banca ou gravações forem compartilhadas externamente.

### Seed determinístico completo (script) para uma conta de demonstração

Cobre o ciclo inteiro com dados sempre consistentes e reproduzíveis, mas é mais trabalho de implementação e ainda depende de alguém logar de fato com uma conta Microsoft de teste — o produto não tem cadastro local.

### Conta de demonstração populada manualmente pelo fluxo real (recomendada)

Usa uma conta Microsoft descartável (a mesma linha já usada nas Fases 7–9 para QA) e povoa Diário, evidências, Score, Live e Artefatos pelo fluxo real da aplicação — sem SQL manual, sem dado inventado por script. Mais lento que um seed automático, mas gera evidência de que o ciclo funciona de ponta a ponta com dados reais do próprio produto, sem risco de vazar histórico pessoal de Yan.

## 5. Escopo obrigatório de hardening (`PHASES.md`, já aprovado)

- auditoria de dependências (`npm audit` ou equivalente) e segredos (`.env`, histórico de commits, logs);
- revisão de RLS em todas as tabelas das Fases 3–9, teste de dois usuários repetido;
- limites de upload e de uso da IA (Groq) — tamanho de entrada, timeout, retries, rate limit;
- recuperação de falhas: Groq indisponível, Supabase indisponível, sessão expirada;
- acessibilidade e teclado no ciclo principal completo;
- screenshots finais 1024/1280/1440/1920 do ciclo principal;
- build limpo (`lint`, `typecheck`, `test`, `build`) na íntegra do repositório;
- achados de segurança reproduzidos e corrigidos manualmente antes de fechar qualquer item.

## 6. Fora do escopo (a menos que Yan decida o contrário em §2)

- modo Automático do Persona Live;
- integração real com Meet, Zoom ou Teams;
- qualquer gravação ou persistência de áudio de terceiros;
- billing, paywall ou checkout;
- PWA/mobile dedicado;
- painel administrativo, filas, microsserviços;
- login local ou outro provedor além da Microsoft.

## 7. Próximo passo

Este documento fica como rascunho. Antes de aprofundar (arquitetura de scripts, checklist linha a linha por tabela, formato exato da narrativa da banca), preciso das respostas de §2 — em especial a data-limite e a estratégia de dados de demonstração, porque mudam o tamanho real do trabalho.
