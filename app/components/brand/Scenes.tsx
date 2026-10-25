import type {CSSProperties} from 'react';
import {Bat, Sparkle} from './Icons';
import type {CoverBook} from '~/lib/book';

const DEFAULT_BOOK: CoverBook = {
  title: 'Carmilla',
  author: 'J. S. Le Fanu',
  coverBg: '#ea580c',
  coverInk: '#1e1b4b',
};

/** Libro con volumen: portada en arco, lomo y páginas. Escala con su contenedor. */
export function Book3D({
  book = DEFAULT_BOOK,
  rotate = -5,
  ribbon = '#7e22ce',
  className = '',
}: {
  book?: CoverBook;
  rotate?: number;
  ribbon?: string;
  className?: string;
}) {
  const u = (n: number) => `${((n * 100) / 218).toFixed(3)}cqw`;
  return (
    <div className={`w-full ${className}`} style={{containerType: 'inline-size'}}>
      <div className="relative flex" style={{transform: `rotate(${rotate}deg)`}}>
        <div
          className="relative z-[2] flex flex-none"
          style={{
            width: u(206),
            aspectRatio: '2 / 3',
            padding: `${u(14)} ${u(14)} ${u(14)} ${u(24)}`,
            borderRadius: '3px 2px 2px 3px',
            background: book.coverBg,
            color: book.coverInk,
            boxShadow: '0 2px 4px rgba(15,23,42,.25), 12px 20px 30px -14px rgba(46,16,101,.6)',
          }}
        >
          <span
            className="absolute inset-y-0 left-0"
            style={{width: u(14), background: 'linear-gradient(90deg, rgba(0,0,0,.3), rgba(255,255,255,.14) 60%, rgba(0,0,0,.05))'}}
          />
          <div
            className="flex min-w-0 flex-1 flex-col items-center justify-between text-center"
            style={{border: '1.5px dashed currentColor', borderRadius: `${u(70)} ${u(70)} ${u(10)} ${u(10)}`, padding: `${u(26)} ${u(10)}`}}
          >
            <span className="font-extrabold uppercase" style={{fontSize: u(10), letterSpacing: '.2em'}}>
              {book.author}
            </span>
            <span className="font-serif font-black" style={{fontSize: u(28), lineHeight: 1.12}}>
              {book.title}
            </span>
            <svg style={{width: u(24), height: u(24)}} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
            </svg>
          </div>
          <span
            className="absolute"
            style={{
              left: u(132),
              bottom: `-${u(34)}`,
              width: u(14),
              height: u(52),
              background: ribbon,
              clipPath: 'polygon(0 0, 100% 0, 100% 100%, 50% 82%, 0 100%)',
            }}
          />
        </div>
        <div
          className="z-[1] flex-none"
          style={{
            width: u(12),
            margin: `${u(5)} 0 ${u(5)} -2px`,
            borderRadius: '0 3px 3px 0',
            background: 'repeating-linear-gradient(180deg, #fdfbf7 0 2px, #e7e1d6 2px 3px)',
            boxShadow: 'inset 2px 0 3px rgba(0,0,0,.15)',
          }}
        />
      </div>
    </div>
  );
}

const pct = (n: number) => `${n}cqw`;

function SceneFrame({children, ratio}: {children: React.ReactNode; ratio: string}) {
  return (
    <div aria-hidden="true" className="relative w-full" style={{aspectRatio: ratio, containerType: 'inline-size'}}>
      {children}
    </div>
  );
}

function abs(style: CSSProperties): CSSProperties {
  return {position: 'absolute', height: 'auto', ...style};
}

/** Escena nocturna: luna, murciélagos y un sujeto (libro, llave-calabaza o sobre lacrado). */
export function NightScene({
  subject = 'book',
  book,
  ribbon = '#7e22ce',
}: {
  subject?: 'book' | 'key' | 'envelope';
  book?: CoverBook;
  ribbon?: string;
}) {
  return (
    <SceneFrame ratio="12 / 11">
      <svg style={abs({left: '6%', top: '4%', width: pct(68.75)})} viewBox="0 0 100 100">
        <path d="M50 4A46 46 0 1 0 50 96A54 54 0 0 1 50 4Z" fill="#e9d5ff" />
      </svg>
      <Sparkle style={abs({left: '14%', top: '12%', width: pct(4.167)})} />
      <Sparkle style={abs({left: '22%', top: '26%', width: pct(2.292)})} />
      <Sparkle style={abs({left: '80%', top: '80%', width: pct(3.125)})} />
      <Sparkle style={abs({left: '68%', top: '12%', width: pct(2.083)})} fill="#f97316" />
      <Bat style={abs({left: '6%', top: '28%', width: pct(12.917), transform: 'rotate(-14deg)'})} />
      <Bat style={abs({left: '68%', top: '6%', width: pct(9.167), transform: 'rotate(10deg)'})} />
      <Bat style={abs({left: '80%', top: '15%', width: pct(5.833), transform: 'rotate(18deg)'})} />
      <Bat style={abs({left: '84%', top: '62%', width: pct(7.5), transform: 'rotate(-8deg)'})} />
      <div
        className="absolute left-1/2 -translate-x-1/2 rounded-[50%]"
        style={{bottom: '7%', width: pct(52.083), height: pct(5), background: 'radial-gradient(closest-side, rgba(46,16,101,.28), rgba(46,16,101,0))'}}
      />
      <div className="absolute left-1/2 top-1/2 flex items-center justify-center" style={{transform: 'translate(-50%, -52%)'}}>
        {subject === 'book' ? (
          <div style={{width: pct(45.833)}}>
            <Book3D book={book} ribbon={ribbon} />
          </div>
        ) : subject === 'key' ? (
          <PumpkinKey />
        ) : (
          <Envelope />
        )}
      </div>
    </SceneFrame>
  );
}

