import {Form} from 'react-router';
import type {Route} from './+types/ayuda._index';
import {Icon} from '~/components/brand/Icons';
import {NightScene} from '~/components/brand/Scenes';
import {HelpContact, HelpTopicCard} from '~/components/help';
import {ChipLink, Eyebrow, FaqItem, SectionHead} from '~/components/ui';
import {HELP_TOPICS, POPULAR_FAQS} from '~/lib/help';

export const meta: Route.MetaFunction = () => [
  {title: 'Ayuda | La Buhardilla'},
  {name: 'description', content: 'Envíos, pagos, devoluciones, libros usados y el club de medianoche.'},
];

export default function Ayuda() {
  return (
    <div className="mx-auto box-border flex max-w-[1280px] flex-col gap-12 px-4 pb-24 md:gap-[72px] md:px-6">
      <section className="flex flex-wrap-reverse items-center gap-x-16 gap-y-6 md:flex-wrap">
        <div className="flex min-w-0 flex-[1_1_520px] flex-col gap-[18px]">
          <Eyebrow>Ayuda</Eyebrow>
          <h1 className="m-0 font-serif text-[34px] font-black leading-[1.08] md:text-[52px]">¿Qué te quita el sueño?</h1>
          <p className="m-0 max-w-[520px] text-base leading-relaxed text-slate md:text-lg">
            Respuestas para casi todo lo que cruje en la buhardilla: envíos, pagos, libros usados y el club.
          </p>
          <Form method="get" action="/ayuda/buscar" role="search" className="flex min-h-[60px] max-w-[560px] items-center gap-2 rounded-full border-[1.5px] border-witch-light bg-white py-1.5 pl-5 pr-1.5 shadow-[0_14px_30px_-24px_rgba(46,16,101,.6)]">
            <span className="flex text-witch">
              <Icon name="search" size={20} />
            </span>
            <label htmlFor="help-q" className="sr-only">
              Buscar en la ayuda
            </label>
            <input id="help-q" name="q" type="search" placeholder="Busca tu duda: envíos, devoluciones, el club…" className="min-h-[46px] min-w-0 flex-1 border-0 bg-transparent font-sans text-base text-midnight outline-none" />
            <button type="submit" className="btn-main min-h-[46px] flex-none cursor-pointer rounded-full border-0 bg-midnight px-5 font-sans text-[15px] font-extrabold text-pumpkin-light md:px-6">
              Buscar
            </button>
          </Form>
          <div className="flex flex-wrap items-center gap-2">
            <span className="mr-1 text-sm font-bold text-ash">Lo más buscado:</span>
            <ChipLink to="/ayuda/envios">Rastrear mi pedido</ChipLink>
            <ChipLink to="/ayuda/envios">Tiempos de envío</ChipLink>
            <ChipLink to="/ayuda/devoluciones">Devoluciones</ChipLink>
          </div>
        </div>
        <div className="mx-auto w-full max-w-[260px] flex-[1_1_340px] md:max-w-[440px]">
          <NightScene subject="key" />
        </div>
      </section>

      <section className="flex flex-col gap-[22px]">
        <SectionHead eyebrow="Temas" title="Busca por tema" />
        <div className="hidden grid-cols-[repeat(auto-fill,minmax(340px,1fr))] gap-4 md:grid">
          {HELP_TOPICS.map((t) => (
            <HelpTopicCard key={t.handle} topic={t} />
          ))}
        </div>
        <div className="flex flex-col gap-2.5 md:hidden">
          {HELP_TOPICS.map((t) => (
            <HelpTopicCard key={t.handle} topic={t} compact />
          ))}
        </div>
      </section>

      <section className="flex flex-wrap items-start gap-x-14 gap-y-[22px]">
        <div className="flex min-w-0 flex-[1_1_280px] flex-col gap-3">
          <SectionHead eyebrow="Lo más preguntado" title="Antes de que preguntes" />
          <p className="m-0 text-base leading-relaxed text-ash">Las dudas que más suben por la escalera de caracol.</p>
        </div>
        <div className="flex min-w-0 flex-[999_1_560px] flex-col gap-3">
          {POPULAR_FAQS.map((f, i) => (
            <FaqItem key={f.q} question={f.q} answer={f.a} open={i === 0} />
          ))}
        </div>
      </section>

      <HelpContact />
    </div>
  );
}
