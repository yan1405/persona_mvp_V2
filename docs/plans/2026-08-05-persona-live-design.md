# Persona Live — Design funcional aprovado

> Status: aprovado em descoberta — decisão cruzada `X-001`; pronto para integrar o mapa de páginas e o plano do MVP  
> Data: 05/08/2026  
> Decisor: Yan Guilherme Oliveira da Silva  
> Implementação: ainda não iniciada

## 1. Decisão

O Persona Live será um assistente de argumentação em entrevistas baseado exclusivamente nas experiências e evidências autorizadas pelo usuário.

Ele exibirá ao mesmo tempo, mas em áreas separadas:

1. **Argumentos reais:** fatos, resultados, competências, fontes e alertas.
2. **Rascunho sugerido:** resposta curta construída a partir desses argumentos.

O sistema não responde pelo usuário. A interface deve favorecer compreensão rápida e fala natural, não leitura literal.

## 2. Abordagens consideradas

### A. Resposta completa escondida

Alta percepção de impacto, mas genérica, eticamente frágil e semelhante a copilotos que prometem respostas indetectáveis. Rejeitada.

### B. Apenas tópicos de evidência

Autêntica e simples, mas insuficiente para usuários que travam ao transformar fatos em uma resposta. Não escolhida isoladamente.

### C. Argumentos e rascunho separados

Equilibra autenticidade e apoio prático. O usuário vê primeiro os fatos e pode usar o rascunho como estrutura. **Abordagem aprovada.**

## 3. Fluxo antes da entrevista

1. Selecionar ou informar a vaga, empresa e contexto.
2. Escolher quais evidências poderão ser utilizadas.
3. Selecionar modo Manual ou Automático.
4. No Automático, confirmar privacidade e testar áudio.
5. Revisar orientações de uso responsável.
6. Iniciar a sessão.

O contexto da vaga melhora a seleção de evidências, mas não autoriza o sistema a criar fatos ausentes.

## 4. Fluxo durante a entrevista

### Modo Manual

1. O usuário digita ou cola a pergunta.
2. O sistema interpreta a intenção da pergunta.
3. Busca as evidências mais relacionadas.
4. Mostra Argumentos reais e Rascunho sugerido.
5. O usuário responde ou solicita ajuste.

### Modo Automático

1. O sistema processa áudio autorizado temporariamente.
2. Detecta que uma possível pergunta terminou.
3. Prepara a busca e sinaliza que encontrou argumentos.
4. O usuário abre ou ignora a sugestão.
5. A exibição segue o mesmo contrato do modo Manual.

O Automático não deve substituir o Manual. Se áudio ou detecção falharem, a sessão continua.

## 5. Contrato da interface

### Cabeçalho da sessão

- contexto da entrevista;
- modo ativo;
- estado de escuta quando aplicável;
- controle para pausar;
- acesso rápido ao modo Manual;
- encerramento da sessão.

### Pergunta identificada

- texto editável da pergunta;
- indicação de confiança da detecção quando aplicável;
- opção para corrigir antes de gerar novamente.

### Painel Argumentos reais

- experiência recomendada;
- contexto;
- ação do usuário;
- resultado;
- competências;
- provas e registros de origem;
- lacunas ou alertas.

### Painel Rascunho sugerido

- texto curto e escaneável;
- nenhuma informação sem correspondência nos argumentos;
- linguagem natural compatível com o perfil confirmado pelo usuário;
- ações `Encurtar`, `Aprofundar` e `Outra experiência`.

Em largura compacta, Argumentos reais aparecem antes do Rascunho sugerido. Em largura expandida, os painéis podem aparecer lado a lado, mantendo os argumentos como referência principal.

## 6. Regra de extensão

O Persona adapta automaticamente a resposta, sempre favorecendo concisão:

| Tipo de pergunta | Duração alvo |
|---|---:|
| Objetiva | 15–25 segundos |
| Comportamental ou STAR | 30–45 segundos |
| Complexa | até 60 segundos |

Respostas de 90 segundos não são geradas automaticamente. `Aprofundar` adiciona somente fatos já disponíveis.

Estrutura mínima do rascunho:

1. contexto em uma frase;
2. ação do usuário;
3. resultado;
4. aprendizado, apenas quando relevante.

## 7. Fluxo de dados conceitual

```text
Pergunta
  → identificação da intenção
  → busca nas evidências autorizadas
  → seleção e classificação de relevância
  → composição dos argumentos reais
  → geração do rascunho somente com esses argumentos
  → verificação de correspondência
  → exibição separada com fontes e alertas
```

