[CmdletBinding()]
param(
    [ValidateSet('User', 'Project')]
    [string]$Scope = 'User',

    [string]$ProjectPath = (Get-Location).Path,

    [switch]$Force,

    [switch]$SkipValidation
)

$ErrorActionPreference = 'Stop'
$SkillName = 'editorial-modular-app-design'
$SourceRoot = (Resolve-Path (Join-Path $PSScriptRoot '..')).Path

function Write-Log {
    param(
        [ValidateSet('INFO', 'WARN', 'ERROR', 'SUCCESS')]
        [string]$Level,
        [string]$Message
    )
    $timestamp = Get-Date -Format 'yyyy-MM-dd HH:mm:ss'
    Write-Host "[$timestamp] [$Level] $Message"
}

try {
    Write-Log INFO "Início da instalação da skill '$SkillName'."
    Write-Log INFO "Origem: $SourceRoot"

    if (-not (Test-Path (Join-Path $SourceRoot 'SKILL.md') -PathType Leaf)) {
        throw "SKILL.md não encontrado na origem."
    }

    if (-not $SkipValidation) {
        Write-Log INFO 'Etapa 1/4: validando o pacote.'
        $python = Get-Command python -ErrorAction SilentlyContinue
        if (-not $python) {
            $python = Get-Command py -ErrorAction SilentlyContinue
        }

        if ($python) {
            if ($python.Name -eq 'py.exe' -or $python.Name -eq 'py') {
                & $python.Source -3 (Join-Path $SourceRoot 'scripts\validate_skill.py')
            }
            else {
                & $python.Source (Join-Path $SourceRoot 'scripts\validate_skill.py')
            }
            if ($LASTEXITCODE -ne 0) {
                throw "A validação falhou com código $LASTEXITCODE."
            }
        }
        else {
            Write-Log WARN 'Python não encontrado. A validação automática foi ignorada.'
        }
    }
    else {
        Write-Log WARN 'Validação ignorada por -SkipValidation.'
    }

    Write-Log INFO 'Etapa 2/4: resolvendo o destino.'
    if ($Scope -eq 'User') {
        $Destination = Join-Path $HOME ".claude\skills\$SkillName"
    }
    else {
        $ResolvedProject = (Resolve-Path $ProjectPath).Path
        $Destination = Join-Path $ResolvedProject ".claude\skills\$SkillName"
    }

    Write-Log INFO "Destino: $Destination"

    if ((Test-Path $Destination) -and -not $Force) {
        throw "O destino já existe. Use -Force para substituir: $Destination"
    }

    Write-Log INFO 'Etapa 3/4: copiando arquivos.'
    $DestinationParent = Split-Path $Destination -Parent
    New-Item -ItemType Directory -Path $DestinationParent -Force | Out-Null

    if (Test-Path $Destination) {
        Remove-Item $Destination -Recurse -Force
    }

    Copy-Item $SourceRoot $Destination -Recurse -Force

    Write-Log INFO 'Etapa 4/4: verificando a instalação.'
    $InstalledSkill = Join-Path $Destination 'SKILL.md'
    if (-not (Test-Path $InstalledSkill -PathType Leaf)) {
        throw "A cópia terminou, mas SKILL.md não foi localizado no destino."
    }

    $fileCount = (Get-ChildItem $Destination -Recurse -File).Count
    Write-Log SUCCESS "Instalação concluída. $fileCount arquivo(s) copiado(s)."
    Write-Host ""
    Write-Host "Use no Claude Code:"
    Write-Host "/$SkillName <sua tarefa>"
}
catch {
    Write-Log ERROR $_.Exception.Message
    exit 1
}
