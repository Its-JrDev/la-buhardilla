// La «carta de luna llena» para clientes con sesión.
export const CUSTOMER_MARKETING_SUBSCRIBE = `#graphql
  mutation MarketingOptIn {
    customerEmailMarketingSubscribe {
      emailAddress {
        marketingState
      }
      userErrors {
        field
        message
        code
      }
    }
  }
` as const;

export const CUSTOMER_MARKETING_UNSUBSCRIBE = `#graphql
  mutation MarketingOptOut {
    customerEmailMarketingUnsubscribe {
      emailAddress {
        marketingState
      }
      userErrors {
        field
        message
        code
      }
    }
  }
` as const;
