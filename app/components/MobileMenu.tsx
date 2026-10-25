import {Suspense} from 'react';
import {Await, Form, Link} from 'react-router';
import {useOptimisticCart} from '@shopify/hydrogen';
import type {CartApiQueryFragment} from 'storefrontapi.generated';
import {Icon, Logo, Pumpkin, type IconName} from '~/components/brand/Icons';
import {Drip} from '~/components/brand/Drip';
import {buttonClass} from '~/components/ui';
import {useAside} from '~/components/Aside';
import {useSaved} from '~/lib/saved';
import {initials, type HeaderCustomer} from '~/components/Header';

type Spine = [width: number, height: number, bg: string, band: string, lean?: number];

const SHELVES: Array<{label: string; to: string; spines: Spine[]}> = [
  {
    label: 'Horror',
    to: '/collections/horror',
    spines: [
      [12, 58, '#0f172a', '#fdba74'],
      [10, 50, '#7e22ce', '#fdfbf7'],
      [14, 62, '#f97316', '#1e1b4b'],
      [9, 46, '#fdfbf7', '#581c87'],
    ],
  },
  {
    label: 'Thriller',
    to: '/collections/thriller',
    spines: [
      [12, 56, '#0f172a', '#fdba74'],
      [14, 64, '#d8b4fe', '#1e1b4b'],
      [10, 50, '#ea580c', '#0f172a'],
      [12, 58, '#334155', '#fdfbf7'],
    ],
  },
  {
    label: 'Terror fantástico',
    to: '/collections/terror-fantastico',
    spines: [
      [11, 54, '#fdba74', '#1e1b4b', -9],
      [12, 64, '#581c87', '#fdba74'],
      [10, 52, '#fdfbf7', '#7c2d12'],
      [12, 60, '#c2410c', '#fdfbf7'],
    ],
  },
];

function MiniShelf() {
  return (
    <div className="grid grid-cols-3 gap-1.5 rounded-t-xl rounded-b bg-night px-1.5 pt-2 shadow-[0_10px_18px_-12px_rgba(30,27,75,.7)]">
      {SHELVES.map((s) => (
        <Link key={s.to} to={s.to} aria-label={`Estante de ${s.label}`} className="shelf flex min-w-0 flex-col no-underline">
          <span
            aria-hidden="true"
            className="flex h-16 items-end justify-center gap-0.5 overflow-hidden px-1"
            style={{background: 'repeating-linear-gradient(90deg, #2e1065 0 22px, #260b55 22px 23px)', boxShadow: 'inset 0 12px 14px -10px rgba(0,0,0,.7)'}}
          >
            {s.spines.map(([w, h, bg, band, lean], i) => (
              <span
                key={i}
                className="spine flex-none rounded-t-[2px]"
                style={{
                  width: w,
                  height: h,
                  background: bg,
                  borderTop: `5px solid ${bg}`,
                  boxShadow: `inset 0 2px 0 ${band}, inset 0 -6px 0 ${bg}, inset 0 -8px 0 ${band}, inset -2px 0 0 rgba(0,0,0,.2)`,
                  transform: lean ? `rotate(${lean}deg)` : undefined,
                  transformOrigin: 'bottom right',
                  marginLeft: lean ? 10 : undefined,
                }}
              />
            ))}
          </span>
          <span aria-hidden="true" className="h-1.5 border-t-2 border-witch bg-[#4c1d95]" />
          <span className="flex flex-1 items-center justify-center px-0.5 pb-2 pt-1.5 text-center font-serif text-[13px] font-bold leading-tight text-pumpkin-soft">
            {s.label}
          </span>
        </Link>
      ))}
    </div>
  );
}

function Row({to, icon, label, badge, hot}: {to: string; icon?: IconName; label: string; badge?: number; hot?: boolean}) {
  return (
    <Link
      to={to}
      className={`flex min-h-[42px] items-center gap-3 border-b border-dashed border-veil text-base no-underline ${hot ? 'font-extrabold text-pumpkin-dark' : 'font-bold text-midnight'} hover:text-witch`}
    >
      {icon ? (
        <span className="flex text-drip">
          <Icon name={icon} size={20} />
        </span>
      ) : null}
      <span className="flex-1">{label}</span>
      {badge ? (
        <span className="flex h-[22px] min-w-[22px] items-center justify-center rounded-full bg-pumpkin-soft px-1.5 text-xs font-extrabold text-night">{badge}</span>
      ) : (
        <span className="flex text-[#a78bfa]">
          <Icon name="chev" size={16} />
        </span>
      )}
    </Link>
  );
}

