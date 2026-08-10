#!/usr/bin/env python3
"""
auditar_tells_ia.py — Audita uma base de código de front-end em busca dos sinais que
mais denunciam uma interface gerada sem revisão humana (o fenômeno documentado como
"AI slop design").

O script varre arquivos HTML, CSS/SCSS/LESS, JS/JSX/TS/TSX, Vue e Svelte, e reporta
contagem exata e localização (arquivo:linha) de cada sinal. Ele não decide sozinho se
um sinal é um problema — cada ocorrência é candidata a revisão manual, conforme o
método descrito em SKILL.md e references/tells-visuais.md.

Uso:
    python3 auditar_tells_ia.py --caminho <pasta-do-projeto>
    python3 auditar_tells_ia.py --caminho <pasta> --json relatorio.json
    python3 auditar_tells_ia.py --caminho <pasta> --ext .tsx,.jsx,.css

Sem dependências externas — usa apenas a biblioteca padrão do Python.
"""

import argparse
import json
import re
import sys
from collections import Counter, defaultdict
from pathlib import Path

DEFAULT_EXTENSIONS = {
    ".html", ".htm", ".css", ".scss", ".less",
    ".jsx", ".tsx", ".js", ".ts", ".vue", ".svelte",
}

IGNORAR_PASTAS = {"node_modules", ".git", "dist", "build", ".next", ".nuxt", "out"}

# --- Padrões de busca ---------------------------------------------------

PADRAO_GRADIENTE_INDIGO = re.compile(
    r"(from-(?:indigo|violet|purple)-\d{2,3}"
    r"|to-(?:indigo|violet|purple)-\d{2,3}"
    r"|via-(?:indigo|violet|purple)-\d{2,3}"
    r"|#6366f1|#4f46e5|#4338ca|#8b5cf6|#7c3aed|#a855f7|#9333ea"
    r"|linear-gradient\([^)]*(?:indigo|violet|purple|#6366f1|#8b5cf6|#a855f7)[^)]*\))",
    re.IGNORECASE,
)

PADRAO_FONTE_INTER = re.compile(
    r"font-family\s*:\s*['\"]?Inter\b"
    r"|['\"]Inter['\"]\s*,\s*['\"]?system-ui"
    r"|fonts\.googleapis\.com/css2\?family=Inter",
    re.IGNORECASE,
)

PADRAO_IMPORT_ICONES = re.compile(
    r"from\s+['\"](lucide-react|@heroicons/react|react-icons)[^'\"]*['\"]"
)

TERMOS_COPY = [
    "revolucionário", "revolucionar", "desbloqueie o poder", "impulsionar",
    "potencializar", "supercarregar", "sem esforço", "de ponta",
    "eleve o nível", "elevar o nível", "solução completa",
    "tudo o que você precisa", "alavancar", "capacitar", "empoderar",
    "leve sua empresa para o próximo nível", "next-generation", "cutting-edge",
    "seamless", "leverage", "utilize", "empower", "streamline",
    "unlock the power of", "supercharge", "game-changer", "frictionless",
    "best-in-class", "delve",
]
PADRAO_COPY = re.compile("|".join(re.escape(t) for t in TERMOS_COPY), re.IGNORECASE)

PADRAO_RADIUS = re.compile(
    r"\brounded-(sm|md|lg|xl|2xl|3xl|full)\b|border-radius\s*:\s*([0-9.]+)(px|rem)"
)

PADRAO_SHADOW = re.compile(r"\bshadow-(sm|md|lg|xl|2xl)\b|box-shadow\s*:")

PADRAO_CENTRALIZACAO = re.compile(
    r"\btext-center\b|\bitems-center\s+justify-center\b|\bmx-auto\b"
)

PADRAO_GRID_CARDS = re.compile(r"grid-cols-(3|4)\b")

CATEGORIAS = {
    "cor_gradiente_indigo": (PADRAO_GRADIENTE_INDIGO, "Gradiente roxo/índigo/violeta (tell de cor nº1)"),
    "tipografia_inter": (PADRAO_FONTE_INTER, "Inter declarada como fonte (verificar se foi escolha deliberada)"),
    "icones_pacote_padrao": (PADRAO_IMPORT_ICONES, "Importação de pacote de ícones padrão (Lucide/Heroicons/react-icons)"),
    "copy_termos_genericos": (PADRAO_COPY, "Termo de preenchimento na copy (ver references/copy-microcopy.md)"),
    "radius": (PADRAO_RADIUS, "Valor de border-radius (checar uniformidade abaixo)"),
    "sombra": (PADRAO_SHADOW, "Sombra aplicada (checar se coexiste com radius em todo elemento)"),
    "centralizacao": (PADRAO_CENTRALIZACAO, "Centralização de texto/bloco (proxy de layout sem hierarquia)"),
    "grid_cards_3_4": (PADRAO_GRID_CARDS, "Grid de 3 ou 4 colunas (proxy do grid didático de feature cards)"),
}


def deve_ignorar(caminho: Path) -> bool:
    return any(parte in IGNORAR_PASTAS for parte in caminho.parts)


def varrer_arquivo(caminho: Path):
    """Retorna {categoria: [(linha, trecho), ...]} e a lista de valores de radius encontrados."""
    ocorrencias = defaultdict(list)
    valores_radius = []
    try:
        texto = caminho.read_text(encoding="utf-8", errors="ignore")
    except OSError:
        return ocorrencias, valores_radius

    for numero, linha in enumerate(texto.splitlines(), start=1):
        for categoria, (padrao, _descricao) in CATEGORIAS.items():
            match = padrao.search(linha)
            if match:
                ocorrencias[categoria].append((numero, linha.strip()[:160]))
                if categoria == "radius":
                    valor = match.group(1) or f"{match.group(2)}{match.group(3)}"
                    valores_radius.append(valor)

    return ocorrencias, valores_radius


