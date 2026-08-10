# Paletas e tipografia — conjunto curado para escolher, não para o modelo inventar

Pedir para a IA "escolher uma cor bonita" ou "escolher uma fonte moderna" devolve a média. Escolher a partir de um conjunto já filtrado por critério humano produz um resultado acima da média antes mesmo da primeira decisão de layout. Trate as tabelas abaixo como cardápio: escolha uma linha inteira, documente como token, e mantenha em toda a peça — misturar linhas de direções diferentes recria o problema que este cardápio existe para evitar.

Nenhuma destas é a única resposta certa. São pontos de partida deliberados, o oposto do vazio que o modelo preenche sozinho. Ajuste o hex exato à identidade real do produto sempre que houver marca já definida.

## Pares tipográficos

| Direção | Display (títulos) | Corpo | Personalidade | Bom para |
|---|---|---|---|---|
| Editorial autoral | Fraunces ou Playfair Display | Source Serif 4 ou Newsreader | Serifada com peso, autoridade de publicação | Conteúdo longo, marca pessoal, produto que vende expertise |
| Técnico/dev | Space Grotesk ou IBM Plex Sans | JetBrains Mono (para código/dados) + IBM Plex Sans (corpo) | Precisão, nada decorativo | Ferramenta para desenvolvedores, produto de infraestrutura |
| Grotesca com calor | Bricolage Grotesque | General Sans ou Inter (deliberado, não default) | Moderno sem ser frio | Produto de consumo, marca jovem sem ser infantil |
| Minimalismo suíço | Archivo ou Neue Haas Grotesk | Public Sans | Rigor, grid visível, zero ornamento | Dashboard denso, produto B2B sério |
| Serifada + sans de contraste | GT Sectra (ou Spectral) no display + Söhne/Inter no corpo | — | Premium, peso editorial em título, leveza no corpo | Fintech, produto que precisa comunicar confiança |
| Monoespaçada como assinatura | Space Mono ou JetBrains Mono no display | Work Sans no corpo | Técnico, quase brutalista | Produto de dado/analytics, ferramenta interna |
| Display condensado | Archivo Expanded ou Chivo no display, peso alto | DM Sans no corpo | Impacto, cartaz, energia | Landing page de lançamento, produto com tom de manifesto |
| Serifada itálica de assinatura | Instrument Serif (peso único, uso pontual em destaque) | Inter ou Geist no corpo | Toque autoral sem reformular tudo | Peça que já usa Inter no sistema e precisa de um único ponto de personalidade |

Regra prática: a fonte de display carrega a personalidade e aparece pouco (títulos, poucos números grandes); a fonte de corpo é neutra e aparece muito (parágrafos, labels, dados). Nunca inverter — corpo com personalidade cansa a leitura, display neutro não assina nada.

## Direções de paleta (fuja do roxo-índigo não escolhido)

Cada linha traz 4–6 cores nomeadas por função, não por posição no gradiente. Adapte o hex exato à marca; mantenha a lógica de papel semântico.

| Direção | Base/fundo | Texto principal | Acento primário | Acento secundário | Estado (sucesso/aviso) | Onde funciona |
|---|---|---|---|---|---|---|
| Terracota sóbria | `#F4F1EA` (creme) | `#221F1B` | `#B5502F` (terracota) | `#5C6B57` (verde oliva) | `#2E7D5B` / `#B5502F` | Marca com calor humano, produto de bem-estar ou serviço |
| Navy preciso | `#0B1120` (quase preto azulado) | `#E8EAF0` | `#4F7CFF` (azul definido, não gradiente) | `#8B93A7` (cinza-azulado) | `#2FBF71` / `#E0A63C` | Fintech, produto que vende estabilidade |
| Papel e tinta | `#FAFAF7` | `#1A1A18` | `#0F172A` (quase preto, sem cor de destaque) | `#8A8577` (bege escuro) | usar peso tipográfico, não cor | Editorial, produto que vende clareza de leitura |
| Verde técnico | `#F7F8F5` | `#14261F` | `#1F6F4A` (verde escuro) | `#B8863B` (mostarda) | `#1F6F4A` / `#C6482D` | Sustentabilidade, agro, produto técnico com identidade orgânica |
| Contraste alto de marca | `#FFFFFF` | `#0A0A0A` | uma única cor de marca saturada (ex.: `#E8483C`) | preto/branco apenas | mesma cor de acento, variando opacidade | Produto que já tem cor de marca forte e quer reforçá-la, não diluí-la |
| Escuro com um acento | `#111114` | `#F2F2F0` | `#D9C77A` (dourado envelhecido) ou `#7FB3A3` (verde-água) | cinza `#5A5A5F` | `#7FB3A3` / `#C97B4A` | Produto premium noturno, ferramenta criativa |

Observação sobre gradiente: se o briefing pedir gradiente, prefira gradiente de um único matiz variando em luminosidade (por exemplo, do acento primário para uma versão 20% mais escura dele mesmo) a um gradiente multicromático azul-roxo. Isso preserva profundidade sem reproduzir o tell mais reconhecível de 2026.

## Sistema espacial — especificar junto com a cor

Cor e tipografia chamam atenção primeiro, mas espaçamento e alinhamento respondem por boa parte de como a interface "sente". Ao fechar o sistema de restrições da fase 3 do SKILL.md, declare também:

```
Layout:
- Grid de 12 colunas, calhas de 80px em desktop
- Conteúdo do hero nas colunas 2–8 (assimétrico, não centralizado)
- Ritmo do corpo: base de 8px; todo espaçamento vertical é múltiplo de 24px
- Divisores de seção: 1px sólido rgba(0,0,0,0.08) — nunca sombra
- Hero: máximo 70vh; padding de seção de 60px, não 120–200px
```

Esse bloco, aplicado de forma consistente, faz mais pela sensação de "alguém desenhou isso" do que qualquer ajuste de cor isolado.
