#!/usr/bin/env python3
"""Build an optional single-file SKILL.md distribution."""

from __future__ import annotations

from datetime import datetime
from pathlib import Path


def log(message: str) -> None:
    print(f"[{datetime.now():%Y-%m-%d %H:%M:%S}] [INFO] {message}")


def main() -> None:
    root = Path(__file__).resolve().parent.parent
    source = (root / "SKILL.md").read_text(encoding="utf-8")
    references = sorted((root / "references").glob("*.md"))
    templates = [
        root / "templates/app-brief.md",
        root / "templates/screen-spec.md",
        root / "templates/component-spec.md",
        root / "templates/qa-checklist.md",
        root / "templates/handoff.md",
    ]

    sections = [source]
    sections.append(
        "\n\n---\n\n# Referências incorporadas\n\n"
        "Esta distribuição contém as referências no mesmo arquivo. "
        "Na versão modular, leia apenas os arquivos necessários.\n"
    )

    for path in references + templates:
        log(f"Incorporando {path.relative_to(root)}")
        text = path.read_text(encoding="utf-8")
        sections.append(
            f"\n\n---\n\n<!-- Source: {path.relative_to(root)} -->\n\n{text}\n"
        )

    output = root / "dist/SKILL.standalone.md"
    output.write_text("".join(sections), encoding="utf-8")
    log(f"Arquivo criado: {output} ({output.stat().st_size} bytes)")


if __name__ == "__main__":
    main()
