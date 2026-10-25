import {useLoaderData} from 'react-router';
import {getPaginationVariables, Pagination} from '@shopify/hydrogen';
import type {Route} from './+types/account.orders._index';
import {OrderRow} from '~/components/account';
import {EmptyState, PageHead} from '~/components/ui';
import {CUSTOMER_ORDERS_QUERY} from '~/graphql/customer-account/CustomerOrdersQuery';

export const meta: Route.MetaFunction = () => [{title: 'Tus pedidos | La Buhardilla'}];

export async function loader({request, context}: Route.LoaderArgs) {
  const {data, errors} = await context.customerAccount.query(CUSTOMER_ORDERS_QUERY, {
    variables: {...getPaginationVariables(request, {pageBy: 10}), language: context.customerAccount.i18n.language},
  });
  if (errors?.length || !data?.customer) throw new Error('Customer orders not found');
  return {orders: data.customer.orders};
}

export default function Orders() {
  const {orders} = useLoaderData<typeof loader>();
  return (
    <>
      <PageHead crumbs={[{label: 'Tu cuenta', to: '/account'}, {label: 'Pedidos'}]} eyebrow="Tu cuenta" title="Tus pedidos" />
      {orders.nodes.length ? (
        <Pagination connection={orders}>
          {({nodes, NextLink, PreviousLink, isLoading}) => (
            <div className="flex flex-col gap-2.5">
              <PreviousLink className="self-center font-extrabold no-underline">{isLoading ? 'Cargando…' : '↑ Más recientes'}</PreviousLink>
              {nodes.map((o) => (
                <OrderRow key={o.id} order={o} />
              ))}
              <NextLink className="self-center font-extrabold no-underline">{isLoading ? 'Cargando…' : 'Ver pedidos anteriores ↓'}</NextLink>
            </div>
          )}
        </Pagination>
      ) : (
        <EmptyState title="Aún no bajas nada de la buhardilla." message="Cuando selles tu primera transacción, aquí podrás seguirla paso a paso." />
      )}
    </>
  );
}
