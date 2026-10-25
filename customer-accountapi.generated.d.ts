/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable eslint-comments/no-unlimited-disable */
/* eslint-disable */
import type * as CustomerAccountAPI from '@shopify/hydrogen/customer-account-api-types';

export type CustomerAddressUpdateMutationVariables = CustomerAccountAPI.Exact<{
  address: CustomerAccountAPI.CustomerAddressInput;
  addressId: CustomerAccountAPI.Scalars['ID']['input'];
  defaultAddress?: CustomerAccountAPI.InputMaybe<
    CustomerAccountAPI.Scalars['Boolean']['input']
  >;
  language?: CustomerAccountAPI.InputMaybe<CustomerAccountAPI.LanguageCode>;
}>;

export type CustomerAddressUpdateMutation = {
  customerAddressUpdate?: CustomerAccountAPI.Maybe<{
    customerAddress?: CustomerAccountAPI.Maybe<
      Pick<CustomerAccountAPI.CustomerAddress, 'id'>
    >;
    userErrors: Array<
      Pick<
        CustomerAccountAPI.UserErrorsCustomerAddressUserErrors,
        'code' | 'field' | 'message'
      >
    >;
  }>;
};

export type CustomerAddressDeleteMutationVariables = CustomerAccountAPI.Exact<{
  addressId: CustomerAccountAPI.Scalars['ID']['input'];
  language?: CustomerAccountAPI.InputMaybe<CustomerAccountAPI.LanguageCode>;
}>;

export type CustomerAddressDeleteMutation = {
  customerAddressDelete?: CustomerAccountAPI.Maybe<
    Pick<
      CustomerAccountAPI.CustomerAddressDeletePayload,
      'deletedAddressId'
    > & {
      userErrors: Array<
        Pick<
          CustomerAccountAPI.UserErrorsCustomerAddressUserErrors,
          'code' | 'field' | 'message'
        >
      >;
    }
  >;
};

export type CustomerAddressCreateMutationVariables = CustomerAccountAPI.Exact<{
  address: CustomerAccountAPI.CustomerAddressInput;
  defaultAddress?: CustomerAccountAPI.InputMaybe<
    CustomerAccountAPI.Scalars['Boolean']['input']
  >;
  language?: CustomerAccountAPI.InputMaybe<CustomerAccountAPI.LanguageCode>;
}>;

export type CustomerAddressCreateMutation = {
  customerAddressCreate?: CustomerAccountAPI.Maybe<{
    customerAddress?: CustomerAccountAPI.Maybe<
      Pick<CustomerAccountAPI.CustomerAddress, 'id'>
    >;
    userErrors: Array<
      Pick<
        CustomerAccountAPI.UserErrorsCustomerAddressUserErrors,
        'code' | 'field' | 'message'
      >
    >;
  }>;
};

export type CustomerFragment = Pick<
  CustomerAccountAPI.Customer,
  'id' | 'firstName' | 'lastName'
> & {
  emailAddress?: CustomerAccountAPI.Maybe<
    Pick<
      CustomerAccountAPI.CustomerEmailAddress,
      'emailAddress' | 'marketingState'
    >
  >;
  phoneNumber?: CustomerAccountAPI.Maybe<
    Pick<CustomerAccountAPI.CustomerPhoneNumber, 'phoneNumber'>
  >;
  defaultAddress?: CustomerAccountAPI.Maybe<
    Pick<
      CustomerAccountAPI.CustomerAddress,
      | 'id'
      | 'formatted'
      | 'firstName'
      | 'lastName'
      | 'company'
      | 'address1'
      | 'address2'
      | 'territoryCode'
      | 'zoneCode'
      | 'city'
      | 'zip'
      | 'phoneNumber'
    >
  >;
  addresses: {
    nodes: Array<
      Pick<
        CustomerAccountAPI.CustomerAddress,
        | 'id'
        | 'formatted'
        | 'firstName'
        | 'lastName'
        | 'company'
        | 'address1'
        | 'address2'
        | 'territoryCode'
        | 'zoneCode'
        | 'city'
        | 'zip'
        | 'phoneNumber'
      >
    >;
  };
};

