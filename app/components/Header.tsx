import {Suspense, useEffect, useRef, useState} from 'react';
import {Await, Form, Link, NavLink, useAsyncValue} from 'react-router';
import {type CartViewPayload, useAnalytics, useOptimisticCart} from '@shopify/hydrogen';
import type {CartApiQueryFragment} from 'storefrontapi.generated';
import {useAside} from '~/components/Aside';
import {Icon, Logo, type IconName} from '~/components/brand/Icons';
import {Drip} from '~/components/brand/Drip';
import {useSaved} from '~/lib/saved';

export type HeaderCustomer = {firstName?: string | null; lastName?: string | null; email?: string | null} | null;

export interface NavItem {
  to: string;
  label: string;
  hot?: boolean;
  icon?: IconName;
}

export const NAV_ITEMS: NavItem[] = [
  {to: '/collections/horror', label: 'Horror'},
  {to: '/collections/thriller', label: 'Thriller'},
  {to: '/collections/terror-fantastico', label: 'Terror fantástico'},
  {to: '/collections/novedades', label: 'Novedades'},
  {to: '/collections/ediciones-raras', label: 'Ediciones raras', hot: true},
  {to: '/club', label: 'Club de medianoche', icon: 'candle'},
];

export const NAV = NAV_ITEMS;

export function initials(c: HeaderCustomer) {
  const a = (c?.firstName ?? '').trim()[0] ?? '';
  const b = (c?.lastName ?? '').trim()[0] ?? '';
  return (a + b || (c?.email ?? '?')[0]).toUpperCase();
}

const iconBtn =
  'relative flex size-11 cursor-pointer items-center justify-center rounded-full border-0 bg-transparent text-ghost no-underline hover:bg-white/10 hover:text-ghost';

export function Header({
  cart,
  customer,
  hero = false,
}: {
  cart: Promise<CartApiQueryFragment | null>;
  customer: Promise<HeaderCustomer>;
  /** En el inicio el header se funde con el hero morado y no gotea. */
  hero?: boolean;
}) {
  const {open} = useAside();
  return (
    <div className={hero ? 'relative z-20' : ''}>
      <div className={`text-ghost ${hero ? 'bg-night-purple' : 'bg-[linear-gradient(180deg,#2e1065_0%,#6b21a8_100%)]'}`}>
        <p className="m-0 bg-midnight/45 px-4 py-1.5 text-center text-xs font-bold tracking-[0.06em] text-pumpkin-soft md:text-[13px] md:tracking-[0.08em]">
          Nuevas llegadas cada luna llena<span className="hidden md:inline"> · Envíos a todo el país</span>
        </p>
        {/* escritorio */}
        <header className="mx-auto hidden max-w-[1280px] flex-nowrap items-center justify-between gap-x-6 px-6 py-2 md:flex">
          <Link to="/" prefetch="intent" className="inline-flex min-h-11 flex-none items-center gap-3 text-ghost no-underline hover:text-ghost">
            <Logo />
            <span className="font-serif text-[23px] font-black tracking-[-0.01em]">La Buhardilla</span>
          </Link>
          <DesktopNav />
          <div className="flex flex-none items-center gap-1">
            <button type="button" aria-label="Buscar" className={iconBtn} onClick={() => open('search')}>
              <Icon name="search" size={22} />
            </button>
            <Suspense fallback={<AccountLink />}>
              <Await resolve={customer} errorElement={<AccountLink />}>
                {(c) => (c ? <AccountMenu customer={c} /> : <AccountLink />)}
              </Await>
            </Suspense>
            <SavedLink />
            <CartToggle cart={cart} className="ml-4" />
          </div>
        </header>
        {/* móvil */}
        <div className="pb-4 md:hidden">
          <header className="flex items-center justify-between px-3 py-2">
            <button type="button" aria-label="Abrir menú" className={iconBtn} onClick={() => open('mobile')}>
              <Icon name="menu" size={24} />
            </button>
            <Link to="/" className="inline-flex min-h-11 items-center gap-2 text-ghost no-underline hover:text-ghost">
              <Logo size={32} />
              <span className="font-serif text-xl font-black">La Buhardilla</span>
            </Link>
            <div className="flex items-center gap-3">
              <SavedLink />
              <CartToggle cart={cart} small />
            </div>
          </header>
          <Form method="get" action="/search" role="search" className="px-4 pt-1">
            <label htmlFor="m-search" className="sr-only">
              Buscar
            </label>
            <div className="flex min-h-[46px] items-center gap-2.5 rounded-full bg-ghost px-4 text-drip">
              <Icon name="search" size={18} />
              <input
                id="m-search"
                name="q"
                type="search"
                placeholder="Busca un título o autor"
                className="min-w-0 flex-1 border-0 bg-transparent font-sans text-base text-midnight outline-none"
              />
            </div>
          </Form>
        </div>
      </div>
      {hero ? null : <Drip bg="#fdfbf7" className="md:hidden" compact />}
      {hero ? null : <Drip className="hidden md:block" />}
    </div>
  );
}

