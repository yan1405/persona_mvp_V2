# 14 — Desempenho, privacidade e segurança

## Desempenho percebido

- mostre estrutura rapidamente;
- use cache e conteúdo anterior quando seguro;
- carregue conteúdo acima da dobra primeiro;
- preserve layout para evitar saltos;
- use optimistic UI em ações reversíveis;
- não bloqueie toda a tela por uma atualização local.

## Listas e conteúdo grande

- virtualização;
- paginação ou cursor;
- thumbnails;
- lazy loading;
- busca indexada;
- evitar cálculos pesados no thread principal;
- cancelar trabalho obsoleto.

## Imagens

- tamanho correto para o destino;
- compressão adequada;
- formatos modernos quando suportados;
- placeholders discretos;
- cache;
- alt text para conteúdo informativo;
- remover metadados sensíveis quando necessário.

## Movimento

- animar propriedades eficientes;
- limitar blur e filtros caros;
- testar em dispositivo intermediário;
- evitar animações simultâneas excessivas;
- reduced motion.

## Offline

Defina:

- o que funciona offline;
- o que fica somente leitura;
- o que entra em fila;
- como conflitos são resolvidos;
- como o usuário vê pendências;
- como retry acontece.

## Privacidade na UI

- minimize coleta;
- explique uso de dados;
- permita revisar e excluir quando aplicável;
- masque dados sensíveis;
- evite dados reais em screenshots, logs e fixtures;
- bloqueie previews em app switcher quando o domínio exige;
- trate clipboard e compartilhamento com cuidado.

## Autorização

- esconder um botão não substitui autorização no backend;
- explique estado sem permissão;
- não revele existência de recursos confidenciais;
- confirme mudança de papel ou compartilhamento;
- mostre escopo de acesso antes de conceder.

## Ações sensíveis

Para pagamento, exclusão permanente, alteração de credencial, assinatura ou publicação:

- confirme intenção;
- mostre objeto e consequência;
- evite submit duplicado;
- registre resultado;
- ofereça recibo, histórico ou recuperação quando possível.

## Conteúdo externo

- sanitize HTML e rich text;
- trate URLs e deep links;
- não execute conteúdo não confiável;
- indique domínio antes de sair quando necessário;
- valide uploads por tipo real e tamanho;
- não confie apenas na extensão do arquivo.

## Logs

- sem senhas, tokens, conteúdo privado ou dados pessoais desnecessários;
- IDs técnicos somente quando úteis e protegidos;
- mensagens de erro para usuário separadas de diagnóstico;
- monitore falhas sem expor conteúdo.