export type AddressFragment = Pick<
  CustomerAccountAPI.CustomerAddress,
  | 'id'
  | 'formatted'
  | 'firstName'
  | 'lastName'
  | 'company'
  | 'address1'
  | 'address2'
  | 'territoryCode'
  | 'zoneCode'
  | 'city'
  | 'zip'
  | 'phoneNumber'
>;

export type CustomerDetailsQueryVariables = CustomerAccountAPI.Exact<{
  language?: CustomerAccountAPI.InputMaybe<CustomerAccountAPI.LanguageCode>;
}>;

export type CustomerDetailsQuery = {
  customer: Pick<
    CustomerAccountAPI.Customer,
    'id' | 'firstName' | 'lastName'
  > & {
    emailAddress?: CustomerAccountAPI.Maybe<
      Pick<
        CustomerAccountAPI.CustomerEmailAddress,
        'emailAddress' | 'marketingState'
      >
    >;
    phoneNumber?: CustomerAccountAPI.Maybe<
      Pick<CustomerAccountAPI.CustomerPhoneNumber, 'phoneNumber'>
    >;
    defaultAddress?: CustomerAccountAPI.Maybe<
      Pick<
        CustomerAccountAPI.CustomerAddress,
        | 'id'
        | 'formatted'
        | 'firstName'
        | 'lastName'
        | 'company'
        | 'address1'
        | 'address2'
        | 'territoryCode'
        | 'zoneCode'
        | 'city'
        | 'zip'
        | 'phoneNumber'
      >
    >;
    addresses: {
      nodes: Array<
        Pick<
          CustomerAccountAPI.CustomerAddress,
          | 'id'
          | 'formatted'
          | 'firstName'
          | 'lastName'
          | 'company'
          | 'address1'
          | 'address2'
          | 'territoryCode'
          | 'zoneCode'
          | 'city'
          | 'zip'
          | 'phoneNumber'
        >
      >;
    };
  };
};

export type HeaderCustomerQueryVariables = CustomerAccountAPI.Exact<{
  [key: string]: never;
}>;

export type HeaderCustomerQuery = {
  customer: Pick<CustomerAccountAPI.Customer, 'firstName' | 'lastName'> & {
    emailAddress?: CustomerAccountAPI.Maybe<
      Pick<CustomerAccountAPI.CustomerEmailAddress, 'emailAddress'>
    >;
  };
};

export type MarketingOptInMutationVariables = CustomerAccountAPI.Exact<{
  [key: string]: never;
}>;

export type MarketingOptInMutation = {
  customerEmailMarketingSubscribe?: CustomerAccountAPI.Maybe<{
    emailAddress?: CustomerAccountAPI.Maybe<
      Pick<CustomerAccountAPI.CustomerEmailAddress, 'marketingState'>
    >;
    userErrors: Array<
      Pick<
        CustomerAccountAPI.UserErrorsCustomerEmailMarketingUserErrors,
        'field' | 'message' | 'code'
      >
    >;
  }>;
};

export type MarketingOptOutMutationVariables = CustomerAccountAPI.Exact<{
  [key: string]: never;
}>;

export type MarketingOptOutMutation = {
  customerEmailMarketingUnsubscribe?: CustomerAccountAPI.Maybe<{
    emailAddress?: CustomerAccountAPI.Maybe<
      Pick<CustomerAccountAPI.CustomerEmailAddress, 'marketingState'>
    >;
    userErrors: Array<
      Pick<
        CustomerAccountAPI.UserErrorsCustomerEmailMarketingUserErrors,
        'field' | 'message' | 'code'
      >
    >;
  }>;
};

export type OrderMoneyFragment = Pick<
  CustomerAccountAPI.MoneyV2,
  'amount' | 'currencyCode'
