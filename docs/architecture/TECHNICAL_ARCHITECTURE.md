# Arquitetura Técnica — Persona MVP v2

Status: aprovada para scaffold e implementação inicial.

## 1. Forma de execução

O desenvolvimento será conduzido nesta tarefa do Codex Desktop. O terminal será usado internamente para instalar, executar, testar e auditar. Essa forma mantém decisões, alterações e validações no mesmo histórico, sem exigir um processo separado via CLI.

## 2. Stack aprovada

| Camada | Escolha | Motivo |
|---|---|---|
| Aplicação | Next.js 16, App Router | Aplicação web única com renderização no servidor, ações e rotas HTTP no mesmo projeto. |
| Interface | React 19 + TypeScript estrito | Base tipada e compatível com o Next.js atual. |
| Estilos | Tailwind CSS + tokens CSS próprios | Implementação direta do Design DNA sem runtime visual. |
| Componentes | shadcn/ui seletivo | Primitivos acessíveis copiados como código local e adaptados ao DNA. |
| Ícones | Carbon para domínio; Lucide para utilidades | Convenção visual definida pelo DNA, sem mistura no mesmo grupo. |
| Dados | Supabase Postgres | Persistência relacional e políticas por usuário. |
| Autenticação | Supabase Auth com Microsoft Azure | Login Microsoft para contas pessoais, corporativas e escolares. |
| Arquivos | Supabase Storage | Fontes anexadas às evidências, quando essa função entrar no fluxo. |
| IA | SDK oficial da Groq, somente no servidor | Estruturação e geração com chave protegida e modelo configurável. |
| Testes | Vitest + Playwright | Regras rápidas em unidade e validação dos fluxos críticos no navegador. |
| Hospedagem futura | Vercel + Supabase | Compatibilidade direta; nenhum recurso pago será criado sem autorização. |

A versão exata de cada pacote será fixada em `package-lock.json` no momento do scaffold. O ambiente atual possui Node.js 24 e npm 12; portanto, npm será o único gerenciador inicial.

## 3. Estrutura do repositório

```text
persona_mvp_v2/
  apps/
    web/                    # única aplicação do MVP
  docs/
    architecture/
    design/
  .agents/skills/           # skills locais para agentes compatíveis
  .claude/skills/           # skills locais para o Claude
  AGENTS.md
```

Não será criado monorepo operacional, pacote compartilhado, backend separado ou camada de domínio genérica antes de existir uma necessidade concreta. Se uma segunda aplicação real surgir, a estrutura será reavaliada.

## 4. Limites internos da aplicação

Dentro de `apps/web`, a organização seguirá responsabilidade concreta:

- `app/`: rotas, layouts, carregamento, erros e composição de página;
- `components/ui/`: primitivos shadcn adaptados;
- `components/persona/`: componentes específicos do produto;
- `features/`: lógica que pertence a um fluxo completo, criada somente quando a rota deixar de ser simples;
- `lib/supabase/`: clientes de navegador/servidor e utilidades de sessão;
- `lib/ai/`: chamadas server-only, prompts versionados e schemas de saída;
- `lib/validation/`: schemas compartilhados nas fronteiras do sistema.

Componentes de página permanecem próximos da rota até terem reutilização comprovada. Não haverá camada `services`, `repositories`, event bus ou injeção de dependência especulativa.

## 5. Autenticação Microsoft

O provedor Azure do Supabase Auth será configurado para o tenant `common`, permitindo contas Microsoft pessoais, corporativas e escolares durante o MVP.

Requisitos do fluxo:

- OAuth Authorization Code com PKCE;
- escopo `email` solicitado explicitamente;
- callback controlado em `/auth/callback`;
- URLs de redirecionamento separadas por ambiente;
- claim opcional `xms_edov` configurada no Azure para maior confiança sobre e-mails verificados;
- sessão validada no servidor antes de acessar dados privados;
- autorização por `user_id` e Row Level Security, nunca apenas por ocultação na interface.

Client secret do Azure fica no painel do Supabase. Chaves privadas e `service_role` nunca entram no bundle do navegador nem no repositório.

## 6. Modelo de dados mínimo

