import {CartForm, useOptimisticCart, type OptimisticCartLine} from '@shopify/hydrogen';
import type {CartLineUpdateInput} from '@shopify/hydrogen/storefront-api-types';
import {Link, useFetchers} from 'react-router';
import type {CartApiQueryFragment} from 'storefrontapi.generated';
import {useAside} from '~/components/Aside';
import {Icon} from '~/components/brand/Icons';
import {FlatCover} from '~/components/brand/Scenes';
import {buttonClass, EmptyState} from '~/components/ui';
import {coverOf, discountPercent, formatMoney} from '~/lib/book';

export type CartLayout = 'page' | 'aside';
type CartLine = OptimisticCartLine<CartApiQueryFragment>;

export function cartCount(cart: CartApiQueryFragment | null | undefined) {
  return cart?.totalQuantity ?? 0;
}

export function CartMain({layout, cart: originalCart}: {cart: CartApiQueryFragment | null; layout: CartLayout}) {
  const cart = useOptimisticCart(originalCart);
  const lines = (cart?.lines?.nodes ?? []).filter((l) => !('parentRelationship' in l && l.parentRelationship?.parent));
  const {close} = useAside();
  const fetchers = useFetchers();
  const fetcherCheckoutUrl = fetchers
    .map((f) => (f.data as {cart?: {checkoutUrl?: string}} | undefined)?.cart?.checkoutUrl)
    .find(Boolean);
  const checkoutUrl = cart?.checkoutUrl ?? fetcherCheckoutUrl;

  if (!lines.length) {
    return layout === 'aside' ? (
      <div className="flex flex-1 flex-col items-center justify-center gap-3.5 px-6 text-center">
        <Icon name="ghost" size={56} strokeWidth={1.6} className="text-witch" />
        <p className="m-0 font-serif text-xl font-black">Tu selección está vacía.</p>
        <p className="m-0 text-[15px] text-ash">Ni un libro, ni una nota al margen.</p>
        <Link to="/collections/all" onClick={close} className={buttonClass({size: 'sm'})}>
          Explorar el catálogo
        </Link>
      </div>
    ) : (
      <EmptyState title="Tu selección está vacía." message="Ni un libro, ni una nota al margen. Sube a los estantes y elige qué leer esta noche." />
    );
  }

  const compareTotal = lines.reduce((sum, l) => {
    const unit =
      l.cost?.compareAtAmountPerQuantity?.amount ??
      l.merchandise?.compareAtPrice?.amount ??
      l.cost?.amountPerQuantity?.amount ??
      l.merchandise?.price?.amount;
    return sum + Number(unit ?? 0) * l.quantity;
  }, 0);
  const calculatedSubtotal = lines.reduce((sum, l) => {
    const amt =
      l.cost?.totalAmount?.amount ??
      Number(l.merchandise?.price?.amount ?? 0) * l.quantity;
    return sum + Number(amt ?? 0);
  }, 0);
  const subtotal = cart?.cost?.subtotalAmount?.amount
    ? Number(cart.cost.subtotalAmount.amount)
    : calculatedSubtotal;
  const savings = compareTotal > subtotal ? compareTotal - subtotal : 0;
  const currencyCode =
    cart?.cost?.subtotalAmount?.currencyCode ??
    lines[0]?.merchandise?.price?.currencyCode ??
    'USD';

  if (layout === 'aside') {
    return (
      <>
        <div className="flex min-h-0 flex-1 flex-col gap-2.5 overflow-y-auto px-5 pb-2 pt-3.5">
          <ul className="m-0 list-none border-b border-dashed border-witch-light p-0">
            {lines.map((line) => (
              <CartLineItem key={line.id} line={line} layout="aside" />
            ))}
          </ul>
        </div>
        <div className="flex flex-col gap-2.5 border-t border-dashed border-witch-light bg-white px-5 pb-[18px] pt-4 shadow-[0_-14px_24px_-20px_rgba(46,16,101,.5)]">
          <div className="flex items-baseline justify-between">
            <span className="text-[17px] font-extrabold">Subtotal</span>
            <span className="flex items-baseline gap-2">
              {savings ? <span className="text-sm text-mist line-through">{formatMoney({amount: String(compareTotal), currencyCode})}</span> : null}
              <span className="text-xl font-extrabold text-pumpkin-dark">
                {formatMoney(cart?.cost?.subtotalAmount ?? {amount: String(subtotal), currencyCode})}
              </span>
            </span>
          </div>
          <span className="text-[13px] text-mist">
            {savings ? `Ahorras ${formatMoney({amount: String(savings), currencyCode})}. ` : ''}Envío e impuestos se calculan al sellar.
          </span>
          {checkoutUrl ? (
            <a href={checkoutUrl} className={buttonClass({full: true})}>
              Sellar transacción <Icon name="arrow" size={18} />
            </a>
          ) : (
            <Link to="/cart" onClick={close} className={buttonClass({full: true})}>
              Sellar transacción <Icon name="arrow" size={18} />
            </Link>
          )}
          <Link to="/cart" onClick={close} className="inline-flex min-h-10 items-center self-center text-[15px] font-extrabold no-underline">
            Ver tu selección completa →
          </Link>
        </div>
      </>
    );
  }

  return (
    <div className="flex flex-wrap items-start gap-x-14 gap-y-10">
      <section aria-label="Libros en tu selección" className="min-w-0 flex-[999_1_560px] border-b border-dashed border-witch-light">
        <ul className="m-0 list-none p-0">
          {lines.map((line) => (
            <CartLineItem key={line.id} line={line} layout="page" />
          ))}
        </ul>
      </section>
      <div className="min-w-0 flex-[1_1_340px] md:sticky md:top-6">
        <OrderSummary
          cart={cart}
          checkoutUrl={checkoutUrl}
          savings={savings}
          currencyCode={currencyCode}
          count={cart?.totalQuantity ?? 0}
          subtotal={subtotal}
        />
      </div>
    </div>
  );
}

