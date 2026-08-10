#!/usr/bin/env bash
set -Eeuo pipefail

SKILL_NAME="editorial-modular-app-design"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SOURCE_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
SCOPE="${1:-user}"
PROJECT_PATH="${2:-$(pwd)}"
FORCE="${FORCE:-0}"

log() {
  local level="$1"
  shift
  printf '[%s] [%s] %s\n' "$(date '+%Y-%m-%d %H:%M:%S')" "$level" "$*"
}

on_error() {
  local exit_code=$?
  log ERROR "Instalação interrompida na linha $1 com código $exit_code."
  exit "$exit_code"
}
trap 'on_error $LINENO' ERR

log INFO "Início da instalação da skill '$SKILL_NAME'."
log INFO "Origem: $SOURCE_ROOT"

if [[ ! -f "$SOURCE_ROOT/SKILL.md" ]]; then
  log ERROR "SKILL.md não encontrado na origem."
  exit 1
fi

log INFO "Etapa 1/4: validando o pacote."
if command -v python3 >/dev/null 2>&1; then
  python3 "$SOURCE_ROOT/scripts/validate_skill.py"
elif command -v python >/dev/null 2>&1; then
  python "$SOURCE_ROOT/scripts/validate_skill.py"
else
  log WARN "Python não encontrado. A validação automática foi ignorada."
fi

log INFO "Etapa 2/4: resolvendo o destino."
case "$SCOPE" in
  user)
    DESTINATION="$HOME/.claude/skills/$SKILL_NAME"
    ;;
  project)
    PROJECT_PATH="$(cd "$PROJECT_PATH" && pwd)"
    DESTINATION="$PROJECT_PATH/.claude/skills/$SKILL_NAME"
    ;;
  *)
    log ERROR "Escopo inválido. Use 'user' ou 'project'."
    exit 2
    ;;
esac

log INFO "Destino: $DESTINATION"

if [[ -e "$DESTINATION" && "$FORCE" != "1" ]]; then
  log ERROR "O destino já existe. Execute com FORCE=1 para substituir."
  exit 3
fi

log INFO "Etapa 3/4: copiando arquivos."
mkdir -p "$(dirname "$DESTINATION")"
rm -rf "$DESTINATION"
cp -R "$SOURCE_ROOT" "$DESTINATION"

log INFO "Etapa 4/4: verificando a instalação."
if [[ ! -f "$DESTINATION/SKILL.md" ]]; then
  log ERROR "SKILL.md não foi localizado no destino."
  exit 4
fi

FILE_COUNT="$(find "$DESTINATION" -type f | wc -l | tr -d ' ')"
log SUCCESS "Instalação concluída. $FILE_COUNT arquivo(s) copiado(s)."
printf '\nUse no Claude Code:\n/%s <sua tarefa>\n' "$SKILL_NAME"