function PumpkinKey() {
  return (
    <svg
      style={{width: pct(25.833), height: 'auto', transform: 'rotate(-24deg)', filter: 'drop-shadow(10px 16px 18px rgba(46,16,101,.35))'}}
      viewBox="0 0 120 260"
      aria-hidden="true"
    >
      <path d="M60 32c0-11 4-18 12-21" fill="none" stroke="#3f6212" strokeWidth="5" strokeLinecap="round" />
      <path d="M67 18c8-6 17-5 21 1-7 4-15 4-21-1Z" fill="#4d7c0f" />
      <ellipse cx="38" cy="66" rx="26" ry="32" fill="#ea580c" />
      <ellipse cx="82" cy="66" rx="26" ry="32" fill="#ea580c" />
      <ellipse cx="60" cy="66" rx="24" ry="35" fill="#ef6418" />
      <path d="M44 36q-10 30 0 61M76 36q10 30 0 61" fill="none" stroke="#c2410c" strokeWidth="2.5" opacity=".75" />
      <path d="M33 66l9-15 9 15ZM69 66l9-15 9 15Z" fill="#1e1b4b" />
      <path d="M56 74l4-6 4 6Z" fill="#1e1b4b" />
      <path d="M32 80q28 20 56 0l-7 2-3 7-6-6-5 7-5-7-5 7-5-7-6 6-3-7Z" fill="#1e1b4b" />
      <rect x="45" y="97" width="30" height="9" rx="4.5" fill="#1e1b4b" />
      <circle cx="60" cy="113" r="7" fill="#f97316" stroke="#1e1b4b" strokeWidth="3" />
      <rect x="55" y="118" width="10" height="114" rx="5" fill="#1e1b4b" />
      <path d="M58 124v100" stroke="#4c1d95" strokeWidth="2" strokeLinecap="round" />
      <path d="M60 124c13 5 13 15 0 20s-13 15 0 20 13 15 0 20" fill="none" stroke="#4d7c0f" strokeWidth="3.2" strokeLinecap="round" />
      <path d="M60 184c6 2 11 6 12 12-7 0-12-4-12-12Z" fill="#65a30d" />
      <path d="M64 196h28a3 3 0 0 1 3 3v6h-9v7h9v6a3 3 0 0 1-3 3H64Z" fill="#1e1b4b" />
      <path d="M64 222h18a3 3 0 0 1 3 3v4a3 3 0 0 1-3 3H64Z" fill="#1e1b4b" />
      <circle cx="60" cy="236" r="6" fill="#f97316" stroke="#1e1b4b" strokeWidth="3" />
    </svg>
  );
}

function Envelope() {
  return (
    <svg
      viewBox="0 0 300 198"
      aria-hidden="true"
      style={{width: pct(60.417), height: 'auto', transform: 'rotate(-4deg)', filter: 'drop-shadow(10px 18px 22px rgba(46,16,101,.35))'}}
    >
      <rect x="6" y="6" width="288" height="186" rx="10" fill="#1e1b4b" />
      <path d="M6 16 150 118 294 16" fill="none" stroke="#4c1d95" strokeWidth="3" />
      <path d="M6 188 120 98M294 188 180 98" fill="none" stroke="#2e1065" strokeWidth="3" />
      <circle cx="150" cy="116" r="34" fill="#ea580c" />
      <circle cx="150" cy="116" r="34" fill="none" stroke="#c2410c" strokeWidth="6" strokeDasharray="7 5" />
      <circle cx="150" cy="116" r="22" fill="#f97316" />
      <path d="M150 100a10 10 0 0 0 13 13 14 14 0 1 1-13-13Z" fill="#9a3412" />
      <path d="M128 146c-4 8-2 14 4 16M172 146c4 8 2 14-4 16" fill="none" stroke="#ea580c" strokeWidth="7" strokeLinecap="round" />
    </svg>
  );
}

