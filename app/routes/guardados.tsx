import {useEffect, useState} from 'react';
import {Link, useFetcher} from 'react-router';
import {CartForm} from '@shopify/hydrogen';
import type {Route} from './+types/guardados';
import {useAside} from '~/components/Aside';
import {Icon} from '~/components/brand/Icons';
import {FlatCover} from '~/components/brand/Scenes';
import {StockLine} from '~/components/books';
import {buttonClass, EmptyState, PageHead} from '~/components/ui';
import {BOOK_CARD_FRAGMENT, bookSummary, formatMoney, type BookCardProduct} from '~/lib/book';
import {useWishlist} from '~/lib/wishlist';
import {WishlistTabs} from '~/components/wishlist/WishlistTabs';
import {ShareModal} from '~/components/wishlist/ShareModal';
import {MoveItemModal} from '~/components/wishlist/MoveItemModal';

export const meta: Route.MetaFunction = () => [
  {title: 'Tus guardados | La Buhardilla'},
  {name: 'robots', content: 'noindex'},
];

/** Los guardados viven en el cliente; la página pide aquí los datos de esos libros. */
export async function loader({request, context}: Route.LoaderArgs) {
  const handles = (new URL(request.url).searchParams.get('h') ?? '')
    .split(',')
    .map((h) => h.trim())
    .filter((h) => /^[a-z0-9-]+$/.test(h))
    .slice(0, 50);
  if (!handles.length) return {books: [] as BookCardProduct[]};
  const {products} = await context.storefront.query(SAVED_QUERY, {cache: context.storefront.CacheShort()});
  const byHandle = new Map((products.nodes as BookCardProduct[]).map((p) => [p.handle, p]));
  return {books: handles.flatMap((h) => byHandle.get(h) ?? [])};
}

export default function Guardados() {
  const {
    ready,
    lists,
    activeList,
    activeListId,
    setActiveListId,
    createList,
    renameList,
    deleteList,
    removeItem,
    moveItem,
    addItem,
    getShareUrl,
  } = useWishlist();

  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [movingBook, setMovingBook] = useState<{title: string; handle: string} | null>(null);

  const fetcher = useFetcher<typeof loader>();
  const currentHandles = activeList?.handles ?? [];
  const key = currentHandles.join(',');

  useEffect(() => {
    if (key) {
      void fetcher.load(`/guardados?h=${encodeURIComponent(key)}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  const books = (fetcher.data?.books ?? []).filter((b) => currentHandles.includes(b.handle));
  const loading = Boolean(key) && !fetcher.data;

  return (
    <div className="mx-auto box-border flex max-w-[1280px] flex-col gap-8 px-4 pb-24 md:px-6">
      <PageHead
        eyebrow={`Tus listas de deseos · ${currentHandles.length} ${
          currentHandles.length === 1 ? 'libro' : 'libros'
        }`}
        title="Tus guardados"
        lead="Organiza tus lecturas en listas personalizadas y compártelas con quien quieras."
      />

      {/* Selector de Listas / Pestañas */}
      <WishlistTabs
        lists={lists}
        activeListId={activeListId}
        onSelect={setActiveListId}
        onCreate={createList}
        onRename={renameList}
        onDelete={deleteList}
        onShare={() => setShareModalOpen(true)}
      />

      {!ready ? (
        <p className="text-ash">Sacudiendo el polvo de tus libros…</p>
      ) : !currentHandles.length ? (
        <EmptyState
          title={`La lista «${activeList?.name ?? 'Favoritos'}» está vacía.`}
          message="Toca el corazón de cualquier libro para añadirlo a esta lista, o explora nuestro catálogo."
        />
      ) : loading ? (
        <p className="text-ash">Sacudiendo el polvo de tus libros…</p>
      ) : (
        <section
          aria-label={`Libros en ${activeList?.name ?? 'guardados'}`}
          className="grid border-b border-dashed border-witch-light md:grid-cols-2 md:gap-x-10"
        >
          {books.map((b) => (
            <SavedItem
              key={b.id}
              book={b}
              currentListId={activeListId}
              hasMultipleLists={lists.length > 1}
              onRemove={(handle) => removeItem(handle, activeListId)}
              onOpenMove={(title, handle) => setMovingBook({title, handle})}
            />
          ))}
        </section>
      )}

      {/* Modal para Compartir Lista */}
      <ShareModal
        isOpen={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
        listName={activeList?.name ?? 'Mis favoritos'}
        shareUrl={getShareUrl(activeListId)}
        itemCount={currentHandles.length}
      />

      {/* Modal para Mover Libro entre Listas */}
      {movingBook && (
        <MoveItemModal
          isOpen={true}
          onClose={() => setMovingBook(null)}
          bookTitle={movingBook.title}
          bookHandle={movingBook.handle}
          currentListId={activeListId}
          lists={lists}
          onMove={moveItem}
          onCopy={addItem}
        />
      )}
    </div>
  );
}

function SavedItem({
  book,
  currentListId,
  hasMultipleLists,
  onRemove,
  onOpenMove,
}: {
  book: BookCardProduct;
  currentListId: string;
  hasMultipleLists: boolean;
  onRemove: (handle: string) => void;
  onOpenMove: (title: string, handle: string) => void;
}) {
  const s = bookSummary(book);
  const firstVariant = book.variants.nodes.find((v) => v.id === s.variantId) ?? book.variants.nodes[0];
  const {open} = useAside();

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
                  <Icon name="bag" size={18} />
                  {fetcher.state !== 'idle' ? 'Añadiendo…' : 'Añadir'}
                </button>
              )}
            </CartForm>
          ) : null}

          {hasMultipleLists && (
            <button
              type="button"
              onClick={() => onOpenMove(book.title, book.handle)}
              className="min-h-11 cursor-pointer border-0 bg-transparent p-0 font-sans text-[15px] font-bold text-ash hover:text-midnight"
            >
              Mover a otra lista
            </button>
          )}

          <button
            type="button"
            onClick={() => onRemove(book.handle)}
            className="min-h-11 cursor-pointer border-0 bg-transparent p-0 font-sans text-[15px] font-extrabold text-witch hover:underline"
          >
            Quitar
          </button>
        </div>
      </div>
    </article>
  );
}

const SAVED_QUERY = `#graphql
  query SavedBooks($country: CountryCode, $language: LanguageCode)
  @inContext(country: $country, language: $language) {
    products(first: 100, query: "product_type:Libro") {
      nodes {
        ...BookCard
      }
    }
  }
  ${BOOK_CARD_FRAGMENT}
` as const;
