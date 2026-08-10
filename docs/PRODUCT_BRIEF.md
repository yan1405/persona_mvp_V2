# Persona — Briefing central do produto

> Status: aprovado para orientar o planejamento do MVP v2 — decisão cruzada `X-001`  
> Atualizado em: 05/08/2026  
> Decisor: Yan Guilherme Oliveira da Silva

## 1. Definição

O Persona é um **sistema de evidências profissionais**. Ele registra experiências reais, identifica o que elas demonstram e recupera os melhores fatos para o usuário comunicar sua competência em oportunidades de carreira.

Proposta institucional: **“O sistema operacional da sua identidade profissional.”**

Promessa funcional: **“Registre uma vez. Prove sempre.”**

Frase de diferenciação: **“O Persona não começa pela resposta. Começa pela evidência.”**

## 2. Problema

Estudantes e profissionais vivem experiências relevantes, mas normalmente:

- esquecem exemplos importantes sob pressão;
- não registram ações, resultados e aprendizados;
- descrevem competências sem provas;
- têm dificuldade para selecionar a experiência certa para cada pergunta;
- produzem currículos, pitches e respostas desconectados entre si;
- recorrem a IAs genéricas que podem inventar, exagerar ou descontextualizar fatos.

O problema não é apenas escrever melhor. É **recuperar a evidência certa, no momento certo, sem distorcer a trajetória do usuário**.

## 3. Público prioritário

O recorte inicial será definido e validado em pesquisa. A hipótese atual prioriza estudantes, profissionais em início de carreira e pessoas se preparando para entrevistas, especialmente quem possui experiências úteis, mas ainda não sabe transformá-las em argumentos profissionais.

O Persona não deve afirmar que atende todo o mercado antes dessa validação.

## 4. Solução

O produto organiza um ciclo contínuo:

1. o usuário registra o dia ou uma experiência no Daily Log, em texto ou voz própria;
2. o Persona propõe contexto, ação, resultado, competências e provas possíveis;
3. o usuário confirma, corrige e autoriza essas informações;
4. a experiência entra na Biblioteca de Evidências;
5. o Narrative Score e as sínteses de evolução são atualizados de forma explicável;
6. uma pergunta ou oportunidade ativa a busca pelas evidências mais relevantes;
7. o Persona apresenta argumentos reais e um rascunho curto no Persona Live ou cria um Artefato profissional rastreável.

### 4.1 Daily Log

O Daily Log é a entrada recorrente do Persona. Ele deve ser rápido o suficiente para registrar uma reunião, decisão, problema resolvido, aprendizado ou resultado sem exigir que o usuário conheça previamente a estrutura de uma evidência.

- texto é o modo funcional prioritário;
- voz própria pertence ao sistema completo e deve possuir fallback para texto;
- IA pode sugerir uma ou mais evidências a partir do log;
- nenhuma sugestão se torna fato confirmado sem revisão do usuário;
- lembrete é opcional e configurável;
- salvar, editar ou excluir um log precisa atualizar de forma consistente seus derivados.

### 4.2 Narrative Score

O Narrative Score é uma síntese explicável, não o produto inteiro nem uma gamificação isolada. Ele será apresentado como KPIs no Início, logo após o onboarding e durante o uso recorrente.

- **Consistência:** regularidade dos registros, calculada deterministicamente;
- **Coerência:** conexão percebida entre experiências, com explicação sobre o uso de IA;
- **Credibilidade:** não recebe número enquanto não houver validação real suficiente;
- cada mudança deve apontar para período e dados de origem;
- poucos dados produzem estado de insuficiência, não pontuação artificial.

## 5. Unidade central: evidência profissional

Cada evidência pode conter:

- título e data;
- contexto;
- desafio ou responsabilidade;
- ação específica do usuário;
- resultado qualitativo ou quantitativo;
- competências demonstradas;
- aprendizado;
- documento, link ou outro material de apoio;
- origem das informações;
- nível de confiança.

Níveis conceituais:

1. **Registrada:** declarada pelo usuário.
2. **Documentada:** acompanhada por arquivo, link ou resultado.
3. **Validada:** confirmada por terceiro autorizado.
4. **Certificada:** vinculada a uma credencial institucional.

O MVP não precisa implementar todos os níveis. Não chamar uma informação de “verificada” sem uma verificação real.

## 6. Diferencial: Persona Live

O Persona Live atua durante a preparação ou realização de uma entrevista. Ele identifica a pergunta, encontra experiências relacionadas e mostra duas áreas simultâneas:

### Argumentos reais

- experiência recomendada;
- fatos relevantes;
- ação realizada pelo usuário;
- resultado e números existentes;
- competências demonstradas;
- evidências de origem;
- alertas sobre o que não afirmar.

### Rascunho sugerido

