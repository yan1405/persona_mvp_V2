# Arquitetura de Informação — Persona MVP v2

Status: proposta reformulada após auditoria de 10/08/2026 e aprovada por Yan para a implementação inicial.

## 1. Modelo mental

O Persona é organizado pelo ciclo do usuário, não pelas tabelas do banco:

`registrar → transformar em evidência → entender a evolução → ativar em uma oportunidade`

As quatro camadas do produto são:

- **Memória:** Daily Logs e fontes originais.
- **Evidência:** fatos estruturados, competências e provas.
- **Síntese:** Narrative Score e evolução.
- **Ativação:** Persona Live e Artefatos profissionais.

## 2. Shell desktop inspirado no CRM

- cabeçalho global de 48px com marca, contexto e menu de conta;
- trilho lateral de 56px com cinco destinos principais;
- Configurações isolada no rodapé do trilho;
- conteúdo operacional com largura máxima de 1280px e gutters de 24px;
- detalhes abertos preferencialmente em painel lateral, preservando a lista ou o contexto anterior;
- abas somente para visões irmãs do mesmo objeto;
- busca, filtros e ordenação são ferramentas locais, não abas.

### Destinos principais

1. **Início**
2. **Diário**
3. **Evidências**
4. **Persona Live**
5. **Artefatos**
6. **Configurações**, no rodapé

Narrative Score não ocupa um item próprio. Ele aparece imediatamente como KPIs no Início e abre um detalhe contextual quando o usuário deseja entender os números.

## 3. Mapa de rotas

### Públicas e autenticação

| Rota | Tela/função |
|---|---|
| `/` | Portão de sessão: redireciona para `/app/inicio` ou `/entrar`. |
| `/entrar` | Entrada do produto e login exclusivo com Microsoft. |
| `/auth/callback` | Conclusão técnica do OAuth PKCE. |
| `/auth/erro` | Recuperação de autenticação. |
| `/privacidade` | Política de privacidade. |
| `/termos` | Termos de uso da fase de testes. |

### Primeiro uso

| Rota | Tela/função |
|---|---|
| `/onboarding` | Fluxo compacto de perfil, consentimento, lembrete opcional e primeiro Daily Log. |

### Produto autenticado

| Rota | Tela/função | Padrão |
|---|---|---|
| `/app/inicio` | Visão operacional e KPIs do Narrative Score. | Página |
| `/app/score` | Explicação e histórico do Narrative Score. | Painel lateral/deep link |
| `/app/diario` | Captura e histórico de Daily Logs. | Página |
| `/app/diario/[id]` | Registro completo e sugestões derivadas. | Painel lateral/deep link |
| `/app/evidencias` | Biblioteca, busca, filtros e fila de revisão. | Página |
| `/app/evidencias/[id]` | Evidência, provas, confiança e usos. | Painel lateral/deep link |
| `/app/live` | Preparação e sessão do Persona Live. | Workspace dedicado |
| `/app/artefatos` | Biblioteca e criação de Artefatos. | Página |
| `/app/artefatos/novo` | Criação conforme o tipo selecionado. | Workspace dedicado |
| `/app/artefatos/[id]` | Conteúdo, fontes e versões de um Artefato. | Painel lateral/deep link |
| `/app/configuracoes` | Perfil e preferências. | Página com navegação secundária |
| `/app/configuracoes/dados` | Privacidade, exportação e exclusão. | Subárea |
| `/app/configuracoes/conta` | Conta Microsoft e encerramento da sessão. | Subárea |

## 4. Telas e anatomia

### 4.1 Entrada — `/entrar`

Composição dividida, seguindo a qualidade estrutural do CRM:

- painel de posicionamento do Persona;
- promessa objetiva e uma demonstração visual própria do produto;
- painel de autenticação;
- botão único `Entrar com Microsoft`;
- links de Termos e Privacidade;
- estados carregando, falha de provedor, conexão e retorno seguro.

Não é landing page de marketing.

### 4.2 Onboarding — `/onboarding`

Etapas sequenciais, não abas:

1. **Contexto:** nome confirmado pela Microsoft, momento profissional e objetivo principal.
2. **Privacidade:** consentimento obrigatório e comunicações opcionais separadas.
3. **Rotina:** lembrete opcional de Daily Log.
4. **Primeiro registro:** Daily Log real, não tour promocional.

Saída: Início. O score aparece com estado inicial ou insuficiência de dados; nunca com número inventado.

### 4.3 Início — `/app/inicio`

Decisão visual forte: uma faixa analítica compacta com o Narrative Score e suas dimensões.

Seções:

1. cabeçalho contextual e próxima ação;
2. KPIs: Narrative Score total, Consistência, Coerência e Credibilidade;
3. explicação curta do período e última atualização;
4. ação prioritária dinâmica: registrar o dia ou revisar sugestões;
5. evidências aguardando revisão;
6. últimos Daily Logs e evidências recentes;
7. síntese de competências e lacunas;
8. acesso rápido ao Persona Live e ao último Artefato.

Estados dos KPIs:

- sem registros;
- dados insuficientes;
- calculando;
- disponível com período e origem;
- falha parcial sem bloquear o restante do Início.

#### Detalhe do Score — `/app/score`

Abas dentro do painel:

- **Resumo:** score, dimensões e interpretação.
- **Histórico:** evolução por período e eventos relacionados.
- **Como é calculado:** método, limitações e uso de IA.

Credibilidade permanece indisponível enquanto não houver validação real.

### 4.4 Diário — `/app/diario`

Decisão visual forte: editor de captura em primeiro plano, sem formulário burocrático.

Áreas:

