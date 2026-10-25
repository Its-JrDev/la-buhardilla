import {useCallback, useEffect, useRef, useState} from 'react';
import {useFetcher} from 'react-router';
import {CartForm} from '@shopify/hydrogen';
import type {ProductQuery} from 'storefrontapi.generated';
import {useAside} from '~/components/Aside';
import {Icon} from '~/components/brand/Icons';
import {Book3D} from '~/components/brand/Scenes';
import {BuyBox, type CartLineInput} from '~/components/BuyBox';
import {coverOf} from '~/lib/book';

type LoaderData = {product: NonNullable<ProductQuery['product']>};

/**
 * Vista rápida: se abre desde el ojo de cada libro y carga los datos de la ficha
 * (el loader de /products/:handle) sin salir del estante.
 */
export function useQuickView() {
  const [handle, setHandle] = useState<string | null>(null);
  const fetcher = useFetcher<LoaderData>();
  const cartFetcher = useFetcher();
  const {open: openAside} = useAside();

  const open = useCallback(
    (h: string) => {
      setHandle(h);
      void fetcher.load(`/products/${h}`);
    },
    [],
  );

  const close = useCallback(() => setHandle(null), []);

  const addToCart = useCallback(
    (lines: CartLineInput[]) => {
      if (!lines.length) return;
      cartFetcher.submit(
        {
          [CartForm.INPUT_NAME]: JSON.stringify({
            action: CartForm.ACTIONS.LinesAdd,
            inputs: {lines},
          }),
        },
        {method: 'POST', action: '/cart'},
      );
      setHandle(null);
      openAside('cart');
    },
    [cartFetcher, openAside],
  );

  const product = fetcher.data?.product?.handle === handle ? fetcher.data.product : null;
  const modal = handle ? (
    <QuickViewModal product={product} onClose={close} onAddToCart={addToCart} />
  ) : null;
  return {open, modal};
}

function QuickViewModal({
  product,
  onClose,
  onAddToCart,
}: {
  product: LoaderData['product'] | null;
  onClose: () => void;
  onAddToCart: (lines: CartLineInput[]) => void;
}) {
  const dialog = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const ac = new AbortController();
    document.addEventListener('keydown', (e) => e.key === 'Escape' && onClose(), {signal: ac.signal});
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    dialog.current?.focus();
    return () => {
      ac.abort();
      document.body.style.overflow = prev;
    };
  }, [onClose]);
  const meta = product
    ? [product.publisher?.value, product.year?.value, product.condition?.value].filter(Boolean).join(' · ')
    : '';
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center p-0 sm:items-center sm:p-6">
      <button type="button" tabIndex={-1} aria-label="Cerrar" onClick={onClose} className="absolute inset-0 cursor-default border-0 bg-midnight/55" />
      <div
        ref={dialog}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby="qv-title"
        className="relative flex max-h-[92dvh] w-full max-w-[880px] flex-wrap overflow-y-auto rounded-t-[28px] bg-ghost shadow-[0_40px_80px_-30px_rgba(15,23,42,.7)] outline-none sm:rounded-[28px]"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Cerrar vista rápida"
          className="absolute right-3.5 top-3.5 z-[2] flex size-11 cursor-pointer items-center justify-center rounded-full border-0 bg-white text-midnight shadow-[0_6px_14px_-8px_rgba(15,23,42,.5)]"
        >
          <Icon name="x" size={20} />
        </button>
        {product ? (
          <>
            <div className="box-border flex min-w-0 flex-[1_1_300px] items-center justify-center bg-spill px-8 pb-14 pt-12">
              <div className="w-[190px]">
                <Book3D book={coverOf(product)} />
              </div>
            </div>
            <div className="box-border flex min-w-0 flex-[1_1_380px] flex-col gap-3.5 px-6 pb-7 pt-9 sm:px-9">
              <span className="text-sm font-extrabold text-witch">{product.vendor}</span>
              <h2 id="qv-title" className="m-0 -mt-1.5 font-serif text-[30px] font-black leading-[1.15]">
                {product.title}
              </h2>
              {meta ? <span className="text-sm text-mist">{meta}</span> : null}
              {product.description ? <p className="m-0 text-[15px] leading-relaxed text-slate">{product.description}</p> : null}
              <BuyBox key={product.id} product={product} compact syncUrl={false} onAddToCartLines={onAddToCart} />
            </div>
          </>
        ) : (
          <div className="flex min-h-[320px] w-full items-center justify-center text-ash" id="qv-title">
            Abriendo la vitrina…
          </div>
        )}
      </div>
    </div>
  );
}
