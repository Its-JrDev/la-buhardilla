/**
 * Datos de libro: los productos guardan autor en `vendor` y el resto en
 * metafields `custom.*` (editorial, año, estado, escalofríos, colores de portada…).
 */

export type CoverBook = {
  title: string;
  author: string;
  coverBg: string;
  coverInk: string;
};

type Meta = {value?: string | null} | null | undefined;

export const BOOK_CARD_FRAGMENT = `#graphql
  fragment BookCard on Product {
    id
    handle
    title
    vendor
    tags
    availableForSale
    publisher: metafield(namespace: "custom", key: "publisher") { value }
    year: metafield(namespace: "custom", key: "year") { value }
    condition: metafield(namespace: "custom", key: "condition") { value }
    chill: metafield(namespace: "custom", key: "chill") { value }
    subgenre: metafield(namespace: "custom", key: "subgenre") { value }
    coverBg: metafield(namespace: "custom", key: "cover_bg") { value }
    coverInk: metafield(namespace: "custom", key: "cover_ink") { value }
    priceRange {
      minVariantPrice { amount currencyCode }
    }
    compareAtPriceRange {
      minVariantPrice { amount currencyCode }
    }
    featuredImage { id url altText width height }
    variants(first: 6) {
      nodes {
        id
        title
        availableForSale
        price { amount currencyCode }
        compareAtPrice { amount currencyCode }
        selectedOptions { name value }
      }
    }
  }
` as const;

type Money = {amount: string; currencyCode: string};

export type BookCardProduct = {
  id: string;
  handle: string;
  title: string;
  vendor: string;
  tags: string[];
  availableForSale: boolean;
  publisher?: Meta;
  year?: Meta;
  condition?: Meta;
  chill?: Meta;
  subgenre?: Meta;
  coverBg?: Meta;
  coverInk?: Meta;
  priceRange: {minVariantPrice: Money};
  compareAtPriceRange?: {minVariantPrice: Money} | null;
  featuredImage?: {id?: string | null; url: string; altText?: string | null; width?: number | null; height?: number | null} | null;
  variants: {
    nodes: Array<{
      id: string;
      title: string;
      availableForSale: boolean;
      quantityAvailable?: number | null;
      price: Money;
      compareAtPrice?: Money | null;
      selectedOptions: Array<{name: string; value: string}>;
    }>;
  };
};

const FALLBACK_COVERS: Array<[string, string]> = [
  ['#1e1b4b', '#fdba74'],
  ['#7e22ce', '#fdfbf7'],
  ['#ea580c', '#0f172a'],
  ['#f3e8ff', '#581c87'],
  ['#0f172a', '#d8b4fe'],
];

function hash(s: string) {
  let h = 0;
  for (const c of s) h = (h * 31 + c.charCodeAt(0)) | 0;
  return Math.abs(h);
}

export function coverOf(p: {title: string; vendor?: string | null; handle?: string; coverBg?: Meta; coverInk?: Meta}): CoverBook {
  const [bg, ink] = FALLBACK_COVERS[hash(p.handle ?? p.title) % FALLBACK_COVERS.length];
  return {
    title: p.title,
    author: p.vendor ?? '',
    coverBg: p.coverBg?.value || bg,
    coverInk: p.coverInk?.value || ink,
  };
}

export function formatMoney(m?: {amount?: string | null; currencyCode?: string | null} | null) {
  if (!m?.amount) return '';
  const n = Number(m.amount);
  return `$${Number.isInteger(n) ? n.toLocaleString('es-MX') : n.toLocaleString('es-MX', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
}

export function discountPercent(price?: {amount?: string | null} | null, compare?: {amount?: string | null} | null) {
  if (!price?.amount || !compare?.amount) return null;
  const p = Number(price.amount);
  const c = Number(compare.amount);
  if (!(c > p)) return null;
  return `-${Math.round((1 - p / c) * 100)}%`;
}

/** Texto y tono del inventario: «Solo quedan 3», «Último ejemplar», «Agotado»… */
export function stockLabel(quantity: number | null | undefined, available: boolean) {
  if (!available) return {text: 'Agotado por ahora', low: true, out: true};
  if (quantity == null) return {text: 'En existencia', low: false, out: false};
  if (quantity <= 0) return {text: 'Bajo pedido', low: false, out: false};
  if (quantity === 1) return {text: 'Último ejemplar', low: true, out: false};
  if (quantity <= 3) return {text: `Solo quedan ${quantity} ejemplares`, low: true, out: false};
  return {text: 'En existencia', low: false, out: false};
}

export function bookSummary(p: BookCardProduct) {
  const first = p.variants.nodes.find((v) => v.availableForSale) ?? p.variants.nodes[0];
  const format = first?.selectedOptions.find((o) => o.name === 'Formato')?.value;
  const meta = [p.publisher?.value, p.year?.value, format, p.condition?.value].filter(Boolean).join(' · ');
  const price = first?.price ?? p.priceRange.minVariantPrice;
  const compare = first?.compareAtPrice ?? null;
  return {
    cover: coverOf(p),
    meta,
    price,
    compare,
    discount: discountPercent(price, compare),
    stock: stockLabel(first?.quantityAvailable, p.availableForSale),
    variantId: first?.availableForSale ? first.id : null,
  };
}

export const SHELVES = [
  {handle: 'horror', title: 'Horror'},
  {handle: 'thriller', title: 'Thriller'},
  {handle: 'terror-fantastico', title: 'Terror fantástico'},
  {handle: 'novedades', title: 'Novedades'},
  {handle: 'ediciones-raras', title: 'Ediciones raras'},
] as const;
