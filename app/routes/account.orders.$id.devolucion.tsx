import {Form, redirect, useActionData, useLoaderData, useNavigation} from 'react-router';
import type {Route} from './+types/account.orders.$id.devolucion';
import {Icon} from '~/components/brand/Icons';
import {FlatCover, NightScene} from '~/components/brand/Scenes';
import {Alert, Button, buttonClass, DefinitionCard, Eyebrow, OptionPills, PageHead, TextArea} from '~/components/ui';
import {CUSTOMER_ORDER_QUERY} from '~/graphql/customer-account/CustomerOrderQuery';
import {CUSTOMER_REQUEST_RETURN} from '~/graphql/customer-account/CustomerReturnMutation';
import {coverOf, formatMoney} from '~/lib/book';
import {isClubLine} from '~/lib/orders';

export const meta: Route.MetaFunction = () => [{title: 'Iniciar una devolución | La Buhardilla'}];

const REASONS = [
  {value: 'DEFECTIVE', label: 'Llegó dañado'},
  {value: 'NOT_AS_DESCRIBED', label: 'No coincide con la ficha'},
  {value: 'WRONG_ITEM', label: 'No es el que pedí'},
  {value: 'UNWANTED', label: 'Cambié de opinión'},
] as const;
const RESOLUTIONS = [
  {value: 'Otro ejemplar', label: 'Otro ejemplar'},
  {value: 'Reembolso', label: 'Reembolso'},
];

async function loadOrder(context: Route.LoaderArgs['context'], id: string) {
  const {data, errors} = await context.customerAccount.query(CUSTOMER_ORDER_QUERY, {
    variables: {orderId: atob(id), language: context.customerAccount.i18n.language},
  });
  if (errors?.length || !data?.order) throw new Response('Pedido no encontrado', {status: 404});
  return data.order;
}

export async function loader({params, context}: Route.LoaderArgs) {
  if (!params.id) throw redirect('/account');
  const order = await loadOrder(context, params.id);
  return {order};
}

export async function action({params, request, context}: Route.ActionArgs) {
  const order = await loadOrder(context, params.id!);
  const f = await request.formData();
  const ids = f.getAll('linea').map(String);
  const reason = String(f.get('motivo') ?? 'DEFECTIVE');
  const note = [String(f.get('prefiere') ?? ''), String(f.get('nota') ?? '').trim()].filter(Boolean).join(' · ');
  const lines = order.lineItems.nodes.filter((l) => ids.includes(l.id) && !isClubLine(l));
  if (!lines.length) return {ok: false as const, error: 'Elige al menos un libro para devolver.'};
  const {data, errors} = await context.customerAccount.mutate(CUSTOMER_REQUEST_RETURN, {
    variables: {
      orderId: order.id,
      requestedLineItems: lines.map((l) => ({
        lineItemId: l.id,
        quantity: l.quantity,
        returnReason: REASONS.some((r) => r.value === reason) ? (reason as (typeof REASONS)[number]['value']) : 'OTHER',
        customerNote: note.slice(0, 300),
      })),
    },
  });
  const userError = data?.orderRequestReturn?.userErrors?.[0]?.message ?? errors?.[0]?.message;
  if (userError || !data?.orderRequestReturn?.return) {
    return {ok: false as const, error: userError ?? 'No pudimos registrar tu solicitud. Escríbenos y lo resolvemos.'};
  }
  return {
    ok: true as const,
    name: data.orderRequestReturn.return.name,
    books: lines.map((l) => l.title).join(', '),
    reason: REASONS.find((r) => r.value === reason)?.label ?? 'Otro',
    prefiere: String(f.get('prefiere') ?? ''),
  };
}

