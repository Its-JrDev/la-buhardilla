import {Link} from 'react-router';
import {Cobweb, Pumpkin} from '~/components/brand/Icons';

type Spine = {title: string; w: number; h: number; bg: string; ink: string; lean?: 'r' | 'l'};

const NICHES: Array<{num: string; label: string; to: string; blurb: string; spines: Spine[]}> = [
  {
    num: 'I',
    label: 'Horror',
    to: '/collections/horror',
    blurb: 'Casas que respiran, criaturas que esperan y los clásicos góticos que lo empezaron todo.',
    spines: [
      {title: 'Drácula', w: 40, h: 206, bg: '#0f172a', ink: '#fdba74'},
      {title: 'Carmilla', w: 30, h: 178, bg: '#7e22ce', ink: '#fdfbf7'},
      {title: 'Frankenstein', w: 44, h: 214, bg: '#f97316', ink: '#1e1b4b'},
      {title: 'Usher', w: 28, h: 168, bg: '#fdfbf7', ink: '#581c87'},
      {title: 'Dunwich', w: 36, h: 196, bg: '#334155', ink: '#fdfbf7'},
      {title: 'Innsmouth', w: 32, h: 188, bg: '#c2410c', ink: '#fdfbf7'},
      {title: 'Otra vuelta de tuerca', w: 30, h: 170, bg: '#d8b4fe', ink: '#1e1b4b', lean: 'r'},
    ],
  },
  {
    num: 'II',
    label: 'Thriller',
    to: '/collections/thriller',
    blurb: 'Persecuciones, secretos de familia y finales que te harán revisar la cerradura dos veces.',
    spines: [
      {title: 'Jekyll y Hyde', w: 38, h: 200, bg: '#0f172a', ink: '#f97316'},
      {title: 'La ópera', w: 34, h: 214, bg: '#d8b4fe', ink: '#1e1b4b'},
      {title: 'Innsmouth', w: 30, h: 176, bg: '#ea580c', ink: '#0f172a'},
      {title: 'Otra vuelta de tuerca', w: 42, h: 206, bg: '#334155', ink: '#fdfbf7'},
      {title: 'El Horla', w: 28, h: 184, bg: '#fdba74', ink: '#1e1b4b'},
    ],
  },
  {
    num: 'III',
    label: 'Terror fantástico',
    to: '/collections/terror-fantastico',
    blurb: 'Mundos imposibles, pactos antiguos y una magia que siempre cobra su precio.',
    spines: [
      {title: 'Los sauces', w: 30, h: 176, bg: '#fdba74', ink: '#1e1b4b', lean: 'l'},
      {title: 'Cthulhu', w: 40, h: 214, bg: '#581c87', ink: '#fdba74'},
      {title: 'El rey de amarillo', w: 34, h: 196, bg: '#fdfbf7', ink: '#7c2d12'},
      {title: 'El gran dios Pan', w: 32, h: 204, bg: '#c2410c', ink: '#fdfbf7'},
      {title: 'Montañas de la locura', w: 44, h: 210, bg: '#1e1b4b', ink: '#d8b4fe'},
      {title: 'El color', w: 28, h: 180, bg: '#d8b4fe', ink: '#2e1065'},
    ],
  },
];

