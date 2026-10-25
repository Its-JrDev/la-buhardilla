// NOTE: https://shopify.dev/docs/api/customer/2026-04/mutations/orderRequestReturn
export const CUSTOMER_REQUEST_RETURN = `#graphql
  mutation RequestReturn($orderId: ID!, $requestedLineItems: [RequestedLineItemInput!]!) {
    orderRequestReturn(orderId: $orderId, requestedLineItems: $requestedLineItems) {
      return {
        id
        name
        status
      }
      userErrors {
        field
        message
        code
      }
    }
  }
` as const;