export default function Devolucion() {
  const {order} = useLoaderData<typeof loader>();
  const result = useActionData<typeof action>();
  const nav = useNavigation();
  const books = order.lineItems.nodes.filter((l) => !isClubLine(l));

  if (result?.ok) {
    return (
      <div className="flex flex-col gap-7">
        <div className="mx-auto w-full max-w-[300px] md:max-w-[340px]">
          <NightScene subject="envelope" />
        </div>
        <section className="flex flex-col items-center gap-3.5 text-center">
          <Eyebrow>Solicitud enviada</Eyebrow>
          <h1 className="m-0 font-serif text-[34px] font-black leading-[1.1] md:text-[46px]">Recibimos tu solicitud.</h1>
          <p className="m-0 max-w-[560px] text-base leading-relaxed text-slate md:text-lg">
            La revisamos y te escribimos con los siguientes pasos y la guía de devolución. Si puedes, ten a mano fotos del libro y del paquete.
          </p>
        </section>
        <DefinitionCard
          title="Tu devolución"
          rows={[
            ['Folio', result.name],
            ['Pedido', order.name],
            ['Libros', result.books],
            ['Motivo', result.reason],
            ...(result.prefiere ? ([['Prefieres', result.prefiere]] as Array<[string, string]>) : []),
          ]}
        />
        <div className="flex flex-wrap justify-center gap-3">
          <Button to="/account" variant="outline" className="max-sm:w-full">
            Volver a tu cuenta
          </Button>
          <Button to="/collections/all" className="max-sm:w-full">
            Seguir explorando
          </Button>
        </div>
      </div>
    );
  }

  const step = (n: number, title: string, body: React.ReactNode) => (
    <section className="card flex flex-col gap-4 p-5 md:p-[26px]">
      <div className="flex items-center gap-3">
        <span className="flex size-8 flex-none items-center justify-center rounded-full bg-midnight text-[15px] font-extrabold text-pumpkin-light">{n}</span>
        <h2 className="m-0 font-serif text-xl font-black md:text-[22px]">{title}</h2>
      </div>
      {body}
    </section>
  );

  return (
    <>
      <PageHead
        crumbs={[{label: 'Tu cuenta', to: '/account'}, {label: `Pedido ${order.name}`}, {label: 'Devolución'}]}
        eyebrow="Tu cuenta"
        title="Inicia una devolución"
        lead="Si un libro llegó dañado o no coincide con su ficha, lo resolvemos."
      />
      <Form method="post" className="flex flex-col gap-5">
        {result && !result.ok ? <Alert title="No se envió tu solicitud">{result.error}</Alert> : null}
        {step(
          1,
          '¿Qué libros?',
          <div className="flex flex-col gap-2.5">
            {books.map((l) => (
              <label key={l.id} className="flex cursor-pointer items-center gap-3.5 rounded-[20px] border-[1.5px] border-veil bg-ghost px-4 py-3 has-[:checked]:border-witch">
                <input type="checkbox" name="linea" value={l.id} defaultChecked={books.length === 1} className="size-[18px] accent-witch" />
                <span className="w-10 flex-none" aria-hidden="true">
                  <FlatCover book={coverOf({title: l.title})} size="xs" />
                </span>
                <span className="flex flex-1 flex-col gap-0.5">
                  <span className="font-serif text-base font-bold">{l.title}</span>
                  <span className="text-sm text-mist">{[l.variantTitle, `${l.quantity} ${l.quantity === 1 ? 'ejemplar' : 'ejemplares'}`].filter(Boolean).join(' · ')}</span>
                </span>
                <span className="font-extrabold">{formatMoney(l.totalPrice)}</span>
              </label>
            ))}
          </div>,
        )}
        {step(
          2,
          '¿Qué pasó?',
          <>
            <OptionPills legend="Motivo" name="motivo" value="DEFECTIVE" options={REASONS.map((r) => ({...r}))} />
            <TextArea label="Cuéntanos un poco más" name="nota" rows={4} placeholder="Por ejemplo: la esquina de la portada llegó doblada." maxLength={240} />
            <p className="m-0 flex items-center gap-2 text-sm text-ash">
              <Icon name="camera" size={18} className="text-drip" />
              Si nos pides fotos, te las solicitamos por correo.
            </p>
          </>,
        )}
        {step(3, '¿Cómo lo resolvemos?', <OptionPills legend="Prefieres" name="prefiere" value="Otro ejemplar" options={RESOLUTIONS} />)}
        <button type="submit" className={buttonClass({full: true})} disabled={nav.state !== 'idle'}>
          {nav.state !== 'idle' ? 'Enviando…' : 'Enviar solicitud'} <Icon name="arrow" size={18} />
        </button>
      </Form>
    </>
  );
}
