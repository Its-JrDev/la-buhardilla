import {Await, Link, useLoaderData} from 'react-router';
import {Suspense} from 'react';
import type {Route} from './+types/club._index';
import {Icon, type IconName} from '~/components/brand/Icons';
import {NightScene} from '~/components/brand/Scenes';
import {BookGrid} from '~/components/books';
import {SessionCard} from '~/components/club';
import {useQuickView} from '~/components/QuickView';
import {Button, Eyebrow, FaqItem, SectionHead} from '~/components/ui';
import {BOOK_CARD_FRAGMENT, type BookCardProduct} from '~/lib/book';
import {CLUB_PAST, CLUB_SESSIONS} from '~/lib/club';
import {topicByHandle} from '~/lib/help';

export const meta: Route.MetaFunction = () => [
  {title: 'Club de lectura de medianoche | La Buhardilla'},
  {name: 'description', content: 'El último viernes de cada mes, leemos en voz baja hasta que se apaga la última vela.'},
];

export function loader({context}: Route.LoaderArgs) {
  const past = context.storefront
    .query(PAST_QUERY, {cache: context.storefront.CacheLong()})
    .then((d) => {
      const all = d.products.nodes as BookCardProduct[];
      return CLUB_PAST.flatMap((h) => all.find((b) => b.handle === h) ?? []);
    })
    .catch(() => [] as BookCardProduct[]);
  return {past};
}

const STEPS: Array<[IconName, string, string]> = [
  ['calendar', 'Aparta tu lugar', 'Reserva en línea para la sesión del mes. Te llega la confirmación por correo.'],
  ['book', 'Lee el libro del mes', 'Lo encuentras en la buhardilla. No hace falta terminarlo: basta con las ganas.'],
  ['candle', 'Sube a la buhardilla', 'El último viernes, a las 23:00 h. Leemos en voz baja hasta la última vela.'],
];

export default function Club() {
  const {past} = useLoaderData<typeof loader>();
  const {open, modal} = useQuickView();
  const next = CLUB_SESSIONS[0];
  const faqs = topicByHandle('club')?.faqs ?? [];
  return (
    <div className="mx-auto box-border flex max-w-[1280px] flex-col gap-12 px-4 pb-24 md:gap-[72px] md:px-6">
      <section className="flex flex-wrap items-center gap-x-16 gap-y-6">
        <div className="mx-auto w-full max-w-[340px] flex-[1_1_380px] md:max-w-[500px]">
          <NightScene subject="book" book={{title: next.book, author: next.author, coverBg: next.cover!.bg, coverInk: next.cover!.ink}} />
        </div>
        <div className="flex min-w-0 flex-[1_1_460px] flex-col gap-[18px]">
          <Eyebrow>Club de lectura de medianoche</Eyebrow>
          <h1 className="m-0 font-serif text-[34px] font-black leading-[1.08] md:text-[52px]">El último viernes de cada mes, leemos en voz baja.</h1>
          <p className="m-0 max-w-[560px] text-base leading-relaxed text-slate md:text-lg">
            Un libro, velas encendidas y una conversación que termina cuando se apaga la última. Sube a la buhardilla con nosotros.
          </p>
          <SessionCard session={next} seats="Puedes llevar un acompañante" />
          <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
            <Button to="/club/reservar" icon="arrow" className="max-sm:w-full">
              Reservar mi lugar
            </Button>
            <a href="#como-funciona" className="inline-flex min-h-11 items-center font-extrabold no-underline">
              Cómo funciona →
            </a>
          </div>
        </div>
      </section>

      <section id="como-funciona" className="flex flex-col gap-[22px]">
        <SectionHead eyebrow="Cómo funciona" title="Tres pasos hasta la medianoche" />
        <ol className="m-0 flex list-none flex-wrap gap-4 p-0">
          {STEPS.map(([icon, t, d], i) => (
            <li key={t} className="flex min-w-0 flex-[1_1_240px] flex-col gap-2.5 rounded-[22px] bg-white p-[22px]">
              <span className="flex items-center gap-3">
                <span className="flex size-11 items-center justify-center rounded-full bg-spill text-drip">
                  <Icon name={icon} size={22} />
                </span>
                <span className="text-[13px] font-extrabold text-pumpkin-dark">PASO {i + 1}</span>
              </span>
              <span className="font-serif text-[19px] font-black">{t}</span>
              <span className="text-[15px] leading-relaxed text-ash">{d}</span>
            </li>
          ))}
        </ol>
      </section>

      <section className="flex flex-col gap-[18px]">
        <SectionHead eyebrow="Calendario" title="Próximas sesiones" />
        <div className="grid gap-4 md:grid-cols-[repeat(auto-fill,minmax(380px,1fr))]">
          {CLUB_SESSIONS.map((s) => (
            <SessionCard key={s.month} session={s} />
          ))}
        </div>
      </section>

      <Suspense fallback={null}>
        <Await resolve={past}>
          {(books) =>
            books.length ? (
              <section className="flex flex-col gap-6">
                <SectionHead eyebrow="Ya subimos con" title="Lecturas anteriores" />
                <BookGrid books={books} onQuickView={open} />
              </section>
            ) : null
          }
        </Await>
      </Suspense>

      <section className="flex flex-col gap-4">
        <SectionHead eyebrow="Preguntas" title="Antes de subir" />
        <div className="flex flex-col gap-3">
          {faqs.map((f) => (
            <FaqItem key={f.q} question={f.q} answer={f.a} feedback={false} />
          ))}
        </div>
        <Link to="/ayuda/club" className="self-start font-extrabold no-underline">
          Más sobre el club →
        </Link>
      </section>
      {modal}
    </div>
  );
}

const PAST_QUERY = `#graphql
  query ClubPastReads($country: CountryCode, $language: LanguageCode)
  @inContext(country: $country, language: $language) {
    products(first: 100, query: "product_type:Libro") {
      nodes {
        ...BookCard
      }
    }
  }
  ${BOOK_CARD_FRAGMENT}
` as const;
