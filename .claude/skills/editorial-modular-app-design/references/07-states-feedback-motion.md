# 07 — Estados, feedback e movimento

## Estado é parte do design

Não entregue apenas o “happy path”. Modele estados como uma máquina previsível.

## Estados de tela

- inicial;
- carregando;
- carregamento progressivo;
- conteúdo completo;
- conteúdo parcial;
- vazio inicial;
- nenhum resultado;
- offline com cache;
- offline sem cache;
- erro recuperável;
- erro fatal;
- sem permissão;
- recurso bloqueado;
- atualização disponível;
- manutenção.

## Estados de ação

- idle;
- hover;
- focus;
- pressed;
- selected;
- loading;
- success;
- error;
- disabled;
- read-only.

## Feedback imediato

Toda ação deve responder rapidamente com pelo menos um sinal:

- mudança visual;
- estado pressed;
- spinner ou progresso;
- toast;
- atualização otimista;
- vibração/haptic quando apropriado;
- mensagem inline.

Não deixe o usuário repetir a ação por falta de feedback.

## Optimistic UI

Use quando:

- a ação é provável de funcionar;
- pode ser revertida;
- a latência prejudica a fluidez.

Inclua rollback e mensagem de falha. Não use para ações financeiras, destrutivas ou irreversíveis sem garantias adequadas.

## Autosave

Estados recomendados:

```text
Editando → Salvando → Salvo
                  ↘ Falha ao salvar
Offline → Alterações pendentes → Sincronizando → Sincronizado
```

- mantenha o indicador discreto;
- não mostre “Salvo” a cada tecla de forma chamativa;
- preserve conteúdo em falhas;
- permita retry;
- mostre conflito quando necessário.

## Progresso

- indeterminado: duração desconhecida;
- determinado: progresso mensurável;
- etapas: processo com marcos reais.

Não invente percentuais. Para tarefas longas, informe o que está acontecendo e permita cancelar quando seguro.

## Erros

Uma boa mensagem responde:

1. o que aconteceu;
2. o impacto;
3. o que fazer agora.

Exemplo:

```text
Não foi possível sincronizar suas alterações.
Elas continuam salvas neste dispositivo.
[Tentar novamente]
```

Evite códigos técnicos sem tradução. Preserve detalhes técnicos em logs ou seção expandível quando o público precisa deles.

## Empty states

### Vazio inicial

Ensina valor e primeira ação.

### Nenhum resultado

Explica que filtros ou busca removeram resultados e oferece limpar ou ajustar.

### Sem permissão

Explica a restrição e indica contato, solicitação ou retorno.

## Destruição e undo

Preferência:

1. undo imediato;
2. Trash com recuperação;
3. confirmação;
4. confirmação reforçada para alto risco.

Não confirme ações rotineiras de baixo risco.

## Motion principles

- movimento explica relação espacial e mudança de estado;
- duração curta em tarefas frequentes;
- entrada e saída preservam continuidade;
- não anime todas as propriedades;
- evite movimento que bloqueia toque;
- interrupções e reversões devem funcionar;
- suporte reduced motion.

## Padrões de movimento

### Fade

Para mudança de conteúdo leve e feedback.

### Slide

Para navegação, sheets e relação espacial.

### Scale discreto

Para menus e popovers, sem “zoom dramático”.

### Shared element

Use com parcimônia quando ajuda a perceber continuidade entre lista e detalhe.

### Reorder

Itens devem mover-se suavemente e o espaço de destino precisa ser visível.

## Haptics

Use apenas quando a plataforma e o contexto justificam:

- confirmação importante;
- seleção em controle;
- limite ou erro;
- conclusão.

Não use haptic em toda interação.
