// NOTE: https://shopify.dev/docs/api/customer/latest/queries/order
export const CUSTOMER_ORDER_QUERY = `#graphql
  fragment OrderMoney on MoneyV2 {
    amount
    currencyCode
  }
  query Order($orderId: ID!, $language: LanguageCode) @inContext(language: $language) {
    order(id: $orderId) {
      id
      name
      processedAt
      statusPageUrl
      fulfillmentStatus
      financialStatus
      cancelledAt
      totalPrice {
        ...OrderMoney
      }
      subtotal {
        ...OrderMoney
      }
      totalShipping {
        ...OrderMoney
      }
      totalTax {
        ...OrderMoney
      }
      shippingAddress {
        formatted(withName: true)
      }
      shippingLine {
        title
      }
      fulfillments(first: 5) {
        nodes {
          status
          latestShipmentStatus
          estimatedDeliveryAt
          createdAt
          trackingInformation {
            company
            number
            url
          }
        }
      }
      lineItems(first: 50) {
        nodes {
          id
          title
          variantTitle
          quantity
          productType
          price {
            ...OrderMoney
          }
          totalPrice {
            ...OrderMoney
          }
        }
      }
    }
  }
` as const;
