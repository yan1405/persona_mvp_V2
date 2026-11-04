# Pacote visual congelado — T4.1 a T4.8 (03/11/2026)

Cópia somente leitura das telas aprovadas visualmente por Yan (decisão D-032) e do Design System usado por elas. É especificação visual, **não** prova de implementação, backend, leitor de tela ou zoom real. Para o que o produto faz, vale o código em `apps/web`.

- **Origem:** exportação pela interface do Claude Design (04/11/2026 UTC) dos projetos T4 `865d08f1-bee1-40c0-854c-eaca4294fcf5` e Design System `ff1a7bce-a6f2-4fa9-af99-a6196b748678`. Bytes idênticos ao export; `.gitattributes` impede conversão de fim de linha.
- **Conteúdo:** `fonte/` (arquivos incluídos), `capturas/auditadas/` (9) e `capturas/canonicas/` (8, uma por tela, 1440×900), `MANIFEST.json` (caminho, SHA-256, tamanho e estado de cada arquivo do export, com o motivo de cada exclusão).
- **Fora do pacote:** fontes `.woff2`, miniaturas, 5 SVG de `uploads/` com C2PA, metadados de transporte (hashes registrados no manifesto) e arquivos retidos até decisão de Yan.
- **Verificar:** `python -I verificar.py` (sai com código 1 se algum hash divergir).
- **Mudar:** qualquer alteração exige nova aprovação de Yan e novo manifesto. Não editar arquivos daqui.