>;

export type OrderQueryVariables = CustomerAccountAPI.Exact<{
  orderId: CustomerAccountAPI.Scalars['ID']['input'];
  language?: CustomerAccountAPI.InputMaybe<CustomerAccountAPI.LanguageCode>;
}>;

export type OrderQuery = {
  order?: CustomerAccountAPI.Maybe<
    Pick<
      CustomerAccountAPI.Order,
      | 'id'
      | 'name'
      | 'processedAt'
      | 'statusPageUrl'
      | 'fulfillmentStatus'
      | 'financialStatus'
      | 'cancelledAt'
    > & {
      totalPrice: Pick<CustomerAccountAPI.MoneyV2, 'amount' | 'currencyCode'>;
      subtotal?: CustomerAccountAPI.Maybe<
        Pick<CustomerAccountAPI.MoneyV2, 'amount' | 'currencyCode'>
      >;
      totalShipping: Pick<
        CustomerAccountAPI.MoneyV2,
        'amount' | 'currencyCode'
      >;
      totalTax?: CustomerAccountAPI.Maybe<
        Pick<CustomerAccountAPI.MoneyV2, 'amount' | 'currencyCode'>
      >;
      shippingAddress?: CustomerAccountAPI.Maybe<
        Pick<CustomerAccountAPI.CustomerAddress, 'formatted'>
      >;
      shippingLine?: CustomerAccountAPI.Maybe<
        Pick<CustomerAccountAPI.ShippingLine, 'title'>
      >;
      fulfillments: {
        nodes: Array<
          Pick<
            CustomerAccountAPI.Fulfillment,
            | 'status'
            | 'latestShipmentStatus'
            | 'estimatedDeliveryAt'
            | 'createdAt'
          > & {
            trackingInformation: Array<
              Pick<
                CustomerAccountAPI.TrackingInformation,
                'company' | 'number' | 'url'
              >
            >;
          }
        >;
      };
      lineItems: {
        nodes: Array<
          Pick<
            CustomerAccountAPI.LineItem,
            'id' | 'title' | 'variantTitle' | 'quantity' | 'productType'
          > & {
            price?: CustomerAccountAPI.Maybe<
              Pick<CustomerAccountAPI.MoneyV2, 'amount' | 'currencyCode'>
            >;
            totalPrice?: CustomerAccountAPI.Maybe<
              Pick<CustomerAccountAPI.MoneyV2, 'amount' | 'currencyCode'>
            >;
          }
        >;
      };
    }
  >;
};

export type OrderItemFragment = Pick<
  CustomerAccountAPI.Order,
  | 'financialStatus'
  | 'fulfillmentStatus'
  | 'id'
  | 'name'
  | 'number'
  | 'cancelledAt'
  | 'confirmationNumber'
  | 'processedAt'
> & {
  totalPrice: Pick<CustomerAccountAPI.MoneyV2, 'amount' | 'currencyCode'>;
  fulfillments: {
    nodes: Array<
      Pick<
        CustomerAccountAPI.Fulfillment,
        'status' | 'latestShipmentStatus' | 'estimatedDeliveryAt'
      >
    >;
  };
  lineItems: {
    nodes: Array<
      Pick<
        CustomerAccountAPI.LineItem,
        'title' | 'quantity' | 'productType' | 'variantTitle'
      >
    >;
  };
};

export type CustomerOrdersFragment = {
  orders: {
    nodes: Array<
      Pick<
        CustomerAccountAPI.Order,
        | 'financialStatus'
        | 'fulfillmentStatus'
        | 'id'
        | 'name'
        | 'number'
        | 'cancelledAt'
        | 'confirmationNumber'
        | 'processedAt'
      > & {
        totalPrice: Pick<CustomerAccountAPI.MoneyV2, 'amount' | 'currencyCode'>;
        fulfillments: {
          nodes: Array<
            Pick<
              CustomerAccountAPI.Fulfillment,
              'status' | 'latestShipmentStatus' | 'estimatedDeliveryAt'
            >
          >;
        };
        lineItems: {
          nodes: Array<
            Pick<
              CustomerAccountAPI.LineItem,
              'title' | 'quantity' | 'productType' | 'variantTitle'
            >
          >;
        };
      }
    >;
    pageInfo: Pick<
      CustomerAccountAPI.PageInfo,
      'hasPreviousPage' | 'hasNextPage' | 'endCursor' | 'startCursor'
    >;
  };
};

