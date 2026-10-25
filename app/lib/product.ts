import {BOOK_CARD_FRAGMENT} from '~/lib/book';

export const PRODUCT_VARIANT_FRAGMENT = `#graphql
  fragment ProductVariant on ProductVariant {
    id
    title
    availableForSale
    price {
      amount
      currencyCode
    }
    compareAtPrice {
      amount
      currencyCode
    }
    selectedOptions {
      name
      value
    }
  }
` as const;

export const PRODUCT_QUERY = `#graphql
  query Product(
    $country: CountryCode
    $handle: String!
    $language: LanguageCode
    $selectedOptions: [SelectedOptionInput!]!
  ) @inContext(country: $country, language: $language) {
    product(handle: $handle) {
      id
      title
      vendor
      handle
      productType
      description
      tags
      options {
        name
        optionValues {
          name
        }
      }
      selectedOrFirstAvailableVariant(selectedOptions: $selectedOptions, ignoreUnknownOptions: true, caseInsensitiveMatch: true) {
        ...ProductVariant
      }
      variants(first: 12) {
        nodes {
          ...ProductVariant
        }
      }
      collections(first: 3) {
        nodes {
          handle
          title
        }
      }
      seo {
        description
        title
      }
      publisher: metafield(namespace: "custom", key: "publisher") { value }
      year: metafield(namespace: "custom", key: "year") { value }
      condition: metafield(namespace: "custom", key: "condition") { value }
      chill: metafield(namespace: "custom", key: "chill") { value }
      subgenre: metafield(namespace: "custom", key: "subgenre") { value }
      synopsis: metafield(namespace: "custom", key: "synopsis") { value }
      quote: metafield(namespace: "custom", key: "quote") { value }
      pages: metafield(namespace: "custom", key: "pages") { value }
      isbn: metafield(namespace: "custom", key: "isbn") { value }
      translator: metafield(namespace: "custom", key: "translator") { value }
      coverBg: metafield(namespace: "custom", key: "cover_bg") { value }
      coverInk: metafield(namespace: "custom", key: "cover_ink") { value }
    }
  }
  ${PRODUCT_VARIANT_FRAGMENT}
` as const;

export const RECOMMENDATIONS_QUERY = `#graphql
  query BookRecommendations($productId: ID!, $country: CountryCode, $language: LanguageCode)
  @inContext(country: $country, language: $language) {
    productRecommendations(productId: $productId) {
      ...BookCard
    }
  }
  ${BOOK_CARD_FRAGMENT}
` as const;
