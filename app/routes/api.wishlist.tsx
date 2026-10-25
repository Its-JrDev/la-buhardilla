import {data as remixData} from 'react-router';
import type {Route} from './+types/api.wishlist';
import type {WishlistState} from '~/lib/wishlist';

export async function loader({context}: Route.LoaderArgs) {
  const {session} = context;
  const wishlists = (session.get('customer_wishlists') as WishlistState) ?? null;
  return remixData({wishlists});
}

export async function action({request, context}: Route.ActionArgs) {
  const {session} = context;
  try {
    const body = (await request.json()) as WishlistState;
    if (body && Array.isArray(body.lists)) {
      session.set('customer_wishlists', body);
      return remixData(
        {ok: true},
        {
          headers: {
            'Set-Cookie': await session.commit(),
          },
        },
      );
    }
    return remixData({ok: false, error: 'Invalid payload'}, {status: 400});
  } catch (err) {
    return remixData({ok: false, error: String(err)}, {status: 500});
  }
}
