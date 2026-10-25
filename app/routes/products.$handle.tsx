import {Await, Link, redirect, useLoaderData} from 'react-router';
import {Suspense} from 'react';
import type {Route} from './+types/products.$handle';
import {Analytics, getSelectedProductOptions} from '@shopify/hydrogen';
import {Icon} from '~/components/brand/Icons';
import {NightScene} from '~/components/brand/Scenes';
import {BookGrid} from '~/components/books';
import {BuyBox} from '~/components/BuyBox';
import {useQuickView} from '~/components/QuickView';
import {Crumbs, Eyebrow} from '~/components/ui';
import {coverOf, type BookCardProduct} from '~/lib/book';
import {PRODUCT_QUERY, RECOMMENDATIONS_QUERY} from '~/lib/product';
import {redirectIfHandleIsLocalized} from '~/lib/redirect';
import {CLUB_PRODUCT_HANDLE} from '~/lib/club';

export const meta: Route.MetaFunction = ({data}) => [
  {title: `${data?.product.title ?? 'Libro'} · ${data?.product.vendor ?? ''} | La Buhardilla`},
  {name: 'description', content: data?.product.seo.description ?? data?.product.description ?? ''},
  {rel: 'canonical', href: `/products/${data?.product.handle}`},
];

export async function loader({context, params, request}: Route.LoaderArgs) {
  const {handle} = params;
  const {storefront} = context;
  if (!handle) throw new Error('Expected product handle to be defined');
  if (handle === CLUB_PRODUCT_HANDLE) throw redirect('/club/reservar');

  const {product} = await storefront.query(PRODUCT_QUERY, {
    variables: {handle, selectedOptions: getSelectedProductOptions(request)},
  });
  if (!product?.id) throw new Response(null, {status: 404});
  redirectIfHandleIsLocalized(request, {handle, data: product});

  const related = storefront
    .query(RECOMMENDATIONS_QUERY, {variables: {productId: product.id}})
    .then((d) => ((d.productRecommendations ?? []) as BookCardProduct[]).slice(0, 4))
    .catch((error: Error) => {
      console.error(error);
      return [] as BookCardProduct[];
    });

  return {product, related};
}

