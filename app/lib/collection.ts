import type {ProductCollectionSortKeys, ProductFilter} from '@shopify/hydrogen/storefront-api-types';

/** Orden del estante: valor de URL → sortKey/reverse de la Storefront API. */
export const SORTS = [
  {value: 'recientes', label: 'Más recientes', sortKey: 'CREATED', reverse: true},
  {value: 'precio-asc', label: 'Precio: menor a mayor', sortKey: 'PRICE', reverse: false},
  {value: 'precio-desc', label: 'Precio: mayor a menor', sortKey: 'PRICE', reverse: true},
  {value: 'titulo', label: 'Título: A–Z', sortKey: 'TITLE', reverse: false},
  {value: 'populares', label: 'Más temidos', sortKey: 'BEST_SELLING', reverse: false},
] as const satisfies ReadonlyArray<{value: string; label: string; sortKey: ProductCollectionSortKeys; reverse: boolean}>;

export function sortFromUrl(url: URL) {
  return SORTS.find((s) => s.value === url.searchParams.get('orden')) ?? SORTS[0];
}

/**
 * La Storefront API devuelve `filters.values.input` como string JSON, aunque el tipo
 * lo declare como objeto. Normalizamos ambos casos a la representación que viaja en la URL.
 */
export function canonicalFilterInput(input: unknown): string {
  return typeof input === 'string' ? input : JSON.stringify(input);
}

/** Parsea el input de un filtro, tolerando JSON anidado (URLs antiguas doble-codificadas). */
function parseFilterInput(raw: string): ProductFilter | null {
  try {
    let value: unknown = JSON.parse(raw);
    if (typeof value === 'string') value = JSON.parse(value);
    return isFilterObject(value) ? (value as ProductFilter) : null;
  } catch {
    return null;
  }
}

function isFilterObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/** Cada filtro activo viaja en la URL como `filtro=<input JSON de la API>`. */
export function filtersFromUrl(url: URL): ProductFilter[] {
  return url.searchParams.getAll('filtro').flatMap((raw) => {
    const parsed = parseFilterInput(raw);
    return parsed ? [parsed] : [];
  });
}

/** Clave estable (JSON canónico) para comparar filtros aunque vengan doble-codificados. */
export function filterKey(input: unknown): string {
  const parsed = parseFilterInput(canonicalFilterInput(input));
  return parsed ? JSON.stringify(parsed) : canonicalFilterInput(input);
}

export function toggleFilterUrl(url: URL, input: unknown) {
  const next = new URL(url);
  const target = filterKey(input);
  const current = next.searchParams.getAll('filtro').flatMap((raw) => {
    const parsed = parseFilterInput(raw);
    return parsed ? [filterKey(JSON.stringify(parsed))] : [];
  });
  next.searchParams.delete('filtro');
  next.searchParams.delete('cursor');
  next.searchParams.delete('direction');
  const has = current.includes(target);
  for (const f of current) if (f !== target) next.searchParams.append('filtro', f);
  if (!has) next.searchParams.append('filtro', target);
  return `${next.pathname}${next.search}`;
}
