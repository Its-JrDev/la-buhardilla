import {Await, Link, useLoaderData} from 'react-router';
import {Suspense} from 'react';
import type {Route} from './+types/_index';
import {Drip} from '~/components/brand/Drip';
import {Icon} from '~/components/brand/Icons';
import {HeroScene, NightScene} from '~/components/brand/Scenes';
import {Bookcase} from '~/components/Bookcase';
import {BookGrid} from '~/components/books';
import {CalendarLeaf} from '~/components/club';
import {useQuickView} from '~/components/QuickView';
import {Button, Eyebrow} from '~/components/ui';
import {BOOK_CARD_FRAGMENT, type BookCardProduct} from '~/lib/book';
import {CLUB_SESSIONS} from '~/lib/club';

export const handle = {heroHeader: true};

export const meta: Route.MetaFunction = () => [
  {title: 'La Buhardilla · Librería de horror, thriller y terror fantástico'},
  {name: 'description', content: 'Una librería para quienes leen con la luz encendida: clásicos góticos, thrillers y terror fantástico.'},
];

export async function loader({context}: Route.LoaderArgs) {
  const novedades = context.storefront
    .query(HOME_QUERY, {cache: context.storefront.CacheShort()})
    .then((d) => (d.collection?.products.nodes ?? []) as BookCardProduct[])
    .catch((error: Error) => {
      console.error(error);
      return [] as BookCardProduct[];
    });
  return {novedades};
}

export default function Homepage() {
  const {novedades} = useLoaderData<typeof loader>();
  const {open, modal} = useQuickView();
  const next = CLUB_SESSIONS[0];
  return (
    <>
      <div className="relative bg-[linear-gradient(180deg,#2e1065_0%,#4c1d95_55%,#6b21a8_100%)] text-ghost">
        <section className="mx-auto box-border flex max-w-[1280px] flex-wrap items-center gap-x-16 gap-y-6 px-6 pb-2 pt-8 md:pt-14">
          <div className="flex min-w-0 flex-[1_1_460px] flex-col gap-6">
            <h1 className="m-0 font-serif text-[40px] font-black leading-[1.08] md:text-[64px]">
              Sube a la buhardilla. <span className="italic text-pumpkin-soft">Algo te espera</span> entre los estantes.
            </h1>
            <p className="m-0 max-w-[560px] text-[17px] leading-relaxed text-veil md:text-lg">
              Una librería para quienes leen con la luz encendida: clásicos góticos, thrillers que no sueltan y mundos fantásticos donde la magia siempre cobra su precio.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button to="/collections/all" variant="accent" icon="arrow" className="max-sm:w-full">
                Explorar el catálogo
              </Button>
              <Button to="/collections/novedades" variant="outline-dark" className="max-sm:w-full">
                Novedades del mes
              </Button>
            </div>
          </div>
          <div className="mx-auto w-full max-w-[300px] flex-[1_1_360px] md:max-w-[440px]">
            <HeroScene />
          </div>
        </section>
      </div>
      <Drip />

      <div className="mx-auto box-border flex max-w-[1280px] flex-col gap-20 px-4 pb-24 md:gap-24 md:px-6">
        <section className="flex flex-col gap-9 pt-6">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <h2 className="m-0 font-serif text-[30px] font-black md:text-[40px]">Elige tu pesadilla</h2>
            <p className="m-0 max-w-[420px] text-[17px] text-ash">Tres nichos del mismo librero. Elige con cuidado.</p>
          </div>
          <Bookcase />
        </section>

        <section className="flex flex-col gap-7">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div className="flex flex-col gap-1.5">
              <Eyebrow>Novedades</Eyebrow>
              <h2 className="m-0 font-serif text-[30px] font-black md:text-[40px]">Recién exhumados</h2>
            </div>
            <Link to="/collections/all" prefetch="intent" className="text-[17px] font-extrabold no-underline">
              Ver todo el catálogo →
            </Link>
          </div>
          <Suspense fallback={<p className="text-ash">Desempolvando los estantes…</p>}>
            <Await resolve={novedades}>{(books) => <BookGrid books={books} onQuickView={open} />}</Await>
          </Suspense>
        </section>

        <section className="flex flex-wrap items-center gap-x-16 gap-y-8">
          <div className="mx-auto w-full max-w-[420px] flex-[1_1_360px]">
            <NightScene subject="book" book={{title: next.book, author: next.author, coverBg: next.cover!.bg, coverInk: next.cover!.ink}} />
          </div>
          <div className="flex min-w-0 flex-[1_1_460px] flex-col gap-5">
            <Eyebrow>Club de lectura de medianoche</Eyebrow>
            <h2 className="m-0 font-serif text-[30px] font-black leading-[1.15] md:text-[40px]">El último viernes de cada mes, leemos en voz baja.</h2>
            <p className="m-0 text-[17px] leading-relaxed text-slate">
              Un libro, velas encendidas y una conversación que termina cuando se apaga la última. Este mes subimos con <em className="font-serif">{next.book}</em>.
            </p>
            <div className="flex flex-wrap items-center gap-5">
              <CalendarLeaf month={next.month} day={next.day} weekday={next.weekday} />
              <div className="flex flex-col gap-2 text-[15px] text-slate">
                <span className="inline-flex items-center gap-2">
                  <Icon name="clock" size={18} className="text-witch" />
                  23:00 h · hasta que se apague la última vela
                </span>
                <span className="inline-flex items-center gap-2">
                  <Icon name="pin" size={18} className="text-witch" />
                  En la buhardilla
                </span>
                <span className="inline-flex items-center gap-2">
                  <Icon name="users" size={18} className="text-witch" />
                  Puedes subir con un acompañante
                </span>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
              <Button to="/club/reservar" className="max-sm:w-full">
                Reservar mi lugar
              </Button>
              <Link to="/club" className="inline-flex min-h-11 items-center font-extrabold no-underline">
                Ver lecturas anteriores →
              </Link>
            </div>
          </div>
        </section>
      </div>
      {modal}
    </>
  );
}

const HOME_QUERY = `#graphql
  query HomeNovedades($country: CountryCode, $language: LanguageCode) @inContext(country: $country, language: $language) {
    collection(handle: "novedades") {
      products(first: 4) {
        nodes {
          ...BookCard
        }
      }
    }
  }
  ${BOOK_CARD_FRAGMENT}
` as const;
