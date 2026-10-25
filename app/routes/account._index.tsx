import {Link, useLoaderData, useOutletContext} from 'react-router';
import type {Route} from './+types/account._index';
import type {CustomerFragment} from 'customer-accountapi.generated';
import {OrderRow, OrderTimeline} from '~/components/account';
import {Icon} from '~/components/brand/Icons';
import {SessionCard} from '~/components/club';
import {Button, buttonClass, EmptyState, Eyebrow, Pill, SectionHead} from '~/components/ui';
import {CUSTOMER_ORDERS_QUERY} from '~/graphql/customer-account/CustomerOrdersQuery';
import {CLUB_SESSIONS} from '~/lib/club';
import {formatDate, isClubLine, orderPath, orderStage, orderStatus} from '~/lib/orders';

export const meta: Route.MetaFunction = () => [{title: 'Tu cuenta | La Buhardilla'}];

export async function loader({context}: Route.LoaderArgs) {
  const {data, errors} = await context.customerAccount.query(CUSTOMER_ORDERS_QUERY, {
    variables: {first: 10, language: context.customerAccount.i18n.language},
  });
  if (errors?.length || !data?.customer) throw new Error('Customer orders not found');
  return {orders: data.customer.orders.nodes};
}

export default function AccountHome() {
  const {customer} = useOutletContext<{customer: CustomerFragment}>();
  const {orders} = useLoaderData<typeof loader>();
  const live = orders.find((o) => !o.cancelledAt && orderStage(o) < 4 && o.lineItems.nodes.some((l) => !isClubLine(l)));
  const clubOrder = orders.find((o) => !o.cancelledAt && o.lineItems.nodes.some(isClubLine));
  const clubLine = clubOrder?.lineItems.nodes.find(isClubLine);
  const session = CLUB_SESSIONS.find((s) => s.option && clubLine?.variantTitle?.includes(s.option));

  return (
    <>
      <div className="flex flex-col gap-2.5">
        <Eyebrow>Tu cuenta</Eyebrow>
        <h1 className="m-0 font-serif text-[32px] font-black leading-[1.1] md:text-[46px]">Hola{customer.firstName ? `, ${customer.firstName}` : ''}.</h1>
        <p className="m-0 max-w-[600px] text-base leading-relaxed text-slate md:text-lg">Aquí sigues tus pedidos, tus direcciones y tu lugar en el club.</p>
      </div>

      {live ? (
        <section className="flex flex-col gap-4">
          <SectionHead eyebrow={orderStatus(live).label} title="Tu pedido más reciente" size="sm" />
          <div className="card flex flex-col gap-4 p-5 md:p-[26px]">
            <div className="flex flex-wrap items-center gap-x-3.5 gap-y-2">
              <span className="font-serif text-xl font-black">Pedido {live.name}</span>
              <Pill tone="hot">{orderStatus(live).label}</Pill>
              <span className="basis-full text-[15px] text-ash">
                Sellado el {formatDate(live.processedAt, {day: 'numeric', month: 'long'})}
                {live.fulfillments.nodes[0]?.estimatedDeliveryAt ? `. Llega alrededor del ${formatDate(live.fulfillments.nodes[0].estimatedDeliveryAt, {day: 'numeric', month: 'long'})}.` : '.'}
              </span>
            </div>
            <OrderTimeline stage={orderStage(live)} compact />
            <div className="dashed-top flex flex-wrap items-center gap-x-5 gap-y-1 pt-4">
              <Link to={orderPath(live.id)} className={`${buttonClass({size: 'sm'})} max-sm:w-full`}>
                Ver pedido <Icon name="arrow" size={18} />
              </Link>
            </div>
          </div>
        </section>
      ) : null}

      <section className="flex flex-col gap-4">
        <SectionHead eyebrow="Tus pedidos" title="Lo que ha bajado de la buhardilla" size="sm" />
        {orders.length ? (
          <div className="flex flex-col gap-2.5">
            {orders.slice(0, 5).map((o) => (
              <OrderRow key={o.id} order={o} />
            ))}
            {orders.length > 5 ? (
              <Link to="/account/orders" className="self-start font-extrabold no-underline">
                Ver todos tus pedidos →
              </Link>
            ) : null}
          </div>
        ) : (
          <EmptyState title="Aún no bajas nada de la buhardilla." message="Cuando selles tu primera transacción, aquí podrás seguirla paso a paso." />
        )}
      </section>

      <section className="flex flex-col gap-3">
        <SectionHead eyebrow="Club de medianoche" title={session ? 'Tu próxima sesión' : 'Sube al club'} size="sm" />
        {session ? (
          <>
            <SessionCard session={session} tag="Tu lugar está apartado" seats={clubLine?.variantTitle?.split(' / ').pop() ?? undefined} />
            <Link to="/account/club" className="self-start font-extrabold no-underline">
              Cambiar o cancelar →
            </Link>
          </>
        ) : (
          <div className="flex flex-col items-start gap-3">
            <p className="m-0 text-base text-ash">El último viernes de cada mes leemos en voz baja hasta la última vela.</p>
            <Button to="/club/reservar" size="sm">
              Reservar mi lugar
            </Button>
          </div>
        )}
      </section>
    </>
  );
}