export type CustomerOrdersQueryVariables = CustomerAccountAPI.Exact<{
  endCursor?: CustomerAccountAPI.InputMaybe<
    CustomerAccountAPI.Scalars['String']['input']
  >;
  first?: CustomerAccountAPI.InputMaybe<
    CustomerAccountAPI.Scalars['Int']['input']
  >;
  last?: CustomerAccountAPI.InputMaybe<
    CustomerAccountAPI.Scalars['Int']['input']
  >;
  startCursor?: CustomerAccountAPI.InputMaybe<
    CustomerAccountAPI.Scalars['String']['input']
  >;
  query?: CustomerAccountAPI.InputMaybe<
    CustomerAccountAPI.Scalars['String']['input']
  >;
  language?: CustomerAccountAPI.InputMaybe<CustomerAccountAPI.LanguageCode>;
}>;

export type CustomerOrdersQuery = {
  customer: {
    orders: {
      nodes: Array<
        Pick<
          CustomerAccountAPI.Order,
          | 'financialStatus'
          | 'fulfillmentStatus'
          | 'id'
          | 'name'
          | 'number'
          | 'cancelledAt'
          | 'confirmationNumber'
          | 'processedAt'
        > & {
          totalPrice: Pick<
            CustomerAccountAPI.MoneyV2,
            'amount' | 'currencyCode'
          >;
          fulfillments: {
            nodes: Array<
              Pick<
                CustomerAccountAPI.Fulfillment,
                'status' | 'latestShipmentStatus' | 'estimatedDeliveryAt'
              >
            >;
          };
          lineItems: {
            nodes: Array<
              Pick<
                CustomerAccountAPI.LineItem,
                'title' | 'quantity' | 'productType' | 'variantTitle'
              >
            >;
          };
        }
      >;
      pageInfo: Pick<
        CustomerAccountAPI.PageInfo,
        'hasPreviousPage' | 'hasNextPage' | 'endCursor' | 'startCursor'
      >;
    };
  };
};

export type RequestReturnMutationVariables = CustomerAccountAPI.Exact<{
  orderId: CustomerAccountAPI.Scalars['ID']['input'];
  requestedLineItems:
    | Array<CustomerAccountAPI.RequestedLineItemInput>
    | CustomerAccountAPI.RequestedLineItemInput;
}>;

export type RequestReturnMutation = {
  orderRequestReturn?: CustomerAccountAPI.Maybe<{
    return?: CustomerAccountAPI.Maybe<
      Pick<CustomerAccountAPI.Return, 'id' | 'name' | 'status'>
    >;
    userErrors: Array<
      Pick<CustomerAccountAPI.ReturnUserError, 'field' | 'message' | 'code'>
    >;
  }>;
};

export type CustomerUpdateMutationVariables = CustomerAccountAPI.Exact<{
  customer: CustomerAccountAPI.CustomerUpdateInput;
  language?: CustomerAccountAPI.InputMaybe<CustomerAccountAPI.LanguageCode>;
}>;

export type CustomerUpdateMutation = {
  customerUpdate?: CustomerAccountAPI.Maybe<{
    customer?: CustomerAccountAPI.Maybe<
      Pick<CustomerAccountAPI.Customer, 'firstName' | 'lastName'> & {
        emailAddress?: CustomerAccountAPI.Maybe<
          Pick<CustomerAccountAPI.CustomerEmailAddress, 'emailAddress'>
        >;
        phoneNumber?: CustomerAccountAPI.Maybe<
          Pick<CustomerAccountAPI.CustomerPhoneNumber, 'phoneNumber'>
        >;
      }
    >;
    userErrors: Array<
      Pick<
        CustomerAccountAPI.UserErrorsCustomerUserErrors,
        'code' | 'field' | 'message'
      >
    >;
  }>;
};

