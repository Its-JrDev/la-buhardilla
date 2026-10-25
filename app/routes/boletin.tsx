import {Form, useActionData, useNavigation} from 'react-router';
import type {Route} from './+types/boletin';
import {NightScene} from '~/components/brand/Scenes';
import {Button, buttonClass, Eyebrow, Field} from '~/components/ui';
import {CUSTOMER_MARKETING_SUBSCRIBE} from '~/graphql/customer-account/CustomerMarketingMutation';
import {isEmail} from '~/lib/forms';

export const meta: Route.MetaFunction = () => [{title: 'Únete al aquelarre | La Buhardilla'}];

type Result = {ok: boolean; email?: string; message: string};

export async function action({request, context}: Route.ActionArgs): Promise<Result> {
  const form = await request.formData();
  const email = form.get('email');
  if (!isEmail(email)) return {ok: false, message: 'Escribe un correo válido para unirte.'};

  // Con sesión: la suscripción se guarda en tu cuenta.
  if (await context.customerAccount.isLoggedIn()) {
    const {data, errors} = await context.customerAccount.mutate(CUSTOMER_MARKETING_SUBSCRIBE);
    const userErrors = data?.customerEmailMarketingSubscribe?.userErrors ?? [];
    if (!errors?.length && !userErrors.length) return {ok: true, email: email.trim(), message: 'Quedaste suscrito con el correo de tu cuenta.'};
  }

  const password = crypto.randomUUID() + 'Aa1!';
  try {
    const {customerCreate} = await context.storefront.mutate(NEWSLETTER_MUTATION, {variables: {email: email.trim(), password}});
    const err = customerCreate?.customerUserErrors?.[0];
    if (!err) return {ok: true, email: email.trim(), message: 'Te escribiremos cada luna llena.'};
    if (err.code === 'TAKEN' || err.code === 'CUSTOMER_DISABLED')
      return {ok: true, email: email.trim(), message: 'Ese correo ya está en la buhardilla. Si aún no recibes la carta, actívala desde tu cuenta.'};
    return {ok: false, message: 'No pudimos anotarte ahora. Si ya tienes cuenta, inicia sesión y actívala desde ahí.'};
  } catch (e) {
    console.error('[boletin] error', e);
    return {ok: false, message: 'No pudimos anotarte ahora. Si ya tienes cuenta, inicia sesión y actívala desde ahí.'};
  }
}

export default function Boletin() {
  const result = useActionData<typeof action>();
  const nav = useNavigation();
  return (
    <div className="mx-auto box-border flex max-w-[980px] flex-col gap-8 px-4 pb-24 md:px-6">
      <div className="mx-auto w-full max-w-[300px] md:max-w-[380px]">
        <NightScene subject="envelope" />
      </div>
      <section className="flex flex-col items-center gap-3.5 text-center">
        <Eyebrow>Únete al aquelarre</Eyebrow>
        <h1 className="m-0 font-serif text-[34px] font-black leading-[1.1] md:text-[52px]">
          {result?.ok ? 'Ya eres parte del aquelarre.' : 'Una carta cada luna llena.'}
        </h1>
        <p className="m-0 max-w-[580px] text-base leading-relaxed text-slate md:text-lg">
          {result?.ok ? (
            <>
              Anotamos <strong>{result.email}</strong>. {result.message}
            </>
          ) : (
            'Novedades, ediciones raras y la fecha del próximo club de medianoche. Sin cartas de más.'
          )}
        </p>
      </section>
      {result?.ok ? (
        <div className="flex flex-wrap justify-center gap-3">
          <Button to="/collections/all">Seguir explorando</Button>
          <Button to="/club" variant="outline">
            Conocer el club
          </Button>
        </div>
      ) : (
        <Form method="post" className="card mx-auto box-border flex w-full max-w-[560px] flex-col gap-4 p-[22px] md:p-7">
          <Field label="Correo electrónico" name="email" type="email" required autoComplete="email" placeholder="tu@correo.com" error={result && !result.ok ? result.message : undefined} />
          <button type="submit" className={buttonClass({full: true})} disabled={nav.state !== 'idle'}>
            Suscribirme
          </button>
          <p className="m-0 text-center text-[13px] text-mist">Puedes darte de baja desde cualquier carta.</p>
        </Form>
      )}
    </div>
  );
}

const NEWSLETTER_MUTATION = `#graphql
  mutation NewsletterSubscribe($email: String!, $password: String!) {
    customerCreate(input: {email: $email, password: $password, acceptsMarketing: true}) {
      customer {
        id
      }
      customerUserErrors {
        code
        field
        message
      }
    }
  }
` as const;
