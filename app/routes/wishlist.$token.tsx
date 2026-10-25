import {useState} from 'react';
import {Link} from 'react-router';
import {CartForm} from '@shopify/hydrogen';
import type {Route} from './+types/wishlist.$token';
import {useAside} from '~/components/Aside';
import {Icon} from '~/components/brand/Icons';
import {FlatCover} from '~/components/brand/Scenes';
import {StockLine} from '~/components/books';
import {buttonClass, EmptyState, PageHead} from '~/components/ui';
import {BOOK_CARD_FRAGMENT, bookSummary, formatMoney, type BookCardProduct} from '~/lib/book';
import {decodeShareToken, useWishlist} from '~/lib/wishlist';

export const meta: Route.MetaFunction = ({data}) => [
  {title: `${data?.title ?? 'Lista compartida'} | La Buhardilla`},
  {name: 'robots', content: 'noindex'},
];

export async function loader({params, context}: Route.LoaderArgs) {
  const token = params.token ?? '';
  const payload = decodeShareToken(token);

  if (!payload || !payload.h.length) {
    return {
      title: 'Lista no encontrada',
      books: [] as BookCardProduct[],
      token,
      handles: [] as string[],
    };
  }

  const {products} = await context.storefront.query(SAVED_QUERY, {
    cache: context.storefront.CacheShort(),
  });

  const byHandle = new Map((products.nodes as BookCardProduct[]).map((p) => [p.handle, p]));
  const books = payload.h.flatMap((h) => byHandle.get(h) ?? []);

  return {
    title: payload.n,
    books,
    token,
    handles: payload.h,
  };
}

export default function SharedWishlist({loaderData}: Route.ComponentProps) {
  const {title, books, handles} = loaderData;
  const {importList} = useWishlist();
  const {open} = useAside();
  const [imported, setImported] = useState(false);

  const handleImport = () => {
    importList({name: title, handles});
    setImported(true);
    setTimeout(() => setImported(false), 3000);
  };

  // Preparamos todas las líneas de variantes para "Añadir todos"
  const allCartLines = books
    .map((b) => {
      const s = bookSummary(b);
      const firstVariant = b.variants.nodes.find((v) => v.id === s.variantId) ?? b.variants.nodes[0];
      if (!s.variantId || !firstVariant) return null;
      return {
        merchandiseId: s.variantId,
        quantity: 1,
        selectedVariant: {
          ...firstVariant,
          product: {
            id: b.id,
            title: b.title,
            handle: b.handle,
            vendor: b.vendor,
            productType: 'Libro',
            coverBg: b.coverBg,
            coverInk: b.coverInk,
          },
        },
      };
    })
    .filter(Boolean);

  return (
    <div className="mx-auto box-border flex max-w-[1280px] flex-col gap-8 px-4 pb-24 md:px-6">
      <PageHead
        eyebrow="Colección compartida · La Buhardilla"
        title={title}
        lead={
          books.length
            ? `${books.length} ${books.length === 1 ? 'libro seleccionado' : 'libros seleccionados'} para descubrir.`
            : 'Esta lista no contiene libros o el enlace es incorrecto.'
        }
      />

      {books.length ? (
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-witch-light bg-cream p-5 md:p-6">
          <div className="flex items-center gap-3">
            <span className="flex size-11 items-center justify-center rounded-full bg-pumpkin-soft text-night">
              <Icon name="heart" size={20} />
            </span>
            <div>
              <p className="m-0 font-serif text-lg font-bold text-midnight">¿Te gusta esta selección?</p>
              <p className="m-0 text-sm text-ash">
                Puedes guardarla en tu propia biblioteca o añadir los libros directo a tu bolsa.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={handleImport}
              className={`cursor-pointer ${buttonClass({size: 'sm', variant: 'outline'})} ${
                imported ? 'border-forest text-forest' : ''
              }`}
            >
              <Icon name={imported ? 'check' : 'heart'} size={16} />
              {imported ? '¡Guardada en tus listas!' : 'Guardar en mis listas'}
            </button>

            {allCartLines.length > 0 && (
              <CartForm route="/cart" action={CartForm.ACTIONS.LinesAdd} inputs={{lines: allCartLines}}>
                {(fetcher) => (
                  <button
                    type="submit"
                    onClick={() => open('cart')}
                    disabled={fetcher.state !== 'idle'}
                    className={buttonClass({size: 'sm'})}
                  >
                    <Icon name="bag" size={16} />
                    {fetcher.state !== 'idle' ? 'Añadiendo selección…' : 'Añadir todos a mi bolsa'}
                  </button>
                )}
              </CartForm>
            )}
          </div>
        </div>
      ) : null}

      {!books.length ? (
        <EmptyState
          title="No encontramos libros en esta lista."
          message="El enlace puede estar incompleto o los libros ya no están en nuestro catálogo."
        />
      ) : (
        <section aria-label="Libros de la lista compartida" className="grid border-b border-dashed border-witch-light md:grid-cols-2 md:gap-x-10">
          {books.map((b) => (
            <SharedItem key={b.id} book={b} />
          ))}
        </section>
      )}
    </div>
  );
}