interface GeneratedQueryTypes {
  '#graphql\n  query CustomerDetails($language: LanguageCode) @inContext(language: $language) {\n    customer {\n      ...Customer\n    }\n  }\n  #graphql\n  fragment Customer on Customer {\n    id\n    firstName\n    lastName\n    emailAddress {\n      emailAddress\n      marketingState\n    }\n    phoneNumber {\n      phoneNumber\n    }\n    defaultAddress {\n      ...Address\n    }\n    addresses(first: 6) {\n      nodes {\n        ...Address\n      }\n    }\n  }\n  fragment Address on CustomerAddress {\n    id\n    formatted\n    firstName\n    lastName\n    company\n    address1\n    address2\n    territoryCode\n    zoneCode\n    city\n    zip\n    phoneNumber\n  }\n\n': {
    return: CustomerDetailsQuery;
    variables: CustomerDetailsQueryVariables;
  };
  '#graphql\n  query HeaderCustomer {\n    customer {\n      firstName\n      lastName\n      emailAddress {\n        emailAddress\n      }\n    }\n  }\n': {
    return: HeaderCustomerQuery;
    variables: HeaderCustomerQueryVariables;
  };
  '#graphql\n  fragment OrderMoney on MoneyV2 {\n    amount\n    currencyCode\n  }\n  query Order($orderId: ID!, $language: LanguageCode) @inContext(language: $language) {\n    order(id: $orderId) {\n      id\n      name\n      processedAt\n      statusPageUrl\n      fulfillmentStatus\n      financialStatus\n      cancelledAt\n      totalPrice {\n        ...OrderMoney\n      }\n      subtotal {\n        ...OrderMoney\n      }\n      totalShipping {\n        ...OrderMoney\n      }\n      totalTax {\n        ...OrderMoney\n      }\n      shippingAddress {\n        formatted(withName: true)\n      }\n      shippingLine {\n        title\n      }\n      fulfillments(first: 5) {\n        nodes {\n          status\n          latestShipmentStatus\n          estimatedDeliveryAt\n          createdAt\n          trackingInformation {\n            company\n            number\n            url\n          }\n        }\n      }\n      lineItems(first: 50) {\n        nodes {\n          id\n          title\n          variantTitle\n          quantity\n          productType\n          price {\n            ...OrderMoney\n          }\n          totalPrice {\n            ...OrderMoney\n          }\n        }\n      }\n    }\n  }\n': {
    return: OrderQuery;
    variables: OrderQueryVariables;
  };
  '#graphql\n  #graphql\n  fragment CustomerOrders on Customer {\n    orders(\n      sortKey: PROCESSED_AT,\n      reverse: true,\n      first: $first,\n      last: $last,\n      before: $startCursor,\n      after: $endCursor,\n      query: $query\n    ) {\n      nodes {\n        ...OrderItem\n      }\n      pageInfo {\n        hasPreviousPage\n        hasNextPage\n        endCursor\n        startCursor\n      }\n    }\n  }\n  #graphql\n  fragment OrderItem on Order {\n    totalPrice {\n      amount\n      currencyCode\n    }\n    financialStatus\n    fulfillmentStatus\n    fulfillments(first: 1) {\n      nodes {\n        status\n        latestShipmentStatus\n        estimatedDeliveryAt\n      }\n    }\n    lineItems(first: 6) {\n      nodes {\n        title\n        quantity\n        productType\n        variantTitle\n      }\n    }\n    id\n    name\n    number\n    cancelledAt\n    confirmationNumber\n    processedAt\n  }\n\n\n  query CustomerOrders(\n    $endCursor: String\n    $first: Int\n    $last: Int\n    $startCursor: String\n    $query: String\n    $language: LanguageCode\n  ) @inContext(language: $language) {\n    customer {\n      ...CustomerOrders\n    }\n  }\n': {
    return: CustomerOrdersQuery;
    variables: CustomerOrdersQueryVariables;
  };
}

