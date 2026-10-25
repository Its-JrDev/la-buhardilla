import type {CustomerAddressInput} from '@shopify/hydrogen/customer-account-api-types';
import type {
  AddressFragment,
  CustomerFragment,
} from 'customer-accountapi.generated';
import {
  data,
  Form,
  useActionData,
  useNavigation,
  useOutletContext,
  type Fetcher,
} from 'react-router';
import {Alert, buttonClass, Field, PageHead, Pill} from '~/components/ui';
import type {Route} from './+types/account.addresses';
import {
  UPDATE_ADDRESS_MUTATION,
  DELETE_ADDRESS_MUTATION,
  CREATE_ADDRESS_MUTATION,
} from '~/graphql/customer-account/CustomerAddressMutations';

export type ActionResponse = {
  addressId?: string | null;
  createdAddress?: AddressFragment;
  defaultAddress?: string | null;
  deletedAddress?: string | null;
  error: Record<AddressFragment['id'], string> | null;
  updatedAddress?: AddressFragment;
};

export const meta: Route.MetaFunction = () => {
  return [{title: 'Direcciones | La Buhardilla'}];
};

export async function loader({context}: Route.LoaderArgs) {
  await context.customerAccount.handleAuthStatus();

  return {};
}

export async function action({request, context}: Route.ActionArgs) {
  const {customerAccount} = context;

  try {
    const form = await request.formData();

    const addressId = form.has('addressId')
      ? String(form.get('addressId'))
      : null;
    if (!addressId) {
      throw new Error('You must provide an address id.');
    }

    // this will ensure redirecting to login never happen for mutatation
    const isLoggedIn = await customerAccount.isLoggedIn();
    if (!isLoggedIn) {
      return data(
        {error: {[addressId]: 'Unauthorized'}},
        {
          status: 401,
        },
      );
    }

    const defaultAddress = form.has('defaultAddress')
      ? String(form.get('defaultAddress')) === 'on'
      : false;
    const address: CustomerAddressInput = {};
    const keys: (keyof CustomerAddressInput)[] = [
      'address1',
      'address2',
      'city',
      'company',
      'territoryCode',
      'firstName',
      'lastName',
      'phoneNumber',
      'zoneCode',
      'zip',
    ];

    for (const key of keys) {
      const value = form.get(key);
      if (typeof value === 'string') {
        address[key] = value;
      }
    }

    switch (request.method) {
      case 'POST': {
        // handle new address creation
        try {
          const {data, errors} = await customerAccount.mutate(
            CREATE_ADDRESS_MUTATION,
            {
              variables: {
                address,
                defaultAddress,
                language: customerAccount.i18n.language,
              },
            },
          );

          if (errors?.length) {
            throw new Error(errors[0].message);
          }

          if (data?.customerAddressCreate?.userErrors?.length) {
            throw new Error(data?.customerAddressCreate?.userErrors[0].message);
          }

          if (!data?.customerAddressCreate?.customerAddress) {
            throw new Error('Customer address create failed.');
          }

          return {
            error: null,
            createdAddress: data?.customerAddressCreate?.customerAddress,
            defaultAddress,
          };
        } catch (error: unknown) {
          if (error instanceof Error) {
            return data(
              {error: {[addressId]: error.message}},
              {
                status: 400,
              },
            );
          }
          return data(
            {error: {[addressId]: error}},
            {
              status: 400,
            },
          );
        }
      }

      case 'PUT': {
        // handle address updates
        try {
          const {data, errors} = await customerAccount.mutate(
            UPDATE_ADDRESS_MUTATION,
            {
              variables: {
                address,
                addressId: decodeURIComponent(addressId),
                defaultAddress,
                language: customerAccount.i18n.language,
              },
            },
          );

          if (errors?.length) {
            throw new Error(errors[0].message);
          }

          if (data?.customerAddressUpdate?.userErrors?.length) {
            throw new Error(data?.customerAddressUpdate?.userErrors[0].message);
          }

          if (!data?.customerAddressUpdate?.customerAddress) {
            throw new Error('Customer address update failed.');
          }

          return {
            error: null,
            updatedAddress: address,
            defaultAddress,
          };
        } catch (error: unknown) {
          if (error instanceof Error) {
            return data(
              {error: {[addressId]: error.message}},
              {
                status: 400,
              },
            );
          }
          return data(
            {error: {[addressId]: error}},
            {
              status: 400,
            },
          );
        }
      }

      case 'DELETE': {
        // handles address deletion
        try {
          const {data, errors} = await customerAccount.mutate(
            DELETE_ADDRESS_MUTATION,
            {
              variables: {
                addressId: decodeURIComponent(addressId),
                language: customerAccount.i18n.language,
              },
            },
          );

          if (errors?.length) {
            throw new Error(errors[0].message);
          }

          if (data?.customerAddressDelete?.userErrors?.length) {
            throw new Error(data?.customerAddressDelete?.userErrors[0].message);
          }

          if (!data?.customerAddressDelete?.deletedAddressId) {
            throw new Error('Customer address delete failed.');
          }

          return {error: null, deletedAddress: addressId};
        } catch (error: unknown) {
          if (error instanceof Error) {
            return data(
              {error: {[addressId]: error.message}},
              {
                status: 400,
              },
            );
          }
          return data(
            {error: {[addressId]: error}},
            {
              status: 400,
            },
          );
        }
      }

      default: {
        return data(
          {error: {[addressId]: 'Method not allowed'}},
          {
            status: 405,
          },
        );
      }
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      return data(
        {error: error.message},
        {
          status: 400,
        },
      );
    }
    return data(
      {error},
      {
        status: 400,
      },
    );
  }
}

