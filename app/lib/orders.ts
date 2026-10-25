/** Traducciones y estados de pedido para la cuenta. */

type Fulfillment = {status?: string | null; latestShipmentStatus?: string | null; estimatedDeliveryAt?: string | null};
type OrderLike = {
  fulfillmentStatus?: string | null;
  financialStatus?: string | null;
  cancelledAt?: string | null;
  fulfillments: {nodes: Fulfillment[]};
};

export type OrderStage = 1 | 2 | 3 | 4;

/** Sellado → Preparando → En camino → Entregado. */
export function orderStage(o: OrderLike): OrderStage {
  const f = o.fulfillments.nodes[0];
  const ship = f?.latestShipmentStatus;
  if (ship === 'DELIVERED') return 4;
  if (ship && ship !== 'LABEL_PRINTED' && ship !== 'LABEL_PURCHASED' && ship !== 'CONFIRMED') return 3;
  if (o.fulfillmentStatus === 'FULFILLED' || f?.status === 'SUCCESS') return 3;
  if (o.fulfillmentStatus === 'IN_PROGRESS' || o.fulfillmentStatus === 'PARTIALLY_FULFILLED' || f) return 2;
  return 1;
}

export function orderStatus(o: OrderLike): {label: string; tone: 'hot' | 'soft' | 'muted'} {
  if (o.cancelledAt) return {label: 'Cancelado', tone: 'muted'};
  if (o.financialStatus === 'REFUNDED') return {label: 'Reembolsado', tone: 'muted'};
  const stage = orderStage(o);
  if (stage === 4) return {label: 'Entregado', tone: 'soft'};
  if (stage === 3) return {label: 'En camino', tone: 'hot'};
  if (stage === 2) return {label: 'Preparando', tone: 'hot'};
  return {label: 'Sellado', tone: 'hot'};
}

export function formatDate(iso?: string | null, opts: Intl.DateTimeFormatOptions = {day: 'numeric', month: 'short', year: 'numeric'}) {
  if (!iso) return '';
  return new Intl.DateTimeFormat('es-MX', opts).format(new Date(iso));
}

export const isClubLine = (l: {productType?: string | null; title: string}) => l.productType === 'Club' || l.title.startsWith('Club de medianoche');

export const orderPath = (id: string) => `/account/orders/${btoa(id)}`;
