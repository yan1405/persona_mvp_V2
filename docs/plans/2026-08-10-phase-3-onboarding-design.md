# Fase 3 — Onboarding funcional

Status: aprovado para implementação por Yan em 10/08/2026.

## Objetivo e critério de sucesso

Uma pessoa autenticada pela Microsoft deve concluir o primeiro uso sem tour promocional: confirmar contexto, decidir consentimentos, configurar opcionalmente um lembrete e registrar um Daily Log real. A conclusão persiste no Supabase e termina em `/app/inicio`, onde o produto informa que ainda não há dados suficientes para um score.

## Abordagens avaliadas

1. **Uma rota, quatro etapas e uma gravação final — escolhida.** Mantém contexto, evita estados parciais e usa um único formulário com validação nativa e no servidor.
2. **Quatro rotas independentes.** Facilitaria URLs por etapa, mas acrescentaria navegação, recuperação e persistência intermediária sem valor no MVP.
3. **Salvar cada etapa automaticamente.** Aumentaria chamadas, estados de sincronização e risco de onboarding parcialmente concluído.

## Contrato de interface

- rota única `/onboarding`, desktop-first e utilizável a partir de 1024px;
- progresso textual `Etapa N de 4`, sem abas clicáveis;
- uma pergunta principal por etapa, ações `Voltar` e `Continuar` previsíveis;
- nome confirmado pela Microsoft, momento profissional e objetivo principal;
- consentimento obrigatório para tratamento dos dados do produto separado de comunicações opcionais;
- lembrete desativado por padrão; horário só aparece quando habilitado;
- primeiro Daily Log com conteúdo real e mínimo suficiente para estruturação posterior;
- estado de envio desabilita repetição e erro aparece junto às ações;
- saída autenticada em `/app/inicio`, com estado inicial explícito e sem score inventado.

## Contrato de dados e segurança

- `profiles`: contexto mínimo, consentimentos, lembrete e conclusão do onboarding;
- `daily_logs`: texto bruto de autoria do usuário, antes de qualquer estruturação por IA;
- todas as linhas privadas possuem `user_id`/`id` ligado a `auth.users`;
- RLS limita leitura e escrita ao próprio `auth.uid()`;
- uma função transacional conclui o perfil e o primeiro log juntos;
- a Server Action reconfirma autenticação e valida todos os limites no servidor;
- conteúdo do Daily Log, tokens e sessão não entram em logs técnicos;
- nenhum segredo novo e nenhuma dependência de runtime nova.

## Limite desta fase

A Fase 3 não chama a Groq, não estrutura evidências e não calcula Narrative Score. A chave da Groq será solicitada somente quando a fase que realmente fizer a primeira chamada de IA estiver pronta para configuração.
