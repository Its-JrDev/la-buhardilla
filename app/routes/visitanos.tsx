import type {Route} from './+types/visitanos';
import {Icon, type IconName} from '~/components/brand/Icons';
import {Tiles} from '~/components/sections';
import {PageHead, SectionHead} from '~/components/ui';

export const meta: Route.MetaFunction = () => [{title: 'Visítanos | La Buhardilla'}];

/** Dirección, horario y teléfono: llenados para la maqueta. */
const VISIT = {
  address: 'Calle de las Velas 3, 2º D, 28004 Madrid',
  hours: 'Miércoles a sábado · 11:00 – 19:00',
  phone: '+34 911 234 567',
  mapsUrl: 'https://www.google.com/maps?q=Calle%20de%20las%20Velas%203%2C%20Madrid%2C%20Espa%C3%B1a',
};

function MapArt() {
  return (
    <svg viewBox="0 0 560 380" role="img" aria-label="Mapa ilustrado de los alrededores de La Buhardilla" className="block h-auto w-full rounded-[22px] bg-spill">
      <path d="M0 250C120 230 180 300 300 280S470 210 560 230V380H0Z" fill="#e9d5ff" />
      <g stroke="#fff" strokeWidth="18" strokeLinecap="round" fill="none">
        <path d="M-10 120H570" />
        <path d="M180 -10V390" />
        <path d="M400 -10 360 390" />
        <path d="M-10 330 570 300" />
      </g>
      <g stroke="#fff" strokeWidth="8" strokeLinecap="round" fill="none" opacity=".8">
        <path d="M40 -10V390" />
        <path d="M-10 200 560 190" />
        <path d="M500 -10V390" />
      </g>
      <g fill="#d8b4fe">
        <rect x="62" y="20" width="96" height="76" rx="10" />
        <rect x="202" y="140" width="80" height="46" rx="10" />
        <rect x="420" y="20" width="62" height="80" rx="10" />
        <rect x="62" y="216" width="96" height="60" rx="10" />
        <rect x="420" y="214" width="62" height="64" rx="10" />
      </g>
      <g transform="translate(290 72)">
        <path d="M0 70C-26 40-40 22-40 2a40 40 0 0 1 80 0c0 20-14 38-40 68Z" fill="#ea580c" />
        <path d="M-18 14V-2l18-16 18 16v16Z" fill="#1e1b4b" />
        <circle cx="0" cy="0" r="5" fill="#fdba74" />
      </g>
      <text x="292" y="166" textAnchor="middle" fill="#1e1b4b" fontFamily="Nunito, sans-serif" fontWeight="800" fontSize="13">
        La Buhardilla
      </text>
    </svg>
  );
}

export default function Visitanos() {
  const rows: Array<[IconName, string, string]> = [
    ['pin', 'Dirección', VISIT.address ?? 'Te la enviamos con tu pedido para recoger o tu reserva del club.'],
    ['clock', 'Horario', `${VISIT.hours ? `${VISIT.hours}. ` : ''}El club se reúne el último viernes de cada mes, 23:00 h.`],
    ...(VISIT.phone ? ([['phone', 'Teléfono', VISIT.phone]] as Array<[IconName, string, string]>) : []),
  ];
  return (
    <div className="mx-auto box-border flex max-w-[1280px] flex-col gap-8 px-4 pb-24 md:gap-12 md:px-6">
      <PageHead eyebrow="Visítanos" title="Sube a la buhardilla" lead="Una escalera de caracol, una lámpara encendida y tres estantes que crujen." />
      <div className="flex flex-wrap items-stretch gap-6 md:items-center">
        <div className="min-w-0 flex-[999_1_520px]">
          <MapArt />
        </div>
        <section className="card box-border flex min-w-0 flex-[1_1_340px] flex-col gap-1 p-[22px] md:p-7">
          {rows.map(([icon, a, b], i) => (
            <div key={a} className={`flex gap-3.5 py-3.5 ${i ? 'dashed-top' : ''}`}>
              <Icon name={icon} size={20} className="mt-0.5 flex-none text-drip" />
              <span className="flex flex-col gap-0.5">
                <span className="text-base font-extrabold">{a}</span>
                <span className="text-[15px] leading-normal text-slate">{b}</span>
              </span>
            </div>
          ))}
          {VISIT.mapsUrl ? (
            <a href={VISIT.mapsUrl} target="_blank" rel="noreferrer" className="btn-main mt-2.5 inline-flex min-h-[54px] items-center justify-center gap-2.5 rounded-full bg-midnight px-[30px] text-[17px] font-extrabold text-pumpkin-light no-underline">
              Abrir en mapas <Icon name="arrow" size={18} />
            </a>
          ) : null}
        </section>
      </div>
      <section className="flex flex-col gap-[18px]">
        <SectionHead eyebrow="En la buhardilla" title="Qué puedes hacer al subir" />
        <Tiles
          items={[
            {icon: 'package', title: 'Recoger tus pedidos', text: 'Elige «Recoger en la buhardilla» al sellar y te avisamos cuando esté listo.'},
            {icon: 'feather', title: 'Hojear ediciones raras', text: 'Pide verlas en el mostrador: las sacamos de la vitrina con guantes.'},
            {icon: 'candle', title: 'Subir al club', text: 'El último viernes de cada mes leemos en voz baja hasta la última vela.'},
          ]}
        />
      </section>
    </div>
  );
}
