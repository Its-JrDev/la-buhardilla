import {Form, Link, NavLink} from 'react-router';
import {Icon, type IconName} from '~/components/brand/Icons';
import {FlatCover} from '~/components/brand/Scenes';
import {Pill} from '~/components/ui';
import {coverOf, formatMoney} from '~/lib/book';
import {formatDate, isClubLine, orderPath, orderStatus, type OrderStage} from '~/lib/orders';

const NAV: Array<{to: string; icon: IconName; label: string; end?: boolean}> = [
  {to: '/account', icon: 'package', label: 'Pedidos', end: true},
  {to: '/account/profile', icon: 'user', label: 'Direcciones y datos'},
  {to: '/guardados', icon: 'heart', label: 'Tus guardados'},
  {to: '/account/club', icon: 'candle', label: 'Reservas del club'},
];

export function AccountNav({name, email, initials}: {name: string; email?: string | null; initials: string}) {
  return (
    <>
      <nav aria-label="Tu cuenta" className="hidden flex-col gap-1.5 rounded-3xl border-[1.5px] border-veil bg-white p-3.5 md:flex">
        <div className="mb-1.5 flex items-center gap-3 border-b border-dashed border-witch-light px-2.5 pb-4 pt-2">
          <span className="flex size-[52px] flex-none items-center justify-center rounded-full bg-pumpkin-soft text-lg font-extrabold text-night">{initials}</span>
          <span className="flex min-w-0 flex-col gap-0.5">
            <span className="font-serif text-lg font-black">{name}</span>
            {email ? <span className="truncate text-sm text-mist">{email}</span> : null}
          </span>
        </div>
        {NAV.map((n) => (
          <NavLink
            key={n.to}
            to={n.to}
            end={n.end}
            className={({isActive}) =>
              `flex min-h-12 items-center gap-3 rounded-2xl px-3.5 text-[15px] font-extrabold no-underline ${
                isActive ? 'bg-midnight text-pumpkin-light hover:text-pumpkin-light' : 'text-midnight hover:bg-spill hover:text-midnight'
              }`
            }
          >
            {({isActive}) => (
              <>
                <Icon name={n.icon} size={19} className={isActive ? 'text-pumpkin-light' : 'text-drip'} />
                {n.label}
              </>
            )}
          </NavLink>
        ))}
        <Form method="post" action="/account/logout" className="mt-1.5 border-t border-dashed border-witch-light">
          <button type="submit" className="flex min-h-12 w-full cursor-pointer items-center gap-3 rounded-2xl border-0 bg-transparent px-3.5 font-sans text-[15px] font-bold text-ash hover:bg-spill">
            <Icon name="logout" size={19} />
            Salir
          </button>
        </Form>
      </nav>
      <nav aria-label="Tu cuenta" className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 pb-1.5 md:hidden">
        {NAV.map((n) => (
          <NavLink
            key={n.to}
            to={n.to}
            end={n.end}
            className={({isActive}) =>
              `inline-flex min-h-[42px] flex-none items-center gap-2 rounded-full border-[1.5px] px-4 text-sm font-extrabold no-underline ${
                isActive ? 'border-midnight bg-midnight text-pumpkin-light' : 'border-witch-light bg-white text-midnight'
              }`
            }
          >
            <Icon name={n.icon} size={16} />
            {n.label}
          </NavLink>
        ))}
      </nav>
    </>
  );
}

type OrderRowData = {
  id: string;
  name?: string | null;
  number: number;
  processedAt: string;
  totalPrice: {amount: string; currencyCode: string};
  fulfillmentStatus?: string | null;
  financialStatus?: string | null;
  fulfillments: {nodes: Array<{status?: string | null; latestShipmentStatus?: string | null}>};
  lineItems: {nodes: Array<{title: string; quantity: number; productType?: string | null}>};
};

export function OrderRow({order}: {order: OrderRowData}) {
  const status = orderStatus(order);
  const books = order.lineItems.nodes.filter((l) => !isClubLine(l));
  const club = order.lineItems.nodes.find(isClubLine);
  const count = order.lineItems.nodes.reduce((n, l) => n + l.quantity, 0);
  return (
    <Link
      to={orderPath(order.id)}
      className="card-link box-border flex flex-wrap items-center gap-x-[18px] gap-y-3.5 rounded-[22px] border-[1.5px] border-veil bg-white px-[18px] py-4 text-midnight no-underline hover:text-midnight"
    >
      <span aria-hidden="true" className="flex flex-none pr-4">
        {books.slice(0, 3).map((b, i) => (
          <span key={i} className="-mr-4 w-[38px]">
            <FlatCover book={coverOf({title: b.title})} size="xs" />
          </span>
        ))}
        {!books.length && club ? (
          <span className="flex aspect-[2/3] w-[38px] items-center justify-center rounded bg-night text-pumpkin-soft">
            <Icon name="candle" size={18} />
          </span>
        ) : null}
      </span>
      <span className="flex min-w-0 flex-[1_1_180px] flex-col gap-0.5">
        <span className="font-serif text-[17px] font-bold">Pedido {order.name ?? `#${order.number}`}</span>
        <span className="text-sm text-mist">
          {formatDate(order.processedAt)} · {count} {count === 1 ? 'artículo' : 'artículos'}
        </span>
      </span>
      <span className="ml-auto flex items-center gap-3.5">
        <Pill tone={status.tone}>{status.label}</Pill>
        <span className="text-[17px] font-extrabold text-pumpkin-dark">{formatMoney(order.totalPrice)}</span>
        <Icon name="chev" size={20} className="text-witch" />
      </span>
    </Link>
  );
}

const STEPS = ['Sellado', 'Preparando', 'En camino', 'Entregado'];

export function OrderTimeline({stage, details = [], compact = false}: {stage: OrderStage; details?: Array<string | null | undefined>; compact?: boolean}) {
  return (
    <ol className="m-0 grid list-none grid-cols-4 p-0">
      {STEPS.map((label, i) => {
        const n = i + 1;
        const done = n < stage;
        const current = n === stage;
        return (
          <li key={label} className={`relative flex flex-col items-center gap-1.5 text-center ${compact ? 'px-px' : 'px-1.5'}`}>
            {n < STEPS.length ? (
              <span aria-hidden="true" className={`absolute top-[13px] h-0.5 rounded ${n < stage ? 'bg-drip' : 'bg-veil'}`} style={{left: 'calc(50% + 19px)', right: 'calc(-50% + 19px)'}} />
            ) : null}
            {done ? (
              <span className="flex size-7 items-center justify-center rounded-full bg-drip text-white">
                <Icon name="check" size={14} strokeWidth={3} />
              </span>
            ) : current ? (
              <span className="box-border flex size-7 items-center justify-center rounded-full border-2 border-drip bg-white">
                <span className="size-2.5 rounded-full bg-pumpkin-light" />
              </span>
            ) : (
              <span className="box-border size-7 rounded-full border-[1.5px] border-witch-light bg-white" />
            )}
            <span className={`mt-1 font-extrabold ${compact ? 'text-[13.5px]' : 'text-[15px]'} ${n <= stage ? 'text-midnight' : 'text-mist'}`}>{label}</span>
            {details[i] ? <span className={`leading-snug text-mist ${compact ? 'text-xs' : 'text-[13px]'}`}>{details[i]}</span> : null}
            <span className="sr-only">{done ? 'completado' : current ? 'paso actual' : 'pendiente'}</span>
          </li>
        );
      })}
    </ol>
  );
}