function DesktopNav() {
  const navRef = useRef<HTMLElement>(null);
  const measureRef = useRef<HTMLDivElement>(null);
  const [visibleCount, setVisibleCount] = useState<number>(NAV_ITEMS.length);

  useEffect(() => {
    const nav = navRef.current;
    const measure = measureRef.current;
    if (!nav || !measure) return;

    const compute = () => {
      const items = Array.from(measure.children) as HTMLElement[];
      if (items.length < NAV_ITEMS.length + 1) return;

      const itemWidths = items.slice(0, NAV_ITEMS.length).map((el) => el.getBoundingClientRect().width);
      const moreWidth = items[items.length - 1].getBoundingClientRect().width;
      const gap = 20; // 1.25rem = gap-x-5

      const available = nav.clientWidth;
      if (available <= 0) return;

      const totalNeeded = itemWidths.reduce((a, b) => a + b, 0) + (itemWidths.length - 1) * gap;
      if (totalNeeded <= available) {
        setVisibleCount(NAV_ITEMS.length);
        return;
      }

      const budget = available - moreWidth - gap;
      let count = 0;
      let current = 0;
      for (let i = 0; i < itemWidths.length; i++) {
        const next = current + itemWidths[i] + (i > 0 ? gap : 0);
        if (next <= budget) {
          current = next;
          count++;
        } else {
          break;
        }
      }

      setVisibleCount(Math.max(1, count));
    };

    compute();

    const ro = new ResizeObserver(() => {
      compute();
    });
    ro.observe(nav);

    return () => ro.disconnect();
  }, []);

  const visibleItems = NAV_ITEMS.slice(0, visibleCount);
  const overflowItems = NAV_ITEMS.slice(visibleCount);

  return (
    <>
      {/* Tira oculta de medición exacta para evitar saltos o suposiciones mágicas */}
      <div
        ref={measureRef}
        aria-hidden="true"
        className="pointer-events-none invisible absolute -top-[9999px] left-0 flex flex-nowrap items-center gap-x-5 whitespace-nowrap text-[15px] font-bold xl:text-base"
      >
        {NAV_ITEMS.map((n) => (
          <span key={n.to} className="inline-flex shrink-0 items-center gap-1.5">
            {n.icon ? <Icon name={n.icon} size={17} /> : null}
            {n.label}
          </span>
        ))}
        <span className="inline-flex shrink-0 items-center gap-1">
          <span>Más</span>
          <Icon name="chev" size={14} />
        </span>
      </div>

      {/* Barra de navegación visible */}
      <nav
        ref={navRef}
        aria-label="Principal"
        className="flex min-w-0 flex-1 flex-nowrap items-center gap-x-5 text-[15px] font-bold xl:text-base"
      >
        {visibleItems.map((n) => (
          <NavLink
            key={n.to}
            to={n.to}
            prefetch="intent"
            className={({isActive}) =>
              `inline-flex shrink-0 min-h-11 items-center gap-1.5 no-underline underline-offset-8 ${
                n.hot ? 'text-pumpkin-soft' : n.icon ? 'text-veil' : 'text-ghost'
              } hover:text-pumpkin-soft ${isActive ? 'underline decoration-2' : ''}`
            }
          >
            {n.icon ? <Icon name={n.icon} size={17} /> : null}
            {n.label}
          </NavLink>
        ))}

        {overflowItems.length > 0 ? <NavMoreMenu items={overflowItems} /> : null}
      </nav>
    </>
  );
}