export default function Addresses() {
  const {customer} = useOutletContext<{customer: CustomerFragment}>();
  const {defaultAddress, addresses} = customer;
  return (
    <>
      <PageHead crumbs={[{label: 'Tu cuenta', to: '/account'}, {label: 'Direcciones y datos', to: '/account/profile'}, {label: 'Direcciones'}]} eyebrow="Tu cuenta" title="Direcciones" lead="La principal se usa por defecto al sellar la transacción." />
      {addresses.nodes.map((address) => (
        <details key={address.id} className="card group" open={addresses.nodes.length === 1}>
          <summary className="flex min-h-16 cursor-pointer list-none items-center justify-between gap-3 px-5 py-4 md:px-[26px]">
            <span className="flex flex-col gap-0.5">
              <span className="flex flex-wrap items-center gap-2 font-serif text-[17px] font-black">
                {[address.firstName, address.lastName].filter(Boolean).join(' ') || 'Dirección'}
                {defaultAddress?.id === address.id ? <Pill tone="dark">Principal</Pill> : null}
              </span>
              <span className="text-sm text-ash">{address.formatted.join(', ')}</span>
            </span>
            <span className="font-extrabold text-witch group-open:hidden">Editar</span>
          </summary>
          <div className="px-5 pb-6 md:px-[26px]">
            <AddressForm addressId={address.id} address={address} defaultAddress={defaultAddress}>
              {({stateForMethod}) => (
                <div className="flex flex-wrap gap-3">
                  <button disabled={stateForMethod('PUT') !== 'idle'} formMethod="PUT" type="submit" className={buttonClass({size: 'sm'})}>
                    {stateForMethod('PUT') !== 'idle' ? 'Guardando…' : 'Guardar cambios'}
                  </button>
                  <button disabled={stateForMethod('DELETE') !== 'idle'} formMethod="DELETE" type="submit" className={buttonClass({size: 'sm', variant: 'outline'})}>
                    {stateForMethod('DELETE') !== 'idle' ? 'Eliminando…' : 'Eliminar'}
                  </button>
                </div>
              )}
            </AddressForm>
          </div>
        </details>
      ))}
      <section className="card flex flex-col gap-4 p-5 md:p-[26px]">
        <h2 className="m-0 font-serif text-[22px] font-black">Agregar dirección</h2>
        <NewAddressForm key={addresses.nodes.length} />
      </section>
    </>
  );
}

