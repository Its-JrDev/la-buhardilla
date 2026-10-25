import {useEffect, useMemo, useRef, useState} from 'react';
import {Link, useFetcher} from 'react-router';
import {CartForm} from '@shopify/hydrogen';
import type {ProductQuery} from 'storefrontapi.generated';
import {useAside} from '~/components/Aside';
import {Icon} from '~/components/brand/Icons';
import {StockLine} from '~/components/books';
import {buttonClass, ChillRating, OptionPills} from '~/components/ui';
import {discountPercent, formatMoney, stockLabel} from '~/lib/book';
import {useSaved} from '~/lib/saved';

type Product = NonNullable<ProductQuery['product']>;
type Variant = Product['variants']['nodes'][number];

export type CartLineInput = {
  merchandiseId: string;
  quantity: number;
  selectedVariant?: any;
};

export function useVariantPicker(product: Product, syncUrl: boolean) {
  const initial = product.selectedOrFirstAvailableVariant ?? product.variants.nodes[0];
  const [selected, setSelected] = useState<Record<string, string>>(() =>
    Object.fromEntries((initial?.selectedOptions ?? []).map((o) => [o.name, o.value])),
  );
  const variant = useMemo(
    () => product.variants.nodes.find((v) => v.selectedOptions.every((o) => selected[o.name] === o.value)) ?? initial,
    [product.variants.nodes, selected, initial],
  );
  const choose = (name: string, value: string) => {
    const next = {...selected, [name]: value};
    setSelected(next);
    if (syncUrl && typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      Object.entries(next).forEach(([k, v]) => url.searchParams.set(k, v));
      window.history.replaceState(window.history.state, '', url);
    }
  };
  return {variant, selected, choose};
}

export function BuyBox({
  product,
  compact = false,
  syncUrl = true,
  onAddToCart,
  onAddToCartLines,
}: {
  product: Product;
  compact?: boolean;
  syncUrl?: boolean;
  onAddToCart?: () => void;
  onAddToCartLines?: (lines: CartLineInput[]) => void;
}) {
  const {variant, selected, choose} = useVariantPicker(product, syncUrl);
  const [qty, setQty] = useState(1);
  const {open} = useAside();
  const {isSaved, toggle} = useSaved();
  const saved = isSaved(product.handle);
  const discount = discountPercent(variant?.price, variant?.compareAtPrice);
  const stock = stockLabel(null, Boolean(variant?.availableForSale));
  const chill = Number(product.chill?.value ?? 0);
  const options = product.options.filter((o) => o.optionValues.length > 1 || o.name !== 'Title');

  const optimisticVariant = useMemo(() => {
    if (!variant) return undefined;
    return {
      ...variant,
      product: {
        id: product.id,
        title: product.title,
        handle: product.handle,
        vendor: product.vendor,
        productType: product.productType,
        coverBg: product.coverBg,
        coverInk: product.coverInk,
      },
    };
  }, [variant, product]);

  return (
    <div className="flex flex-col gap-5">
      {chill ? <ChillRating value={chill} /> : null}
      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-2.5">
        <span className={`${compact ? 'text-[30px]' : 'text-4xl'} font-extrabold text-pumpkin-dark`}>{formatMoney(variant?.price)}</span>
        {discount ? (
          <>
            <span className="text-[17px] text-mist line-through">{formatMoney(variant?.compareAtPrice)}</span>
            <span className="self-center rounded-full bg-pumpkin-light px-2.5 py-1 text-[13px] font-extrabold text-midnight">{discount}</span>
          </>
        ) : null}
        <span className="basis-full">
          <StockLine stock={stock} />
        </span>
      </div>
      {options.map((o) =>
        o.optionValues.length > 1 ? (
          <OptionPills
            key={o.name}
            legend={o.name}
            name={`opt-${o.name}`}
            value={selected[o.name]}
            onChange={(v) => choose(o.name, v)}
            options={o.optionValues.map((ov) => {
              const v = product.variants.nodes.find((x) =>
                x.selectedOptions.every((so) => (so.name === o.name ? so.value === ov.name : selected[so.name] === so.value)),
              );
              return {value: ov.name, label: ov.name, sub: v ? formatMoney(v.price) : undefined, disabled: v ? !v.availableForSale : true};
            })}
          />
        ) : null,
      )}
      {variant?.availableForSale ? (
        <div className="flex flex-wrap items-center gap-3">
          <div className="inline-flex h-[38px] items-center rounded-full border-[1.5px] border-witch-light bg-white" role="group" aria-label="Cantidad">
            <button
              type="button"
              aria-label="Quitar uno"
              disabled={qty <= 1}
              onClick={() => setQty((q) => Math.max(1, q - 1))}
              className="flex size-9 cursor-pointer items-center justify-center rounded-full border-0 bg-transparent text-midnight disabled:opacity-40"
            >
              <Icon name="minus" size={16} />
            </button>
            <span className="min-w-6 text-center text-[15px] font-extrabold" aria-live="polite">
              {qty}
            </span>
            <button
              type="button"
              aria-label="Añadir uno"
              onClick={() => setQty((q) => q + 1)}
              className="flex size-9 cursor-pointer items-center justify-center rounded-full border-0 bg-transparent text-midnight disabled:opacity-40"
            >
              <Icon name="plus" size={16} />
            </button>
          </div>
          <div className="min-w-[220px] flex-[1_1_240px]">
            {onAddToCartLines ? (
              <button
                type="submit"
                onClick={() =>
                  onAddToCartLines(
                    variant
                      ? [
                          {
                            merchandiseId: variant.id,
                            quantity: qty,
                            selectedVariant: optimisticVariant,
                          },
                        ]
                      : [],
                  )
                }
                className={buttonClass({full: true})}
              >
                <Icon name="bag" size={20} />
                Añadir a tu colección
              </button>
            ) : (
              <CartForm
                route="/cart"
                action={CartForm.ACTIONS.LinesAdd}
                inputs={{
                  lines: variant
                    ? [
                        {
                          merchandiseId: variant.id,
                          quantity: qty,
                          selectedVariant: optimisticVariant,
                        },
                      ]
                    : [],
                }}
              >
                {(fetcher) => (
                  <CartSubmitButton
                    fetcher={fetcher}
                    onAddToCart={onAddToCart}
                    className={buttonClass({full: true})}
                  />
                )}
              </CartForm>
            )}
          </div>
        </div>
      ) : (
        <BackInStock product={product.title} variant={variant} />
      )}
      <div className="flex flex-wrap items-center justify-between gap-x-5 gap-y-1">
        <button
          type="button"
          onClick={() => toggle(product.handle)}
          aria-pressed={saved}
          className="inline-flex min-h-11 cursor-pointer items-center gap-2 border-0 bg-transparent p-0 text-base font-extrabold text-witch"
        >
          <Icon name="heart" size={20} fill={saved ? 'currentColor' : 'none'} />
          {saved ? 'Guardado para otra noche' : 'Guardar para otra noche'}
        </button>
        {compact ? (
          <Link to={`/products/${product.handle}`} className="inline-flex min-h-11 items-center text-[15px] font-extrabold no-underline">
            Ver ficha completa →
          </Link>
        ) : null}
      </div>
    </div>
  );
}

