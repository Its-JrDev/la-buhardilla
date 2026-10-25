import {data} from 'react-router';
import type {Route} from './+types/avisame';
import {deliverForm, isEmail} from '~/lib/forms';

/** «Avísame cuando vuelva» (fetcher desde la ficha). */
export async function action({request, context}: Route.ActionArgs) {
  const form = await request.formData();
  const email = form.get('email');
  if (!isEmail(email)) return data({ok: false, message: 'Escribe un correo válido.'}, {status: 400});
  const sent = await deliverForm(context.env, 'avisame', {
    email: email.trim(),
    product: String(form.get('product') ?? ''),
    variant: String(form.get('variant') ?? ''),
  });
  return sent.ok
    ? {ok: true, message: `Listo. Te escribimos a ${email.trim()} en cuanto vuelva.`}
    : data({ok: false, message: 'No pudimos guardar tu aviso. Inténtalo más tarde o escríbenos.'}, {status: 503});
}
