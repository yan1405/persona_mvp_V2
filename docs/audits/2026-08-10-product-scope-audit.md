# Auditoria de Escopo do Persona MVP v2

Data: 10/08/2026  
Status: concluída para orientar o novo mapa de telas  
Escopo: produto, funções históricas, Artefatos, competição e descarte do protótipo legado

## 1. Fontes auditadas

- `persona_mvp_v2/AGENTS.md` e todos os documentos ativos da v2;
- `Persona Empreenda/00_documentacao/` e a apresentação v1.2 da competição;
- `99_lixo/persona_v1/AGENTS.md`, `CLAUDE.md`, checklist, status, rotas, schema e telas de Artefatos;
- código e screenshots do CRM em `C:\Users\yansi\Projetos\crm`, somente como direção visual;
- `design-dna.json` e skills obrigatórias de design.

A interface da Persona v1 não foi usada como referência visual. A v1 foi consultada somente para recuperar funções e regras que poderiam ter sido omitidas.

## 2. Conclusão central

O núcleo completo do Persona não é apenas `evidência → Persona Live`. O ciclo auditado é:

`Daily Log → extração assistida → revisão humana → evidência → síntese narrativa → ativação no Persona Live ou em Artefatos`

O sistema precisa preservar quatro camadas:

1. **Memória:** Daily Logs e fontes originais.
2. **Evidência:** fatos estruturados, competências e provas.
3. **Síntese:** Narrative Score, padrões e evolução.
4. **Ativação:** Persona Live e Artefatos profissionais.

## 3. Matriz de funções

| Função | Decisão v2 | Observação |
|---|---|---|
| Login Microsoft | Preservar como obrigatório | Substitui e-mail/senha local da v1. |
| Onboarding | Simplificar | Perfil mínimo, consentimento, lembrete opcional e primeiro Daily Log. |
| Daily Log em texto | Preservar como núcleo | Entrada recorrente de baixa fricção. |
| Daily Log por voz | Preservar no sistema completo | Processa somente a voz do usuário; exige contrato próprio de privacidade e falha. |
| Lembrete de registro | Preservar como opcional | Nunca bloquear o onboarding. |
| Estruturação assistida | Preservar e fortalecer | IA sugere; usuário revisa antes de virar evidência confirmada. |
| Biblioteca de Evidências | Preservar como núcleo | Busca, filtros, detalhe, fontes, qualidade e uso. |
| Níveis de evidência | Preservar com rigor | Registrada e documentada no MVP; validada/certificada somente com confirmação real. |
| Narrative Score | Reposicionar | KPIs explicáveis no Início; detalhe contextual, sem destino principal no trilho. |
| Consistência | Preservar | Métrica determinística de regularidade. |
| Coerência | Preservar com transparência | Síntese assistida sobre registros/evidências, com explicação. |
| Credibilidade | Estado limitado | Sem número enquanto não houver validação real. Nunca simular. |
| Histórico/evolução | Preservar | Visão ligada aos KPIs e eventos de origem. |
| Persona Live Manual | P0 funcional | Pergunta manual, argumentos e rascunho separados. |
| Persona Live Automático | Demonstração controlada | Não afirmar integração produtiva com plataformas de reunião. |
| Artefatos | Restaurar como área principal | Biblioteca, criação, revisão, rastreabilidade e exportação. |
| Perfil e preferências | Preservar | Dados mínimos, idioma e lembretes. |
| Exportar/excluir dados | Preservar como obrigatório | Controle do usuário e privacidade. |
| Termos e privacidade | Preservar | Revisão jurídica continua necessária antes de uso externo real. |
| Paywall e billing | Remover desta fase | MVP gratuito; nenhuma tela de upgrade necessária. |
| PWA/mobile | Adiar | Desktop/web é a plataforma atual. |
| Relatório semanal | Adiar | Visão futura, não é Artefato central do MVP. |
| Análise de mercado | Adiar e revalidar | Não construir scraping ou pesquisa autônoma nesta fase. |
| Rede social/validação por pares | Adiar | Credibilidade futura, fora do MVP inicial. |

