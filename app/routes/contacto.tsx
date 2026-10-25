import {Form, Link, useActionData, useLoaderData, useNavigation} from 'react-router';
import type {Route} from './+types/contacto';
import {Icon, type IconName} from '~/components/brand/Icons';
import {NightScene} from '~/components/brand/Scenes';
import {Alert, Button, buttonClass, DefinitionCard, Eyebrow, Field, OptionPills, PageHead, TextArea} from '~/components/ui';
import {deliverForm, folio, isEmail} from '~/lib/forms';

export const meta: Route.MetaFunction = () => [{title: 'Escríbenos | La Buhardilla'}];

const MOTIVOS = [
  {value: 'pedido', label: 'Un pedido'},
  {value: 'libro', label: 'Un libro'},
  {value: 'club', label: 'El club'},
  {value: 'otro', label: 'Otra cosa'},
];

export function loader({request}: Route.LoaderArgs) {
  const url = new URL(request.url);
  const motivo = MOTIVOS.some((m) => m.value === url.searchParams.get('motivo')) ? url.searchParams.get('motivo')! : 'pedido';
  return {motivo, pedido: url.searchParams.get('pedido') ?? ''};
}

type Errors = Partial<Record<'nombre' | 'email' | 'mensaje' | 'form', string>>;

export async function action({request, context}: Route.ActionArgs) {
  const f = await request.formData();
  const get = (k: string) => String(f.get(k) ?? '').trim();
  const values = {motivo: get('motivo'), nombre: get('nombre'), email: get('email'), pedido: get('pedido'), mensaje: get('mensaje')};
  const errors: Errors = {};
  if (!values.nombre) errors.nombre = 'Dinos cómo te llamas.';
  if (!isEmail(values.email)) errors.email = 'Escribe un correo válido para responderte.';
  if (values.mensaje.length < 10) errors.mensaje = 'Cuéntanos un poco más.';
  if (Object.keys(errors).length) return {ok: false as const, errors, values};
  const id = folio();
  const sent = await deliverForm(context.env, 'contacto', {...values, folio: id});
  if (!sent.ok) return {ok: false as const, errors: {form: 'No pudimos enviar tu mensaje en este momento. Inténtalo de nuevo más tarde.'} as Errors, values};
  return {ok: true as const, folio: id, values};
}