function NewAddressForm() {
  const newAddress = {address1: '', address2: '', city: '', company: '', territoryCode: '', firstName: '', id: 'new', lastName: '', phoneNumber: '', zoneCode: '', zip: ''} as CustomerAddressInput;
  return (
    <AddressForm addressId={'NEW_ADDRESS_ID'} address={newAddress} defaultAddress={null}>
      {({stateForMethod}) => (
        <button disabled={stateForMethod('POST') !== 'idle'} formMethod="POST" type="submit" className={`${buttonClass({size: 'sm'})} self-start`}>
          {stateForMethod('POST') !== 'idle' ? 'Agregando…' : 'Agregar dirección'}
        </button>
      )}
    </AddressForm>
  );
}

export function AddressForm({
  addressId,
  address,
  defaultAddress,
  children,
}: {
  addressId: AddressFragment['id'];
  address: CustomerAddressInput;
  defaultAddress: CustomerFragment['defaultAddress'];
  children: (props: {stateForMethod: (method: 'PUT' | 'POST' | 'DELETE') => Fetcher['state']}) => React.ReactNode;
}) {
  const {state, formMethod} = useNavigation();
  const action = useActionData<ActionResponse>();
  const error = action?.error?.[addressId];
  const isDefaultAddress = defaultAddress?.id === addressId;
  const id = (name: string) => `${addressId.replace(/\W/g, '')}-${name}`;
  return (
    <Form id={addressId} className="flex flex-col gap-4">
      <input type="hidden" name="addressId" defaultValue={addressId} />
      <div className="flex flex-wrap gap-3.5">
        <Field className="flex-[1_1_200px]" id={id('firstName')} label="Nombre" name="firstName" autoComplete="given-name" defaultValue={address?.firstName ?? ''} required />
        <Field className="flex-[1_1_200px]" id={id('lastName')} label="Apellidos" name="lastName" autoComplete="family-name" defaultValue={address?.lastName ?? ''} required />
      </div>
      <Field id={id('address1')} label="Calle y número" name="address1" autoComplete="address-line1" defaultValue={address?.address1 ?? ''} required />
      <Field id={id('address2')} label="Interior, colonia o referencias (opcional)" name="address2" autoComplete="address-line2" defaultValue={address?.address2 ?? ''} />
      <div className="flex flex-wrap gap-3.5">
        <Field className="flex-[1_1_180px]" id={id('city')} label="Ciudad" name="city" autoComplete="address-level2" defaultValue={address?.city ?? ''} required />
        <Field className="flex-[1_1_180px]" id={id('zoneCode')} label="Estado o provincia (código)" name="zoneCode" autoComplete="address-level1" defaultValue={address?.zoneCode ?? ''} required />
      </div>
      <div className="flex flex-wrap gap-3.5">
        <Field className="flex-[1_1_140px]" id={id('zip')} label="Código postal" name="zip" autoComplete="postal-code" defaultValue={address?.zip ?? ''} required />
        <Field className="flex-[1_1_140px]" id={id('territoryCode')} label="País (código de 2 letras)" name="territoryCode" autoComplete="country" defaultValue={address?.territoryCode ?? ''} required maxLength={2} />
        <Field className="flex-[1_1_180px]" id={id('phoneNumber')} label="Teléfono (opcional)" name="phoneNumber" type="tel" autoComplete="tel" placeholder="+525512345678" pattern="^\+?[1-9]\d{3,14}$" defaultValue={address?.phoneNumber ?? ''} />
      </div>
      <Field className="hidden" id={id('company')} label="Empresa" name="company" defaultValue={address?.company ?? ''} />
      <label className="flex cursor-pointer items-center gap-3 text-[15px] font-bold">
        <input defaultChecked={isDefaultAddress} id={id('default')} name="defaultAddress" type="checkbox" className="size-[18px] accent-witch" />
        Usar como dirección principal
      </label>
      {error ? <Alert title="No se guardó la dirección">{error}</Alert> : null}
      {children({stateForMethod: (method) => (formMethod === method ? state : 'idle')})}
    </Form>
  );
}
