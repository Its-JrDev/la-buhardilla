import {Link, redirect, useLoaderData} from 'react-router';
import type {Route} from './+types/account.orders.$id';
import {OrderTimeline} from '~/components/account';
import {Icon, type IconName} from '~/components/brand/Icons';
import {FlatCover} from '~/components/brand/Scenes';
import {buttonClass, Crumbs, Pill} from '~/components/ui';
import {CUSTOMER_ORDER_QUERY} from '~/graphql/customer-account/CustomerOrderQuery';
import {coverOf, formatMoney} from '~/lib/book';
import {formatDate, isClubLine, orderStage, orderStatus} from '~/lib/orders';

export const meta: Route.MetaFunction = ({data}) => [{title: `Pedido ${data?.order.name ?? ''} | La Buhardilla`}];

export async function loader({params, context}: Route.LoaderArgs) {
  if (!params.id) return redirect('/account/orders');
  const orderId = atob(params.id);
  const {data, errors} = await context.customerAccount.query(CUSTOMER_ORDER_QUERY, {
    variables: {orderId, language: context.customerAccount.i18n.language},
  });
  if (errors?.length || !data?.order) throw new Response('Pedido no encontrado', {status: 404});
  return {order: data.order, param: params.id};
}

function InfoCard({icon, title, children}: {icon: IconName; title: string; children: React.ReactNode}) {
  return (
    <section className="card-line flex min-w-0 flex-[1_1_240px] flex-col gap-2 p-5 md:p-[22px]">
      <span className="flex items-center gap-2.5 font-serif text-[17px] font-black">
        <Icon name={icon} size={19} className="text-drip" />
        {title}
      </span>
      <span className="text-[15px] leading-relaxed text-slate">{children}</span>
    </section>
  );
}

