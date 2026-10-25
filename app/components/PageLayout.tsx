import {Await, Link, useMatches} from 'react-router';
import {Suspense, useId, useMemo} from 'react';
import {useOptimisticCart} from '@shopify/hydrogen';
import type {CartApiQueryFragment} from 'storefrontapi.generated';
import {Aside} from '~/components/Aside';
import {Footer} from '~/components/Footer';
import {Header, type HeaderCustomer} from '~/components/Header';
import {MobileMenu} from '~/components/MobileMenu';
import {CartMain} from '~/components/CartMain';
import {Icon} from '~/components/brand/Icons';
import {FlatCover} from '~/components/brand/Scenes';
import {SEARCH_ENDPOINT, SearchFormPredictive} from '~/components/SearchFormPredictive';
import {SearchResultsPredictive} from '~/components/SearchResultsPredictive';
import {coverOf, formatMoney} from '~/lib/book';

interface PageLayoutProps {
  cart: Promise<CartApiQueryFragment | null>;
  customer: Promise<HeaderCustomer>;
  children?: React.ReactNode;
}

export function PageLayout({cart, customer, children = null}: PageLayoutProps) {
  const matches = useMatches();
  const hero = matches.some((m) => (m.handle as {heroHeader?: boolean} | undefined)?.heroHeader);
  return (
    <Aside.Provider>
      <a href="#contenido" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-white focus:px-4 focus:py-2">
        Saltar al contenido
      </a>
      <CartAside cart={cart} />
      <SearchAside />
      <Aside type="mobile" heading="Menú" bare>
        <MobileMenu customer={customer} cart={cart} />
      </Aside>
      <div className="page-bg flex min-h-dvh flex-col">
        {hero ? null : <Header cart={cart} customer={customer} />}
        <main id="contenido" className="flex-1">
          {hero ? <Header cart={cart} customer={customer} hero /> : null}
          {children}
        </main>
        <Footer />
      </div>
    </Aside.Provider>
  );
}

function CartAside({cart}: {cart: PageLayoutProps['cart']}) {
  return (
    <Aside type="cart" heading="Tu selección" eyebrow={<CartEyebrow cart={cart} />}>
      <Suspense fallback={<CartLoading />}>
        <Await resolve={cart}>
          {(c) => <CartMain cart={c} layout="aside" />}
        </Await>
      </Suspense>
    </Aside>
  );
}

function CartEyebrow({cart}: {cart: PageLayoutProps['cart']}) {
  return (
    <Suspense fallback={null}>
      <Await resolve={cart}>
        {(c) => <CartEyebrowInner originalCart={c} />}
      </Await>
    </Suspense>
  );
}

function CartEyebrowInner({originalCart}: {originalCart: CartApiQueryFragment | null}) {
  const cart = useOptimisticCart(originalCart);
  const count = cart?.totalQuantity ?? 0;
  return <>{count} {count === 1 ? 'libro' : 'libros'}</>;
}

function CartLoading() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-3.5 p-8 text-center text-ash">
      <div className="size-8 animate-spin rounded-full border-2 border-witch border-t-transparent" />
      <span className="text-sm font-bold">Cargando selección…</span>
    </div>
  );
}

function SearchAside() {
  const queriesDatalistId = useId();
  return (
    <Aside type="search" heading="Buscar en la buhardilla">
      <div className="mx-auto box-border flex w-full max-w-[880px] flex-col gap-5 overflow-y-auto px-5 pb-7 pt-4">
        <SearchFormPredictive>
          {({fetchResults, goToSearch, inputRef}) => (
            <div className="flex min-h-[60px] items-center gap-2 rounded-full border-[1.5px] border-witch bg-white py-1.5 pl-5 pr-1.5">
              <span className="flex text-witch">
                <Icon name="search" size={20} />
              </span>
              <label htmlFor="predictive-q" className="sr-only">
                Buscar
              </label>
              <input
                id="predictive-q"
                name="q"
                onChange={fetchResults}
                onFocus={fetchResults}
                placeholder="Busca un título, autor o estante"
                ref={inputRef}
                type="search"
                list={queriesDatalistId}
                autoComplete="off"
                className="min-h-[46px] min-w-0 flex-1 border-0 bg-transparent font-sans text-[17px] font-bold text-midnight outline-none"
              />
              <button
                type="button"
                onClick={goToSearch}
                className="btn-main btn-primary min-h-[46px] flex-none cursor-pointer rounded-full border-0 px-6 font-sans text-[15px] font-extrabold"
              >
                Buscar
              </button>
            </div>
          )}
        </SearchFormPredictive>
        <SearchResultsPredictive>
          {({items, total, term, state, closeSearch}) => {
            const {products, collections, queries} = items;
            if (state === 'loading' && term.current) return <p className="m-0 text-ash">Buscando en los estantes…</p>;
            if (!term.current) return <p className="m-0 text-ash">Prueba con «Lovecraft», «gótico» o «Drácula».</p>;
            if (!total)
              return (
                <p className="m-0 text-ash">
                  Nada responde a <strong>«{term.current}»</strong>.
                </p>
              );
            return (
              <div className="flex flex-col gap-4">
                <SearchResultsPredictive.Queries queries={queries} queriesDatalistId={queriesDatalistId} />
                {collections.length ? (
                  <div className="flex flex-wrap gap-2">
                    {collections.map((c) => (
                      <Link key={c.id} to={`/collections/${c.handle}`} onClick={closeSearch} className="inline-flex min-h-10 items-center rounded-full bg-spill px-4 text-sm font-extrabold text-plum no-underline">
                        {c.title}
                      </Link>
                    ))}
                  </div>
                ) : null}
                <ul className="m-0 grid list-none gap-2 p-0 sm:grid-cols-2">
                  {products.map((p) => (
                    <li key={p.id}>
                      <Link
                        to={`/products/${p.handle}`}
                        onClick={closeSearch}
                        className="flex items-center gap-3.5 rounded-2xl p-2 text-midnight no-underline hover:bg-spill"
                      >
                        <span className="w-11 flex-none">
                          <FlatCover book={coverOf(p)} size="xs" />
                        </span>
                        <span className="flex min-w-0 flex-col">
                          <span className="truncate font-serif font-bold">{p.title}</span>
                          <span className="text-[13px] text-ash">
                            {p.vendor} · {formatMoney(p.selectedOrFirstAvailableVariant?.price)}
                          </span>
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
                <Link onClick={closeSearch} to={`${SEARCH_ENDPOINT}?q=${encodeURIComponent(term.current)}`} className="self-start font-extrabold no-underline">
                  Ver todos los resultados para «{term.current}» →
                </Link>
              </div>
            );
          }}
        </SearchResultsPredictive>
      </div>
    </Aside>
  );
}
