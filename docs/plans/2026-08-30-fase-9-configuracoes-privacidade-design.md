# Fase 9 — Configurações, privacidade e controle de dados

> Estado: contrato aprovado por Yan em 30/08/2026.
> Implementação: autorizada após auditoria do rascunho local existente.

## 1. Objetivo e critério de sucesso

Dar ao usuário controle explícito sobre perfil, preferências, sessão e ciclo de vida dos próprios dados sem criar opções sem efeito real.

A fase está correta quando o usuário consegue:

1. atualizar nome, momento profissional, objetivo, lembrete e comunicação opcional;
2. consultar a conta Microsoft conectada e encerrar a sessão;
3. exportar uma cópia documentada de todos os dados do Persona que pertencem à sua conta;
4. excluir permanentemente conta e dados somente depois de reautenticação Microsoft recente e confirmação textual forte;
5. entender o impacto, o sucesso e as falhas de cada ação.

O produto permanece somente em português do Brasil nesta fase. Não será criada uma preferência de idioma sem tradução funcional correspondente.

## 2. Abordagens avaliadas

### Confirmação textual isolada

Menor implementação, mas uma sessão deixada aberta seria suficiente para excluir toda a conta. Rejeitada por proteção insuficiente.

### Reautenticação Microsoft + `EXCLUIR`

Exige que a Microsoft autentique novamente o usuário, cria uma autorização curta e específica para exclusão e ainda solicita confirmação textual. Aprovada por Yan.

### Exclusão agendada e recuperável

Ofereceria prazo de recuperação, mas exigiria fila, retenção, cancelamento e operação adicional. Adiada até existir necessidade real.

## 3. Arquitetura de informação e interface

Configurações permanece no rodapé da navegação principal. A área usa uma navegação secundária estável:

- `/app/configuracoes` — Perfil e preferências;
- `/app/configuracoes/dados` — Dados e privacidade;
- `/app/configuracoes/conta` — Conta Microsoft e sessão.

As telas seguem o Design DNA atual: conteúdo operacional compacto, Geist, superfícies neutras, divisores de 1 px, Carbon para navegação e roxo Persona somente para ação primária e foco. Não serão adicionados cards, sombras ou animações decorativas.

Estados obrigatórios:

- carregado e sessão expirada;
- formulário ocioso, salvando, salvo e falha com valores preservados;
- exportação disponível e falha recuperável;
- reautenticação necessária, autorizada e expirada;
- confirmação destrutiva incompleta, executando, falha e conclusão;
- encerramento de sessão.

## 4. Perfil e preferências

O formulário reutiliza as regras do onboarding para:

- nome entre 2 e 80 caracteres;
- momento profissional pertencente ao conjunto aprovado;
- objetivo entre 8 e 180 caracteres;
- lembrete opcional com horário válido quando ativado;
- comunicações opcionais sem interferir no acesso ao produto.

A validação HTML fornece resposta imediata, mas o servidor repete todas as regras antes de persistir. O consentimento obrigatório do produto e sua data não são editáveis nesta fase. O lembrete continua sendo apenas uma preferência persistida; envio de notificações permanece fora do escopo.

## 5. Exportação

A exportação usa uma rota autenticada e consultas sujeitas a RLS. O JSON contém versão do formato, data da exportação e conjuntos nomeados:

- perfil;
- Daily Logs;
- sugestões de evidência;
- evidências e fontes;
- diagnósticos e snapshots do Narrative Score;
- sessões, evidências autorizadas, perguntas e versões do Persona Live;
- Artefatos, fontes e versões.

O arquivo não contém tokens, cookies, segredos, credenciais do provedor nem registros de outros usuários. Qualquer falha de consulta interrompe a exportação inteira com mensagem segura; não será entregue um arquivo silenciosamente incompleto.

## 6. Exclusão permanente

Fluxo aprovado:

1. o usuário solicita excluir a conta;
2. o Persona inicia OAuth Microsoft com `prompt=login` e retorno seguro para Dados e privacidade;
3. o callback registra no banco uma autorização curta e vinculada ao usuário e à finalidade `delete_account`;
4. a tela informa que a identidade foi confirmada e solicita o texto exato `EXCLUIR`;
5. uma RPC `security definer`, com `search_path` restrito, valida usuário, finalidade, validade e confirmação dentro da mesma transação;
6. a RPC consome a autorização e remove `auth.users`; as chaves estrangeiras `on delete cascade` removem os dados relacionados;
7. a sessão é encerrada e o usuário retorna à entrada com confirmação.

A autorização é de uso único e expira em cinco minutos. A migração não usa `service role` no cliente. Falha em qualquer verificação não remove dados.

## 7. Segurança, testes e limites

Validações mínimas:

- testes unitários da validação de perfil e do retorno seguro de autenticação;
- teste da exportação para erro em qualquer consulta e ausência de segredos;
- teste SQL com dois usuários para RLS, autorização expirada, finalidade incorreta, confirmação incorreta e exclusão própria;
- fluxo autenticado completo de reautenticação e exclusão apenas com uma conta descartável explicitamente autorizada;
- teclado, foco, texto ampliado e larguras desktop 1024, 1280, 1440 e 1920 px;
- lint, TypeScript, testes, build, auditor `design-sem-cara-de-ia` e revisão Ponytail `full`.

Não excluir a conta principal de Yan nem os registros de QA existentes. Não aplicar a migração ou publicar sem autorização específica imediatamente antes dessas ações.

## 8. Fora do escopo

- tradução para inglês ou seletor de idioma sem efeito;
- upload e remoção de arquivos no Storage;
- exclusão agendada, lixeira ou recuperação de conta;
- gestão de múltiplas identidades Microsoft;
- histórico de dispositivos e encerramento remoto de outras sessões;
- notificações reais do lembrete;
- revisão jurídica final dos textos de Termos e Privacidade.

## 9. Estratégia de implementação

Preservar o rascunho local apenas onde ele respeitar este contrato. Reutilizar validação, Supabase SSR, PKCE, RLS, componentes e tokens existentes. Não adicionar dependências, store global, serviço de exportação separado ou abstrações preventivas.

Ordem:

1. validar e salvar perfil;
2. concluir navegação secundária e logout;
3. tornar a exportação completa e fail-closed;
4. implementar autorização curta de reautenticação;
5. implementar exclusão transacional;
6. testar, revisar visualmente, registrar o handoff e somente então solicitar autorização para migração e publicação.
