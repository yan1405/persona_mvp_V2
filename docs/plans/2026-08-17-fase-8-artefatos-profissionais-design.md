# Fase 8 — Artefatos profissionais

> Status: contrato funcional e técnico aprovado por Yan em 17/08/2026
> Implementação: não iniciada
> Dependência: Fases 4, 5 e 7 concluídas; evidências e Persona Live disponíveis

## 1. Objetivo

Transformar evidências profissionais autorizadas em quatro materiais úteis, revisáveis e rastreáveis: Resposta STAR, Pitch pessoal, Currículo e Portfólio profissional.

A IA organiza e redige, mas não completa lacunas nem inventa experiências, responsabilidades, resultados, números ou competências. Todo conteúdo nasce como rascunho e só se torna revisado por ação explícita do usuário.

## 2. Escopo obrigatório

1. **Resposta STAR**;
2. **Pitch pessoal**;
3. **Currículo**;
4. **Portfólio profissional**.

Resposta salva do Persona Live não é um quinto tipo: a ação opcional `Salvar nos Artefatos` cria uma Resposta STAR em rascunho. Carta de apresentação, DOCX, galeria de modelos, site público de portfólio e transcrição automática de chamadas ficam fora da Fase 8.

## 3. Abordagens consideradas

### A. Um motor comum com conteúdo configurado por tipo — aprovada

Compartilha autorização de fontes, geração, revisão, autosave e versões. STAR e Pitch usam editor textual; Currículo e Portfólio usam seções estruturadas. Mantém diferenças reais sem criar quatro produtos independentes.

### B. Um gerador e uma tabela por tipo

Facilita exceções locais, mas duplica autorização, persistência, estados e tratamento de falhas. Rejeitada.

### C. Editor livre universal

É simples no início, porém não sustenta currículo ATS, portfólio por casos ou PDF consistente. Rejeitada.

## 4. Rotas e navegação

### `/app/artefatos`

- biblioteca densa;
- busca textual;
- filtros por tipo, estado e data de atualização;
- ordenação padrão pelos mais recentes;
- ação `Novo Artefato`;
- estados vazio, sem resultado, carregando e falha recuperável.

Não haverá pastas, etiquetas, favoritos ou visualização em cards decorativos.

### `/app/artefatos/novo`

Fluxo em etapas:

1. escolher tipo e objetivo;
2. informar contexto da oportunidade quando aplicável;
3. revisar dados complementares;
4. selecionar e autorizar evidências;
5. gerar o primeiro rascunho;
6. abrir o editor do artefato criado.

### `/app/artefatos/[id]`

Abas legítimas do mesmo objeto:

- **Conteúdo:** editor, estado e ações;
- **Evidências:** fontes autorizadas e correspondência dos fatos;
- **Versões:** snapshots recuperáveis.

## 5. Modelo de fontes

São aceitas duas origens:

- evidências confirmadas e autorizadas pelo usuário;
- dados complementares informados e confirmados manualmente: contato, links, objetivo, formação, idiomas e outros dados cadastrais necessários.

Cada afirmação profissional gerada deve apontar para uma evidência autorizada. Dados complementares devem ser identificados como declaração manual, não como evidência validada. A IA pode selecionar, ordenar, resumir e conectar fatos, mas não inferir informações ausentes.

O servidor envia somente o conjunto autorizado à Groq, exige saída estruturada com IDs, campos e trechos de origem e valida a correspondência literal dos trechos antes de persistir. Saída inválida é rejeitada sem apagar seleção, contexto ou edição existente.

## 6. Resposta STAR

Estrutura editorial:

- Situação;
- Tarefa;
- Ação;
- Resultado;
- Aprendizado opcional.

O usuário informa a pergunta ou objetivo, seleciona evidências e recebe um texto único editável com as fontes ao lado. Pode salvar e copiar. A ausência de fatos suficientes produz uma lacuna explícita, nunca uma resposta genérica.

## 7. Pitch pessoal

O primeiro processamento produz três versões do mesmo repertório:

