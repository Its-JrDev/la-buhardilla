import {Form, Link, useLocation, useNavigate, useNavigation} from 'react-router';
import {Pagination} from '@shopify/hydrogen';
import {BookGrid} from '~/components/books';
import {useQuickView} from '~/components/QuickView';
import {Crumbs, EmptyState} from '~/components/ui';
import {Icon} from '~/components/brand/Icons';
import type {BookCardProduct} from '~/lib/book';
import {SORTS, filterKey, toggleFilterUrl} from '~/lib/collection';

export type FacetFilter = {
  id: string;
  label: string;
  values: Array<{id: string; label: string; count: number; input: unknown}>;
};

type Connection = {
  nodes: BookCardProduct[];
  pageInfo: {hasPreviousPage: boolean; hasNextPage: boolean; startCursor?: string | null; endCursor?: string | null};
};

const FILTER_LABELS: Record<string, string> = {
  'Availability': 'Disponibilidad',
  'Price': 'Precio',
  'Product type': 'Tipo',
  'Vendor': 'Autor',
  'Formato': 'Formato',
};

export function CollectionView({
  title,
  description,
  products,
  filters = [],
  sort,
}: {
  title: string;
  description?: string | null;
  products: Connection;
  filters?: FacetFilter[];
  sort: string;
}) {
  const location = useLocation();
  const navigate = useNavigate();
  const navigation = useNavigation();
  const {open, modal} = useQuickView();
  const url = new URL(location.pathname + location.search, 'https://x.test');
  const active = url.searchParams.getAll('filtro').map((f) => filterKey(f));
  const visibleFilters = filters.filter((f) => f.values.length > 1 && f.id !== 'filter.p.product_type');
  const activeChips = visibleFilters.flatMap((f) => f.values.filter((v) => active.includes(filterKey(v.input))));
  const count = products.nodes.length;

  const filterPanel = visibleFilters.length ? (
    <div className="flex flex-col border-b border-dashed border-witch-light">
      <div className="flex items-center justify-between pb-3">
        <h2 className="m-0 font-serif text-[22px] font-black">Filtrar</h2>
        {active.length ? (
          <Link to={location.pathname} className="inline-flex min-h-11 items-center font-extrabold no-underline">
            Limpiar
          </Link>
        ) : null}
      </div>
      {visibleFilters.map((f) => (
        <fieldset key={f.id} className="dashed-top m-0 flex flex-col gap-0.5 border-0 px-0 py-[18px]">
          <legend className="float-left mb-2 w-full p-0 text-xs font-extrabold uppercase tracking-[.14em] text-pumpkin-dark">
            {FILTER_LABELS[f.label] ?? f.label}
          </legend>
          {f.values.map((v) => {
            const key = filterKey(v.input);
            const on = active.includes(key);
            return (
              <label key={v.id} className="flex min-h-9 cursor-pointer items-center gap-2.5 text-[15px] text-slate">
                <input
                  type="checkbox"
                  checked={on}
                  onChange={() => void navigate(toggleFilterUrl(url, v.input), {preventScrollReset: true})}
                  className="size-[18px] accent-witch"
                />
                <span className="flex-1">{translateValue(v.label)}</span>
                <span className="text-xs text-mist">{v.count}</span>
              </label>
            );
          })}
        </fieldset>
      ))}
    </div>
  ) : null;

  return (
    <div className="mx-auto box-border flex max-w-[1280px] flex-col gap-8 px-4 pb-24 md:px-6">
      <section className="flex flex-col gap-3 pt-2">
        <Crumbs items={[{label: 'Inicio', to: '/'}, {label: title}]} />
        <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-3">
          <div className="flex max-w-[640px] flex-col gap-2.5">
            <h1 className="m-0 font-serif text-[34px] font-black leading-[1.1] md:text-[44px]">{title}</h1>
            {description ? <p className="m-0 text-[17px] leading-relaxed text-slate">{description}</p> : null}
          </div>
          {products.pageInfo.hasNextPage || products.pageInfo.hasPreviousPage ? null : (
            <span className="text-[15px] font-extrabold text-pumpkin-dark">
              {count} {count === 1 ? 'título' : 'títulos'} en este estante
            </span>
          )}
        </div>
      </section>
      <div className="flex flex-wrap items-start gap-x-12 gap-y-6">
        {filterPanel ? (
          <aside aria-label="Filtros" className="min-w-0 flex-[1_1_240px]">
            <details className="md:hidden" open={false}>
              <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between rounded-full border-[1.5px] border-witch-light bg-white px-5 font-extrabold">
                Filtrar{active.length ? ` · ${active.length}` : ''}
                <Icon name="plus" size={18} />
              </summary>
              <div className="pt-4">{filterPanel}</div>
            </details>
            <div className="hidden md:block">{filterPanel}</div>
          </aside>
        ) : null}
        <section aria-label="Resultados" className="flex min-w-0 flex-[999_1_560px] flex-col gap-7">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              {activeChips.length ? <span className="mr-1 text-[15px] font-bold text-ash">Filtrado por</span> : null}
              {activeChips.map((v) => (
                <Link
                  key={v.id}
                  to={toggleFilterUrl(url, v.input)}
                  preventScrollReset
                  aria-label={`Quitar filtro ${v.label}`}
                  className="inline-flex min-h-9 items-center gap-1.5 rounded-full bg-spill pl-3.5 pr-3 text-sm font-bold text-plum no-underline"
                >
                  {translateValue(v.label)}
                  <Icon name="x" size={14} />
                </Link>
              ))}
            </div>
            <Form method="get" className="flex items-center gap-2.5" onChange={(e) => void navigate(`?${new URLSearchParams(new FormData(e.currentTarget) as unknown as Record<string, string>)}`, {preventScrollReset: true})}>
              {active.map((f) => (
                <input key={f} type="hidden" name="filtro" value={f} />
              ))}
              <label htmlFor="orden" className="text-[15px] font-bold text-ash">
                Ordenar por
              </label>
              <select
                id="orden"
                name="orden"
                defaultValue={sort}
                className="min-h-11 rounded-full border-[1.5px] border-witch-light bg-white px-4 font-sans text-[15px] font-bold text-midnight"
              >
                {SORTS.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
              <noscript>
                <button type="submit">Ordenar</button>
              </noscript>
            </Form>
          </div>
          <div className={navigation.state === 'loading' ? 'opacity-60 transition-opacity' : ''}>
            <Pagination connection={products}>
              {({nodes, isLoading, NextLink, PreviousLink, hasNextPage}) =>
                nodes.length ? (
                  <div className="flex flex-col gap-8">
                    <PreviousLink className="self-center font-extrabold no-underline">{isLoading ? 'Cargando…' : '↑ Ver anteriores'}</PreviousLink>
                    <BookGrid books={nodes} onQuickView={open} />
                    {hasNextPage ? (
                      <NextLink className="inline-flex min-h-12 items-center self-center rounded-full border-2 border-midnight px-7 font-extrabold text-midnight no-underline hover:bg-midnight hover:text-pumpkin-light">
                        {isLoading ? 'Cargando…' : 'Ver más del estante'}
                      </NextLink>
                    ) : null}
                  </div>
                ) : (
                  <EmptyState title="El estante está vacío." message="Ningún libro coincide con estos filtros. Quita alguno o explora otro estante." cta="Ver todo el catálogo" />
                )
              }
            </Pagination>
          </div>
        </section>
      </div>
      {modal}
    </div>
  );
}

function translateValue(label: string) {
  const map: Record<string, string> = {'In stock': 'Disponible', 'Out of stock': 'Agotado'};
  return map[label] ?? label;
}
