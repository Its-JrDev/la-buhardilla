import {data as remixData, Outlet, redirect, useLoaderData} from 'react-router';
import type {Route} from './+types/account';
import {AccountNav} from '~/components/account';
import {initials} from '~/components/Header';
import {CUSTOMER_DETAILS_QUERY} from '~/graphql/customer-account/CustomerDetailsQuery';

export function shouldRevalidate() {
  return true;
}

export async function loader({context}: Route.LoaderArgs) {
  if (!(await context.customerAccount.isLoggedIn())) {
    return redirect('/account/login');
  }
  const {customerAccount} = context;
  const {data, errors} = await customerAccount.query(CUSTOMER_DETAILS_QUERY, {
    variables: {language: customerAccount.i18n.language},
  });
  if (errors?.length || !data?.customer) {
    return redirect('/account/login');
  }
  return remixData({customer: data.customer}, {headers: {'Cache-Control': 'no-cache, no-store, must-revalidate'}});
}

export default function AccountLayout() {
  const {customer} = useLoaderData<typeof loader>();
  const email = customer.emailAddress?.emailAddress;
  const name = [customer.firstName, customer.lastName].filter(Boolean).join(' ') || 'Tu cuenta';
  return (
    <div className="mx-auto box-border flex max-w-[1280px] flex-col gap-6 px-4 pb-24 md:flex-row md:items-start md:gap-12 md:px-6">
      <div className="md:sticky md:top-6 md:w-[300px] md:flex-none">
        <AccountNav name={name} email={email} initials={initials({firstName: customer.firstName, lastName: customer.lastName, email})} />
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-10">
        <Outlet context={{customer}} />
      </div>
    </div>
  );
}
