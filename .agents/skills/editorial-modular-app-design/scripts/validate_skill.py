#!/usr/bin/env python3
"""Validate the Editorial Modular App Design Claude Code skill.

Dependency-free validator with timestamped execution monitoring.
"""

from __future__ import annotations

import re
import sys
from datetime import datetime
from pathlib import Path


REQUIRED_FILES = [
    "SKILL.md",
    "README.md",
    "references/01-design-language.md",
    "references/02-design-tokens.md",
    "references/03-layout-responsive.md",
    "references/04-navigation-information-architecture.md",
    "references/05-components-patterns.md",
    "references/06-block-editor-data-views.md",
    "references/07-states-feedback-motion.md",
    "references/08-accessibility-inclusion.md",
    "references/09-platform-guidelines.md",
    "references/10-code-architecture.md",
    "references/11-quality-assurance.md",
    "references/12-deliverables.md",
    "references/13-content-ux-writing.md",
    "references/14-performance-security.md",
    "references/15-reference-sources.md",
    "references/16-visual-validation.md",
    "templates/app-brief.md",
    "templates/design-tokens.json",
    "templates/screen-spec.md",
    "templates/component-spec.md",
    "templates/qa-checklist.md",
    "templates/handoff.md",
    "templates/inventory.csv",
    "examples/example-output.md",
]


def log(level: str, message: str) -> None:
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    print(f"[{timestamp}] [{level}] {message}")


def parse_frontmatter(text: str) -> dict[str, str]:
    if not text.startswith("---\n"):
        raise ValueError("SKILL.md não começa com frontmatter YAML.")

    end = text.find("\n---\n", 4)
    if end == -1:
        raise ValueError("Frontmatter YAML não foi encerrado com ---.")

    block = text[4:end]
    result: dict[str, str] = {}
    current_key: str | None = None

    for raw_line in block.splitlines():
        if not raw_line.strip() or raw_line.lstrip().startswith("#"):
            continue
        if re.match(r"^[A-Za-z0-9_-]+:\s*", raw_line):
            key, value = raw_line.split(":", 1)
            current_key = key.strip()
            result[current_key] = value.strip().strip('"').strip("'")
        elif current_key and raw_line.startswith((" ", "\t")):
            result[current_key] += " " + raw_line.strip().strip('"').strip("'")
        else:
            raise ValueError(f"Linha de frontmatter não reconhecida: {raw_line}")

    return result


def referenced_paths(skill_text: str) -> set[str]:
    matches = re.findall(
        r"`((?:references|templates|examples|scripts)/[^`]+)`", skill_text
    )
    return {match.strip() for match in matches}


def main() -> int:
    root = Path(__file__).resolve().parent.parent
    failures: list[str] = []
    warnings: list[str] = []

    log("INFO", f"Início da validação: {root}")

    log("INFO", "Etapa 1/5: verificando arquivos obrigatórios")
    for relative in REQUIRED_FILES:
        path = root / relative
        if not path.is_file():
            failures.append(f"Arquivo obrigatório ausente: {relative}")

    skill_path = root / "SKILL.md"
    if not skill_path.is_file():
        for item in failures:
            log("ERROR", item)
        return 1

    skill_text = skill_path.read_text(encoding="utf-8")

    log("INFO", "Etapa 2/5: validando frontmatter")
    try:
        frontmatter = parse_frontmatter(skill_text)
    except ValueError as exc:
        failures.append(str(exc))
        frontmatter = {}

    name = frontmatter.get("name", "")
    description = frontmatter.get("description", "")
    when_to_use = frontmatter.get("when_to_use", "")

    if name != "editorial-modular-app-design":
        failures.append(
            "O campo name deve ser 'editorial-modular-app-design'."
        )
    if len(description) < 80:
        failures.append("A description está curta demais para descoberta confiável.")
    if len(description) + len(when_to_use) > 1536:
        warnings.append(
            "description + when_to_use ultrapassam 1.536 caracteres e podem ser truncados."
        )

    log("INFO", "Etapa 3/5: verificando referências internas")
    for relative in sorted(referenced_paths(skill_text)):
        if "<" in relative or ">" in relative:
            continue
        if not (root / relative).exists():
            failures.append(f"Referência interna inexistente: {relative}")

    log("INFO", "Etapa 4/5: verificando conteúdo e estrutura")
    line_count = len(skill_text.splitlines())
    if line_count > 500:
        warnings.append(
            f"SKILL.md possui {line_count} linhas. Considere mover mais conteúdo para references/."
        )
    if "$ARGUMENTS" not in skill_text:
        warnings.append("SKILL.md não utiliza $ARGUMENTS.")
    if "Definition of done" not in skill_text and "Definition of done" not in skill_text:
        warnings.append("Definição de pronto não localizada.")

    json_template = root / "templates/design-tokens.json"
    if json_template.is_file():
        import json

        try:
            json.loads(json_template.read_text(encoding="utf-8"))
        except json.JSONDecodeError as exc:
            failures.append(f"design-tokens.json inválido: {exc}")

    log("INFO", "Etapa 5/5: emitindo resultado")
    for item in warnings:
        log("WARN", item)
    for item in failures:
        log("ERROR", item)

    if failures:
        log("ERROR", f"Validação concluída com {len(failures)} falha(s).")
        return 1

    log(
        "SUCCESS",
        f"Skill válida. {len(REQUIRED_FILES)} arquivos obrigatórios verificados; "
        f"{line_count} linhas no SKILL.md; {len(warnings)} aviso(s).",
    )
    return 0


if __name__ == "__main__":
    sys.exit(main())
