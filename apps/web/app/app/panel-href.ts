// Links de lista com painel: abrir e fechar preservam os filtros da lista (q, datas, estado…).
export const DIARY_FILTERS = ["q", "from", "to", "state"] as const;
export const EVIDENCE_FILTERS = ["q", "view", "competency", "from", "to", "level", "state"] as const;

type Filters = Partial<Record<string, string | undefined>>;

function query(filters: Filters, keys: readonly string[], extra: [string, string][] = []) {
  const params = new URLSearchParams();
  for (const key of keys) {
    const value = filters[key];
    if (value) params.set(key, value);
  }
  for (const [key, value] of extra) params.set(key, value);
  const text = params.toString();
  return text ? "?" + text : "";
}

/** Lista com os filtros atuais, sem painel aberto. */
export function listHref(base: string, filters: Filters, keys: readonly string[]) {
  return base + query(filters, keys);
}

/** Cartão que abre o painel `id` mantendo os filtros. */
export function openHref(base: string, id: string, filters: Filters, keys: readonly string[]) {
  return base + query(filters, keys, [["abrir", id]]);
}

/** Destino ao fechar o painel: os parâmetros atuais menos os do painel. */
export function closeHref(base: string, current: { get(name: string): string | null }, keys: readonly string[]) {
  return listHref(base, Object.fromEntries(keys.map((key) => [key, current.get(key) ?? undefined])), keys);
}
