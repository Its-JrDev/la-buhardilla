import {useMemo} from 'react';
import {Link} from 'react-router';
import {CartForm} from '@shopify/hydrogen';
import {Icon} from '~/components/brand/Icons';
import {FlatCover} from '~/components/brand/Scenes';
import {bookSummary, formatMoney, type BookCardProduct} from '~/lib/book';
import {useSaved} from '~/lib/saved';
import {useAside} from '~/components/Aside';

/** Libro en listado: portada sin caja y tres acciones al pasar el cursor. */
export function BookCard({book, onQuickView}: {book: BookCardProduct; onQuickView?: (handle: string) => void}) {
  const s = bookSummary(book);
  const {isSaved, toggle} = useSaved();
  const saved = isSaved(book.handle);
  const url = `/products/${book.handle}`;
  return (
    <article className="bk-card flex h-full flex-col gap-3.5">
      <div className="relative box-border flex aspect-[4/5] items-center justify-center overflow-hidden px-5 py-7">
        <Link to={url} prefetch="intent" aria-label={`${book.title}, de ${book.vendor}`} className="block w-[64%] no-underline">
          <FlatCover book={s.cover} />
        </Link>
        {s.discount ? (
          <span className="absolute left-3 top-3 rounded-full bg-pumpkin-light px-2.5 py-1 text-xs font-extrabold text-midnight">{s.discount}</span>
        ) : null}
        <div className="absolute right-3 top-3 flex flex-col gap-2">
          {s.variantId ? (
            <AddToCartIcon book={book} variantId={s.variantId} />
          ) : null}
          <button
            type="button"
            onClick={() => toggle(book.handle)}
            aria-pressed={saved}
            aria-label={saved ? `Quitar ${book.title} de tus guardados` : `Guardar ${book.title} para otra noche`}
            className="bk-act flex size-11 cursor-pointer items-center justify-center rounded-full border-[1.5px] border-veil bg-white text-drip shadow-[0_4px_10px_-4px_rgba(15,23,42,.35)]"
          >
            <Icon name="heart" size={19} fill={saved ? 'currentColor' : 'none'} />
          </button>
          {onQuickView ? (
            <button
              type="button"
              onClick={() => onQuickView(book.handle)}
              aria-label={`Vista rápida de ${book.title}`}
              className="bk-act flex size-11 cursor-pointer items-center justify-center rounded-full border-[1.5px] border-veil bg-white text-drip shadow-[0_4px_10px_-4px_rgba(15,23,42,.35)]"
            >
              <Icon name="eye" size={19} />
            </button>
          ) : null}
        </div>
      </div>
      <div className="flex flex-col gap-[3px] px-1">
        <h3 className="m-0 line-clamp-2 font-serif text-base font-bold leading-snug">
          <Link to={url} prefetch="intent" className="text-midnight no-underline hover:text-witch">
            {book.title}
          </Link>
        </h3>
        <span className="text-sm text-ash">{book.vendor}</span>
        {s.meta ? <span className="text-xs leading-snug text-mist">{s.meta}</span> : null}
        <div className="mt-1.5 flex items-baseline gap-2">
          <span className="text-[19px] font-extrabold text-pumpkin-dark">{formatMoney(s.price)}</span>
          {s.compare && s.discount ? <span className="text-sm text-mist line-through">{formatMoney(s.compare)}</span> : null}
        </div>
        <StockLine stock={s.stock} />
      </div>
    </article>
  );
}

function AddToCartIcon({book, variantId}: {book: BookCardProduct; variantId: string}) {
  const {open} = useAside();
  const firstVariant = book.variants.nodes.find((v) => v.id === variantId) ?? book.variants.nodes[0];
  const optimisticVariant = useMemo(() => {
    if (!firstVariant) return undefined;
    return {
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
    };
  }, [firstVariant, book]);

  return (
    <CartForm
      route="/cart"
      action={CartForm.ACTIONS.LinesAdd}
      inputs={{
        lines: [
          {
            merchandiseId: variantId,
            quantity: 1,
            selectedVariant: optimisticVariant,
          },
        ],
      }}
    >
      {(fetcher) => (
        <button
          type="submit"
          onClick={() => open('cart')}
          disabled={fetcher.state !== 'idle'}
          aria-label={`Añadir ${book.title} a tu selección`}
          className="bk-act flex size-11 cursor-pointer items-center justify-center rounded-full border-0 bg-midnight text-pumpkin-light shadow-[0_4px_10px_-4px_rgba(15,23,42,.5)]"
        >
          <Icon name="bag" size={19} />
        </button>
      )}
    </CartForm>
  );
}

export function StockLine({stock, small = false}: {stock: {text: string; low: boolean; out: boolean}; small?: boolean}) {
  const color = stock.out ? 'text-ash' : stock.low ? 'text-pumpkin-dark' : 'text-drip';
  return (
    <span className={`inline-flex items-center gap-1.5 font-bold ${small ? 'text-xs' : 'text-[13px]'} ${color}`}>
      <span aria-hidden="true" className="size-[7px] rounded-full bg-current" />
      {stock.text}
    </span>
  );
}

/** Libro en fila (listados móviles). */
export function BookRow({book}: {book: BookCardProduct}) {
  const s = bookSummary(book);
  return (
    <Link to={`/products/${book.handle}`} prefetch="intent" className="dashed-top flex items-start gap-4 py-4 text-midnight no-underline">
      <div className="relative w-[92px] flex-none pl-1">
        <FlatCover book={s.cover} size="sm" />
        {s.discount ? (
          <span className="absolute left-0 top-1.5 rounded-r-full bg-pumpkin-light px-[7px] py-0.5 text-[11px] font-extrabold text-midnight">{s.discount}</span>
        ) : null}
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-[3px]">
        <span className="font-serif text-base font-bold leading-snug">{book.title}</span>
        <span className="text-sm text-ash">{book.vendor}</span>
        {s.meta ? <span className="text-xs leading-snug text-mist">{s.meta}</span> : null}
        <span className="mt-1 flex items-baseline gap-2">
          <span className="text-lg font-extrabold text-pumpkin-dark">{formatMoney(s.price)}</span>
          {s.compare && s.discount ? <span className="text-[13px] text-mist line-through">{formatMoney(s.compare)}</span> : null}
        </span>
        <StockLine stock={s.stock} small />
      </div>
    </Link>
  );
}

/** Rejilla en escritorio, filas en móvil. */
export function BookGrid({books, onQuickView, min = 180}: {books: BookCardProduct[]; onQuickView?: (h: string) => void; min?: number}) {
  return (
    <>
      <div className="hidden gap-x-6 gap-y-10 md:grid" style={{gridTemplateColumns: `repeat(auto-fill, minmax(${min}px, 1fr))`}}>
        {books.map((b) => (
          <BookCard key={b.id} book={b} onQuickView={onQuickView} />
        ))}
      </div>
      <div className="flex flex-col border-b border-dashed border-witch-light md:hidden">
        {books.map((b) => (
          <BookRow key={b.id} book={b} />
        ))}
      </div>
    </>
  );
}