def gerar_relatorio(caminho_base: Path, extensoes):
    arquivos = [
        p for p in caminho_base.rglob("*")
        if p.is_file() and p.suffix.lower() in extensoes and not deve_ignorar(p)
    ]

    relatorio = {cat: {"total": 0, "ocorrencias": defaultdict(list)} for cat in CATEGORIAS}
    contador_radius = Counter()

    for arquivo in arquivos:
        ocorrencias, valores_radius = varrer_arquivo(arquivo)
        rel_path = str(arquivo.relative_to(caminho_base))
        for categoria, lista in ocorrencias.items():
            relatorio[categoria]["total"] += len(lista)
            relatorio[categoria]["ocorrencias"][rel_path].extend(lista)
        contador_radius.update(valores_radius)

    return relatorio, contador_radius, len(arquivos)


def formatar_relatorio(relatorio, contador_radius, total_arquivos, caminho_base):
    linhas = []
    linhas.append("=" * 72)
    linhas.append("AUDITORIA DE TELLS DE IA — design-sem-cara-de-ia")
    linhas.append(f"Pasta analisada: {caminho_base}")
    linhas.append(f"Arquivos varridos: {total_arquivos}")
    linhas.append("=" * 72)

    total_geral = sum(dados["total"] for dados in relatorio.values())
    if total_geral == 0:
        linhas.append("\nNenhum dos nove sinais monitorados foi encontrado nos arquivos varridos.")
        linhas.append("Isso não confirma ausência de 'cara de IA' — rode também o checklist manual")
        linhas.append("em references/checklist-auditoria.md, que cobre itens que código sozinho não revela")
        linhas.append("(voz da copy, decisão visual forte por tela, referência de ancoragem).")
        return "\n".join(linhas)

    for categoria, (_padrao, descricao) in CATEGORIAS.items():
        dados = relatorio[categoria]
        if dados["total"] == 0:
            continue
        linhas.append(f"\n[{categoria}] {descricao}")
        linhas.append(f"  Ocorrências: {dados['total']}")
        for arquivo, ocorrencias in sorted(dados["ocorrencias"].items()):
            linhas.append(f"  - {arquivo} ({len(ocorrencias)} ocorrência(s)):")
            for numero, trecho in ocorrencias[:8]:
                linhas.append(f"      linha {numero}: {trecho}")
            if len(ocorrencias) > 8:
                linhas.append(f"      ... e mais {len(ocorrencias) - 8} ocorrência(s) neste arquivo")

    if contador_radius:
        total_radius = sum(contador_radius.values())
        valor_mais_comum, contagem_mais_comum = contador_radius.most_common(1)[0]
        proporcao = contagem_mais_comum / total_radius
        linhas.append("\n[uniformidade_radius] Distribuição dos valores de border-radius encontrados")
        for valor, contagem in contador_radius.most_common():
            linhas.append(f"  - {valor}: {contagem} ocorrência(s)")
        if total_radius >= 5 and proporcao >= 0.8:
            linhas.append(
                f"  ALERTA: {contagem_mais_comum} de {total_radius} ocorrências "
                f"({proporcao:.1%}) usam o mesmo valor ('{valor_mais_comum}'). "
                "Verifique se isso reflete hierarquia deliberada ou aplicação uniforme "
                "sem variação (tell de layout nº3 em tells-visuais.md)."
            )

    linhas.append("\n" + "-" * 72)
    linhas.append(
        "Nota: cada ocorrência acima é candidata a revisão manual, não um erro confirmado.\n"
        "O script sinaliza presença do padrão; a decisão de manter, justificar ou trocar\n"
        "continua sendo humana. Cruze com references/checklist-auditoria.md antes de concluir."
    )
    return "\n".join(linhas)


def main():
    parser = argparse.ArgumentParser(description="Audita código de front-end em busca de tells de IA.")
    parser.add_argument("--caminho", required=True, help="Pasta do projeto a ser analisada")
    parser.add_argument("--json", help="Caminho opcional para salvar o relatório também em JSON")
    parser.add_argument(
        "--ext",
        help="Lista de extensões separadas por vírgula (ex.: .tsx,.jsx,.css). "
             "Se omitido, usa o conjunto padrão de front-end.",
    )
    args = parser.parse_args()

    caminho_base = Path(args.caminho).resolve()
    if not caminho_base.is_dir():
        print(f"Erro: '{caminho_base}' não é uma pasta válida.", file=sys.stderr)
        sys.exit(1)

    extensoes = DEFAULT_EXTENSIONS
    if args.ext:
        extensoes = {e.strip() if e.strip().startswith(".") else f".{e.strip()}" for e in args.ext.split(",")}

    relatorio, contador_radius, total_arquivos = gerar_relatorio(caminho_base, extensoes)
    texto_relatorio = formatar_relatorio(relatorio, contador_radius, total_arquivos, caminho_base)
    print(texto_relatorio)

    if args.json:
        saida_json = {
            "pasta_analisada": str(caminho_base),
            "arquivos_varridos": total_arquivos,
            "categorias": {
                cat: {
                    "total": dados["total"],
                    "ocorrencias": {
                        arq: [{"linha": n, "trecho": t} for n, t in lista]
                        for arq, lista in dados["ocorrencias"].items()
                    },
                }
                for cat, dados in relatorio.items()
            },
            "distribuicao_radius": dict(contador_radius),
        }
        Path(args.json).write_text(json.dumps(saida_json, ensure_ascii=False, indent=2), encoding="utf-8")
        print(f"\nRelatório também salvo em: {args.json}")


if __name__ == "__main__":
    main()