- editor `O que aconteceu hoje?`;
- modo texto e, quando habilitado, voz própria;
- data e contexto opcional;
- salvar rascunho/registro;
- retorno das evidências sugeridas;
- lista compacta de registros recentes;
- busca e filtro por período/tipo.

Não há abas principais. O editor e o histórico pertencem ao mesmo fluxo.

#### Detalhe do Log — `/app/diario/[id]`

Abas dentro do painel:

- **Registro:** conteúdo original, edição e exclusão.
- **Sugestões:** evidências extraídas, estado da revisão e vínculos criados.

Excluir ou alterar um log exige explicar os impactos em evidências e score derivados.

### 4.5 Evidências — `/app/evidencias`

Áreas:

- título e ação `Registrar evidência` como exceção contextual;
- busca textual;
- filtros por estado, competência, período e nível;
- visão `Todas` e fila `Para revisar` como filtros salvos, não tabs obrigatórias;
- lista densa com título, contexto, competências, nível, fonte e atualização;
- ações em lote somente quando houver necessidade real;
- estados vazio, sem resultado, parcial e erro.

#### Detalhe da Evidência — `/app/evidencias/[id]`

Abas:

- **Resumo:** contexto, desafio, ação, resultado, aprendizado e competências.
- **Provas:** arquivos, links, origem e nível de evidência.
- **Uso:** Persona Live e Artefatos que utilizaram o registro.

Ações: editar, confirmar sugestão, documentar, arquivar e testar no Persona Live.

### 4.6 Persona Live — `/app/live`

O Persona Live é um workspace, não uma sequência de páginas pequenas.

Estados do workspace:

1. **Preparação:** oportunidade, empresa/vaga, evidências autorizadas, modo e privacidade.
2. **Pronto:** pergunta manual em foco ou demonstração automática preparada.
3. **Processando:** intenção e busca de evidências.
4. **Resposta:** Argumentos reais e Rascunho sugerido simultâneos.
5. **Recuperação:** nenhuma evidência, baixa confiança, falha da IA ou interrupção.
6. **Encerramento:** salvar resposta como Artefato e descartar transcrição temporária.

Controles de modo:

- `Manual`;
- `Automático — demonstração`.

São modos de operação, não abas de navegação.

Composição expandida:

- cabeçalho da sessão;
- pergunta editável;
- painel principal Argumentos reais;
- painel secundário Rascunho sugerido;
- fontes e alertas contextuais;
- ações Encurtar, Aprofundar, Outra experiência, Copiar e Salvar como Artefato.

### 4.7 Artefatos — `/app/artefatos`

Artefatos é uma área principal e substitui o nome genérico `Produções`.

Seções:

- cabeçalho e ação `Novo Artefato`;
- seletor de tipo no início da criação;
- biblioteca com busca e filtros por tipo, estado e data;
- lista densa com tipo, objetivo, atualização, estado e principais fontes;
- rascunhos recentes;
- exportados/copiados recentemente;
- estados vazio, falha e fonte indisponível.

Tipos obrigatórios no mapa:

1. Resposta STAR;
2. Resposta salva do Persona Live;
3. Pitch pessoal;
4. Carta de apresentação;
5. Currículo;
6. Portfólio profissional.

#### Novo Artefato — `/app/artefatos/novo`

Etapas, não abas:

1. tipo e objetivo;
2. contexto da oportunidade;
3. evidências sugeridas e autorizadas;
4. geração;
5. revisão humana;
6. salvar, copiar ou exportar.

O mesmo workspace atende todos os tipos por configuração de conteúdo; não criar uma arquitetura independente por gerador.

#### Detalhe do Artefato — `/app/artefatos/[id]`

Abas:

- **Conteúdo:** editor e estado de revisão.
- **Evidências:** fontes usadas e correspondência dos fatos.
- **Versões:** histórico mínimo de alterações e exportações.

Estados: Rascunho, Revisado e Exportado/Copiado.

### 4.8 Configurações

Navegação secundária lateral:

- **Perfil:** nome, foto opcional e contexto profissional.
- **Preferências:** idioma, lembrete e comportamento do Daily Log.
- **Dados e privacidade:** exportar dados, consentimentos e excluir conta.
- **Conta Microsoft:** e-mail, sessão e sair.

Não há planos, preços ou billing nesta fase gratuita.

## 5. Fluxos críticos

### Primeiro valor

`Microsoft → onboarding → primeiro Daily Log → sugestões → revisão → evidência → Início com KPIs iniciais`

### Ativação em entrevista

`Evidências → Persona Live → pergunta → argumentos + rascunho → salvar como Artefato`

### Criação de material profissional

`Artefatos → tipo → contexto → evidências → geração → revisão → copiar/exportar`

### Controle de dados

`Configurações → Dados e privacidade → exportar ou excluir → confirmação forte`

## 6. Elementos fora do mapa atual

- landing page de marketing;
- paywall, checkout e billing;
- painel administrativo;
- rede social ou validação por pares;
- integração produtiva com Meet, Zoom ou Teams;
- gravação/persistência de áudio de terceiros;
- PWA ou experiência mobile dedicada;
- relatório semanal automatizado;
- análise autônoma de mercado;
- colaboração entre usuários.

## 7. Critérios de aprovação do mapa

- Daily Log, Evidências, Narrative Score, Persona Live e Artefatos formam um único ciclo compreensível.
- Narrative Score está visível no Início sem ocupar navegação própria.
- todos os seis tipos de Artefato permanecem rastreáveis no mapa.
- nenhuma tela da Persona v1 orienta a composição visual.
- estrutura e densidade seguem CRM + Design DNA.
- cada fase de implementação termina com a Sessão de Avaliação Visual obrigatória.