function CartLineItem({line, layout}: {line: CartLine; layout: CartLayout}) {
  const {merchandise} = line;
  const product = merchandise?.product ?? {
    id: '',
    title: merchandise?.title ?? 'Libro',
    handle: '',
    vendor: '',
    productType: '',
  };
  const selectedOptions = merchandise?.selectedOptions ?? [];
  const {close} = useAside();
  const cover = coverOf({
    title: product.title,
    vendor: product.vendor,
    handle: product.handle,
    coverBg: (product as any).coverBg,
    coverInk: (product as any).coverInk,
  });
  const format = selectedOptions
    .filter((o) => o.name !== 'Title')
    .map((o) => o.value)
    .join(' · ');
  const unitPrice = line.cost?.amountPerQuantity ?? merchandise?.price;
  const comparePrice = line.cost?.compareAtAmountPerQuantity ?? merchandise?.compareAtPrice;
  const discount = discountPercent(unitPrice, comparePrice);
  const totalAmount =
    line.cost?.totalAmount ??
    (merchandise?.price
      ? {
          amount: String(Number(merchandise.price.amount) * line.quantity),
          currencyCode: merchandise.price.currencyCode,
        }
      : null);
  const isClub = product.productType === 'Club';
  const aside = layout === 'aside';
  return (
    <li className="dashed-top flex items-start gap-4 py-4">
      <Link
        to={isClub ? '/club' : `/products/${product.handle}`}
        onClick={aside ? close : undefined}
        className={`flex-none no-underline ${aside ? 'w-16' : 'w-20 md:w-24'}`}
        aria-hidden="true"
        tabIndex={-1}
      >
        {isClub ? (
          <span className="flex aspect-[2/3] items-center justify-center rounded bg-night text-pumpkin-soft">
            <Icon name="candle" size={26} />
          </span>
        ) : (
          <FlatCover book={cover} size={aside ? 'xs' : 'sm'} />
        )}
      </Link>
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <Link
          to={isClub ? '/club' : `/products/${product.handle}`}
          onClick={aside ? close : undefined}
          className={`font-serif font-bold leading-snug text-midnight no-underline hover:text-witch ${aside ? 'text-[15px]' : 'text-[17px]'}`}
        >
          {product.title}
        </Link>
        <span className="text-[13px] text-ash">{[isClub ? null : product.vendor, format].filter(Boolean).join(' · ')}</span>
        <div className="mt-1.5 flex flex-wrap items-center justify-between gap-3">
          <CartLineQuantity line={line} />
          <span className="flex items-baseline gap-2">
            {discount ? <span className="text-[13px] text-mist line-through">{formatMoney(comparePrice)}</span> : null}
            <span className="text-base font-extrabold text-pumpkin-dark">{formatMoney(totalAmount)}</span>
          </span>
        </div>
      </div>
      <CartForm route="/cart" action={CartForm.ACTIONS.LinesRemove} inputs={{lineIds: [line.id]}} fetcherKey={`rm-${line.id}`}>
        <button
          type="submit"
          disabled={!!line.isOptimistic}
          aria-label={`Quitar ${product.title} de tu selección`}
          className="flex size-10 flex-none cursor-pointer items-center justify-center rounded-full border-0 bg-transparent text-mist hover:bg-spill hover:text-witch"
        >
          <Icon name="x" size={18} />
        </button>
      </CartForm>
    </li>
  );
}