export default function Product() {
  const {product, related} = useLoaderData<typeof loader>();
  const {open, modal} = useQuickView();
  const shelf = product.collections.nodes.find((c) => c.handle !== 'novedades') ?? product.collections.nodes[0];
  const synopsis = (product.synopsis?.value ?? product.description ?? '').split(/\n+/).filter(Boolean);
  const variant = product.selectedOrFirstAvailableVariant;
  const format = variant?.selectedOptions.find((o) => o.name === 'Formato')?.value;
  const meta = [product.publisher?.value, product.year?.value, format, product.condition?.value].filter(Boolean).join(' · ');
  const details: Array<[string, string | null | undefined]> = [
    ['Editorial', product.publisher?.value],
    ['Año', product.year?.value],
    ['Páginas', product.pages?.value],
    ['Traducción', product.translator?.value],
    ['ISBN', product.isbn?.value],
    ['Estado', product.condition?.value],
    ['Subgénero', product.subgenre?.value],
  ];

  return (
    <div className="mx-auto box-border flex max-w-[1280px] flex-col gap-20 px-4 pb-24 md:px-6">
      <div className="flex flex-col gap-6">
        <Crumbs items={[{label: 'Inicio', to: '/'}, ...(shelf ? [{label: shelf.title, to: `/collections/${shelf.handle}`}] : []), {label: product.title}]} />
        <section className="flex flex-wrap items-start gap-x-16 gap-y-8">
          <div className="mx-auto w-full max-w-[300px] flex-[1_1_420px] md:max-w-[560px]">
            <NightScene subject="book" book={coverOf(product)} ribbon="#f97316" />
          </div>
          <div className="flex min-w-0 flex-[1_1_440px] flex-col gap-5">
            <Eyebrow>{[product.subgenre?.value, shelf?.title].filter(Boolean).join(' · ') || 'La Buhardilla'}</Eyebrow>
            <div className="flex flex-col gap-1.5">
              <h1 className="m-0 font-serif text-[34px] font-black leading-[1.1] md:text-[52px]">{product.title}</h1>
              <Link to={`/search?q=${encodeURIComponent(product.vendor)}`} className="self-start text-lg font-extrabold no-underline">
                {product.vendor}
              </Link>
              {meta ? <span className="text-sm text-mist">{meta}</span> : null}
            </div>
            <BuyBox product={product} />
            <div className="dashed-top flex flex-col gap-3 pt-[18px] text-[15px] text-slate">
              <span className="flex items-center gap-3">
                <span className="flex size-9 flex-none items-center justify-center rounded-full bg-white text-drip">
                  <Icon name="package" size={18} />
                </span>
                Envío estándar de 3 a 5 días hábiles, o recógelo gratis en la buhardilla
              </span>
              <span className="flex items-center gap-3">
                <span className="flex size-9 flex-none items-center justify-center rounded-full bg-white text-drip">
                  <Icon name="moon" size={18} />
                </span>
                Sale envuelto en papel negro con lacre naranja
              </span>
            </div>
          </div>
        </section>
      </div>

      <section className="flex flex-wrap items-start gap-x-16 gap-y-10">
        <div className="flex min-w-0 flex-[999_1_520px] flex-col gap-4">
          <Eyebrow>Sinopsis</Eyebrow>
          <h2 className="m-0 font-serif text-[28px] font-black md:text-[34px]">La historia</h2>
          {synopsis.map((p, i) => (
            <p key={i} className="m-0 max-w-[680px] text-[17px] leading-[1.7] text-slate">
              {p}
            </p>
          ))}
          {product.quote?.value ? (
            <blockquote className="m-0 mt-2 max-w-[640px] border-l-4 border-pumpkin-light pl-5 font-serif text-xl italic leading-relaxed text-night md:text-2xl">
              «{product.quote.value}»
            </blockquote>
          ) : null}
        </div>
        <div className="card flex min-w-0 flex-[1_1_320px] flex-col gap-2 p-[26px]">
          <Eyebrow>Ficha</Eyebrow>
          <h2 className="m-0 mb-1 font-serif text-[22px] font-black">Detalles</h2>
          <dl className="m-0">
            {details
              .filter(([, v]) => v)
              .map(([k, v]) => (
                <div key={k} className="dashed-top flex justify-between gap-4 py-3">
                  <dt className="text-sm font-bold text-mist">{k}</dt>
                  <dd className="m-0 text-right text-[15px] font-bold">{v}</dd>
                </div>
              ))}
          </dl>
        </div>
      </section>

      <Suspense fallback={null}>
        <Await resolve={related}>
          {(books) =>
            books.length ? (
              <section className="flex flex-col gap-7">
                <div className="flex flex-wrap items-end justify-between gap-3">
                  <div className="flex flex-col gap-1.5">
                    <Eyebrow>También en el estante</Eyebrow>
                    <h2 className="m-0 font-serif text-[26px] font-black md:text-[34px]">Quienes subieron por este libro también se llevaron</h2>
                  </div>
                  {shelf ? (
                    <Link to={`/collections/${shelf.handle}`} className="font-extrabold no-underline">
                      Ver más del estante →
                    </Link>
                  ) : null}
                </div>
                <BookGrid books={books} onQuickView={open} />
              </section>
            ) : null
          }
        </Await>
      </Suspense>
      {modal}
      <Analytics.ProductView
        data={{
          products: [
            {
              id: product.id,
              title: product.title,
              price: variant?.price.amount || '0',
              vendor: product.vendor,
              variantId: variant?.id || '',
              variantTitle: variant?.title || '',
              quantity: 1,
            },
          ],
        }}
      />
    </div>
  );
}
