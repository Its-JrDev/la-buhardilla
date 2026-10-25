import type {Route} from './+types/quienes-somos';
import {HeroScene} from '~/components/brand/Scenes';
import {Tiles} from '~/components/sections';
import {Banner, Eyebrow, SectionHead} from '~/components/ui';

export const meta: Route.MetaFunction = () => [
  {title: 'Quiénes somos | La Buhardilla'},
  {name: 'description', content: 'Una librería al final de la escalera: horror, thriller y terror fantástico.'},
];

export default function QuienesSomos() {
  return (
    <div className="mx-auto box-border flex max-w-[1280px] flex-col gap-11 px-4 pb-24 md:gap-16 md:px-6">
      <section className="flex flex-wrap-reverse items-center gap-x-16 gap-y-6 md:flex-wrap">
        <div className="flex min-w-0 flex-[1_1_480px] flex-col gap-[18px]">
          <Eyebrow>Quiénes somos</Eyebrow>
          <h1 className="m-0 font-serif text-[34px] font-black leading-[1.08] md:text-[52px]">Una librería al final de la escalera.</h1>
          <p className="m-0 max-w-[560px] text-base leading-relaxed text-slate md:text-lg">
            La Buhardilla vende solo lo que da miedo: horror, thriller y terror fantástico. Empezamos con un estante y una lámpara; hoy subimos libros nuevos, usados y
            ediciones raras para quien lee con la luz encendida.
          </p>
        </div>
        <div className="mx-auto w-full max-w-[300px] flex-[1_1_380px] md:max-w-[460px]">
          <HeroScene />
        </div>
      </section>
      <section className="flex flex-col gap-[18px]">
        <SectionHead eyebrow="Lo que nos mueve" title="Tres reglas de la casa" />
        <Tiles
          items={[
            {icon: 'ghost', title: 'Solo lo que da miedo', text: 'Tres estantes y ninguno más. Si no te quita el sueño, no sube a la buhardilla.'},
            {icon: 'book', title: 'Libros con historia', text: 'Revisamos cada usado página por página y describimos sus marcas antes de que lo apartes.'},
            {icon: 'candle', title: 'Leer acompañados', text: 'El último viernes de cada mes subimos a leer en voz baja hasta la última vela.'},
          ]}
        />
      </section>
      <div className="flex flex-col gap-3">
        <Banner icon="pin" title="Sube a conocernos" message="Recoge tus pedidos o pide ver las ediciones raras en el mostrador." action="Cómo llegar" to="/visitanos" />
        <Banner icon="candle" title="Lee con nosotros" message="El club de medianoche se reúne el último viernes de cada mes a las 23:00 h." action="Ver el club" to="/club" />
      </div>
    </div>
  );
}