function SpineBook({s, i}: {s: Spine; i: number}) {
  const lean = s.lean === 'r' ? 'rotate(9deg)' : s.lean === 'l' ? 'rotate(-9deg)' : undefined;
  return (
    <div
      className="flex flex-none"
      style={{transform: lean, transformOrigin: s.lean === 'r' ? 'bottom left' : 'bottom right', margin: s.lean === 'r' ? '0 0 0 8px' : s.lean === 'l' ? '0 8px 0 0' : undefined}}
    >
      <div
        className="spine box-border flex flex-col rounded-t-[3px] rounded-b-[1px] px-[3px]"
        style={{
          width: s.w,
          height: s.h,
          background: s.bg,
          color: s.ink,
          boxShadow: 'inset -4px 0 0 rgba(0,0,0,.2), inset 2px 0 0 rgba(255,255,255,.14), 2px 0 3px rgba(0,0,0,.25)',
          transitionDelay: `${i * 35}ms`,
        }}
      >
        <div className="mt-2.5 h-3.5 border-y border-current border-t-2 opacity-85" />
        <div className="flex flex-1 items-center justify-center overflow-hidden py-1.5">
          <span className="whitespace-nowrap font-serif text-[11px] font-bold tracking-[.04em]" style={{writingMode: 'vertical-rl', transform: 'rotate(180deg)'}}>
            {s.title}
          </span>
        </div>
        <div className="mb-2.5 h-2.5 border-y border-current border-b-2 opacity-85" />
      </div>
    </div>
  );
}

function Candle() {
  return (
    <svg aria-hidden="true" className="block flex-none" width="30" height="84" viewBox="0 0 34 96">
      <path d="M17 4c-6 8-6 14 0 18 6-4 6-10 0-18Z" fill="#f97316" />
      <path d="M17 10c-3 4-3 8 0 10 3-2 3-6 0-10Z" fill="#fdba74" />
      <path d="M17 22v6" stroke="#1e1b4b" strokeWidth="2" />
      <path d="M8 28h18v62H8Z" fill="#f3e8ff" />
      <path d="M8 28c0 6 4 6 4 12s4 3 4-2 4-4 4 1 3 3 3-3 3-8 3-8Z" fill="#d8b4fe" />
      <path d="M3 90h28v6H3Z" fill="#4c1d95" />
    </svg>
  );
}

/** «Elige tu pesadilla»: tres nichos del mismo librero, uno por estante. */
export function Bookcase() {
  return (
    <div className="flex flex-col">
      <div aria-hidden="true" className="flex h-[70px] items-end justify-between px-7">
        <div className="flex items-end gap-2.5">
          <Candle />
        </div>
        <div className="flex items-end gap-1">
          <Pumpkin size={44} />
          <Pumpkin size={66} />
        </div>
      </div>
      <div className="rounded-t-xl bg-night p-3 pb-0 shadow-[0_30px_60px_-30px_rgba(30,27,75,.8)] md:p-4 md:pb-0">
        <div className="grid gap-3 md:grid-cols-3">
          {NICHES.map((n) => (
            <Link key={n.to} to={n.to} prefetch="intent" className="shelf flex flex-col bg-night no-underline">
              <div
                className="niche relative box-border flex h-[220px] items-end justify-center gap-0.5 overflow-hidden px-[18px] md:h-[270px]"
                style={{
                  background: 'repeating-linear-gradient(90deg, #2e1065 0 62px, #260b55 62px 64px)',
                  boxShadow: 'inset 0 22px 26px -14px rgba(0,0,0,.65), inset 0 -10px 16px -10px rgba(0,0,0,.5)',
                }}
              >
                <Cobweb className="absolute left-0 top-0 opacity-40" />
                {n.spines.map((s, i) => (
                  <SpineBook key={s.title + i} s={s} i={i} />
                ))}
              </div>
              <div aria-hidden="true" className="h-3 border-t-[3px] border-witch bg-[#4c1d95]" />
              <div className="flex flex-col gap-2 px-1 pb-5 pt-4">
                <span className="inline-flex items-center gap-2.5 self-start rounded-r-full bg-pumpkin-soft py-[7px] pl-[22px] pr-5 font-serif text-[17px] font-black text-night">
                  <span className="text-xs text-witch">{n.num}</span>
                  {n.label}
                </span>
                <span className="text-[15px] leading-relaxed text-veil">{n.blurb}</span>
                <span className="text-[15px] font-extrabold text-pumpkin-soft">Entrar al estante →</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
      <div aria-hidden="true" className="h-4 rounded-b-md bg-night-purple" />
    </div>
  );
}
