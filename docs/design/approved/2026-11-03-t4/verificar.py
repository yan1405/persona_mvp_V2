"""Confere os arquivos do pacote contra MANIFEST.json. Uso: python -I verificar.py"""
import hashlib, json, os, sys
aqui = os.path.dirname(os.path.abspath(__file__))
m = json.load(open(os.path.join(aqui, "MANIFEST.json"), encoding="utf-8"))
itens = [(e["destino"], e["sha256"]) for e in m["arquivos"] if e["estado"] == "incluido"] + [(c["arquivo"], c["sha256"]) for c in m["capturas"]]
ruins = [d for d, h in itens if not os.path.isfile(os.path.join(aqui, d)) or hashlib.sha256(open(os.path.join(aqui, d), "rb").read()).hexdigest() != h]
print(f"{len(itens) - len(ruins)}/{len(itens)} arquivos conferem")
for d in ruins: print("DIVERGE:", d)
sys.exit(1 if ruins else 0)
