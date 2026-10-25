import {Form, useActionData, useLoaderData, useNavigation} from 'react-router';
import type {Route} from './+types/account.club';
import {NightScene} from '~/components/brand/Scenes';
import {SessionCard} from '~/components/club';
import {Alert, Button, buttonClass, DefinitionCard, Eyebrow, OptionPills, PageHead} from '~/components/ui';
import {CUSTOMER_ORDERS_QUERY} from '~/graphql/customer-account/CustomerOrdersQuery';
import {CLUB_SESSIONS, SEAT_OPTIONS} from '~/lib/club';
import {deliverForm} from '~/lib/forms';
import {isClubLine} from '~/lib/orders';

export const meta: Route.MetaFunction = () => [{title: 'Reservas del club | La Buhardilla'}];

export async function loader({context}: Route.LoaderArgs) {
  const {data} = await context.customerAccount.query(CUSTOMER_ORDERS_QUERY, {
    variables: {first: 20, language: context.customerAccount.i18n.language},
  });
  const reservations = (data?.customer?.orders.nodes ?? []).flatMap((o) => {
    const line = o.lineItems.nodes.find(isClubLine);
    if (!line || o.cancelledAt) return [];
    const session = CLUB_SESSIONS.find((s) => s.option && line.variantTitle?.includes(s.option));
    if (!session) return [];
    const seats = SEAT_OPTIONS.find((s) => line.variantTitle?.includes(s.value))?.value ?? '1 lugar';
    return [{order: o.name, session, seats}];
  });
  return {reservations};
}

export async function action({request, context}: Route.ActionArgs) {
  const f = await request.formData();
  const intent = String(f.get('intent'));
  const order = String(f.get('pedido') ?? '');
  const payload = {pedido: order, sesion: String(f.get('sesion') ?? ''), lugares: String(f.get('lugares') ?? '')};
  const sent = await deliverForm(context.env, intent === 'cancelar' ? 'club-cancelacion' : 'club-cambio', payload);
  if (!sent.ok) return {ok: false as const, intent, error: 'No pudimos enviar tu solicitud. Escríbenos y lo resolvemos.'};
  return {ok: true as const, intent, ...payload};
}

export default function AccountClub() {
  const {reservations} = useLoaderData<typeof loader>();
  const result = useActionData<typeof action>();
  const nav = useNavigation();
  const r = reservations[0];

  if (result?.ok && result.intent === 'cancelar' && r) {
    return (
      <div className="flex flex-col gap-7">
        <div className="mx-auto w-full max-w-[300px] md:max-w-[340px]">
          <NightScene subject="book" book={{title: r.session.book, author: r.session.author, coverBg: r.session.cover!.bg, coverInk: r.session.cover!.ink}} />
        </div>
        <section className="flex flex-col items-center gap-3.5 text-center">
          <Eyebrow>Cancelación solicitada</Eyebrow>
          <h1 className="m-0 font-serif text-[34px] font-black leading-[1.1] md:text-[46px]">Apagamos tu vela.</h1>
          <p className="m-0 max-w-[560px] text-base leading-relaxed text-slate md:text-lg">Liberamos tus lugares y te confirmamos por correo.</p>
        </section>
        <DefinitionCard title="Reserva" rows={[['Sesión', `${r.session.dateLong} · 23:00 h`], ['Libro', r.session.book], ['Pedido', r.order]]} />
        <div className="flex flex-wrap justify-center gap-3">
          <Button to="/club/reservar" className="max-sm:w-full">
            Reservar otra sesión
          </Button>
          <Button to="/account" variant="outline" className="max-sm:w-full">
            Volver a tu cuenta
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <PageHead
        crumbs={[{label: 'Tu cuenta', to: '/account'}, {label: 'Reservas del club'}]}
        eyebrow="Club de medianoche"
        title="Tu reserva"
        lead={r ? 'Cambia la sesión o cuántos suben contigo. Si cambias de libro, no hace falta comprarlo de nuevo.' : 'Aún no apartas lugar para ninguna sesión.'}
      />
      {result && !result.ok ? <Alert title="No se envió">{result.error}</Alert> : null}
      {result?.ok && result.intent === 'cambiar' ? <Alert tone="info" title="Recibimos tu cambio">Te confirmamos por correo la nueva sesión.</Alert> : null}
      {r ? (
        <>
          <SessionCard session={r.session} tag="Tu lugar está apartado" seats={r.seats} />
          <Form method="post" className="card flex flex-col gap-4 p-5 md:p-[26px]">
            <h2 className="m-0 font-serif text-[22px] font-black">Cambiar tu reserva</h2>
            <input type="hidden" name="pedido" value={r.order} />
            <OptionPills
              legend="Sesión"
              name="sesion"
              value={r.session.option!}
              options={CLUB_SESSIONS.filter((s) => s.option).map((s) => ({value: s.option!, label: `${s.weekday.slice(0, 3)} ${s.day} ${s.month.toLowerCase()}`, sub: s.book}))}
            />
            <OptionPills legend="Lugares" name="lugares" value={r.seats} options={SEAT_OPTIONS} />
            <button type="submit" name="intent" value="cambiar" className={`${buttonClass({size: 'sm'})} self-start max-sm:w-full`} disabled={nav.state !== 'idle'}>
              Guardar cambios
            </button>
          </Form>
          <Form method="post" className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3.5 rounded-[22px] border-[1.5px] border-veil bg-white p-5 md:p-6">
            <input type="hidden" name="pedido" value={r.order} />
            <span className="flex flex-[1_1_280px] flex-col gap-1">
              <span className="font-serif text-[19px] font-black">¿Ya no puedes subir?</span>
              <span className="text-[15px] leading-relaxed text-ash">Libera tus lugares para alguien más. Puedes cancelar hasta 24 h antes de la sesión.</span>
            </span>
            <button type="submit" name="intent" value="cancelar" className={`${buttonClass({variant: 'outline', size: 'sm'})} max-sm:w-full`} disabled={nav.state !== 'idle'}>
              Cancelar mi reserva
            </button>
          </Form>
        </>
      ) : (
        <div className="flex flex-col items-start gap-4">
          <SessionCard session={CLUB_SESSIONS[0]} />
          <Button to="/club/reservar">Reservar mi lugar</Button>
        </div>
      )}
    </>
  );
}