export default function OrderPage() {
  const {order, param} = useLoaderData<typeof loader>();
  const stage = orderStage(order);
  const status = orderStatus(order);
  const f = order.fulfillments.nodes[0];
  const tracking = f?.trackingInformation?.[0];
  const delivered = stage === 4 || order.fulfillmentStatus === 'FULFILLED';
  const count = order.lineItems.nodes.reduce((n, l) => n + l.quantity, 0);
  const actions: Array<[IconName, string, string, boolean]> = [
    ['return', delivered ? 'Iniciar una devolución' : 'Iniciar una devolución (al recibirlo)', `/account/orders/${param}/devolucion`, delivered],
    ['mail', 'Escríbenos sobre este pedido', `/contacto?motivo=pedido&pedido=${encodeURIComponent(order.name)}`, true],
    ['file', 'Ver estado y comprobante', order.statusPageUrl, true],
  ];
  return (
    <>
      <div className="flex flex-col gap-2.5">
        <Crumbs items={[{label: 'Tu cuenta', to: '/account'}, {label: `Pedido ${order.name}`}]} />
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2.5">
          <h1 className="m-0 font-serif text-[32px] font-black leading-[1.1] md:text-[46px]">Pedido {order.name}</h1>
          <Pill tone={status.tone}>{status.label}</Pill>
        </div>
        <p className="m-0 text-base text-ash md:text-[17px]">
          Sellado el {formatDate(order.processedAt, {day: 'numeric', month: 'long', year: 'numeric'})} · {count} {count === 1 ? 'artículo' : 'artículos'}
        </p>
      </div>
      <div className="flex flex-wrap items-start gap-7">
        <div className="flex min-w-0 flex-[999_1_520px] flex-col gap-5">
          <section className="card flex flex-col gap-4 p-5 md:p-[26px]">
            <h2 className="m-0 font-serif text-[22px] font-black">Seguimiento</h2>
            <OrderTimeline
              stage={stage}
              details={[formatDate(order.processedAt, {day: 'numeric', month: 'short'}), null, f?.createdAt ? `Salió el ${formatDate(f.createdAt, {day: 'numeric', month: 'short'})}` : null, f?.estimatedDeliveryAt ? `Llega ${formatDate(f.estimatedDeliveryAt, {day: 'numeric', month: 'short'})}` : null]}
            />
            {tracking ? (
              <div className="flex flex-wrap items-center justify-between gap-x-5 gap-y-3 rounded-[18px] bg-spill px-4 py-3.5">
                <span className="flex items-center gap-2.5 text-[15px] text-slate">
                  <Icon name="truck" size={20} className="text-drip" />
                  <span>
                    <strong className="text-midnight">{tracking.company ?? 'Paquetería'}</strong>
                    {tracking.number ? ` · Guía ${tracking.number}` : ''}
                  </span>
                </span>
                {tracking.url ? (
                  <a href={tracking.url} target="_blank" rel="noreferrer" className={`${buttonClass({variant: 'outline', size: 'sm'})} max-sm:w-full`}>
                    Rastrear paquete
                  </a>
                ) : null}
              </div>
            ) : null}
          </section>
          <div className="flex flex-wrap gap-3.5">
            <InfoCard icon="pin" title="Envío a">
              {order.shippingAddress?.formatted?.length ? order.shippingAddress.formatted.map((l) => <span key={l} className="block">{l}</span>) : 'Sin envío: se recoge en la buhardilla.'}
              {order.shippingLine?.title ? <span className="block">{order.shippingLine.title}</span> : null}
            </InfoCard>
            <InfoCard icon="card" title="Pago">
              {order.financialStatus === 'PAID' ? 'Pagado' : order.financialStatus === 'REFUNDED' ? 'Reembolsado' : 'Pendiente'} · {formatMoney(order.totalPrice)}
            </InfoCard>
          </div>
          <section className="card-line flex flex-col px-5 pb-2 pt-5 md:px-[22px] md:pt-[22px]">
            <span className="pb-2.5 font-serif text-[17px] font-black">¿Algo no está bien?</span>
            {actions.map(([icon, label, to, enabled]) =>
              enabled ? (
                to.startsWith('http') ? (
                  <a key={label} href={to} className="dashed-top flex min-h-[52px] items-center gap-3 text-[15px] font-bold text-midnight no-underline hover:text-witch">
                    <Icon name={icon} size={19} className="text-drip" />
                    <span className="flex-1">{label}</span>
                    <Icon name="chev" size={18} className="text-witch" />
                  </a>
                ) : (
                  <Link key={label} to={to} className="dashed-top flex min-h-[52px] items-center gap-3 text-[15px] font-bold text-midnight no-underline hover:text-witch">
                    <Icon name={icon} size={19} className="text-drip" />
                    <span className="flex-1">{label}</span>
                    <Icon name="chev" size={18} className="text-witch" />
                  </Link>
                )
              ) : (
                <span key={label} className="dashed-top flex min-h-[52px] items-center gap-3 text-[15px] font-bold text-mist">
                  <Icon name={icon} size={19} />
                  {label}
                </span>
              ),
            )}
          </section>
        </div>
        <aside aria-label="Resumen del pedido" className="card box-border flex min-w-0 flex-[1_1_340px] flex-col gap-5 p-[26px] md:sticky md:top-6">
          <h2 className="m-0 font-serif text-[22px] font-black">Tu pedido</h2>
          <ul className="m-0 flex list-none flex-col gap-[18px] p-0">
            {order.lineItems.nodes.map((l) => (
              <li key={l.id} className="flex items-center gap-4">
                <span className="relative w-[54px] flex-none">
                  {isClubLine(l) ? (
                    <span className="flex aspect-[2/3] items-center justify-center rounded bg-night text-pumpkin-soft">
                      <Icon name="candle" size={22} />
                    </span>
                  ) : (
                    <FlatCover book={coverOf({title: l.title})} size="xs" />
                  )}
                  <span className="absolute -right-2 -top-2 flex h-[22px] min-w-[22px] items-center justify-center rounded-full bg-midnight px-1.5 text-xs font-extrabold text-pumpkin-soft">{l.quantity}</span>
                </span>
                <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                  <span className="font-serif text-[15px] font-bold leading-snug">{l.title}</span>
                  {l.variantTitle ? <span className="text-[13px] text-mist">{l.variantTitle}</span> : null}
                </span>
                <span className="text-[15px] font-extrabold">{formatMoney(l.totalPrice)}</span>
              </li>
            ))}
          </ul>
          <dl className="dashed-top m-0 flex flex-col gap-2.5 pt-4 text-[15px]">
            {(
              [
                ['Subtotal', order.subtotal],
                ['Envío', order.totalShipping],
                ['Impuestos', order.totalTax],
              ] as const
            ).map(([k, v]) =>
              v ? (
                <div key={k} className="flex justify-between gap-3">
                  <dt className="text-ash">{k}</dt>
                  <dd className="m-0 font-bold">{formatMoney(v)}</dd>
                </div>
              ) : null,
            )}
            <div className="dashed-top flex items-baseline justify-between gap-3 pt-3">
              <dt className="text-lg font-extrabold">Total</dt>
              <dd className="m-0 text-2xl font-extrabold text-pumpkin-dark">{formatMoney(order.totalPrice)}</dd>
            </div>
          </dl>
        </aside>
      </div>
    </>
  );
}