function BackInStock({product, variant}: {product: string; variant?: Variant}) {
  const fetcher = useFetcher<{ok: boolean; message: string}>();
  const format = variant?.selectedOptions.find((o) => o.name === 'Formato')?.value;
  const done = fetcher.data?.ok;
  return (
    <section className="flex flex-col gap-3.5 rounded-[22px] border-[1.5px] border-witch-light bg-white p-5">
      <div className="flex items-start gap-3.5">
        <span className="flex size-11 flex-none items-center justify-center rounded-full bg-spill text-drip">
          <Icon name="bell" size={21} />
        </span>
        <span className="flex flex-col gap-0.5">
          <span className="font-serif text-lg font-bold">Avísame cuando vuelva</span>
          <span className="text-sm leading-relaxed text-ash">
            {done ? fetcher.data?.message : `Te escribimos en cuanto otro ejemplar${format ? ` en ${format.toLowerCase()}` : ''} suba a la buhardilla. Solo un correo.`}
          </span>
        </span>
      </div>
      {done ? null : (
        <fetcher.Form method="post" action="/avisame" className="flex flex-wrap gap-2.5">
          <input type="hidden" name="product" value={product} />
          <input type="hidden" name="variant" value={variant?.id ?? ''} />
          <label htmlFor="bis-mail" className="sr-only">
            Correo electrónico
          </label>
          <input id="bis-mail" name="email" type="email" required placeholder="tu@correo.com" className="field-input !min-h-[46px] min-w-0 flex-[1_1_200px] bg-ghost" />
          <button type="submit" className={`${buttonClass({size: 'sm'})} flex-[1_1_120px]`} disabled={fetcher.state !== 'idle'}>
            Avísame
          </button>
          {fetcher.data && !fetcher.data.ok ? <p className="m-0 basis-full text-sm font-bold text-pumpkin-dark">{fetcher.data.message}</p> : null}
        </fetcher.Form>
      )}
    </section>
  );
}

function CartSubmitButton({
  fetcher,
  onAddToCart,
  className,
}: {
  fetcher: {state: string; data?: unknown};
  onAddToCart?: () => void;
  className: string;
}) {
  const {open} = useAside();
  const submittedRef = useRef(false);

  useEffect(() => {
    if (fetcher.state !== 'idle') {
      submittedRef.current = true;
    }
    if (submittedRef.current && fetcher.state === 'idle') {
      submittedRef.current = false;
      onAddToCart?.();
    }
  }, [fetcher.state, onAddToCart]);

  return (
    <button
      type="submit"
      onClick={() => open('cart')}
      disabled={fetcher.state !== 'idle'}
      className={className}
    >
      <Icon name="bag" size={20} />
      {fetcher.state !== 'idle' ? 'Añadiendo…' : 'Añadir a tu colección'}
    </button>
  );
}