function NavMoreMenu({items}: {items: NavItem[]}) {
  const [open, setOpen] = useState(false);
  const box = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const ac = new AbortController();
    document.addEventListener(
      'pointerdown',
      (e) => !box.current?.contains(e.target as Node) && setOpen(false),
      {signal: ac.signal},
    );
    document.addEventListener(
      'keydown',
      (e) => e.key === 'Escape' && setOpen(false),
      {signal: ac.signal},
    );
    return () => ac.abort();
  }, [open]);

  if (!items.length) return null;

  return (
    <div ref={box} className="relative inline-flex shrink-0">
      <button
        type="button"
        aria-haspopup="true"
        aria-expanded={open}
        aria-label="Más secciones y colecciones"
        onClick={() => setOpen((o) => !o)}
        className={`inline-flex min-h-11 cursor-pointer items-center gap-1 border-0 bg-transparent p-0 text-[15px] font-bold no-underline transition-colors xl:text-base ${
          open ? 'text-pumpkin-soft' : 'text-ghost'
        } hover:text-pumpkin-soft`}
      >
        <span>Más</span>
        <Icon
          name="chev"
          size={14}
          className={`transition-transform duration-200 ${open ? '-rotate-90 text-pumpkin-soft' : 'rotate-90 text-veil'}`}
        />
      </button>

      {open ? (
        <div
          role="menu"
          aria-label="Más colecciones"
          className="absolute right-0 top-[calc(100%+12px)] z-30 flex w-[270px] flex-col gap-0.5 rounded-[22px] border-[1.5px] border-veil bg-white p-2 text-midnight shadow-[0_24px_48px_-20px_rgba(46,16,101,0.55)]"
        >
          <span
            aria-hidden="true"
            className="absolute -top-2 right-[20px] size-3.5 rotate-45 border-l-[1.5px] border-t-[1.5px] border-veil bg-white"
          />

          {items.map((item) => (
            <Link
              key={item.to}
              role="menuitem"
              to={item.to}
              onClick={() => setOpen(false)}
              className="flex min-h-[42px] items-center justify-between rounded-[14px] px-3 text-[15px] font-extrabold text-midnight no-underline hover:bg-spill hover:text-midnight"
            >
              <span className="flex items-center gap-2.5">
                {item.icon ? (
                  <Icon name={item.icon} size={17} className={item.to === '/club' ? 'text-witch' : 'text-drip'} />
                ) : null}
                {item.label}
              </span>
              {item.hot ? (
                <span className="rounded-full bg-pumpkin-soft px-2 py-0.5 text-[11px] font-bold text-pumpkin-dark">
                  Raras
                </span>
              ) : null}
            </Link>
          ))}

          <div className="my-1 border-t border-dashed border-witch-light" />

          {/* Catálogo completo */}
          <Link
            role="menuitem"
            to="/collections/all"
            onClick={() => setOpen(false)}
            className="flex min-h-[42px] items-center gap-2.5 rounded-[14px] px-3 text-[15px] font-extrabold text-witch no-underline hover:bg-spill"
          >
            <Icon name="book" size={17} className="text-witch" />
            <span>Ver catálogo completo →</span>
          </Link>
        </div>
      ) : null}
    </div>
  );
}

function AccountLink() {
  return (
    <Link to="/account" aria-label="Tu cuenta" className={iconBtn}>
      <Icon name="user" size={22} />
    </Link>
  );
}

const ACCOUNT_MENU: Array<{icon: IconName; label: string; to: string}> = [
  {icon: 'package', label: 'Tus pedidos', to: '/account/orders'},
  {icon: 'user', label: 'Direcciones y datos', to: '/account/profile'},
  {icon: 'heart', label: 'Tus guardados', to: '/guardados'},
  {icon: 'candle', label: 'Reservas del club', to: '/account/club'},
];