function SharedItem({book}: {book: BookCardProduct}) {
  const s = bookSummary(book);
  const firstVariant = book.variants.nodes.find((v) => v.id === s.variantId) ?? book.variants.nodes[0];
  const {open} = useAside();
  const {addItem, hasItem} = useWishlist();
  const [savedLocally, setSavedLocally] = useState(false);

  const handleSaveIndividual = () => {
    addItem(book.handle);
    setSavedLocally(true);
    setTimeout(() => setSavedLocally(false), 2000);
  };

  const isAlreadySaved = hasItem(book.handle) || savedLocally;

  return (
    <article className="dashed-top flex items-start gap-4 py-5">
      <Link to={`/products/${book.handle}`} className="w-[92px] flex-none no-underline" tabIndex={-1} aria-hidden="true">
        <FlatCover book={s.cover} size="sm" />
      </Link>
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <Link
          to={`/products/${book.handle}`}
          className="font-serif text-[17px] font-bold leading-snug text-midnight no-underline hover:text-witch"
        >
          {book.title}
        </Link>
        <span className="text-sm text-ash">{book.vendor}</span>
        {s.meta ? <span className="text-xs text-mist">{s.meta}</span> : null}
        <span className="mt-1 flex items-baseline gap-2">
          <span className="text-lg font-extrabold text-pumpkin-dark">{formatMoney(s.price)}</span>
          {s.discount ? <span className="text-[13px] text-mist line-through">{formatMoney(s.compare)}</span> : null}
        </span>
        <StockLine stock={s.stock} small />
        <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2">
          {s.variantId && firstVariant ? (
            <CartForm
              route="/cart"
              action={CartForm.ACTIONS.LinesAdd}
              inputs={{
                lines: [
                  {
                    merchandiseId: s.variantId,
                    quantity: 1,
                    selectedVariant: {
                      ...firstVariant,
                      product: {
                        id: book.id,
                        title: book.title,
                        handle: book.handle,
                        vendor: book.vendor,
                        productType: 'Libro',
                        coverBg: book.coverBg,
                        coverInk: book.coverInk,
                      },
                    },
                  },
                ],
              }}
            >
              {(fetcher) => (
                <button
                  type="submit"
                  onClick={() => open('cart')}
                  disabled={fetcher.state !== 'idle'}
                  className={buttonClass({size: 'sm'})}
                >
                  <Icon name="bag" size={16} />
                  {fetcher.state !== 'idle' ? 'Añadiendo…' : 'Añadir a mi bolsa'}
                </button>
              )}
            </CartForm>
          ) : null}

          <button
            type="button"
            onClick={handleSaveIndividual}
            className={`min-h-11 cursor-pointer border-0 bg-transparent p-0 font-sans text-[15px] font-extrabold ${
              isAlreadySaved ? 'text-forest' : 'text-witch hover:underline'
            }`}
          >
            {isAlreadySaved ? '✓ En tus guardados' : 'Guardar en mis listas'}
          </button>
        </div>
      </div>
    </article>
  );
}

const SAVED_QUERY = `#graphql
  query SharedBooks($country: CountryCode, $language: LanguageCode)
  @inContext(country: $country, language: $language) {
    products(first: 100, query: "product_type:Libro") {
      nodes {
        ...BookCard
      }
    }
  }
  ${BOOK_CARD_FRAGMENT}
` as const;