- 30 segundos — apresentação rápida;
- 60 segundos — versão principal;
- 90 segundos — versão aprofundada.

As três versões são editáveis, salváveis e copiáveis. Alterar uma duração manualmente não modifica as demais. Uma ação de IA afeta somente a duração selecionada.

## 8. Currículo

Um único modelo oficial, legível por ATS, sem foto por padrão e com uma ou duas páginas conforme o conteúdo confirmado.

Seções:

1. identificação, contato e links;
2. objetivo profissional;
3. resumo;
4. experiências e projetos;
5. formação;
6. competências, idiomas e informações complementares.

O editor trabalha por seções. Reordenação usa botões explícitos, sem drag-and-drop. A pré-visualização aplica o modelo oficial e permite exportar por impressão nativa do navegador em PDF.

## 9. Portfólio profissional

Um único documento editorial em PDF, organizado por casos, sem site público nesta fase.

Seções:

1. capa;
2. apresentação profissional;
3. competências em destaque;
4. projetos ou experiências selecionadas;
5. casos com contexto, ação, resultado, aprendizado e provas;
6. links profissionais e contato.

As fontes continuam rastreáveis dentro do Persona. IDs internos, alertas e dados técnicos não aparecem automaticamente no PDF.

## 10. Edição e ações de IA

A geração inicial cria o artefato completo. Depois disso, a IA atua somente sobre a seção ou duração selecionada por uma destas ações fechadas:

- `Encurtar`;
- `Aprofundar`;
- `Adaptar ao objetivo`;
- `Gerar alternativa`.

Não haverá chat aberto no editor. Antes de aplicar uma geração, o servidor confirma a versão-base; conflito preserva a edição mais recente e solicita nova tentativa. Nenhuma ação sobrescreve silenciosamente conteúdo manual.

## 11. Estados, autosave e versões

Estados do artefato:

- `Rascunho`;
- `Revisado`.

O conteúdo de trabalho recebe autosave com indicação `Salvando`, `Salvo` ou `Falha ao salvar`. Não é criada uma versão por tecla.

Snapshots recuperáveis são criados:

1. na geração inicial;
2. após cada ação de IA aplicada;
3. ao marcar como revisado;
4. ao restaurar uma versão, preservando o histórico anterior.

Qualquer edição posterior em um item revisado devolve o estado a Rascunho. Copiar e exportar são eventos, não estados.

## 12. Integração opcional com Persona Live

Na versão atual de uma pergunta sustentada, `Salvar nos Artefatos` cria uma Resposta STAR em rascunho com:

- pergunta;
- texto atual;
- evidências usadas;
- referência da sessão e da versão de origem.

Salvar não chama a IA novamente, não encerra a sessão e não transforma Persona Live em gerador de Artefatos. O Persona Live continua sendo ferramenta de auxílio em calls: o usuário digita a pergunta e recebe argumentos reais e rascunho curto. Escuta, gravação e resposta automática permanecem fora do MVP funcional.

## 13. Dados

### `artifacts`

- `id`, `user_id`;
- `type`: `star | pitch | resume | portfolio`;
- `title`, `objective`, `opportunity_context`;
- `status`: `draft | reviewed`;
- `revision` inteiro para evitar sobrescrita concorrente;
- `working_content` JSONB validado por tipo;
- `supplementary_data` JSONB validado;
- `origin_type`, `origin_id` opcionais;
- `created_at`, `updated_at`, `reviewed_at`.

### `artifact_sources`

- `artifact_id`, `evidence_id`, `user_id`;
- `authorized_at`, `removed_at` opcional;
- metadados mínimos de correspondência usados pelo conteúdo.

### `artifact_versions`

- `id`, `artifact_id`, `user_id`, `version`;
- `trigger`: `initial | shorter | deeper | adapted | alternative | reviewed | restored`;
- `section_key` opcional;
- `content` e `source_map` JSONB validados;
- `model`, `prompt_version` opcionais;
- `created_at`.

