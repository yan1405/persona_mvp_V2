# Mapa funcional: áreas, páginas, abas e estados

Este documento é um mapa operacional resumido da arquitetura de informação. A fonte completa e aprovada continua sendo `docs/architecture/INFORMATION_ARCHITECTURE.md`.

## 1. Modelo mental

```text
Memória       Evidência          Síntese              Ativação
Daily Log  →  fatos revisados → Narrative Score  →  Persona Live / Artefatos
```

Fluxos críticos:

```text
Microsoft → onboarding → Daily Log → sugestões → revisão → evidência → Início
Evidências → Persona Live → argumentos + rascunho → Artefato
Artefatos → tipo → contexto → evidências → geração → revisão → copiar/exportar
Configurações → Dados → exportar/excluir → confirmação forte
```

## 2. Navegação principal autenticada

O shell desktop aprovado possui cabeçalho de 48px, trilho lateral de 56px e conteúdo operacional de até 1280px.

| Ordem | Destino | Rota | Situação atual |
|---|---|---|---|
| 1 | Início | `/app/inicio` | visão operacional implementada na Fase 6 |
| 2 | Diário | `/app/diario` | núcleo implementado na Fase 4 |
| 3 | Evidências | `/app/evidencias` | implementado na Fase 5 |
| 4 | Persona Live | `/app/live` | implementado e validado na Fase 7 |
| 5 | Artefatos | `/app/artefatos` | contrato aprovado; implementação da Fase 8 não iniciada |
| rodapé | Configurações | `/app/configuracoes` | planejado para Fase 9 |

Narrative Score não é um destino principal; aparece no Início e abre `/app/score` como painel/deep link.

## 3. Inventário de rotas

| Rota | Acesso | Tipo | Situação | Responsabilidade |
|---|---|---|---|---|
| `/` | público | portão | implementada | decidir `/entrar` ou produto |
| `/entrar` | público | página | implementada | apresentação funcional e login Microsoft |
| `/auth/iniciar` | público/técnico | Route Handler | implementada | iniciar OAuth PKCE |
| `/auth/callback` | público/técnico | Route Handler | implementada | trocar código por sessão |
| `/auth/erro` | público | página | implementada | recuperar falhas sem expor diagnóstico sensível |
| `/privacidade` | público | documento | implementada/provisória | política da fase de testes |
| `/termos` | público | documento | implementada/provisória | termos da fase de testes |
| `/onboarding` | autenticado | fluxo | implementada | perfil, consentimento, rotina e primeiro log |
| `/app/inicio` | autenticado | página | implementada | Score, origem, dimensões, rastreabilidade e próxima ação |
| `/app/diagnostico` | autenticado | fluxo | implementada | base declarada versionada em três etapas |
| `/app/score` | autenticado | painel/deep link | implementada | resumo, histórico e método |
| `/app/diario` | autenticado | página | implementada | captura, busca, filtros e histórico de logs |
| `/app/diario/[id]` | autenticado | painel/deep link | implementada | registro original, sugestões, revisão e confirmação |
| `/app/evidencias` | autenticado | página | implementada | biblioteca, registro manual, busca e filtros |
| `/app/evidencias/[id]` | autenticado | painel/deep link | implementada | resumo editável, provas por link e usos futuros |
| `/app/live` | autenticado | workspace | implementada | preparação e assistência manual em perguntas |
| `/app/live/[id]` | autenticado | workspace | implementada | sessão, argumentos, rascunhos, fontes e versões |
| `/app/artefatos` | autenticado | página | contrato aprovado | biblioteca de materiais profissionais |
| `/app/artefatos/novo` | autenticado | workspace | contrato aprovado | criação por tipo |
| `/app/artefatos/[id]` | autenticado | painel/deep link | contrato aprovado | conteúdo, fontes e versões |
| `/app/configuracoes` | autenticado | página | planejada | perfil e preferências |
| `/app/configuracoes/dados` | autenticado | subárea | planejada | consentimento, exportar e excluir |
| `/app/configuracoes/conta` | autenticado | subárea | planejada | Microsoft e encerrar sessão |

## 4. Anatomia por área

### Entrada

- painel de posicionamento;
- promessa objetiva;
- demonstração de rastreabilidade;
- botão único Microsoft;
- Termos e Privacidade;
- falha de configuração/provedor e retorno seguro.

Não é landing page de marketing e não possui preços, depoimentos ou três cards de benefícios.

### Onboarding

Etapas sequenciais:

1. Contexto;
2. Privacidade;
3. Rotina;
4. Primeiro registro.

Comunicação opcional nunca pode estar agregada ao consentimento necessário. Lembrete nunca bloqueia. O primeiro registro é real.