export function MobileMenu({customer, cart}: {customer: Promise<HeaderCustomer>; cart: Promise<CartApiQueryFragment | null>}) {
  const {close} = useAside();
  const {saved} = useSaved();
  return (
    <nav aria-label="Menú" className="flex h-full flex-col overflow-hidden">
      <div className="flex flex-none items-center justify-between bg-[linear-gradient(180deg,#2e1065_0%,#6b21a8_100%)] py-3 pl-4 pr-2 text-ghost">
        <Link to="/" className="inline-flex min-h-11 items-center gap-2 text-ghost no-underline hover:text-ghost">
          <Logo size={30} />
          <span className="font-serif text-lg font-black">La Buhardilla</span>
        </Link>
        <button type="button" onClick={close} aria-label="Cerrar menú" className="flex size-11 cursor-pointer items-center justify-center rounded-full border-0 bg-transparent text-ghost">
          <Icon name="x" size={22} />
        </button>
      </div>
      <Drip bg="#fdfbf7" compact className="flex-none" />
      <div className="flex min-h-0 flex-1 flex-col gap-3.5 overflow-y-auto px-[18px] pb-3">
        <div className="flex flex-col gap-2.5">
          <span className="eyebrow text-xs">Estantes</span>
          <MiniShelf />
          <div className="flex flex-col">
            <Row to="/collections/novedades" label="Novedades" />
            <Row to="/collections/ediciones-raras" label="Ediciones raras" hot />
          </div>
        </div>
        <div className="flex flex-col">
          <span className="eyebrow text-xs">Tu buhardilla</span>
          <Row to="/guardados" icon="heart" label="Tus guardados" badge={saved.length || undefined} />
          <MobileCartRow cart={cart} />
          <Row to="/club" icon="candle" label="Club de medianoche" />
          <Row to="/ayuda" icon="help" label="Ayuda y envíos" />
        </div>
        <div className="mt-auto flex items-end justify-between gap-3">
          <span className="font-serif text-[15px] italic text-drip">Lee con la luz encendida.</span>
          <Pumpkin />
        </div>
      </div>
      <Suspense fallback={<GuestFooter />}>
        <Await resolve={customer} errorElement={<GuestFooter />}>
          {(c) => (c ? <SignedFooter customer={c} /> : <GuestFooter />)}
        </Await>
      </Suspense>
    </nav>
  );
}

function GuestFooter() {
  return (
    <div className="flex flex-none flex-col gap-2.5 border-t border-dashed border-witch-light bg-white px-[18px] pb-[18px] pt-3.5">
      <span className="flex items-center gap-2.5 text-sm text-ash">
        <span className="flex size-8 flex-none items-center justify-center rounded-full bg-spill text-drip">
          <Icon name="user" size={17} />
        </span>
        Entra para seguir tus pedidos y guardados.
      </span>
      <div className="flex gap-2.5">
        <Link to="/account/login" className={`${buttonClass({size: 'sm', full: true})} flex-1`}>
          Entrar
        </Link>
        <Link to="/account/login" className={`${buttonClass({size: 'sm', variant: 'outline', full: true})} flex-1`}>
          Crear cuenta
        </Link>
      </div>
    </div>
  );
}

function SignedFooter({customer}: {customer: NonNullable<HeaderCustomer>}) {
  const name = [customer.firstName, customer.lastName].filter(Boolean).join(' ') || 'Tu cuenta';
  return (
    <div className="flex flex-none items-center gap-3 border-t border-dashed border-witch-light bg-white py-3.5 pl-[18px] pr-2.5">
      <span className="flex size-11 flex-none items-center justify-center rounded-full bg-pumpkin-soft text-[15px] font-extrabold text-night">{initials(customer)}</span>
      <span className="flex min-w-0 flex-1 flex-col">
        <span className="font-serif text-base font-bold">{name}</span>
        <Link to="/account" className="text-sm font-extrabold no-underline">
          Tu cuenta y pedidos →
        </Link>
      </span>
      <Form method="post" action="/account/logout">
        <button type="submit" aria-label="Salir" className="flex size-11 cursor-pointer items-center justify-center rounded-full border-0 bg-transparent text-ash">
          <Icon name="logout" size={20} />
        </button>
      </Form>
    </div>
  );
}

function MobileCartRow({cart}: {cart: Promise<CartApiQueryFragment | null>}) {
  return (
    <Suspense fallback={<Row to="/cart" icon="bag" label="Tu selección" />}>
      <Await resolve={cart}>
        {(c) => <MobileCartRowInner originalCart={c} />}
      </Await>
    </Suspense>
  );
}

function MobileCartRowInner({originalCart}: {originalCart: CartApiQueryFragment | null}) {
  const cart = useOptimisticCart(originalCart);
  const n = cart?.totalQuantity ?? 0;
  return <Row to="/cart" icon="bag" label="Tu selección" badge={n || undefined} />;
}
