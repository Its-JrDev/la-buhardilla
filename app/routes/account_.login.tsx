import {Link, useLoaderData, useSearchParams} from 'react-router';
import type {Route} from './+types/account_.login';
import {NightScene} from '~/components/brand/Scenes';
import {buttonClass} from '~/components/ui';
import {Icon} from '~/components/brand/Icons';

export const meta: Route.MetaFunction = () => [{title: 'Entrar | La Buhardilla'}, {name: 'robots', content: 'noindex'}];

/**
 * «Entra a la buhardilla». El acceso lo resuelve Shopify (cuentas de cliente sin contraseña,
 * con código por correo); esta página lo presenta y, con `?go=1`, inicia el flujo.
 */
export async function loader({request, context}: Route.LoaderArgs) {
  const url = new URL(request.url);
  if (url.searchParams.get('go') !== '1') {
    url.searchParams.set('go', '1');
    return {continueTo: `${url.pathname}${url.search}`};
  }
  return context.customerAccount.login({
    countryCode: context.storefront.i18n.country,
    acrValues: url.searchParams.get('acr_values') || undefined,
    loginHint: url.searchParams.get('login_hint') || undefined,
    loginHintMode: url.searchParams.get('login_hint_mode') || undefined,
    locale: url.searchParams.get('locale') || undefined,
  });
}

export default function Login() {
  const {continueTo} = useLoaderData<typeof loader>();
  const [params] = useSearchParams();
  const notice = params.get('notice');
  return (
    <div className="mx-auto box-border flex max-w-[1180px] flex-wrap items-center gap-x-[72px] gap-y-2 px-4 pb-24 md:px-6">
      <div className="mx-auto w-[290px] min-w-0 md:w-auto md:max-w-[500px] md:flex-[1_1_400px]">
        <NightScene subject="key" />
      </div>
      <div className="card box-border flex min-w-0 flex-[1_1_440px] flex-col gap-[18px] px-[22px] py-[26px] md:max-w-[520px] md:p-10">
        <span className="eyebrow">Tu cuenta</span>
        <h1 className="m-0 font-serif text-[30px] font-black leading-[1.1] md:text-[38px]">Entra a la buhardilla</h1>
        <p className="m-0 text-base leading-relaxed text-ash">Tus pedidos, tus direcciones y tu lugar en el club te esperan.</p>
        <div className="flex gap-3 rounded-[18px] bg-spill px-4 py-3.5 text-sm leading-relaxed text-slate">
          <Icon name="mail" size={19} className="flex-none text-drip" />
          <span>Sin contraseñas que olvidar: te enviamos un código de un solo uso a tu correo. Si es tu primera vez, la cuenta se crea al entrar.</span>
        </div>
        <a href={continueTo} className={buttonClass({full: true})}>
          Entrar con mi correo <Icon name="arrow" size={18} />
        </a>
        <p className="m-0 border-t border-dashed border-witch-light pt-4 text-center text-sm leading-relaxed text-ash">
          No necesitas cuenta para comprar.{' '}
          <Link to="/cart" className="font-extrabold no-underline">
            Seguir como invitado
          </Link>
        </p>
      </div>
    </div>
  );
}