### Início

Estado completo implementado:

- cabeçalho e próxima ação;
- KPIs total, Consistência, Coerência e Credibilidade;
- período e origem;
- revisões pendentes;
- logs/evidências recentes;
- competências/lacunas;
- atalhos Live e Artefatos.

Estados: sem registros, insuficiente, calculando, disponível e falha parcial.

### Score

Abas legítimas por serem visões irmãs:

- Resumo;
- Histórico;
- Como é calculado.

### Diário

- editor em primeiro plano;
- texto prioritário;
- voz própria apenas quando contratada e com fallback;
- data/contexto opcionais;
- histórico compacto;
- busca/filtros;
- sugestões após salvar.

Detalhe do log:

- aba Registro;
- aba Sugestões.

### Evidências

- lista densa;
- busca;
- filtros por estado, competência, período e nível;
- `Todas` e `Para revisar` como filtros salvos;
- origem, nível e atualização visíveis.

Detalhe:

- Resumo;
- Provas;
- Uso.

Níveis conceituais:

1. Registrada;
2. Documentada;
3. Validada;
4. Certificada.

Somente os dois primeiros podem entrar sem mecanismo externo real.

Estado implementado na Fase 5:

- `Registrada`: evidência confirmada sem link;
- `Documentada`: ao menos um link HTTP/HTTPS vinculado;
- arquivos, Storage, `Validada` e `Certificada` permanecem fora do escopo atual;
- Uso informa as integrações futuras sem inventar sessões ou Artefatos.

### Persona Live

Estados do workspace:

1. Preparação;
2. Pronto;
3. Processando;
4. Resposta;
5. Recuperação;
6. Encerramento.

Regiões simultâneas:

- Argumentos reais;
- Rascunho sugerido;
- fontes e alertas.

O MVP opera somente no modo Manual, sem escuta, gravação ou transcrição. O modo Automático permanece futuro.

### Artefatos

Biblioteca:

- busca e filtros;
- tipo, estado, data e fontes;
- Novo Artefato;
- rascunhos e recentes.

Tipos obrigatórios da Fase 8:

- STAR;
- Pitch em 30, 60 e 90 segundos;
- Currículo ATS;
- Portfólio profissional por casos.

Salvar uma resposta do Live cria um STAR em rascunho. Carta de apresentação fica fora da fase.

Novo Artefato usa etapas. Detalhe usa abas Conteúdo, Evidências e Versões.

### Configurações

Navegação secundária:

- Perfil;
- Preferências;
- Dados e privacidade;
- Conta Microsoft.

## 5. Objetos e responsabilidades

| Objeto | É fonte? | Pode conter IA? | Confirmação humana | Usos |
|---|---|---|---|---|
| Daily Log | sim, memória original | sugestões derivadas | edição/exclusão pelo usuário | gerar evidências |
| Evidência | fato estruturado | estrutura sugerida | obrigatória antes de confirmada | score, Live, Artefatos |
| Fonte | prova/origem | não deve ser inventada | usuário adiciona/autoriza | nível e rastreabilidade |
| Snapshot de score | síntese | Coerência pode usar IA | método deve ser explicável | Início/histórico |
| Pergunta Live | contexto temporário | classificação/geração | usuário controla | resposta e Artefato |
| Argumentos reais | fatos recuperados | seleção assistida | fontes visíveis | sustentar rascunho |
| Rascunho | texto gerado | sim | sempre revisável | copiar/salvar |
| Artefato | material profissional | geração baseada em fontes | nasce Rascunho | exportar/copiar |

## 6. Regras de abas, filtros e painéis

- abas somente para visões irmãs do mesmo objeto;
- filtros e ordenação não viram abas por conveniência;
- detalhe abre preferencialmente em painel, preservando a lista;
- deep link deve permitir abrir o mesmo detalhe diretamente;
- ações destrutivas não ficam escondidas apenas no hover;
- contexto aparece antes de controles avançados.

## 7. Estados transversais obrigatórios

Cada área deve avaliar:

- carregando;
- vazio inicial;
- nenhum resultado;
- conteúdo parcial;
- erro recuperável;
- indisponível/sem permissão;
- salvando e salvo;
- alterações não salvas;
- falha de rede/IA;
- desabilitado;
- foco;
- sucesso;
- exclusão/undo quando aplicável.

## 8. Limites de produto atuais

Não fazem parte da superfície atual:

- landing page de marketing;
- billing;
- admin;
- rede social;
- validação por pares;
- integração produtiva com reunião;
- PWA/mobile dedicada;
- relatório semanal;
- análise de mercado;
- colaboração.