| Entidade | Responsabilidade |
|---|---|
| `profiles` | Preferências e contexto mínimo do usuário. |
| `daily_logs` | Registro bruto em texto ou voz própria, antes da estruturação. |
| `evidences` | Relato original, estrutura revisável, estado, competências, resultado e qualidade. |
| `evidence_sources` | Origem ou anexo vinculado a uma evidência. |
| `narrative_score_snapshots` | Histórico explicável de consistência, coerência, credibilidade e total. |
| `live_sessions` | Contexto e modo de uma interação no Persona Live. |
| `live_questions` | Pergunta, evidências usadas, argumentos e resposta gerada. |
| `artifacts` | STAR, pitch, currículo ou portfólio, com conteúdo de trabalho e estado. |
| `artifact_sources` | Evidências autorizadas utilizadas na geração de cada Artefato. |
| `artifact_versions` | Snapshots recuperáveis da geração, ações de IA, revisão e restauração. |

Todos os registros privados carregam `user_id`. Competências começam como valores simples associados à evidência; não será criado um catálogo complexo antes de a taxonomia precisar de governança própria.

## 7. Uso de IA e recuperação

O banco é a fonte da verdade. A IA sugere estrutura e redação, mas conteúdo inferido só ganha estado confirmado após revisão do usuário.

A integração inicial será direta com a Groq por meio do SDK oficial, exclusivamente no servidor. O Vercel AI Gateway não faz parte do MVP inicial e só deve ser reconsiderado se surgir necessidade comprovada de fallback, roteamento entre modelos, observabilidade centralizada ou múltiplos provedores.

Consistência do Narrative Score começa como cálculo determinístico de regularidade. Coerência pode usar o LLM sobre um conjunto controlado de logs e evidências, mas deve guardar explicação e data. Credibilidade permanece nula/indisponível enquanto não houver validação real suficiente; não converter ausência de dados em zero.

Para o Persona Live, a primeira implementação usa recuperação determinística no Postgres por texto, competências, contexto, recência e qualidade. Um conjunto pequeno de evidências é enviado ao modelo para formular argumentos e texto. Embeddings e banco vetorial só serão considerados quando testes reais mostrarem que a busca determinística é insuficiente.

Artefatos usam a mesma recuperação e o mesmo princípio de rastreabilidade. Tipos diferentes compartilham o fluxo `contexto → evidências → geração → revisão → exportação`; não criar um backend independente para cada tipo sem necessidade concreta. O conteúdo de trabalho recebe autosave, enquanto snapshots são criados somente em gerações, revisão e restauração. Currículo e Portfólio usam HTML semântico e CSS de impressão para PDF no MVP, sem renderizador adicional.

Respostas estruturadas devem ser validadas no servidor. Falha da Groq não pode impedir leitura, edição ou exportação de dados já existentes.

## 8. Segurança e privacidade

- Row Level Security obrigatória em toda tabela privada;
- validação de entrada nas fronteiras do servidor;
- nenhum segredo em variáveis públicas;
- upload com limite de tipo e tamanho, quando habilitado;
- logs sem relato profissional completo, token ou dado sensível;
- exportação e exclusão acessíveis ao próprio usuário;
- dependências mínimas, atualizações verificadas e lockfile versionado;
- Strix executado posteriormente apenas contra ambiente autorizado e testável, nunca como substituto de revisão, RLS e testes.

## 9. Qualidade e conclusão

Uma alteração de código só pode ser considerada pronta após, conforme aplicável:

1. lint;
2. verificação de tipos;
3. testes unitários das regras alteradas;
4. Playwright no fluxo crítico afetado;
5. build de produção;
6. inspeção visual nas larguras desktop definidas;
7. revisão por `editorial-modular-app-design`, `design-sem-cara-de-ia`, Design DNA e Ponytail;
8. verificação de autenticação, autorização e ausência de segredos.

Os scripts exatos serão registrados no `AGENTS.md` somente depois de existirem no `package.json` e serem executados com sucesso.

## 10. Decisões de simplicidade

Ficam fora da arquitetura inicial:

- Prisma ou outro ORM sobre o cliente Supabase;
- Zustand/Redux para estado que o servidor e a URL já resolvem;
- Redis, filas ou workers permanentes;
- microsserviços ou API separada;
- GraphQL;
- banco vetorial preventivo;
- analytics, cobrança e feature flags comerciais;
- biblioteca interna de componentes publicada como pacote;
- Vercel AI Gateway ou outra camada intermediária antes de necessidade comprovada;
- abstrações para múltiplos provedores de IA antes de uma segunda integração real.