interface GeneratedMutationTypes {
  '#graphql\n  mutation customerAddressUpdate(\n    $address: CustomerAddressInput!\n    $addressId: ID!\n    $defaultAddress: Boolean\n    $language: LanguageCode\n ) @inContext(language: $language) {\n    customerAddressUpdate(\n      address: $address\n      addressId: $addressId\n      defaultAddress: $defaultAddress\n    ) {\n      customerAddress {\n        id\n      }\n      userErrors {\n        code\n        field\n        message\n      }\n    }\n  }\n': {
    return: CustomerAddressUpdateMutation;
    variables: CustomerAddressUpdateMutationVariables;
  };
  '#graphql\n  mutation customerAddressDelete(\n    $addressId: ID!\n    $language: LanguageCode\n  ) @inContext(language: $language) {\n    customerAddressDelete(addressId: $addressId) {\n      deletedAddressId\n      userErrors {\n        code\n        field\n        message\n      }\n    }\n  }\n': {
    return: CustomerAddressDeleteMutation;
    variables: CustomerAddressDeleteMutationVariables;
  };
  '#graphql\n  mutation customerAddressCreate(\n    $address: CustomerAddressInput!\n    $defaultAddress: Boolean\n    $language: LanguageCode\n  ) @inContext(language: $language) {\n    customerAddressCreate(\n      address: $address\n      defaultAddress: $defaultAddress\n    ) {\n      customerAddress {\n        id\n      }\n      userErrors {\n        code\n        field\n        message\n      }\n    }\n  }\n': {
    return: CustomerAddressCreateMutation;
    variables: CustomerAddressCreateMutationVariables;
  };
  '#graphql\n  mutation MarketingOptIn {\n    customerEmailMarketingSubscribe {\n      emailAddress {\n        marketingState\n      }\n      userErrors {\n        field\n        message\n        code\n      }\n    }\n  }\n': {
    return: MarketingOptInMutation;
    variables: MarketingOptInMutationVariables;
  };
  '#graphql\n  mutation MarketingOptOut {\n    customerEmailMarketingUnsubscribe {\n      emailAddress {\n        marketingState\n      }\n      userErrors {\n        field\n        message\n        code\n      }\n    }\n  }\n': {
    return: MarketingOptOutMutation;
    variables: MarketingOptOutMutationVariables;
  };
  '#graphql\n  mutation RequestReturn($orderId: ID!, $requestedLineItems: [RequestedLineItemInput!]!) {\n    orderRequestReturn(orderId: $orderId, requestedLineItems: $requestedLineItems) {\n      return {\n        id\n        name\n        status\n      }\n      userErrors {\n        field\n        message\n        code\n      }\n    }\n  }\n': {
    return: RequestReturnMutation;
    variables: RequestReturnMutationVariables;
  };
  '#graphql\n  mutation customerUpdate(\n    $customer: CustomerUpdateInput!\n    $language: LanguageCode\n  ) @inContext(language: $language) {\n    customerUpdate(input: $customer) {\n      customer {\n        firstName\n        lastName\n        emailAddress {\n          emailAddress\n        }\n        phoneNumber {\n          phoneNumber\n        }\n      }\n      userErrors {\n        code\n        field\n        message\n      }\n    }\n  }\n': {
    return: CustomerUpdateMutation;
    variables: CustomerUpdateMutationVariables;
  };
}

declare module '@shopify/hydrogen' {
  interface CustomerAccountQueries extends GeneratedQueryTypes {}
  interface CustomerAccountMutations extends GeneratedMutationTypes {}
}
