// Nombre e iniciales para el avatar del header y el menú de cuenta.
export const CUSTOMER_HEADER_QUERY = `#graphql
  query HeaderCustomer {
    customer {
      firstName
      lastName
      emailAddress {
        emailAddress
      }
    }
  }
` as const;