- resposta curta em linguagem natural;
- construída somente a partir dos argumentos reais;
- adaptada ao tipo de pergunta;
- apresentada como apoio, não como fala para leitura literal.

Extensão padrão:

- pergunta objetiva: 15–25 segundos;
- pergunta comportamental ou STAR: 30–45 segundos;
- pergunta complexa: até 60 segundos;
- nunca gerar automaticamente uma resposta de 90 segundos.

Controles: **Encurtar**, **Aprofundar** e **Outra experiência**.

## 7. Artefatos profissionais

Artefatos são entregáveis de carreira criados a partir das evidências autorizadas do usuário. Eles formam uma área principal própria e não devem ser reduzidos a um histórico genérico de textos.

Tipos previstos no sistema completo:

- resposta STAR;
- resposta salva do Persona Live;
- pitch pessoal;
- carta de apresentação;
- currículo;
- portfólio profissional.

Contrato comum:

1. escolher tipo e objetivo;
2. informar o contexto da oportunidade;
3. revisar as evidências sugeridas;
4. gerar somente com fatos disponíveis;
5. editar e revisar o rascunho;
6. consultar as fontes utilizadas;
7. copiar ou exportar no formato autorizado para o tipo.

Todo Artefato nasce como rascunho. Os estados mínimos são `Rascunho`, `Revisado` e `Exportado/Copiado`. Formatos como PDF ou DOCX serão especificados por tipo antes de serem prometidos.

## 8. Modos de uso

### Manual

O usuário digita, cola ou seleciona o tipo de pergunta. Não há captura da voz do entrevistador. Este modo será funcional no MVP.

### Automático

O Persona transcreve temporariamente a conversa, identifica uma possível pergunta e prepara a assistência. Exige autorização apropriada e deve permitir que o usuário confirme a abertura do cartão. No MVP da competição, será uma demonstração controlada; integração completa com Meet, Zoom e Teams fica para uma versão posterior.

## 9. Limites éticos e de privacidade

O Persona:

- não responde pelo usuário;
- não inventa experiências, responsabilidades, resultados ou números;
- não se apresenta como ferramenta indetectável;
- não promete aprovação na entrevista;
- sinaliza ausência ou baixa confiança das evidências;
- informa que processos seletivos podem restringir assistência externa;
- não grava nem persiste áudio de terceiros por padrão;
- descarta transcrições temporárias ao final por padrão;
- oferece modo Manual como alternativa sem captura da conversa;
- mantém o usuário no controle sobre o que pode ser usado e compartilhado.

## 10. Escopo do MVP demonstrável

Deve existir:

- Daily Log e captura de experiência;
- estruturação assistida da evidência;
- biblioteca simples de evidências;
- KPIs explicáveis do Narrative Score no Início;
- Persona Live Manual funcional;
- argumentos e rascunho exibidos separadamente;
- rastreabilidade entre recomendações e registros de origem;
- respostas curtas adaptadas automaticamente;
- estados de ausência de evidência, baixa confiança e falha de geração;
- demonstração controlada do modo Automático.
- área de Artefatos com biblioteca, revisão e fontes;
- resposta STAR e salvamento de resposta do Persona Live como Artefatos funcionais;
- pitch pessoal, carta de apresentação, currículo e portfólio presentes no mapa completo e implementados por fases sem desaparecer do escopo.

Não faz parte do MVP:

- integração produtiva com Meet, Zoom e Teams;
- aplicativo desktop ou extensão definitiva;
- gravação de entrevistas;
- marketplace de vagas;
- rede social;
- blockchain;
- avaliações psicológicas;
- validação externa completa;
- cobrança real.

## 11. Resultado útil inicial

Após registrar uma experiência, o usuário deve conseguir perceber:

> “Eu não sabia que essa experiência demonstrava essas competências, e agora tenho argumentos reais para usá-la em uma entrevista.”

## 12. Hipóteses que ainda precisam de validação

- o público prioritário sente esse problema com frequência;
- registrar evidências gera valor recorrente, não apenas antes de uma entrevista;
- argumentos e rascunho simultâneos ajudam sem distrair;
- usuários confiam no sistema quando a origem é mostrada;
- o modo Manual já entrega valor suficiente para o primeiro MVP;
- existe disposição a pagar pelo produto ou por recursos futuros.

## 13. Critérios de sucesso para validação

- usuários conseguem registrar uma evidência sem ajuda externa;
- reconhecem de onde vieram os argumentos apresentados;
- não encontram fatos inventados no rascunho;
- conseguem responder usando o apoio sem ler palavra por palavra;
- preferem a recomendação do Persona a procurar manualmente em anotações;
- relatam aumento de clareza ou confiança;
- compreendem a diferença entre informação registrada, documentada e validada.
