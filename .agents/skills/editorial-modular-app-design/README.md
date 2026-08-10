# Editorial Modular App Design — Claude Code Skill

Skill reutilizável para criar, implementar, refatorar e auditar interfaces de aplicativos com:

- minimalismo editorial;
- composição modular e baseada em blocos;
- conteúdo como protagonista;
- superfícies neutras e cor de destaque controlada;
- revelação progressiva;
- edição contextual e manipulação direta;
- responsividade, acessibilidade e qualidade de produção.

A skill é genérica. Ela não fixa a identidade do Persona nem obriga o uso de roxo. A paleta, a tipografia e a linguagem de marca são inferidas do projeto ou definidas por briefing.

## Estrutura

```text
editorial-modular-app-design-skill/
├── SKILL.md
├── README.md
├── references/
├── templates/
├── examples/
├── scripts/
└── dist/
```

O `SKILL.md` contém o fluxo principal. Os arquivos em `references/` mantêm o conteúdo detalhado fora do contexto até ser necessário.

## Instalação pessoal no Windows

Abra o PowerShell dentro da pasta descompactada e execute:

```powershell
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass -Force
.\scripts\install.ps1 -Scope User
```

A skill será copiada para:

```text
%USERPROFILE%\.claude\skills\editorial-modular-app-design\
```

## Instalação em um projeto no Windows

Dentro da pasta descompactada:

```powershell
.\scripts\install.ps1 -Scope Project -ProjectPath "C:\caminho\do\projeto"
```

Destino:

```text
<projeto>\.claude\skills\editorial-modular-app-design\
```

## Instalação em macOS, Linux ou WSL

```bash
chmod +x scripts/install.sh
./scripts/install.sh user
```

Para um projeto:

```bash
./scripts/install.sh project /caminho/do/projeto
```

## Instalação manual

Copie esta pasta completa e renomeie o diretório final para:

```text
editorial-modular-app-design
```

Use um dos destinos:

```text
~/.claude/skills/editorial-modular-app-design/
```

ou:

```text
<projeto>/.claude/skills/editorial-modular-app-design/
```

## Validação

```powershell
python .\scripts\validate_skill.py
```

ou:

```bash
python3 scripts/validate_skill.py
```

O validador verifica o frontmatter, arquivos obrigatórios, referências internas e estrutura do pacote.

## Uso

Invocação direta:

```text
/editorial-modular-app-design Criar o fluxo de onboarding de um aplicativo financeiro em React Native.
```

```text
/editorial-modular-app-design Auditar a interface atual, identificar inconsistências e refatorar o design system.
```

```text
/editorial-modular-app-design Criar um app de notas mobile com editor em blocos, busca, tags, offline e modo escuro.
```

O Claude também pode carregar a skill automaticamente quando o pedido corresponder à descrição do frontmatter.

## Versão de arquivo único

A pasta `dist/` contém uma versão consolidada. Ela é útil para ambientes em que você deseja trabalhar com apenas um `SKILL.md`, porém a versão modular é recomendada para reduzir o uso de contexto.