Copiar e abrir a impressão para PDF são ações do cliente e não criam tabela, estado ou analytics próprios.

## 14. Integridade, RLS e privacidade

- todas as tabelas privadas carregam `user_id` e RLS por proprietário;
- vínculos aceitam somente evidências próprias e confirmadas;
- versões são append-only para o cliente;
- alterações de estado e snapshots críticos são atômicos;
- fonte arquivada ou indisponível permanece indicada e bloqueia nova geração com ela;
- exportação exclui metadados internos e inclui apenas o conteúdo escolhido pelo usuário;
- logs técnicos não armazenam o texto integral do artefato, evidências ou dados de contato;
- nenhum segredo, prompt completo ou conteúdo profissional vai para o cliente sem necessidade.

## 15. PDF e dependências

Currículo e Portfólio usam HTML semântico, CSS paginado e `@media print`, acionados pelo diálogo nativo do navegador. Isso entrega pré-visualização e salvamento como PDF sem adicionar biblioteca, serviço ou renderizador.

O aceite exige paginação estável nos navegadores suportados, sem controles do app, cortes indevidos ou fontes ausentes. DOCX e geração de PDF no servidor só serão reconsiderados se testes reais mostrarem insuficiência do caminho nativo.

## 16. Sequência de implementação

1. migração, RLS, validações, motor comum de fontes e versões;
2. biblioteca e criação base;
3. Resposta STAR como piloto completo;
4. Pitch com 30, 60 e 90 segundos;
5. Currículo com modelo oficial e PDF;
6. Portfólio com modelo oficial e PDF;
7. ação opcional `Salvar nos Artefatos` no Persona Live;
8. estados transversais, filtros, testes, QA e revisão visual.

Os quatro tipos são obrigatórios para encerrar a Fase 8. A sequência reduz risco, mas não autoriza entregar apenas o piloto.

## 17. Testes obrigatórios

- validação de conteúdo e dados complementares por tipo;
- IDs, trechos e fontes não autorizadas rejeitados;
- ausência de fatos gera lacuna segura;
- RLS e tentativa de acessar artefato alheio;
- geração inicial e quatro ações por seção;
- edição concorrente não sobrescrita;
- autosave, falha e recuperação;
- snapshots e restauração sem apagar histórico;
- item revisado voltando a Rascunho após edição;
- busca e filtros combinados;
- cópia de STAR e das três versões do Pitch;
- Currículo em uma e duas páginas;
- Portfólio com múltiplos casos;
- PDF sem chrome do app e sem metadados internos;
- Live salvando STAR sem nova chamada de IA;
- teclado, foco, anúncios de estado e contraste WCAG 2.2 AA;
- QA real em 1024, 1280, 1440 e 1920px.

## 18. Direção visual

A área segue o Design DNA aprovado: Geist, superfícies neutras, acento violeta Persona, densidade editorial e hierarquia por grid, alinhamento e tipografia. A biblioteca é uma lista operacional; o editor prioriza conteúdo e fontes; o PDF possui identidade própria, sem parecer uma captura do dashboard.

Evitar cards repetitivos, gradientes genéricos, chat no editor, ícones decorativos e excesso de ações simultâneas. A revisão final deve usar `editorial-modular-app-design`, `design-sem-cara-de-ia`, `design-dna`, Ponytail `full` e o protocolo visual do projeto.

## 19. Critério de sucesso e gate

Yan deve conseguir criar cada um dos quatro tipos a partir de evidências autorizadas, entender a origem dos fatos, editar sem perder trabalho, recuperar versões, revisar, copiar STAR/Pitch e salvar Currículo/Portfólio como PDF.

A Fase 8 só termina após:

- migração aplicada e RLS verificada;
- testes, lint, TypeScript e build aprovados;
- fluxo autenticado completo para os quatro tipos;
- screenshots representativas nas quatro larguras;
- sessão de avaliação visual registrada e aprovada por Yan;
- commit, push e produção validados quando autorizados.

Este documento autoriza o planejamento detalhado. O início da implementação depende de confirmação explícita de Yan.
