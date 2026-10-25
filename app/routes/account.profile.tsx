import type {CustomerFragment} from 'customer-accountapi.generated';
import type {CustomerUpdateInput} from '@shopify/hydrogen/customer-account-api-types';
import {Form, Link, useActionData, useNavigation, useOutletContext} from 'react-router';
import type {Route} from './+types/account.profile';
import {Icon} from '~/components/brand/Icons';
import {Alert, buttonClass, Field, PageHead, Pill} from '~/components/ui';
import {CUSTOMER_UPDATE_MUTATION} from '~/graphql/customer-account/CustomerUpdateMutation';
import {CUSTOMER_MARKETING_SUBSCRIBE, CUSTOMER_MARKETING_UNSUBSCRIBE} from '~/graphql/customer-account/CustomerMarketingMutation';

export const meta: Route.MetaFunction = () => [{title: 'Direcciones y datos | La Buhardilla'}];

export async function loader({context}: Route.LoaderArgs) {
  await context.customerAccount.handleAuthStatus();
  return {};
}

export async function action({request, context}: Route.ActionArgs) {
  const {customerAccount} = context;
  const form = await request.formData();
  const intent = form.get('intent');

  if (intent === 'carta') {
    const on = form.get('carta') === 'on';
    let err: string | undefined;
    if (on) {
      const {data, errors} = await customerAccount.mutate(CUSTOMER_MARKETING_SUBSCRIBE);
      err = errors?.[0]?.message ?? data?.customerEmailMarketingSubscribe?.userErrors?.[0]?.message;
    } else {
      const {data, errors} = await customerAccount.mutate(CUSTOMER_MARKETING_UNSUBSCRIBE);
      err = errors?.[0]?.message ?? data?.customerEmailMarketingUnsubscribe?.userErrors?.[0]?.message;
    }
    return {intent: 'carta', error: err ?? null, ok: !err};
  }

  const customer: CustomerUpdateInput = {};
  for (const key of ['firstName', 'lastName'] as const) {
    const v = form.get(key);
    if (typeof v === 'string' && v.trim()) customer[key] = v.trim();
  }
  const {data, errors} = await customerAccount.mutate(CUSTOMER_UPDATE_MUTATION, {
    variables: {customer, language: customerAccount.i18n.language},
  });
  if (errors?.length || !data?.customerUpdate?.customer) return {intent: 'datos', error: errors?.[0]?.message ?? 'No pudimos guardar tus datos.', ok: false};
  return {intent: 'datos', error: null, ok: true};
}

export default function AccountProfile() {
  const {customer} = useOutletContext<{customer: CustomerFragment}>();
  const {state} = useNavigation();
  const result = useActionData<typeof action>();
  const subscribed = customer.emailAddress?.marketingState === 'SUBSCRIBED' || customer.emailAddress?.marketingState === 'PENDING';
  const addresses = customer.addresses.nodes;

  return (
    <>
      <PageHead eyebrow="Tu cuenta" title="Direcciones y datos" lead="Lo que usamos para enviarte libros y escribirte cuando llegan." />

      <Form method="post" className="card flex flex-col gap-4 p-5 md:p-[26px]">
        <h2 className="m-0 font-serif text-[22px] font-black">Tus datos</h2>
        <input type="hidden" name="intent" value="datos" />
        <div className="flex flex-wrap gap-3.5">
          <Field className="flex-[1_1_200px]" label="Nombre" name="firstName" autoComplete="given-name" defaultValue={customer.firstName ?? ''} />
          <Field className="flex-[1_1_200px]" label="Apellidos" name="lastName" autoComplete="family-name" defaultValue={customer.lastName ?? ''} />
          <Field className="flex-[1_1_220px]" label="Correo electrónico" name="email-ro" type="email" value={customer.emailAddress?.emailAddress ?? ''} readOnly hint="Es tu llave para entrar; no se cambia desde aquí." />
        </div>
        {result?.intent === 'datos' ? result.ok ? <Alert tone="info" title="Datos guardados" /> : <Alert title="No se guardaron">{result.error}</Alert> : null}
        <button type="submit" className={`${buttonClass({size: 'sm'})} self-start max-sm:w-full max-sm:self-stretch`} disabled={state !== 'idle'}>
          Guardar cambios
        </button>
      </Form>

      <section className="card flex flex-col gap-4 p-5 md:p-[26px]">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="m-0 font-serif text-[22px] font-black">Direcciones</h2>
          <Link to="/account/addresses" className="font-extrabold no-underline">
            Administrar direcciones →
          </Link>
        </div>
        <div className="flex flex-wrap gap-3.5">
          {addresses.map((a) => (
            <div key={a.id} className={`box-border flex min-w-0 flex-[1_1_240px] flex-col gap-2 rounded-[20px] border-[1.5px] bg-ghost p-[18px] ${customer.defaultAddress?.id === a.id ? 'border-witch' : 'border-veil'}`}>
              <span className="flex flex-wrap items-center gap-2 font-serif text-[17px] font-black">
                {[a.firstName, a.lastName].filter(Boolean).join(' ') || 'Dirección'}
                {customer.defaultAddress?.id === a.id ? <Pill tone="dark">Principal</Pill> : null}
              </span>
              <span className="text-[15px] leading-relaxed text-slate">
                {a.formatted.map((l) => (
                  <span key={l} className="block">
                    {l}
                  </span>
                ))}
              </span>
            </div>
          ))}
          <Link
            to="/account/addresses"
            className="box-border flex min-h-20 min-w-0 flex-[1_1_240px] flex-col items-center justify-center gap-2 rounded-[20px] border-[1.5px] border-dashed border-[#a78bfa] p-[18px] text-[15px] font-extrabold text-drip no-underline"
          >
            <span className="flex size-10 items-center justify-center rounded-full bg-spill">
              <Icon name="plus" size={20} />
            </span>
            Agregar dirección
          </Link>
        </div>
      </section>

      <Form method="post" className="card flex flex-col gap-4 p-5 md:p-[26px]">
        <h2 className="m-0 font-serif text-[22px] font-black">Avisos</h2>
        <input type="hidden" name="intent" value="carta" />
        <label htmlFor="carta" aria-label="Carta de luna llena" className="flex cursor-pointer items-start gap-3">
          <input id="carta" type="checkbox" name="carta" defaultChecked={subscribed} className="mt-1 size-[18px] accent-witch" />
          <span className="flex flex-col gap-0.5">
            <span className="text-base font-extrabold">Carta de luna llena</span>
            <span className="text-sm leading-relaxed text-ash">Novedades, ediciones raras y la fecha del próximo club.</span>
          </span>
        </label>
        {result?.intent === 'carta' ? result.ok ? <Alert tone="info" title="Preferencia guardada" /> : <Alert title="No se guardó">{result.error}</Alert> : null}
        <button type="submit" className={`${buttonClass({size: 'sm', variant: 'outline'})} self-start`} disabled={state !== 'idle'}>
          Guardar preferencia
        </button>
      </Form>
    </>
  );
}
