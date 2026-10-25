import {Form, redirect, useActionData, useNavigation} from 'react-router';
import type {Route} from './+types/club.reservar';
import {Icon} from '~/components/brand/Icons';
import {NightScene} from '~/components/brand/Scenes';
import {SessionCard} from '~/components/club';
import {Alert, buttonClass, Crumbs, Eyebrow, Field, OptionPills} from '~/components/ui';
import {CLUB_PRODUCT_HANDLE, CLUB_SESSIONS, SEAT_OPTIONS} from '~/lib/club';
import {isEmail} from '~/lib/forms';

export const meta: Route.MetaFunction = () => [{title: 'Reservar · Club de medianoche | La Buhardilla'}];

const OPEN = CLUB_SESSIONS.filter((s) => s.option);

/**
 * La reserva es un pedido a $0: añadimos la variante «Sesión × Lugares» del producto del club
 * (y, si se pide, el libro del mes) y mandamos al checkout para confirmarla.
 */
export async function action({request, context}: Route.ActionArgs) {
  const f = await request.formData();
  const sesion = String(f.get('sesion') ?? '');
  const lugares = String(f.get('lugares') ?? '');
  const nombre = String(f.get('nombre') ?? '').trim();
  const email = String(f.get('email') ?? '').trim();
  const conLibro = f.get('libro') === 'si';
  const errors: Record<string, string> = {};
  if (!nombre) errors.nombre = 'Dinos a nombre de quién apartamos el lugar.';
  if (!isEmail(email)) errors.email = 'Escribe un correo para enviarte la confirmación.';
  const session = OPEN.find((s) => s.option === sesion);
  if (!session) errors.form = 'Elige una sesión.';
  if (Object.keys(errors).length) return {errors};

  const {product, book} = await context.storefront.query(CLUB_VARIANTS_QUERY, {
    variables: {handle: CLUB_PRODUCT_HANDLE, book: session!.bookHandle ?? ''},
    cache: context.storefront.CacheNone(),
  });
  const variant = product?.variants.nodes.find(
    (v) => v.availableForSale && v.selectedOptions.some((o) => o.value === sesion) && v.selectedOptions.some((o) => o.value === lugares),
  );
  if (!variant) return {errors: {form: 'Esa sesión ya no tiene lugares. Prueba con otra fecha.'}};

  const lines = [{merchandiseId: variant.id, quantity: 1, attributes: [{key: 'A nombre de', value: nombre}]}];
  const bookVariant = book?.selectedOrFirstAvailableVariant;
  if (conLibro && bookVariant?.availableForSale) lines.push({merchandiseId: bookVariant.id, quantity: 1, attributes: []});

  const result = await context.cart.addLines(lines);
  if (!result.cart?.id) return {errors: {form: 'No pudimos apartar tu lugar. Inténtalo de nuevo.'}};
  const withBuyer = await context.cart.updateBuyerIdentity({email});
  const headers = context.cart.setCartId(result.cart.id);
  const checkoutUrl = withBuyer.cart?.checkoutUrl ?? result.cart.checkoutUrl;
  return redirect(checkoutUrl, {headers});
}

export default function ClubReservar() {
  const result = useActionData<typeof action>();
  const errors: Record<string, string | undefined> = result?.errors ?? {};
  const nav = useNavigation();
  const next = OPEN[0];
  return (
    <div className="mx-auto box-border flex max-w-[1280px] flex-wrap-reverse items-start gap-x-14 gap-y-8 px-4 pb-24 md:flex-wrap md:px-6">
      <div className="flex min-w-0 flex-[999_1_480px] flex-col gap-[22px]">
        <Crumbs items={[{label: 'Club de medianoche', to: '/club'}, {label: 'Reservar'}]} />
        <div className="flex flex-col gap-2">
          <Eyebrow>Aparta tu lugar</Eyebrow>
          <h1 className="m-0 font-serif text-[32px] font-black leading-[1.1] md:text-[46px]">Reserva para la sesión de medianoche</h1>
        </div>
        <Form method="post" className="flex flex-col gap-[22px]" noValidate>
          {errors.form ? <Alert title="Falta algo">{errors.form}</Alert> : null}
          <OptionPills legend="Sesión" name="sesion" value={next.option!} options={OPEN.map((s) => ({value: s.option!, label: `${s.weekday.slice(0, 3)} ${s.day} ${s.month.toLowerCase()}`, sub: s.book}))} />
          <div className="flex flex-wrap gap-3.5">
            <Field className="flex-[1_1_200px]" label="Nombre" name="nombre" autoComplete="name" placeholder="Mina Harker" error={errors.nombre} required />
            <Field className="flex-[1_1_200px]" label="Correo electrónico" name="email" type="email" autoComplete="email" placeholder="tu@correo.com" error={errors.email} required />
          </div>
          <div className="flex flex-col gap-1">
            <OptionPills legend="Lugares" name="lugares" value={SEAT_OPTIONS[1].value} options={SEAT_OPTIONS} />
            <span className="pt-2.5 text-[13px] text-mist">Puedes subir con un acompañante como máximo.</span>
          </div>
          <label htmlFor="con-libro" aria-label="Añadir el libro del mes a tu selección" className="flex cursor-pointer items-start gap-3 rounded-[20px] bg-spill px-[18px] py-3.5">
            <input id="con-libro" type="checkbox" name="libro" value="si" defaultChecked className="mt-0.5 size-[18px] accent-witch" />
            <span className="flex flex-col gap-0.5">
              <span className="text-[15px] font-extrabold">
                Añadir <em className="font-serif">{next.book}</em> a tu selección
              </span>
              <span className="text-[13px] text-ash">Desmárcalo si ya tienes el libro del mes.</span>
            </span>
          </label>
          <div className="flex flex-col gap-2.5">
            <button type="submit" className={buttonClass({full: true})} disabled={nav.state !== 'idle'}>
              {nav.state !== 'idle' ? 'Apartando…' : 'Apartar mi lugar'} <Icon name="arrow" size={18} />
            </button>
            <p className="m-0 text-center text-[13px] leading-normal text-mist">
              Confirmas la reserva en el siguiente paso; el lugar no tiene costo. Puedes cambiar o cancelar hasta 24 h antes.
            </p>
          </div>
        </Form>
      </div>
      <aside className="flex min-w-0 flex-[1_1_340px] flex-col gap-3.5">
        <div className="mx-auto w-full max-w-[340px]">
          <NightScene subject="book" book={{title: next.book, author: next.author, coverBg: next.cover!.bg, coverInk: next.cover!.ink}} />
        </div>
        <SessionCard session={next} />
      </aside>
    </div>
  );
}

const CLUB_VARIANTS_QUERY = `#graphql
  query ClubVariants($handle: String!, $book: String!, $country: CountryCode, $language: LanguageCode)
  @inContext(country: $country, language: $language) {
    product(handle: $handle) {
      variants(first: 20) {
        nodes {
          id
          availableForSale
          selectedOptions {
            name
            value
          }
        }
      }
    }
    book: product(handle: $book) {
      selectedOrFirstAvailableVariant {
        id
        availableForSale
      }
    }
  }
` as const;