## 4. Inventário obrigatório de Artefatos do produto

Artefato é um material profissional produzido com evidências autorizadas. Todo Artefato deve nascer como rascunho, mostrar fontes, permitir revisão humana e somente depois ser copiado ou exportado.

| Tipo | Origem no projeto | Entregável mínimo |
|---|---|---|
| Resposta STAR | Implementada na v1 | Situação, Tarefa, Ação e Resultado editáveis. |
| Resposta do Persona Live | Aprovada na v2 | Argumentos reais + rascunho salvo após a sessão. |
| Pitch pessoal | Visão histórica aprovada | Versão curta e editável baseada na trajetória. |
| Carta de apresentação | Visão histórica aprovada | Carta contextualizada para oportunidade informada. |
| Currículo | Promessa funcional da v2 | Resumo e experiências sustentados por evidências. Escopo de layout/exportação ainda será especificado. |
| Portfólio profissional | Visão histórica aprovada | Estrutura de casos/evidências selecionadas pelo usuário. |

Estados obrigatórios:

- `Rascunho`;
- `Revisado`;
- `Exportado` ou `Copiado`, conforme o tipo;
- falha de geração sem perda do contexto informado;
- ausência de evidência suficiente;
- fontes removidas ou alteradas após a geração.

Capacidades comuns:

- escolher tipo e objetivo;
- informar contexto da oportunidade;
- sugerir evidências e permitir troca;
- gerar sem inventar fatos;
- editar conteúdo;
- ver evidências de origem;
- salvar versão;
- copiar ou exportar em formato adequado ao tipo.

Os formatos finais de PDF/DOCX não devem ser prometidos antes da especificação e validação técnica de cada Artefato.

## 5. Entregáveis da competição — trilha separada

Estes itens não são páginas do produto, mas o projeto não pode esquecê-los:

- Plano Empreendedor/Sumário Executivo vigente;
- Portfólio de Evidências;
- Pitch Deck;
- PDF único com Portfólio + Pitch Deck conforme regras registradas;
- Vídeo de Apoio de até um minuto;
- evidências de validação com usuários;
- narrativa de ODS 4 e 8;
- demonstração funcional do MVP para a banca.

Decisões que afetarem produto e competição devem continuar marcadas como `[CRUZADO]`.

## 6. Lacunas encontradas nos documentos da v2

1. Daily Log não aparecia com força suficiente no briefing inicial da v2.
2. Narrative Score havia sido transformado em área principal sem necessidade; o usuário prefere KPIs no Início.
3. Artefatos não tinham tipos nem entregáveis definidos.
4. Currículo aparecia na promessa, mas não no inventário de Artefatos.
5. Lembretes, voz, histórico e estados de credibilidade estavam pouco explícitos.
6. O mapa anterior fragmentava criação e detalhe em páginas quando o padrão visual do CRM favorece painéis contextuais.
7. Entregáveis do produto e da competição estavam semanticamente misturados.

## 7. Decisões para o novo mapa

- Narrative Score aparece como KPIs no Início e abre detalhe contextual.
- Daily Log é uma área principal própria.
- Artefatos substitui o nome genérico Produções.
- Início, Diário, Evidências, Persona Live e Artefatos são os cinco destinos principais.
- Configurações fica separada no rodapé do trilho.
- detalhes de log, evidência, score e Artefato usam painel lateral com deep link, seguindo o padrão estrutural do CRM.
- tabs são usadas apenas para visões irmãs do mesmo objeto; filtros não viram tabs.
- nenhuma página de monetização entra no MVP gratuito.

## 8. Destino do legado

Após esta auditoria e a atualização dos documentos ativos, `persona_v1` foi movido de forma recuperável para `Persona_Geral/99_lixo/persona_v1`. O conteúdo permanece disponível como arquivo histórico, mas deixou de ser uma fonte ativa ou visual do MVP v2.