function CartLineQuantity({line}: {line: CartLine}) {
  const {id, quantity, isOptimistic} = line;
  const update = (q: number): CartLineUpdateInput[] => [{id, quantity: q}];
  return (
    <div className="inline-flex h-[38px] items-center rounded-full border-[1.5px] border-witch-light bg-white">
      <CartForm route="/cart" action={CartForm.ACTIONS.LinesUpdate} inputs={{lines: update(Math.max(0, quantity - 1))}} fetcherKey={`q-${id}`}>
        <button
          type="submit"
          aria-label="Quitar uno"
          disabled={quantity <= 1 || !!isOptimistic}
          className="flex size-9 cursor-pointer items-center justify-center rounded-full border-0 bg-transparent text-midnight disabled:opacity-40"
        >
          <Icon name="minus" size={16} />
        </button>
      </CartForm>
      <span className="min-w-6 text-center text-[15px] font-extrabold" aria-live="polite">
        {quantity}
      </span>
      <CartForm route="/cart" action={CartForm.ACTIONS.LinesUpdate} inputs={{lines: update(quantity + 1)}} fetcherKey={`q-${id}`}>
        <button
          type="submit"
          aria-label="Añadir uno"
          disabled={!!isOptimistic}
          className="flex size-9 cursor-pointer items-center justify-center rounded-full border-0 bg-transparent text-midnight disabled:opacity-40"
        >
          <Icon name="plus" size={16} />
        </button>
      </CartForm>
    </div>
  );
}

function OrderSummary({
  cart,
  checkoutUrl,
  savings,
  currencyCode,
  count,
  subtotal,
}: {
  cart: ReturnType<typeof useOptimisticCart<CartApiQueryFragment | null>>;
  checkoutUrl?: string;
  savings: number;
  currencyCode: string;
  count: number;
  subtotal: number;
}) {
  const codes = cart?.discountCodes?.filter((d) => d.applicable).map((d) => d.code) ?? [];
  const subtotalDisplay = cart?.cost?.subtotalAmount ?? {amount: String(subtotal), currencyCode};
  const totalDisplay = cart?.cost?.totalAmount ?? {amount: String(subtotal), currencyCode};
  return (
    <aside aria-label="Resumen de tu selección" className="card box-border flex flex-col gap-5 p-[26px]">
      <h2 className="m-0 font-serif text-[22px] font-black">Resumen</h2>
      <dl className="m-0 flex flex-col gap-2.5 text-[15px]">
        <div className="flex justify-between gap-3">
          <dt className="text-ash">Subtotal · {count} {count === 1 ? 'libro' : 'libros'}</dt>
          <dd className="m-0 font-bold">{formatMoney(subtotalDisplay)}</dd>
        </div>
        {savings ? (
          <div className="flex justify-between gap-3">
            <dt className="text-ash">Ahorras</dt>
            <dd className="m-0 font-bold text-drip">−{formatMoney({amount: String(savings), currencyCode})}</dd>
          </div>
        ) : null}
        <div className="flex justify-between gap-3">
          <dt className="text-ash">Envío</dt>
          <dd className="m-0 font-bold">Se calcula al sellar</dd>
        </div>
        <div className="dashed-top flex items-baseline justify-between gap-3 pt-3">
          <dt className="text-lg font-extrabold">Total estimado</dt>
          <dd className="m-0 text-2xl font-extrabold text-pumpkin-dark">{formatMoney(totalDisplay)}</dd>
        </div>
      </dl>
      <CartForm route="/cart" action={CartForm.ACTIONS.DiscountCodesUpdate} inputs={{discountCodes: codes}}>
        <div className="flex gap-2">
          <label htmlFor="codigo" className="sr-only">
            Código del aquelarre
          </label>
          <input id="codigo" name="discountCode" type="text" placeholder="Código del aquelarre" className="field-input !min-h-[46px] flex-1 bg-ghost" />
          <button type="submit" className={buttonClass({variant: 'outline', size: 'sm'})}>
            Aplicar
          </button>
        </div>
      </CartForm>
      {codes.length ? (
        <CartForm route="/cart" action={CartForm.ACTIONS.DiscountCodesUpdate} inputs={{discountCodes: []}}>
          <p className="m-0 flex items-center justify-between text-sm text-ash">
            Código: <strong className="text-midnight">{codes.join(', ')}</strong>
            <button type="submit" className="cursor-pointer border-0 bg-transparent font-extrabold text-witch">
              Quitar
            </button>
          </p>
        </CartForm>
      ) : null}
      {checkoutUrl ? (
        <a href={checkoutUrl} className={buttonClass({full: true})}>
          Sellar transacción <Icon name="arrow" size={18} />
        </a>
      ) : (
        <button type="button" disabled className={buttonClass({full: true})}>
          Sellar transacción <Icon name="arrow" size={18} />
        </button>
      )}
      <p className="m-0 text-center text-[13px] leading-normal text-mist">Envío e impuestos se calculan en el siguiente paso.</p>
    </aside>
  );
}