/** Casa embrujada con luna llena, para el inicio y «Quiénes somos». */
export function HeroScene() {
  return (
    <SceneFrame ratio="440 / 500">
      <div
        className="absolute rounded-full"
        style={{
          right: '6%',
          top: '6%',
          width: pct(52.273),
          aspectRatio: '1',
          background: 'radial-gradient(circle at 40% 40%, #fff7ed 0%, #fdba74 60%, #fb923c 100%)',
          boxShadow: `0 0 ${pct(12)} ${pct(3)} rgba(253, 186, 116, 0.4)`,
        }}
      />
      <Bat style={abs({left: '4%', top: '10%', width: pct(18.182)})} />
      <Bat style={abs({left: '58%', top: '20%', width: pct(11.818), transform: 'rotate(14deg)'})} />
      <Bat style={abs({left: '88%', top: '50%', width: pct(9.091), transform: 'rotate(-10deg)'})} />
      <svg style={abs({left: '50%', bottom: 0, transform: 'translateX(-50%)', width: pct(77.273)})} viewBox="0 0 340 400">
        <path d="M90 120 96 70h20l2 40Z" fill="#1e1b4b" />
        <path d="M40 400V200l-24 6L172 40l150 158-22-4v206Z" fill="#1e1b4b" />
        <path d="M150 108c0-16 44-16 44 0" fill="none" stroke="#1e1b4b" strokeWidth="6" />
        <circle cx="172" cy="150" r="30" fill="#f97316" />
        <circle cx="172" cy="150" r="30" fill="none" stroke="#fdba74" strokeWidth="3" />
        <path d="M172 120v60M142 150h60" stroke="#1e1b4b" strokeWidth="4" />
        <rect x="76" y="232" width="40" height="52" rx="20" fill="#fdba74" />
        <path d="M96 232v52M76 258h40" stroke="#1e1b4b" strokeWidth="3" />
        <rect x="228" y="250" width="40" height="52" rx="4" fill="#4c1d95" />
        <path d="M146 400v-70a26 26 0 0 1 52 0v70Z" fill="#2e1065" />
        <path d="M0 400c40-14 90-18 170-10s130 4 170-4v14H0Z" fill="#2e1065" />
        <path d="M300 400V300M300 330l-26-28M300 318l22-30M300 350l20-12" stroke="#1e1b4b" strokeWidth="6" strokeLinecap="round" fill="none" />
      </svg>
    </SceneFrame>
  );
}

/** Portada plana de un libro (listados, carrito, pedidos). */
export function FlatCover({
  book,
  size = 'md',
  className = '',
}: {
  book: CoverBook;
  size?: 'xs' | 'sm' | 'md';
  className?: string;
}) {
  const s = {
    xs: {pad: '3px 3px 3px 6px', arch: '10px 10px 2px 2px', spine: 4, title: false},
    sm: {pad: '6px 6px 6px 10px', arch: '24px 24px 4px 4px', spine: 6, title: true},
    md: {pad: '10px 10px 10px 15px', arch: '40px 40px 6px 6px', spine: 8, title: true},
  }[size];
  return (
    <div
      className={`bk-cover relative flex overflow-hidden ${className}`}
      style={{
        aspectRatio: '2 / 3',
        padding: s.pad,
        borderRadius: '2px 5px 5px 2px',
        background: book.coverBg,
        color: book.coverInk,
        boxShadow: '0 1px 2px rgba(15,23,42,.25), 5px 9px 16px -6px rgba(46,16,101,.45)',
      }}
    >
      <span
        aria-hidden="true"
        className="absolute inset-y-0 left-0"
        style={{width: s.spine, background: 'linear-gradient(90deg, rgba(0,0,0,.28), rgba(255,255,255,.12) 60%, rgba(0,0,0,0))'}}
      />
      <div
        className="flex min-w-0 flex-1 flex-col items-center justify-between overflow-hidden text-center"
        style={{border: '1.2px dashed currentColor', borderRadius: s.arch, padding: size === 'md' ? '14px 6px' : '4px', containerType: 'inline-size'}}
      >
        {size === 'md' ? (
          <span className="text-[8px] font-extrabold uppercase tracking-[.18em]">{book.author}</span>
        ) : (
          <span />
        )}
        {s.title ? (
          <span
            lang="es"
            className="max-w-full font-serif font-black"
            style={{fontSize: size === 'md' ? coverTitleSize(book.title) : '11px', lineHeight: 1.15, overflowWrap: 'break-word'}}
          >
            {book.title}
          </span>
        ) : null}
        {size === 'md' ? (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
          </svg>
        ) : (
          <span />
        )}
      </div>
    </div>
  );
}

function coverTitleSize(title: string) {
  const longest = Math.max(6, title.length / 3.4, ...title.split(' ').map((w) => w.length));
  const cqw = Math.round(1000 / (longest * 0.74)) / 10;
  return `min(16px, max(6px, ${cqw}cqw))`;
}