export default function Contacto() {
  const {motivo, pedido} = useLoaderData<typeof loader>();
  const result = useActionData<typeof action>();
  const nav = useNavigation();

  if (result?.ok) {
    const label = MOTIVOS.find((m) => m.value === result.values.motivo)?.label ?? 'Otra cosa';
    return (
      <div className="mx-auto box-border flex max-w-[980px] flex-col gap-8 px-4 pb-24 md:px-6">
        <div className="mx-auto w-full max-w-[300px] md:max-w-[380px]">
          <NightScene subject="envelope" />
        </div>
        <section className="flex flex-col items-center gap-3.5 text-center">
          <Eyebrow>Mensaje enviado</Eyebrow>
          <h1 className="m-0 font-serif text-[34px] font-black leading-[1.1] md:text-[52px]">Tu carta ya sube la escalera.</h1>
          <p className="m-0 max-w-[560px] text-base leading-relaxed text-slate md:text-lg">
            Te responderemos a <strong>{result.values.email}</strong>. Si recuerdas algo más, contesta ese mismo correo.
          </p>
        </section>
        <DefinitionCard
          title="Tu mensaje"
          rows={[
            ['Motivo', label],
            ...(result.values.pedido ? ([['Pedido', result.values.pedido]] as Array<[string, string]>) : []),
            ['Folio', result.folio],
            ['Mensaje', `«${result.values.mensaje.slice(0, 80)}${result.values.mensaje.length > 80 ? '…' : ''}»`],
          ]}
        />
        <div className="flex flex-wrap justify-center gap-3">
          <Button to="/ayuda" variant="outline" className="max-sm:w-full">
            Volver a la ayuda
          </Button>
          <Button to="/collections/all" className="max-sm:w-full">
            Seguir explorando
          </Button>
        </div>
      </div>
    );
  }

  const errors = result?.errors ?? {};
  const v = result?.values;
  const quick = (
    <section className="card-line flex flex-col gap-1 p-[22px]">
      <h2 className="m-0 mb-2 font-serif text-[19px] font-black">Antes de escribir</h2>
      {[
        ['¿Cuánto tarda en llegar mi pedido?', '/ayuda/envios'],
        ['¿Cómo rastreo mi paquete?', '/ayuda/envios'],
        ['¿Cómo inicio una devolución?', '/ayuda/devoluciones'],
      ].map(([q, to]) => (
        <Link key={q} to={to} className="dashed-top flex min-h-12 items-center gap-2.5 py-2 text-[15px] font-bold leading-snug text-midnight no-underline hover:text-witch">
          <span className="flex-1">{q}</span>
          <Icon name="chev" size={18} className="text-witch" />
        </Link>
      ))}
    </section>
  );
  const other = (
    <section className="card-line flex flex-col gap-1 p-[22px]">
      <h2 className="m-0 mb-2 font-serif text-[19px] font-black">Otras formas de encontrarnos</h2>
      {(
        [
          ['pin', 'Visítanos', 'La buhardilla abre sus puertas cada día.', '/visitanos'],
          ['candle', 'Club de medianoche', 'El último viernes de cada mes, 23:00 h.', '/club'],
        ] as Array<[IconName, string, string, string]>
      ).map(([icon, a, b, to]) => (
        <Link key={a} to={to} className="dashed-top flex items-start gap-3 py-2.5 text-[15px] leading-normal text-slate no-underline">
          <Icon name={icon} size={19} className="mt-px flex-none text-witch" />
          <span>
            <strong className="text-midnight">{a}</strong>
            <br />
            {b}
          </span>
        </Link>
      ))}
    </section>
  );

  return (
    <div className="mx-auto box-border flex max-w-[1280px] flex-wrap items-start gap-x-14 gap-y-7 px-4 pb-24 md:px-6">
      <div className="flex min-w-0 flex-[999_1_520px] flex-col gap-7">
        <PageHead
          crumbs={[{label: 'Ayuda', to: '/ayuda'}, {label: 'Escríbenos'}]}
          eyebrow="Escríbenos"
          title="Deja tu carta en la buhardilla"
          lead="Una persona, no un fantasma, lee cada mensaje y te contesta."
        />
        <div className="md:hidden">{quick}</div>
        <Form method="post" className="flex flex-col gap-[22px]" noValidate>
          {errors.form ? <Alert title="No se envió tu mensaje">{errors.form}</Alert> : null}
          <OptionPills legend="¿Sobre qué nos escribes?" name="motivo" value={v?.motivo ?? motivo} options={MOTIVOS} />
          <div className="flex flex-wrap gap-3.5">
            <Field className="flex-[1_1_200px]" label="Nombre" name="nombre" autoComplete="name" placeholder="Mina Harker" defaultValue={v?.nombre} error={errors.nombre} required />
            <Field className="flex-[1_1_200px]" label="Correo electrónico" name="email" type="email" autoComplete="email" placeholder="tu@correo.com" defaultValue={v?.email} error={errors.email} required />
          </div>
          <Field label="Número de pedido (opcional)" name="pedido" placeholder="#1001" defaultValue={v?.pedido ?? pedido} hint="Lo encuentras en el correo de confirmación." />
          <div className="flex flex-col gap-1.5">
            <TextArea label="Tu mensaje" name="mensaje" rows={6} placeholder="Cuéntanos qué pasó. Si es sobre un libro, dinos cuál." defaultValue={v?.mensaje} aria-invalid={errors.mensaje ? true : undefined} required />
            {errors.mensaje ? <span className="pl-[18px] text-[13px] font-bold text-pumpkin-dark">{errors.mensaje}</span> : null}
          </div>
          <button type="submit" className={buttonClass({full: true})} disabled={nav.state !== 'idle'}>
            {nav.state !== 'idle' ? 'Enviando…' : 'Enviar mensaje'} <Icon name="arrow" size={18} />
          </button>
        </Form>
        <div className="md:hidden">{other}</div>
      </div>
      <aside className="hidden min-w-0 flex-[1_1_340px] flex-col gap-4 pt-10 md:flex">
        {quick}
        {other}
      </aside>
    </div>
  );
}
