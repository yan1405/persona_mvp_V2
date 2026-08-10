# 10 — Arquitetura de código

## Princípios

- siga a stack existente;
- separe domínio, dados, estado e apresentação;
- use componentes semânticos;
- centralize tokens;
- evite telas monolíticas;
- preserve testabilidade;
- introduza dependências apenas com justificativa.

## Estrutura conceitual

```text
app/
components/
  primitives/
  navigation/
  forms/
  feedback/
  data-display/
  blocks/
features/
  <feature>/
    components/
    hooks-or-state/
    services/
    types/
    tests/
design-system/
  tokens/
  themes/
  icons/
lib/
assets/
tests/
```

Adapte ao framework. Não reorganize um projeto inteiro apenas para coincidir com esta árvore.

## Componentes

- primitive: baixo nível e semântica visual;
- composite: combinação reutilizável;
- feature component: específico do domínio;
- screen/page: orquestra layout e dados.

Evite passar dezenas de props de estilo para um primitive. Defina variantes.

## Estado

Classifique:

- estado local de interação;
- estado de formulário;
- estado de rota;
- estado servidor/cache;
- estado global real;
- estado persistido.

Não coloque tudo em uma store global.

## Dados assíncronos

- loading, error, stale e retry explícitos;
- cancelamento de requests quando necessário;
- cache e invalidação previsíveis;
- optimistic update com rollback;
- paginação ou cursor;
- proteção contra respostas fora de ordem.

## Formulários

- validação no cliente para feedback;
- validação no servidor para segurança;
- schema compartilhado quando viável;
- mensagens por campo;
- preservação de draft;
- prevenção de submit duplicado;
- acessibilidade e autofill.

## Tokens

Fonte canônica única. Gere adaptações para plataforma quando necessário.

Evite:

```text
<brand-color> repetida em 40 arquivos
padding: 17 em uma tela isolada
border-radius diferente em cada componente
```

Prefira:

```text
color.action.primary
space.control.inline
radius.control
```

## Temas

- tema claro e escuro com tokens semânticos;
- não condicionar cores diretamente em cada componente;
- suporte a sistema e preferência manual quando o produto pede;
- persistência da preferência;
- evitar flash de tema no web.

## Ícones

Crie wrapper ou convenção comum para:

- tamanho;
- stroke/weight;
- cor;
- label acessível;
- direção RTL;
- estado ativo.

## Testes

### Unitários

- formatadores;
- reducers/state machines;
- validações;
- utilitários;
- transformação de tokens.

### Componentes

- variantes;
- estados;
- eventos;
- acessibilidade;
- texto longo;
- loading/erro.

### Integração

- formulário;
- navegação;
- busca/filtro;
- autosave;
- offline/retry.

### E2E

- fluxo principal;
- autenticação;
- criação/edição;
- ação destrutiva e recuperação;
- responsividade crítica.

### Visual regression

Use quando a stack possui suporte. Compare componentes e telas em larguras representativas.

## Observabilidade de execução

Ao executar comandos:

- registre etapa atual;
- preserve stdout/stderr;
- informe duração;
- pare em erro crítico;
- diferencie warning de failure;
- não declare sucesso sem código de saída ou evidência equivalente.

## Migração e refatoração

- faça mudanças incrementais;
- mantenha compatibilidade;
- crie adapters quando necessário;
- migre tokens e componentes por domínio;
- remova código antigo apenas após confirmar uso;
- rode busca por referências antes de excluir.

## Dependências

Antes de adicionar uma biblioteca, verifique:

- se o projeto já possui solução equivalente;
- tamanho e impacto;
- manutenção;
- compatibilidade de plataforma;
- acessibilidade;
- licenciamento;
- necessidade real.
