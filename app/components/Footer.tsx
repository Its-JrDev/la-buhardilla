import {Form, Link} from 'react-router';
import {Drip} from '~/components/brand/Drip';

const COLUMNS = [
  {
    title: 'Explorar',
    links: [
      ['Horror', '/collections/horror'],
      ['Thriller', '/collections/thriller'],
      ['Terror fantástico', '/collections/terror-fantastico'],
      ['Ediciones raras', '/collections/ediciones-raras'],
    ],
  },
  {
    title: 'La Buhardilla',
    links: [
      ['Quiénes somos', '/quienes-somos'],
      ['Club de medianoche', '/club'],
      ['Visítanos', '/visitanos'],
    ],
  },
  {
    title: 'Ayuda',
    links: [
      ['Envíos', '/ayuda/envios'],
      ['Devoluciones', '/ayuda/devoluciones'],
      ['Preguntas frecuentes', '/ayuda'],
    ],
  },
] as const;

export function Footer() {
  return (
    <footer className="bg-midnight text-slate-200">
      <Drip fill="#f3e8ff" flip />
      <div className="mx-auto box-border flex max-w-[1280px] flex-col gap-12 px-6 pb-10 pt-6">
        <div className="flex flex-wrap gap-12">
          <Form method="post" action="/boletin" className="flex flex-[2_1_380px] flex-col gap-3.5">
            <h2 className="m-0 font-serif text-[30px] font-black text-ghost">Únete al aquelarre</h2>
            <p className="m-0 max-w-[440px] text-base leading-relaxed text-slate-300">
              Una carta cada luna llena: novedades, ediciones raras y la fecha del próximo club de medianoche.
            </p>
            <label htmlFor="ft-mail" className="text-sm font-bold text-witch-light">
              Correo electrónico
            </label>
            <div className="flex flex-wrap gap-2.5">
              <input
                id="ft-mail"
                name="email"
                type="email"
                required
                autoComplete="email"
                placeholder="tu@correo.com"
                className="box-border min-h-12 min-w-0 flex-[1_1_220px] rounded-full border-2 border-ghost bg-ghost px-[18px] font-sans text-base text-midnight"
              />
              <button
                type="submit"
                className="min-h-12 cursor-pointer rounded-full border-0 bg-pumpkin-light px-6 font-sans text-base font-extrabold text-midnight hover:bg-pumpkin-soft"
              >
                Suscribirme
              </button>
            </div>
          </Form>
          {COLUMNS.map((col) => (
            <nav key={col.title} aria-label={col.title} className="flex flex-[1_1_160px] flex-col gap-1">
              <h3 className="m-0 mb-2 text-[13px] font-extrabold uppercase tracking-[0.14em] text-pumpkin-light">{col.title}</h3>
              {col.links.map(([label, to]) => (
                <Link key={to} to={to} prefetch="intent" className="flex min-h-9 items-center text-slate-200 no-underline hover:text-pumpkin-soft">
                  {label}
                </Link>
              ))}
            </nav>
          ))}
        </div>
        <div className="flex flex-wrap justify-between gap-3 border-t border-slate pt-6 text-sm text-slate-400">
          <span>© {new Date().getFullYear()} La Buhardilla</span>
          <span className="font-serif italic text-witch-light">Lee con la luz encendida.</span>
        </div>
      </div>
    </footer>
  );
}
