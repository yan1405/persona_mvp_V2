# 13 — Conteúdo e UX writing

## Voz

- clara;
- direta;
- humana;
- breve;
- específica;
- respeitosa;
- sem jargão desnecessário.

## Ações

Use verbo + objeto quando o contexto não é óbvio:

- Criar projeto;
- Salvar alterações;
- Enviar convite;
- Excluir tarefa;
- Tentar novamente.

Evite:

- OK;
- Continuar, quando não diz o resultado;
- Confirmar, sem explicar o que será confirmado;
- Sim/Não em perguntas complexas.

## Títulos

- descrevem a tarefa ou conteúdo;
- sentence case;
- não repetem toda a navegação;
- evitam slogans em telas operacionais.

## Labels

- persistentes;
- curtos;
- específicos;
- alinhados ao vocabulário do usuário;
- não dependem de placeholder.

## Ajuda

- mostre antes do erro quando o requisito é incomum;
- mantenha próxima ao campo;
- explique formato com exemplo realista;
- não sobrecarregue todos os campos com texto auxiliar.

## Erros

Ruim:

```text
Erro 400. Requisição inválida.
```

Melhor:

```text
Não foi possível salvar o projeto.
Revise os campos destacados e tente novamente.
```

Inclua detalhes técnicos somente quando o público precisa ou em área copiável.

## Empty state

Estrutura:

```text
Título: estado atual
Corpo: valor ou motivo
CTA: primeira ação
```

Exemplo:

```text
Nenhuma nota ainda
Crie uma nota para registrar ideias e organizar referências.
[Criar nota]
```

## Permissões

Antes do prompt do sistema:

- explique o recurso;
- explique o benefício;
- diga quando será usado;
- ofereça alternativa quando possível.

## Confirmação destrutiva

- nomeie o objeto;
- explique impacto;
- diga se pode ser recuperado;
- ação destrutiva com verbo explícito;
- cancelamento seguro.

## IA generativa

- não trate saída como verdade garantida;
- informe quando foi gerada;
- ofereça revisão e edição;
- cite fontes quando o produto suporta;
- mantenha feedback de streaming e cancelamento;
- explique uso de dados quando relevante.

## Localização

- evite texto dentro de imagens;
- use parâmetros e plurais do sistema;
- não concatene frases;
- prepare expansão de 30–50%;
- use formatos locais;
- revise termos culturalmente ambíguos.
