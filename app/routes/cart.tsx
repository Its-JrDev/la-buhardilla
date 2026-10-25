import {Link, useLoaderData, data, type HeadersFunction} from 'react-router';
import type {Route} from './+types/cart';
import type {CartQueryDataReturn} from '@shopify/hydrogen';
import {CartForm} from '@shopify/hydrogen';
import {CartMain} from '~/components/CartMain';
import {PageHead} from '~/components/ui';

export const meta: Route.MetaFunction = () => {
  return [{title: 'Tu selección | La Buhardilla'}];
};

export const headers: HeadersFunction = ({actionHeaders}) => actionHeaders;

export async function action({request, context}: Route.ActionArgs) {
  const {cart} = context;

  const formData = await request.formData();

  const {action, inputs} = CartForm.getFormInput(formData);

  if (!action) {
    throw new Error('No action provided');
  }

  let status = 200;
  let result: CartQueryDataReturn;

  switch (action) {
    case CartForm.ACTIONS.LinesAdd:
      result = await cart.addLines(inputs.lines);
      break;
    case CartForm.ACTIONS.LinesUpdate:
      result = await cart.updateLines(inputs.lines);
      break;
    case CartForm.ACTIONS.LinesRemove:
      result = await cart.removeLines(inputs.lineIds);
      break;
    case CartForm.ACTIONS.DiscountCodesUpdate: {
      const formDiscountCode = inputs.discountCode;

      // User inputted discount code
      const discountCodes = (
        formDiscountCode ? [formDiscountCode] : []
      ) as string[];

      // Combine discount codes already applied on cart
      discountCodes.push(...inputs.discountCodes);

      result = await cart.updateDiscountCodes(discountCodes);
      break;
    }
    case CartForm.ACTIONS.GiftCardCodesAdd: {
      const formGiftCardCode = inputs.giftCardCode;

      const giftCardCodes = (
        formGiftCardCode ? [formGiftCardCode] : []
      ) as string[];

      result = await cart.addGiftCardCodes(giftCardCodes);
      break;
    }
    case CartForm.ACTIONS.GiftCardCodesRemove: {
      const appliedGiftCardIds = inputs.giftCardCodes as string[];
      result = await cart.removeGiftCardCodes(appliedGiftCardIds);
      break;
    }
    case CartForm.ACTIONS.BuyerIdentityUpdate: {
      result = await cart.updateBuyerIdentity({
        ...inputs.buyerIdentity,
      });
      break;
    }
    default:
      throw new Error(`${action} cart action is not defined`);
  }

  const cartId = result?.cart?.id;
  const headers = cartId ? cart.setCartId(result.cart.id) : new Headers();
  const {cart: cartResult, errors, warnings} = result;

  const redirectTo = formData.get('redirectTo') ?? null;
  if (typeof redirectTo === 'string') {
    status = 303;
    headers.set('Location', redirectTo);
  }

  return data(
    {
      cart: cartResult,
      errors,
      warnings,
      analytics: {
        cartId,
      },
    },
    {status, headers},
  );
}

export async function loader({context}: Route.LoaderArgs) {
  const {cart} = context;
  return await cart.get();
}

export default function Cart() {
  const cart = useLoaderData<typeof loader>();
  const count = cart?.totalQuantity ?? 0;
  return (
    <div className="mx-auto box-border flex max-w-[1280px] flex-col gap-8 px-4 pb-24 md:px-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <PageHead eyebrow={`${count} ${count === 1 ? 'libro' : 'libros'}`} title="Tu selección" lead={count ? 'Lo que elegiste para llevarte. Revísalo antes de sellar.' : undefined} />
        <Link to="/collections/all" className="inline-flex min-h-11 items-center text-[17px] font-extrabold no-underline">
          ← Seguir explorando
        </Link>
      </div>
      <CartMain layout="page" cart={cart} />
    </div>
  );
}