function AccountMenu({customer}: {customer: NonNullable<HeaderCustomer>}) {
  const [open, setOpen] = useState(false);
  const box = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const ac = new AbortController();
    document.addEventListener('pointerdown', (e) => !box.current?.contains(e.target as Node) && setOpen(false), {signal: ac.signal});
    document.addEventListener('keydown', (e) => e.key === 'Escape' && setOpen(false), {signal: ac.signal});
    return () => ac.abort();
  }, [open]);
  const name = [customer.firstName, customer.lastName].filter(Boolean).join(' ') || 'Tu cuenta';
  return (
    <div ref={box} className="relative">
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={`Tu cuenta, ${name}`}
        onClick={() => setOpen((o) => !o)}
        className={iconBtn}
      >
        <span className="flex size-[34px] items-center justify-center rounded-full bg-pumpkin-soft text-[13px] font-extrabold text-night shadow-[0_0_0_2px_#fdfbf7]">
          {initials(customer)}
        </span>
      </button>
      {open ? (
        <div
          role="menu"
          aria-label="Tu cuenta"
          className="absolute right-[-20px] top-[calc(100%+12px)] z-30 flex w-[300px] flex-col gap-0.5 rounded-[22px] border-[1.5px] border-veil bg-white p-2.5 text-midnight shadow-[0_28px_50px_-24px_rgba(46,16,101,.6)]"
        >
          <span aria-hidden="true" className="absolute -top-2 right-[33px] size-3.5 rotate-45 border-l-[1.5px] border-t-[1.5px] border-veil bg-white" />
          <div className="mb-1 flex items-center gap-3 border-b border-dashed border-witch-light px-3 pb-3.5 pt-2">
            <span className="flex size-11 flex-none items-center justify-center rounded-full bg-pumpkin-soft text-[15px] font-extrabold text-night">
              {initials(customer)}
            </span>
            <span className="flex min-w-0 flex-col">
              <span className="font-serif text-base font-black">{name}</span>
              {customer.email ? <span className="truncate text-[13px] text-mist">{customer.email}</span> : null}
            </span>
          </div>
          {ACCOUNT_MENU.map((m) => (
            <Link
              key={m.to}
              role="menuitem"
              to={m.to}
              onClick={() => setOpen(false)}
              className="flex min-h-[46px] items-center gap-3 rounded-[14px] px-3 text-[15px] font-extrabold text-midnight no-underline hover:bg-spill hover:text-midnight"
            >
              <span className="flex text-drip">
                <Icon name={m.icon} size={19} />
              </span>
              {m.label}
            </Link>
          ))}
          <Form method="post" action="/account/logout" className="mt-1 border-t border-dashed border-witch-light">
            <button
              type="submit"
              role="menuitem"
              className="flex min-h-[46px] w-full cursor-pointer items-center gap-3 rounded-[14px] border-0 bg-transparent px-3 text-[15px] font-bold text-ash hover:bg-spill"
            >
              <Icon name="logout" size={19} />
              Salir
            </button>
          </Form>
        </div>
      ) : null}
    </div>
  );
}

function SavedLink() {
  const {saved} = useSaved();
  return (
    <Link to="/guardados" aria-label={`Tus guardados, ${saved.length} libros`} className={iconBtn}>
      <Icon name="heart" size={22} />
      {saved.length ? (
        <span className="absolute right-0.5 top-1 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-pumpkin-soft px-1 text-[11px] font-extrabold text-night">
          {saved.length}
        </span>
      ) : null}
    </Link>
  );
}

function CartBadge({count, small, className = ''}: {count: number; small?: boolean; className?: string}) {
  const {open} = useAside();
  const {publish, shop, cart, prevCart} = useAnalytics();
  return (
    <a
      href="/cart"
      aria-label={`Tu selección, ${count} libros`}
      onClick={(e) => {
        e.preventDefault();
        open('cart');
        publish('cart_viewed', {cart, prevCart, shop, url: window.location.href || ''} as CartViewPayload);
      }}
      className={`inline-flex items-center rounded-full bg-pumpkin-light font-extrabold text-midnight no-underline hover:bg-pumpkin-soft hover:text-midnight ${
        small ? 'min-h-10 gap-1.5 px-3' : 'min-h-11 gap-2 px-4'
      } ${className}`}
    >
      <Icon name="bag" size={small ? 18 : 20} />
      <span>{count}</span>
    </a>
  );
}

function CartToggle({cart, small, className}: {cart: Promise<CartApiQueryFragment | null>; small?: boolean; className?: string}) {
  return (
    <Suspense fallback={<CartBadge count={0} small={small} className={className} />}>
      <Await resolve={cart}>
        <CartBanner small={small} className={className} />
      </Await>
    </Suspense>
  );
}

function CartBanner({small, className}: {small?: boolean; className?: string}) {
  const originalCart = useAsyncValue() as CartApiQueryFragment | null;
  const cart = useOptimisticCart(originalCart);
  return <CartBadge count={cart?.totalQuantity ?? 0} small={small} className={className} />;
}