A stack ainda não está decidida. Não adotar banco de grafos, extensão ou aplicativo desktop antes de demonstrar que o fluxo Manual entrega valor.

## 8. Regras de confiança

- Informação registrada pelo usuário pode ser usada, mas deve manter sua classificação.
- Informação documentada deve apontar para a prova autorizada.
- “Validada” exige confirmação real de terceiro.
- Fato incerto não entra silenciosamente no rascunho.
- Resultado quantitativo ausente não pode ser estimado.
- Ausência de evidência deve ser comunicada explicitamente.
- O usuário pode trocar ou excluir a experiência sugerida antes de usar a resposta.

## 9. Privacidade e ética

### Manual

- não captura a voz do entrevistador;
- processa apenas a pergunta fornecida pelo usuário.

### Automático

- exige confirmação de autorização apropriada;
- mostra estado de escuta de forma persistente;
- permite pausar imediatamente;
- usa transcrição temporária;
- não persiste áudio ou transcrição por padrão;
- descarta o conteúdo temporário ao encerrar.

Em ambos os modos:

- o Persona não promete ser indetectável;
- não orienta o usuário a ocultar uso proibido;
- informa que regras de processos seletivos podem restringir assistência;
- não usa evidências que o usuário não autorizou para aquela sessão.

## 10. Estados e recuperação de falhas

| Situação | Comportamento esperado |
|---|---|
| Pergunta não compreendida | permitir correção ou entrada Manual |
| Baixa confiança na detecção | não gerar automaticamente; pedir confirmação |
| Nenhuma evidência relacionada | informar a lacuna; não inventar |
| Mais de uma experiência forte | mostrar a principal e permitir `Outra experiência` |
| Falha de áudio | pausar escuta e manter modo Manual disponível |
| Falha de geração | preservar pergunta e argumentos recuperados para tentar novamente |
| Fato sem fonte correspondente | remover do rascunho e sinalizar inconsistência |
| Conexão interrompida | manter o conteúdo já exibido; não prometer processamento contínuo |

## 11. Escopo do MVP do Empreenda Senac

### Funcional

- entrada Manual de pergunta;
- busca em evidências previamente registradas;
- argumentos e rascunho separados;
- adaptação automática da extensão;
- rastreabilidade das informações;
- controles Encurtar, Aprofundar e Outra experiência;
- estados de erro e ausência de evidência.

### Demonstração controlada

- simulação do modo Automático identificando uma pergunta;
- indicação visual de escuta e transcrição temporária;
- transição para os mesmos painéis do modo Manual.

### Fora do MVP

- captura produtiva e multiplataforma em Meet, Zoom e Teams;
- aplicação desktop;
- extensão definitiva de navegador;
- gravação ou arquivo completo da entrevista;
- respostas técnicas ou códigos sem base na trajetória registrada.

## 12. Critérios de aceitação

1. Argumentos e rascunho aparecem simultaneamente e separados.
2. Cada afirmação do rascunho corresponde a um argumento visível.
3. Argumentos mostram sua evidência de origem.
4. O sistema não cria números, responsabilidades ou resultados ausentes.
5. A resposta inicial respeita a faixa curta adequada à pergunta.
6. `Aprofundar` não adiciona fatos externos.
7. `Outra experiência` troca a base e atualiza os dois painéis.
8. Nenhuma evidência encontrada produz um estado honesto, não uma resposta genérica.
9. Falha do modo Automático preserva acesso ao Manual.
10. Encerrar a sessão descarta transcrição temporária por padrão.

## 13. Verificação futura mínima

Quando implementado, validar com pelo menos:

- pergunta objetiva com uma evidência correspondente;
- pergunta STAR com múltiplas evidências;
- nenhuma evidência correspondente;
- resultado quantitativo ausente;
- falha de geração após recuperação dos argumentos;
- troca de experiência;
- resposta curta e aprofundada;
- interrupção do modo Automático com continuidade Manual;
- revisão visual compacta e expandida;
- navegação por teclado e anúncio acessível de estados.

## 14. Próxima etapa de planejamento

Integrar o Persona Live ao mapa de páginas e definir o primeiro resultado útil do fluxo completo: registrar uma experiência e utilizá-la imediatamente para responder uma pergunta real de entrevista. A arquitetura e a stack só devem ser escolhidas depois desse fluxo ser aprovado.
