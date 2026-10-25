/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable eslint-comments/no-unlimited-disable */
/* eslint-disable */
import type * as StorefrontAPI from '@shopify/hydrogen/storefront-api-types';

export type BookCardFragment = Pick<
  StorefrontAPI.Product,
  'id' | 'handle' | 'title' | 'vendor' | 'tags' | 'availableForSale'
> & {
  publisher?: StorefrontAPI.Maybe<Pick<StorefrontAPI.Metafield, 'value'>>;
  year?: StorefrontAPI.Maybe<Pick<StorefrontAPI.Metafield, 'value'>>;
  condition?: StorefrontAPI.Maybe<Pick<StorefrontAPI.Metafield, 'value'>>;
  chill?: StorefrontAPI.Maybe<Pick<StorefrontAPI.Metafield, 'value'>>;
  subgenre?: StorefrontAPI.Maybe<Pick<StorefrontAPI.Metafield, 'value'>>;
  coverBg?: StorefrontAPI.Maybe<Pick<StorefrontAPI.Metafield, 'value'>>;
  coverInk?: StorefrontAPI.Maybe<Pick<StorefrontAPI.Metafield, 'value'>>;
  priceRange: {
    minVariantPrice: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>;
  };
  compareAtPriceRange: {
    minVariantPrice: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>;
  };
  featuredImage?: StorefrontAPI.Maybe<
    Pick<StorefrontAPI.Image, 'id' | 'url' | 'altText' | 'width' | 'height'>
  >;
  variants: {
    nodes: Array<
      Pick<
        StorefrontAPI.ProductVariant,
        'id' | 'title' | 'availableForSale'
      > & {
        price: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>;
        compareAtPrice?: StorefrontAPI.Maybe<
          Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>
        >;
        selectedOptions: Array<
          Pick<StorefrontAPI.SelectedOption, 'name' | 'value'>
        >;
      }
    >;
  };
};

export type MoneyFragment = Pick<
  StorefrontAPI.MoneyV2,
  'currencyCode' | 'amount'
>;

export type CartLineFragment = Pick<
  StorefrontAPI.CartLine,
  'id' | 'quantity'
> & {
  attributes: Array<Pick<StorefrontAPI.Attribute, 'key' | 'value'>>;
  cost: {
    totalAmount: Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>;
    amountPerQuantity: Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>;
    compareAtAmountPerQuantity?: StorefrontAPI.Maybe<
      Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>
    >;
  };
  merchandise: Pick<
    StorefrontAPI.ProductVariant,
    'id' | 'availableForSale' | 'requiresShipping' | 'title'
  > & {
    compareAtPrice?: StorefrontAPI.Maybe<
      Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>
    >;
    price: Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>;
    image?: StorefrontAPI.Maybe<
      Pick<StorefrontAPI.Image, 'id' | 'url' | 'altText' | 'width' | 'height'>
    >;
    product: Pick<
      StorefrontAPI.Product,
      'handle' | 'title' | 'id' | 'vendor' | 'productType'
    > & {
      coverBg?: StorefrontAPI.Maybe<Pick<StorefrontAPI.Metafield, 'value'>>;
      coverInk?: StorefrontAPI.Maybe<Pick<StorefrontAPI.Metafield, 'value'>>;
    };
    selectedOptions: Array<
      Pick<StorefrontAPI.SelectedOption, 'name' | 'value'>
    >;
  };
  parentRelationship?: StorefrontAPI.Maybe<{
    parent: Pick<StorefrontAPI.CartLine, 'id'>;
  }>;
};

export type CartLineComponentFragment = Pick<
  StorefrontAPI.ComponentizableCartLine,
  'id' | 'quantity'
> & {
  attributes: Array<Pick<StorefrontAPI.Attribute, 'key' | 'value'>>;
  cost: {
    totalAmount: Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>;
    amountPerQuantity: Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>;
    compareAtAmountPerQuantity?: StorefrontAPI.Maybe<
      Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>
    >;
  };
  merchandise: Pick<
    StorefrontAPI.ProductVariant,
    'id' | 'availableForSale' | 'requiresShipping' | 'title'
  > & {
    compareAtPrice?: StorefrontAPI.Maybe<
      Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>
    >;
    price: Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>;
    image?: StorefrontAPI.Maybe<
      Pick<StorefrontAPI.Image, 'id' | 'url' | 'altText' | 'width' | 'height'>
    >;
    product: Pick<
      StorefrontAPI.Product,
      'handle' | 'title' | 'id' | 'vendor' | 'productType'
    > & {
      coverBg?: StorefrontAPI.Maybe<Pick<StorefrontAPI.Metafield, 'value'>>;
      coverInk?: StorefrontAPI.Maybe<Pick<StorefrontAPI.Metafield, 'value'>>;
    };
    selectedOptions: Array<
      Pick<StorefrontAPI.SelectedOption, 'name' | 'value'>
    >;
  };
  lineComponents: Array<
    Pick<StorefrontAPI.CartLine, 'id' | 'quantity'> & {
      attributes: Array<Pick<StorefrontAPI.Attribute, 'key' | 'value'>>;
      cost: {
        totalAmount: Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>;
        amountPerQuantity: Pick<
          StorefrontAPI.MoneyV2,
          'currencyCode' | 'amount'
        >;
        compareAtAmountPerQuantity?: StorefrontAPI.Maybe<
          Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>
        >;
      };
      merchandise: Pick<
        StorefrontAPI.ProductVariant,
        'id' | 'availableForSale' | 'requiresShipping' | 'title'
      > & {
        compareAtPrice?: StorefrontAPI.Maybe<
          Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>
        >;
        price: Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>;
        image?: StorefrontAPI.Maybe<
          Pick<
            StorefrontAPI.Image,
            'id' | 'url' | 'altText' | 'width' | 'height'
          >
        >;
        product: Pick<
          StorefrontAPI.Product,
          'handle' | 'title' | 'id' | 'vendor' | 'productType'
        > & {
          coverBg?: StorefrontAPI.Maybe<Pick<StorefrontAPI.Metafield, 'value'>>;
          coverInk?: StorefrontAPI.Maybe<
            Pick<StorefrontAPI.Metafield, 'value'>
          >;
        };
        selectedOptions: Array<
          Pick<StorefrontAPI.SelectedOption, 'name' | 'value'>
        >;
      };
      parentRelationship?: StorefrontAPI.Maybe<{
        parent: Pick<StorefrontAPI.CartLine, 'id'>;
      }>;
    }
  >;
};

export type CartApiQueryFragment = Pick<
  StorefrontAPI.Cart,
  'updatedAt' | 'id' | 'checkoutUrl' | 'totalQuantity' | 'note'
> & {
  appliedGiftCards: Array<
    Pick<StorefrontAPI.AppliedGiftCard, 'id' | 'lastCharacters'> & {
      amountUsed: Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>;
    }
  >;
  buyerIdentity: Pick<
    StorefrontAPI.CartBuyerIdentity,
    'countryCode' | 'email' | 'phone'
  > & {
    customer?: StorefrontAPI.Maybe<
      Pick<
        StorefrontAPI.Customer,
        'id' | 'email' | 'firstName' | 'lastName' | 'displayName'
      >
    >;
  };
  lines: {
    nodes: Array<
      | (Pick<StorefrontAPI.CartLine, 'id' | 'quantity'> & {
          attributes: Array<Pick<StorefrontAPI.Attribute, 'key' | 'value'>>;
          cost: {
            totalAmount: Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>;
            amountPerQuantity: Pick<
              StorefrontAPI.MoneyV2,
              'currencyCode' | 'amount'
            >;
            compareAtAmountPerQuantity?: StorefrontAPI.Maybe<
              Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>
            >;
          };
          merchandise: Pick<
            StorefrontAPI.ProductVariant,
            'id' | 'availableForSale' | 'requiresShipping' | 'title'
          > & {
            compareAtPrice?: StorefrontAPI.Maybe<
              Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>
            >;
            price: Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>;
            image?: StorefrontAPI.Maybe<
              Pick<
                StorefrontAPI.Image,
                'id' | 'url' | 'altText' | 'width' | 'height'
              >
            >;
            product: Pick<
              StorefrontAPI.Product,
              'handle' | 'title' | 'id' | 'vendor' | 'productType'
            > & {
              coverBg?: StorefrontAPI.Maybe<
                Pick<StorefrontAPI.Metafield, 'value'>
              >;
              coverInk?: StorefrontAPI.Maybe<
                Pick<StorefrontAPI.Metafield, 'value'>
              >;
            };
            selectedOptions: Array<
              Pick<StorefrontAPI.SelectedOption, 'name' | 'value'>
            >;
          };
          parentRelationship?: StorefrontAPI.Maybe<{
            parent: Pick<StorefrontAPI.CartLine, 'id'>;
          }>;
        })
      | (Pick<StorefrontAPI.ComponentizableCartLine, 'id' | 'quantity'> & {
          attributes: Array<Pick<StorefrontAPI.Attribute, 'key' | 'value'>>;
          cost: {
            totalAmount: Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>;
            amountPerQuantity: Pick<
              StorefrontAPI.MoneyV2,
              'currencyCode' | 'amount'
            >;
            compareAtAmountPerQuantity?: StorefrontAPI.Maybe<
              Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>
            >;
          };
          merchandise: Pick<
            StorefrontAPI.ProductVariant,
            'id' | 'availableForSale' | 'requiresShipping' | 'title'
          > & {
            compareAtPrice?: StorefrontAPI.Maybe<
              Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>
            >;
            price: Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>;
            image?: StorefrontAPI.Maybe<
              Pick<
                StorefrontAPI.Image,
                'id' | 'url' | 'altText' | 'width' | 'height'
              >
            >;
            product: Pick<
              StorefrontAPI.Product,
              'handle' | 'title' | 'id' | 'vendor' | 'productType'
            > & {
              coverBg?: StorefrontAPI.Maybe<
                Pick<StorefrontAPI.Metafield, 'value'>
              >;
              coverInk?: StorefrontAPI.Maybe<
                Pick<StorefrontAPI.Metafield, 'value'>
              >;
            };
            selectedOptions: Array<
              Pick<StorefrontAPI.SelectedOption, 'name' | 'value'>
            >;
          };
          lineComponents: Array<
            Pick<StorefrontAPI.CartLine, 'id' | 'quantity'> & {
              attributes: Array<Pick<StorefrontAPI.Attribute, 'key' | 'value'>>;
              cost: {
                totalAmount: Pick<
                  StorefrontAPI.MoneyV2,
                  'currencyCode' | 'amount'
                >;
                amountPerQuantity: Pick<
                  StorefrontAPI.MoneyV2,
                  'currencyCode' | 'amount'
                >;
                compareAtAmountPerQuantity?: StorefrontAPI.Maybe<
                  Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>
                >;
              };
              merchandise: Pick<
                StorefrontAPI.ProductVariant,
                'id' | 'availableForSale' | 'requiresShipping' | 'title'
              > & {
                compareAtPrice?: StorefrontAPI.Maybe<
                  Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>
                >;
                price: Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>;
                image?: StorefrontAPI.Maybe<
                  Pick<
                    StorefrontAPI.Image,
                    'id' | 'url' | 'altText' | 'width' | 'height'
                  >
                >;
                product: Pick<
                  StorefrontAPI.Product,
                  'handle' | 'title' | 'id' | 'vendor' | 'productType'
                > & {
                  coverBg?: StorefrontAPI.Maybe<
                    Pick<StorefrontAPI.Metafield, 'value'>
                  >;
                  coverInk?: StorefrontAPI.Maybe<
                    Pick<StorefrontAPI.Metafield, 'value'>
                  >;
                };
                selectedOptions: Array<
                  Pick<StorefrontAPI.SelectedOption, 'name' | 'value'>
                >;
              };
              parentRelationship?: StorefrontAPI.Maybe<{
                parent: Pick<StorefrontAPI.CartLine, 'id'>;
              }>;
            }
          >;
        })
    >;
  };
  cost: {
    subtotalAmount: Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>;
    totalAmount: Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>;
    totalDutyAmount?: StorefrontAPI.Maybe<
      Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>
    >;
    totalTaxAmount?: StorefrontAPI.Maybe<
      Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>
    >;
  };
  attributes: Array<Pick<StorefrontAPI.Attribute, 'key' | 'value'>>;
  discountCodes: Array<
    Pick<StorefrontAPI.CartDiscountCode, 'code' | 'applicable'>
  >;
};

export type ProductVariantFragment = Pick<
  StorefrontAPI.ProductVariant,
  'id' | 'title' | 'availableForSale'
> & {
  price: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>;
  compareAtPrice?: StorefrontAPI.Maybe<
    Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>
  >;
  selectedOptions: Array<Pick<StorefrontAPI.SelectedOption, 'name' | 'value'>>;
};

export type ProductQueryVariables = StorefrontAPI.Exact<{
  country?: StorefrontAPI.InputMaybe<StorefrontAPI.CountryCode>;
  handle: StorefrontAPI.Scalars['String']['input'];
  language?: StorefrontAPI.InputMaybe<StorefrontAPI.LanguageCode>;
  selectedOptions:
    | Array<StorefrontAPI.SelectedOptionInput>
    | StorefrontAPI.SelectedOptionInput;
}>;

export type ProductQuery = {
  product?: StorefrontAPI.Maybe<
    Pick<
      StorefrontAPI.Product,
      | 'id'
      | 'title'
      | 'vendor'
      | 'handle'
      | 'productType'
      | 'description'
      | 'tags'
    > & {
      options: Array<
        Pick<StorefrontAPI.ProductOption, 'name'> & {
          optionValues: Array<Pick<StorefrontAPI.ProductOptionValue, 'name'>>;
        }
      >;
      selectedOrFirstAvailableVariant?: StorefrontAPI.Maybe<
        Pick<
          StorefrontAPI.ProductVariant,
          'id' | 'title' | 'availableForSale'
        > & {
          price: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>;
          compareAtPrice?: StorefrontAPI.Maybe<
            Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>
          >;
          selectedOptions: Array<
            Pick<StorefrontAPI.SelectedOption, 'name' | 'value'>
          >;
        }
      >;
      variants: {
        nodes: Array<
          Pick<
            StorefrontAPI.ProductVariant,
            'id' | 'title' | 'availableForSale'
          > & {
            price: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>;
            compareAtPrice?: StorefrontAPI.Maybe<
              Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>
            >;
            selectedOptions: Array<
              Pick<StorefrontAPI.SelectedOption, 'name' | 'value'>
            >;
          }
        >;
      };
      collections: {
        nodes: Array<Pick<StorefrontAPI.Collection, 'handle' | 'title'>>;
      };
      seo: Pick<StorefrontAPI.Seo, 'description' | 'title'>;
      publisher?: StorefrontAPI.Maybe<Pick<StorefrontAPI.Metafield, 'value'>>;
      year?: StorefrontAPI.Maybe<Pick<StorefrontAPI.Metafield, 'value'>>;
      condition?: StorefrontAPI.Maybe<Pick<StorefrontAPI.Metafield, 'value'>>;
      chill?: StorefrontAPI.Maybe<Pick<StorefrontAPI.Metafield, 'value'>>;
      subgenre?: StorefrontAPI.Maybe<Pick<StorefrontAPI.Metafield, 'value'>>;
      synopsis?: StorefrontAPI.Maybe<Pick<StorefrontAPI.Metafield, 'value'>>;
      quote?: StorefrontAPI.Maybe<Pick<StorefrontAPI.Metafield, 'value'>>;
      pages?: StorefrontAPI.Maybe<Pick<StorefrontAPI.Metafield, 'value'>>;
      isbn?: StorefrontAPI.Maybe<Pick<StorefrontAPI.Metafield, 'value'>>;
      translator?: StorefrontAPI.Maybe<Pick<StorefrontAPI.Metafield, 'value'>>;
      coverBg?: StorefrontAPI.Maybe<Pick<StorefrontAPI.Metafield, 'value'>>;
      coverInk?: StorefrontAPI.Maybe<Pick<StorefrontAPI.Metafield, 'value'>>;
    }
  >;
};

export type BookRecommendationsQueryVariables = StorefrontAPI.Exact<{
  productId: StorefrontAPI.Scalars['ID']['input'];
  country?: StorefrontAPI.InputMaybe<StorefrontAPI.CountryCode>;
  language?: StorefrontAPI.InputMaybe<StorefrontAPI.LanguageCode>;
}>;

export type BookRecommendationsQuery = {
  productRecommendations?: StorefrontAPI.Maybe<
    Array<
      Pick<
        StorefrontAPI.Product,
        'id' | 'handle' | 'title' | 'vendor' | 'tags' | 'availableForSale'
      > & {
        publisher?: StorefrontAPI.Maybe<Pick<StorefrontAPI.Metafield, 'value'>>;
        year?: StorefrontAPI.Maybe<Pick<StorefrontAPI.Metafield, 'value'>>;
        condition?: StorefrontAPI.Maybe<Pick<StorefrontAPI.Metafield, 'value'>>;
        chill?: StorefrontAPI.Maybe<Pick<StorefrontAPI.Metafield, 'value'>>;
        subgenre?: StorefrontAPI.Maybe<Pick<StorefrontAPI.Metafield, 'value'>>;
        coverBg?: StorefrontAPI.Maybe<Pick<StorefrontAPI.Metafield, 'value'>>;
        coverInk?: StorefrontAPI.Maybe<Pick<StorefrontAPI.Metafield, 'value'>>;
        priceRange: {
          minVariantPrice: Pick<
            StorefrontAPI.MoneyV2,
            'amount' | 'currencyCode'
          >;
        };
        compareAtPriceRange: {
          minVariantPrice: Pick<
            StorefrontAPI.MoneyV2,
            'amount' | 'currencyCode'
          >;
        };
        featuredImage?: StorefrontAPI.Maybe<
          Pick<
            StorefrontAPI.Image,
            'id' | 'url' | 'altText' | 'width' | 'height'
          >
        >;
        variants: {
          nodes: Array<
            Pick<
              StorefrontAPI.ProductVariant,
              'id' | 'title' | 'availableForSale'
            > & {
              price: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>;
              compareAtPrice?: StorefrontAPI.Maybe<
                Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>
              >;
              selectedOptions: Array<
                Pick<StorefrontAPI.SelectedOption, 'name' | 'value'>
              >;
            }
          >;
        };
      }
    >
  >;
};

export type HomeNovedadesQueryVariables = StorefrontAPI.Exact<{
  country?: StorefrontAPI.InputMaybe<StorefrontAPI.CountryCode>;
  language?: StorefrontAPI.InputMaybe<StorefrontAPI.LanguageCode>;
}>;

export type HomeNovedadesQuery = {
  collection?: StorefrontAPI.Maybe<{
    products: {
      nodes: Array<
        Pick<
          StorefrontAPI.Product,
          'id' | 'handle' | 'title' | 'vendor' | 'tags' | 'availableForSale'
        > & {
          publisher?: StorefrontAPI.Maybe<
            Pick<StorefrontAPI.Metafield, 'value'>
          >;
          year?: StorefrontAPI.Maybe<Pick<StorefrontAPI.Metafield, 'value'>>;
          condition?: StorefrontAPI.Maybe<
            Pick<StorefrontAPI.Metafield, 'value'>
          >;
          chill?: StorefrontAPI.Maybe<Pick<StorefrontAPI.Metafield, 'value'>>;
          subgenre?: StorefrontAPI.Maybe<
            Pick<StorefrontAPI.Metafield, 'value'>
          >;
          coverBg?: StorefrontAPI.Maybe<Pick<StorefrontAPI.Metafield, 'value'>>;
          coverInk?: StorefrontAPI.Maybe<
            Pick<StorefrontAPI.Metafield, 'value'>
          >;
          priceRange: {
            minVariantPrice: Pick<
              StorefrontAPI.MoneyV2,
              'amount' | 'currencyCode'
            >;
          };
          compareAtPriceRange: {
            minVariantPrice: Pick<
              StorefrontAPI.MoneyV2,
              'amount' | 'currencyCode'
            >;
          };
          featuredImage?: StorefrontAPI.Maybe<
            Pick<
              StorefrontAPI.Image,
              'id' | 'url' | 'altText' | 'width' | 'height'
            >
          >;
          variants: {
            nodes: Array<
              Pick<
                StorefrontAPI.ProductVariant,
                'id' | 'title' | 'availableForSale'
              > & {
                price: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>;
                compareAtPrice?: StorefrontAPI.Maybe<
                  Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>
                >;
                selectedOptions: Array<
                  Pick<StorefrontAPI.SelectedOption, 'name' | 'value'>
                >;
              }
            >;
          };
        }
      >;
    };
  }>;
};

export type ArticleQueryVariables = StorefrontAPI.Exact<{
  articleHandle: StorefrontAPI.Scalars['String']['input'];
  blogHandle: StorefrontAPI.Scalars['String']['input'];
  country?: StorefrontAPI.InputMaybe<StorefrontAPI.CountryCode>;
  language?: StorefrontAPI.InputMaybe<StorefrontAPI.LanguageCode>;
}>;

export type ArticleQuery = {
  blog?: StorefrontAPI.Maybe<
    Pick<StorefrontAPI.Blog, 'handle'> & {
      articleByHandle?: StorefrontAPI.Maybe<
        Pick<
          StorefrontAPI.Article,
          'handle' | 'title' | 'contentHtml' | 'publishedAt'
        > & {
          author?: StorefrontAPI.Maybe<
            Pick<StorefrontAPI.ArticleAuthor, 'name'>
          >;
          image?: StorefrontAPI.Maybe<
            Pick<
              StorefrontAPI.Image,
              'id' | 'altText' | 'url' | 'width' | 'height'
            >
          >;
          seo?: StorefrontAPI.Maybe<
            Pick<StorefrontAPI.Seo, 'description' | 'title'>
          >;
        }
      >;
    }
  >;
};

export type BlogQueryVariables = StorefrontAPI.Exact<{
  language?: StorefrontAPI.InputMaybe<StorefrontAPI.LanguageCode>;
  blogHandle: StorefrontAPI.Scalars['String']['input'];
  first?: StorefrontAPI.InputMaybe<StorefrontAPI.Scalars['Int']['input']>;
  last?: StorefrontAPI.InputMaybe<StorefrontAPI.Scalars['Int']['input']>;
  startCursor?: StorefrontAPI.InputMaybe<
    StorefrontAPI.Scalars['String']['input']
  >;
  endCursor?: StorefrontAPI.InputMaybe<
    StorefrontAPI.Scalars['String']['input']
  >;
}>;

export type BlogQuery = {
  blog?: StorefrontAPI.Maybe<
    Pick<StorefrontAPI.Blog, 'title' | 'handle'> & {
      seo?: StorefrontAPI.Maybe<
        Pick<StorefrontAPI.Seo, 'title' | 'description'>
      >;
      articles: {
        nodes: Array<
          Pick<
            StorefrontAPI.Article,
            'contentHtml' | 'handle' | 'id' | 'publishedAt' | 'title'
          > & {
            author?: StorefrontAPI.Maybe<
              Pick<StorefrontAPI.ArticleAuthor, 'name'>
            >;
            image?: StorefrontAPI.Maybe<
              Pick<
                StorefrontAPI.Image,
                'id' | 'altText' | 'url' | 'width' | 'height'
              >
            >;
            blog: Pick<StorefrontAPI.Blog, 'handle'>;
          }
        >;
        pageInfo: Pick<
          StorefrontAPI.PageInfo,
          'hasPreviousPage' | 'hasNextPage' | 'endCursor' | 'startCursor'
        >;
      };
    }
  >;
};

export type ArticleItemFragment = Pick<
  StorefrontAPI.Article,
  'contentHtml' | 'handle' | 'id' | 'publishedAt' | 'title'
> & {
  author?: StorefrontAPI.Maybe<Pick<StorefrontAPI.ArticleAuthor, 'name'>>;
  image?: StorefrontAPI.Maybe<
    Pick<StorefrontAPI.Image, 'id' | 'altText' | 'url' | 'width' | 'height'>
  >;
  blog: Pick<StorefrontAPI.Blog, 'handle'>;
};

export type BlogsQueryVariables = StorefrontAPI.Exact<{
  country?: StorefrontAPI.InputMaybe<StorefrontAPI.CountryCode>;
  endCursor?: StorefrontAPI.InputMaybe<
    StorefrontAPI.Scalars['String']['input']
  >;
  first?: StorefrontAPI.InputMaybe<StorefrontAPI.Scalars['Int']['input']>;
  language?: StorefrontAPI.InputMaybe<StorefrontAPI.LanguageCode>;
  last?: StorefrontAPI.InputMaybe<StorefrontAPI.Scalars['Int']['input']>;
  startCursor?: StorefrontAPI.InputMaybe<
    StorefrontAPI.Scalars['String']['input']
  >;
}>;

export type BlogsQuery = {
  blogs: {
    pageInfo: Pick<
      StorefrontAPI.PageInfo,
      'hasNextPage' | 'hasPreviousPage' | 'startCursor' | 'endCursor'
    >;
    nodes: Array<
      Pick<StorefrontAPI.Blog, 'title' | 'handle'> & {
        seo?: StorefrontAPI.Maybe<
          Pick<StorefrontAPI.Seo, 'title' | 'description'>
        >;
      }
    >;
  };
};

export type NewsletterSubscribeMutationVariables = StorefrontAPI.Exact<{
  email: StorefrontAPI.Scalars['String']['input'];
  password: StorefrontAPI.Scalars['String']['input'];
}>;

export type NewsletterSubscribeMutation = {
  customerCreate?: StorefrontAPI.Maybe<{
    customer?: StorefrontAPI.Maybe<Pick<StorefrontAPI.Customer, 'id'>>;
    customerUserErrors: Array<
      Pick<StorefrontAPI.CustomerUserError, 'code' | 'field' | 'message'>
    >;
  }>;
};

export type ClubPastReadsQueryVariables = StorefrontAPI.Exact<{
  country?: StorefrontAPI.InputMaybe<StorefrontAPI.CountryCode>;
  language?: StorefrontAPI.InputMaybe<StorefrontAPI.LanguageCode>;
}>;

export type ClubPastReadsQuery = {
  products: {
    nodes: Array<
      Pick<
        StorefrontAPI.Product,
        'id' | 'handle' | 'title' | 'vendor' | 'tags' | 'availableForSale'
      > & {
        publisher?: StorefrontAPI.Maybe<Pick<StorefrontAPI.Metafield, 'value'>>;
        year?: StorefrontAPI.Maybe<Pick<StorefrontAPI.Metafield, 'value'>>;
        condition?: StorefrontAPI.Maybe<Pick<StorefrontAPI.Metafield, 'value'>>;
        chill?: StorefrontAPI.Maybe<Pick<StorefrontAPI.Metafield, 'value'>>;
        subgenre?: StorefrontAPI.Maybe<Pick<StorefrontAPI.Metafield, 'value'>>;
        coverBg?: StorefrontAPI.Maybe<Pick<StorefrontAPI.Metafield, 'value'>>;
        coverInk?: StorefrontAPI.Maybe<Pick<StorefrontAPI.Metafield, 'value'>>;
        priceRange: {
          minVariantPrice: Pick<
            StorefrontAPI.MoneyV2,
            'amount' | 'currencyCode'
          >;
        };
        compareAtPriceRange: {
          minVariantPrice: Pick<
            StorefrontAPI.MoneyV2,
            'amount' | 'currencyCode'
          >;
        };
        featuredImage?: StorefrontAPI.Maybe<
          Pick<
            StorefrontAPI.Image,
            'id' | 'url' | 'altText' | 'width' | 'height'
          >
        >;
        variants: {
          nodes: Array<
            Pick<
              StorefrontAPI.ProductVariant,
              'id' | 'title' | 'availableForSale'
            > & {
              price: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>;
              compareAtPrice?: StorefrontAPI.Maybe<
                Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>
              >;
              selectedOptions: Array<
                Pick<StorefrontAPI.SelectedOption, 'name' | 'value'>
              >;
            }
          >;
        };
      }
    >;
  };
};

export type ClubVariantsQueryVariables = StorefrontAPI.Exact<{
  handle: StorefrontAPI.Scalars['String']['input'];
  book: StorefrontAPI.Scalars['String']['input'];
  country?: StorefrontAPI.InputMaybe<StorefrontAPI.CountryCode>;
  language?: StorefrontAPI.InputMaybe<StorefrontAPI.LanguageCode>;
}>;

export type ClubVariantsQuery = {
  product?: StorefrontAPI.Maybe<{
    variants: {
      nodes: Array<
        Pick<StorefrontAPI.ProductVariant, 'id' | 'availableForSale'> & {
          selectedOptions: Array<
            Pick<StorefrontAPI.SelectedOption, 'name' | 'value'>
          >;
        }
      >;
    };
  }>;
  book?: StorefrontAPI.Maybe<{
    selectedOrFirstAvailableVariant?: StorefrontAPI.Maybe<
      Pick<StorefrontAPI.ProductVariant, 'id' | 'availableForSale'>
    >;
  }>;
};

export type BookShelfQueryVariables = StorefrontAPI.Exact<{
  handle: StorefrontAPI.Scalars['String']['input'];
  country?: StorefrontAPI.InputMaybe<StorefrontAPI.CountryCode>;
  language?: StorefrontAPI.InputMaybe<StorefrontAPI.LanguageCode>;
  filters?: StorefrontAPI.InputMaybe<
    Array<StorefrontAPI.ProductFilter> | StorefrontAPI.ProductFilter
  >;
  sortKey?: StorefrontAPI.InputMaybe<StorefrontAPI.ProductCollectionSortKeys>;
  reverse?: StorefrontAPI.InputMaybe<StorefrontAPI.Scalars['Boolean']['input']>;
  first?: StorefrontAPI.InputMaybe<StorefrontAPI.Scalars['Int']['input']>;
  last?: StorefrontAPI.InputMaybe<StorefrontAPI.Scalars['Int']['input']>;
  startCursor?: StorefrontAPI.InputMaybe<
    StorefrontAPI.Scalars['String']['input']
  >;
  endCursor?: StorefrontAPI.InputMaybe<
    StorefrontAPI.Scalars['String']['input']
  >;
}>;

export type BookShelfQuery = {
  collection?: StorefrontAPI.Maybe<
    Pick<
      StorefrontAPI.Collection,
      'id' | 'handle' | 'title' | 'description'
    > & {
      products: {
        filters: Array<
          Pick<StorefrontAPI.Filter, 'id' | 'label'> & {
            values: Array<
              Pick<
                StorefrontAPI.FilterValue,
                'id' | 'label' | 'count' | 'input'
              >
            >;
          }
        >;
        nodes: Array<
          Pick<
            StorefrontAPI.Product,
            'id' | 'handle' | 'title' | 'vendor' | 'tags' | 'availableForSale'
          > & {
            publisher?: StorefrontAPI.Maybe<
              Pick<StorefrontAPI.Metafield, 'value'>
            >;
            year?: StorefrontAPI.Maybe<Pick<StorefrontAPI.Metafield, 'value'>>;
            condition?: StorefrontAPI.Maybe<
              Pick<StorefrontAPI.Metafield, 'value'>
            >;
            chill?: StorefrontAPI.Maybe<Pick<StorefrontAPI.Metafield, 'value'>>;
            subgenre?: StorefrontAPI.Maybe<
              Pick<StorefrontAPI.Metafield, 'value'>
            >;
            coverBg?: StorefrontAPI.Maybe<
              Pick<StorefrontAPI.Metafield, 'value'>
            >;
            coverInk?: StorefrontAPI.Maybe<
              Pick<StorefrontAPI.Metafield, 'value'>
            >;
            priceRange: {
              minVariantPrice: Pick<
                StorefrontAPI.MoneyV2,
                'amount' | 'currencyCode'
              >;
            };
            compareAtPriceRange: {
              minVariantPrice: Pick<
                StorefrontAPI.MoneyV2,
                'amount' | 'currencyCode'
              >;
            };
            featuredImage?: StorefrontAPI.Maybe<
              Pick<
                StorefrontAPI.Image,
                'id' | 'url' | 'altText' | 'width' | 'height'
              >
            >;
            variants: {
              nodes: Array<
                Pick<
                  StorefrontAPI.ProductVariant,
                  'id' | 'title' | 'availableForSale'
                > & {
                  price: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>;
                  compareAtPrice?: StorefrontAPI.Maybe<
                    Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>
                  >;
                  selectedOptions: Array<
                    Pick<StorefrontAPI.SelectedOption, 'name' | 'value'>
                  >;
                }
              >;
            };
          }
        >;
        pageInfo: Pick<
          StorefrontAPI.PageInfo,
          'hasPreviousPage' | 'hasNextPage' | 'endCursor' | 'startCursor'
        >;
      };
    }
  >;
};

export type CatalogQueryVariables = StorefrontAPI.Exact<{
  country?: StorefrontAPI.InputMaybe<StorefrontAPI.CountryCode>;
  language?: StorefrontAPI.InputMaybe<StorefrontAPI.LanguageCode>;
  sortKey?: StorefrontAPI.InputMaybe<StorefrontAPI.ProductSortKeys>;
  reverse?: StorefrontAPI.InputMaybe<StorefrontAPI.Scalars['Boolean']['input']>;
  first?: StorefrontAPI.InputMaybe<StorefrontAPI.Scalars['Int']['input']>;
  last?: StorefrontAPI.InputMaybe<StorefrontAPI.Scalars['Int']['input']>;
  startCursor?: StorefrontAPI.InputMaybe<
    StorefrontAPI.Scalars['String']['input']
  >;
  endCursor?: StorefrontAPI.InputMaybe<
    StorefrontAPI.Scalars['String']['input']
  >;
}>;

export type CatalogQuery = {
  products: {
    nodes: Array<
      Pick<
        StorefrontAPI.Product,
        'id' | 'handle' | 'title' | 'vendor' | 'tags' | 'availableForSale'
      > & {
        publisher?: StorefrontAPI.Maybe<Pick<StorefrontAPI.Metafield, 'value'>>;
        year?: StorefrontAPI.Maybe<Pick<StorefrontAPI.Metafield, 'value'>>;
        condition?: StorefrontAPI.Maybe<Pick<StorefrontAPI.Metafield, 'value'>>;
        chill?: StorefrontAPI.Maybe<Pick<StorefrontAPI.Metafield, 'value'>>;
        subgenre?: StorefrontAPI.Maybe<Pick<StorefrontAPI.Metafield, 'value'>>;
        coverBg?: StorefrontAPI.Maybe<Pick<StorefrontAPI.Metafield, 'value'>>;
        coverInk?: StorefrontAPI.Maybe<Pick<StorefrontAPI.Metafield, 'value'>>;
        priceRange: {
          minVariantPrice: Pick<
            StorefrontAPI.MoneyV2,
            'amount' | 'currencyCode'
          >;
        };
        compareAtPriceRange: {
          minVariantPrice: Pick<
            StorefrontAPI.MoneyV2,
            'amount' | 'currencyCode'
          >;
        };
        featuredImage?: StorefrontAPI.Maybe<
          Pick<
            StorefrontAPI.Image,
            'id' | 'url' | 'altText' | 'width' | 'height'
          >
        >;
        variants: {
          nodes: Array<
            Pick<
              StorefrontAPI.ProductVariant,
              'id' | 'title' | 'availableForSale'
            > & {
              price: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>;
              compareAtPrice?: StorefrontAPI.Maybe<
                Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>
              >;
              selectedOptions: Array<
                Pick<StorefrontAPI.SelectedOption, 'name' | 'value'>
              >;
            }
          >;
        };
      }
    >;
    pageInfo: Pick<
      StorefrontAPI.PageInfo,
      'hasPreviousPage' | 'hasNextPage' | 'startCursor' | 'endCursor'
    >;
  };
};

export type SavedBooksQueryVariables = StorefrontAPI.Exact<{
  country?: StorefrontAPI.InputMaybe<StorefrontAPI.CountryCode>;
  language?: StorefrontAPI.InputMaybe<StorefrontAPI.LanguageCode>;
}>;

export type SavedBooksQuery = {
  products: {
    nodes: Array<
      Pick<
        StorefrontAPI.Product,
        'id' | 'handle' | 'title' | 'vendor' | 'tags' | 'availableForSale'
      > & {
        publisher?: StorefrontAPI.Maybe<Pick<StorefrontAPI.Metafield, 'value'>>;
        year?: StorefrontAPI.Maybe<Pick<StorefrontAPI.Metafield, 'value'>>;
        condition?: StorefrontAPI.Maybe<Pick<StorefrontAPI.Metafield, 'value'>>;
        chill?: StorefrontAPI.Maybe<Pick<StorefrontAPI.Metafield, 'value'>>;
        subgenre?: StorefrontAPI.Maybe<Pick<StorefrontAPI.Metafield, 'value'>>;
        coverBg?: StorefrontAPI.Maybe<Pick<StorefrontAPI.Metafield, 'value'>>;
        coverInk?: StorefrontAPI.Maybe<Pick<StorefrontAPI.Metafield, 'value'>>;
        priceRange: {
          minVariantPrice: Pick<
            StorefrontAPI.MoneyV2,
            'amount' | 'currencyCode'
          >;
        };
        compareAtPriceRange: {
          minVariantPrice: Pick<
            StorefrontAPI.MoneyV2,
            'amount' | 'currencyCode'
          >;
        };
        featuredImage?: StorefrontAPI.Maybe<
          Pick<
            StorefrontAPI.Image,
            'id' | 'url' | 'altText' | 'width' | 'height'
          >
        >;
        variants: {
          nodes: Array<
            Pick<
              StorefrontAPI.ProductVariant,
              'id' | 'title' | 'availableForSale'
            > & {
              price: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>;
              compareAtPrice?: StorefrontAPI.Maybe<
                Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>
              >;
              selectedOptions: Array<
                Pick<StorefrontAPI.SelectedOption, 'name' | 'value'>
              >;
            }
          >;
        };
      }
    >;
  };
};

export type PageQueryVariables = StorefrontAPI.Exact<{
  language?: StorefrontAPI.InputMaybe<StorefrontAPI.LanguageCode>;
  country?: StorefrontAPI.InputMaybe<StorefrontAPI.CountryCode>;
  handle: StorefrontAPI.Scalars['String']['input'];
}>;

export type PageQuery = {
  page?: StorefrontAPI.Maybe<
    Pick<StorefrontAPI.Page, 'handle' | 'id' | 'title' | 'body'> & {
      seo?: StorefrontAPI.Maybe<
        Pick<StorefrontAPI.Seo, 'description' | 'title'>
      >;
    }
  >;
};

export type PolicyFragment = Pick<
  StorefrontAPI.ShopPolicy,
  'body' | 'handle' | 'id' | 'title' | 'url'
>;

export type PolicyQueryVariables = StorefrontAPI.Exact<{
  country?: StorefrontAPI.InputMaybe<StorefrontAPI.CountryCode>;
  language?: StorefrontAPI.InputMaybe<StorefrontAPI.LanguageCode>;
  privacyPolicy: StorefrontAPI.Scalars['Boolean']['input'];
  refundPolicy: StorefrontAPI.Scalars['Boolean']['input'];
  shippingPolicy: StorefrontAPI.Scalars['Boolean']['input'];
  termsOfService: StorefrontAPI.Scalars['Boolean']['input'];
}>;

export type PolicyQuery = {
  shop: {
    privacyPolicy?: StorefrontAPI.Maybe<
      Pick<StorefrontAPI.ShopPolicy, 'body' | 'handle' | 'id' | 'title' | 'url'>
    >;
    shippingPolicy?: StorefrontAPI.Maybe<
      Pick<StorefrontAPI.ShopPolicy, 'body' | 'handle' | 'id' | 'title' | 'url'>
    >;
    termsOfService?: StorefrontAPI.Maybe<
      Pick<StorefrontAPI.ShopPolicy, 'body' | 'handle' | 'id' | 'title' | 'url'>
    >;
    refundPolicy?: StorefrontAPI.Maybe<
      Pick<StorefrontAPI.ShopPolicy, 'body' | 'handle' | 'id' | 'title' | 'url'>
    >;
  };
};

export type PolicyItemFragment = Pick<
  StorefrontAPI.ShopPolicy,
  'id' | 'title' | 'handle'
>;

export type PoliciesQueryVariables = StorefrontAPI.Exact<{
  country?: StorefrontAPI.InputMaybe<StorefrontAPI.CountryCode>;
  language?: StorefrontAPI.InputMaybe<StorefrontAPI.LanguageCode>;
}>;

export type PoliciesQuery = {
  shop: {
    privacyPolicy?: StorefrontAPI.Maybe<
      Pick<StorefrontAPI.ShopPolicy, 'id' | 'title' | 'handle'>
    >;
    shippingPolicy?: StorefrontAPI.Maybe<
      Pick<StorefrontAPI.ShopPolicy, 'id' | 'title' | 'handle'>
    >;
    termsOfService?: StorefrontAPI.Maybe<
      Pick<StorefrontAPI.ShopPolicy, 'id' | 'title' | 'handle'>
    >;
    refundPolicy?: StorefrontAPI.Maybe<
      Pick<StorefrontAPI.ShopPolicy, 'id' | 'title' | 'handle'>
    >;
    subscriptionPolicy?: StorefrontAPI.Maybe<
      Pick<StorefrontAPI.ShopPolicyWithDefault, 'id' | 'title' | 'handle'>
    >;
  };
};

export type BookSearchQueryVariables = StorefrontAPI.Exact<{
  country?: StorefrontAPI.InputMaybe<StorefrontAPI.CountryCode>;
  language?: StorefrontAPI.InputMaybe<StorefrontAPI.LanguageCode>;
  term: StorefrontAPI.Scalars['String']['input'];
}>;

export type BookSearchQuery = {
  search: Pick<StorefrontAPI.SearchResultItemConnection, 'totalCount'> & {
    nodes: Array<
      Pick<
        StorefrontAPI.Product,
        'id' | 'handle' | 'title' | 'vendor' | 'tags' | 'availableForSale'
      > & {
        publisher?: StorefrontAPI.Maybe<Pick<StorefrontAPI.Metafield, 'value'>>;
        year?: StorefrontAPI.Maybe<Pick<StorefrontAPI.Metafield, 'value'>>;
        condition?: StorefrontAPI.Maybe<Pick<StorefrontAPI.Metafield, 'value'>>;
        chill?: StorefrontAPI.Maybe<Pick<StorefrontAPI.Metafield, 'value'>>;
        subgenre?: StorefrontAPI.Maybe<Pick<StorefrontAPI.Metafield, 'value'>>;
        coverBg?: StorefrontAPI.Maybe<Pick<StorefrontAPI.Metafield, 'value'>>;
        coverInk?: StorefrontAPI.Maybe<Pick<StorefrontAPI.Metafield, 'value'>>;
        priceRange: {
          minVariantPrice: Pick<
            StorefrontAPI.MoneyV2,
            'amount' | 'currencyCode'
          >;
        };
        compareAtPriceRange: {
          minVariantPrice: Pick<
            StorefrontAPI.MoneyV2,
            'amount' | 'currencyCode'
          >;
        };
        featuredImage?: StorefrontAPI.Maybe<
          Pick<
            StorefrontAPI.Image,
            'id' | 'url' | 'altText' | 'width' | 'height'
          >
        >;
        variants: {
          nodes: Array<
            Pick<
              StorefrontAPI.ProductVariant,
              'id' | 'title' | 'availableForSale'
            > & {
              price: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>;
              compareAtPrice?: StorefrontAPI.Maybe<
                Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>
              >;
              selectedOptions: Array<
                Pick<StorefrontAPI.SelectedOption, 'name' | 'value'>
              >;
            }
          >;
        };
      }
    >;
  };
  fallback?: StorefrontAPI.Maybe<{
    products: {
      nodes: Array<
        Pick<
          StorefrontAPI.Product,
          'id' | 'handle' | 'title' | 'vendor' | 'tags' | 'availableForSale'
        > & {
          publisher?: StorefrontAPI.Maybe<
            Pick<StorefrontAPI.Metafield, 'value'>
          >;
          year?: StorefrontAPI.Maybe<Pick<StorefrontAPI.Metafield, 'value'>>;
          condition?: StorefrontAPI.Maybe<
            Pick<StorefrontAPI.Metafield, 'value'>
          >;
          chill?: StorefrontAPI.Maybe<Pick<StorefrontAPI.Metafield, 'value'>>;
          subgenre?: StorefrontAPI.Maybe<
            Pick<StorefrontAPI.Metafield, 'value'>
          >;
          coverBg?: StorefrontAPI.Maybe<Pick<StorefrontAPI.Metafield, 'value'>>;
          coverInk?: StorefrontAPI.Maybe<
            Pick<StorefrontAPI.Metafield, 'value'>
          >;
          priceRange: {
            minVariantPrice: Pick<
              StorefrontAPI.MoneyV2,
              'amount' | 'currencyCode'
            >;
          };
          compareAtPriceRange: {
            minVariantPrice: Pick<
              StorefrontAPI.MoneyV2,
              'amount' | 'currencyCode'
            >;
          };
          featuredImage?: StorefrontAPI.Maybe<
            Pick<
              StorefrontAPI.Image,
              'id' | 'url' | 'altText' | 'width' | 'height'
            >
          >;
          variants: {
            nodes: Array<
              Pick<
                StorefrontAPI.ProductVariant,
                'id' | 'title' | 'availableForSale'
              > & {
                price: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>;
                compareAtPrice?: StorefrontAPI.Maybe<
                  Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>
                >;
                selectedOptions: Array<
                  Pick<StorefrontAPI.SelectedOption, 'name' | 'value'>
                >;
              }
            >;
          };
        }
      >;
    };
  }>;
  suggestions?: StorefrontAPI.Maybe<{
    queries: Array<Pick<StorefrontAPI.SearchQuerySuggestion, 'text'>>;
  }>;
};

export type PredictiveArticleFragment = {__typename: 'Article'} & Pick<
  StorefrontAPI.Article,
  'id' | 'title' | 'handle' | 'trackingParameters'
> & {
    blog: Pick<StorefrontAPI.Blog, 'handle'>;
    image?: StorefrontAPI.Maybe<
      Pick<StorefrontAPI.Image, 'url' | 'altText' | 'width' | 'height'>
    >;
  };

export type PredictiveCollectionFragment = {__typename: 'Collection'} & Pick<
  StorefrontAPI.Collection,
  'id' | 'title' | 'handle' | 'trackingParameters'
> & {
    image?: StorefrontAPI.Maybe<
      Pick<StorefrontAPI.Image, 'url' | 'altText' | 'width' | 'height'>
    >;
  };

export type PredictivePageFragment = {__typename: 'Page'} & Pick<
  StorefrontAPI.Page,
  'id' | 'title' | 'handle' | 'trackingParameters'
>;

export type PredictiveProductFragment = {__typename: 'Product'} & Pick<
  StorefrontAPI.Product,
  'id' | 'title' | 'handle' | 'vendor' | 'trackingParameters'
> & {
    coverBg?: StorefrontAPI.Maybe<Pick<StorefrontAPI.Metafield, 'value'>>;
    coverInk?: StorefrontAPI.Maybe<Pick<StorefrontAPI.Metafield, 'value'>>;
    selectedOrFirstAvailableVariant?: StorefrontAPI.Maybe<
      Pick<StorefrontAPI.ProductVariant, 'id'> & {
        image?: StorefrontAPI.Maybe<
          Pick<StorefrontAPI.Image, 'url' | 'altText' | 'width' | 'height'>
        >;
        price: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>;
      }
    >;
  };

export type PredictiveQueryFragment = {
  __typename: 'SearchQuerySuggestion';
} & Pick<
  StorefrontAPI.SearchQuerySuggestion,
  'text' | 'styledText' | 'trackingParameters'
>;

export type PredictiveSearchQueryVariables = StorefrontAPI.Exact<{
  country?: StorefrontAPI.InputMaybe<StorefrontAPI.CountryCode>;
  language?: StorefrontAPI.InputMaybe<StorefrontAPI.LanguageCode>;
  limit: StorefrontAPI.Scalars['Int']['input'];
  limitScope: StorefrontAPI.PredictiveSearchLimitScope;
  term: StorefrontAPI.Scalars['String']['input'];
  types?: StorefrontAPI.InputMaybe<
    | Array<StorefrontAPI.PredictiveSearchType>
    | StorefrontAPI.PredictiveSearchType
  >;
}>;

export type PredictiveSearchQuery = {
  predictiveSearch?: StorefrontAPI.Maybe<{
    articles: Array<
      {__typename: 'Article'} & Pick<
        StorefrontAPI.Article,
        'id' | 'title' | 'handle' | 'trackingParameters'
      > & {
          blog: Pick<StorefrontAPI.Blog, 'handle'>;
          image?: StorefrontAPI.Maybe<
            Pick<StorefrontAPI.Image, 'url' | 'altText' | 'width' | 'height'>
          >;
        }
    >;
    collections: Array<
      {__typename: 'Collection'} & Pick<
        StorefrontAPI.Collection,
        'id' | 'title' | 'handle' | 'trackingParameters'
      > & {
          image?: StorefrontAPI.Maybe<
            Pick<StorefrontAPI.Image, 'url' | 'altText' | 'width' | 'height'>
          >;
        }
    >;
    pages: Array<
      {__typename: 'Page'} & Pick<
        StorefrontAPI.Page,
        'id' | 'title' | 'handle' | 'trackingParameters'
      >
    >;
    products: Array<
      {__typename: 'Product'} & Pick<
        StorefrontAPI.Product,
        'id' | 'title' | 'handle' | 'vendor' | 'trackingParameters'
      > & {
          coverBg?: StorefrontAPI.Maybe<Pick<StorefrontAPI.Metafield, 'value'>>;
          coverInk?: StorefrontAPI.Maybe<
            Pick<StorefrontAPI.Metafield, 'value'>
          >;
          selectedOrFirstAvailableVariant?: StorefrontAPI.Maybe<
            Pick<StorefrontAPI.ProductVariant, 'id'> & {
              image?: StorefrontAPI.Maybe<
                Pick<
                  StorefrontAPI.Image,
                  'url' | 'altText' | 'width' | 'height'
                >
              >;
              price: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>;
            }
          >;
        }
    >;
    queries: Array<
      {__typename: 'SearchQuerySuggestion'} & Pick<
        StorefrontAPI.SearchQuerySuggestion,
        'text' | 'styledText' | 'trackingParameters'
      >
    >;
  }>;
};

export type SharedBooksQueryVariables = StorefrontAPI.Exact<{
  country?: StorefrontAPI.InputMaybe<StorefrontAPI.CountryCode>;
  language?: StorefrontAPI.InputMaybe<StorefrontAPI.LanguageCode>;
}>;

export type SharedBooksQuery = {
  products: {
    nodes: Array<
      Pick<
        StorefrontAPI.Product,
        'id' | 'handle' | 'title' | 'vendor' | 'tags' | 'availableForSale'
      > & {
        publisher?: StorefrontAPI.Maybe<Pick<StorefrontAPI.Metafield, 'value'>>;
        year?: StorefrontAPI.Maybe<Pick<StorefrontAPI.Metafield, 'value'>>;
        condition?: StorefrontAPI.Maybe<Pick<StorefrontAPI.Metafield, 'value'>>;
        chill?: StorefrontAPI.Maybe<Pick<StorefrontAPI.Metafield, 'value'>>;
        subgenre?: StorefrontAPI.Maybe<Pick<StorefrontAPI.Metafield, 'value'>>;
        coverBg?: StorefrontAPI.Maybe<Pick<StorefrontAPI.Metafield, 'value'>>;
        coverInk?: StorefrontAPI.Maybe<Pick<StorefrontAPI.Metafield, 'value'>>;
        priceRange: {
          minVariantPrice: Pick<
            StorefrontAPI.MoneyV2,
            'amount' | 'currencyCode'
          >;
        };
        compareAtPriceRange: {
          minVariantPrice: Pick<
            StorefrontAPI.MoneyV2,
            'amount' | 'currencyCode'
          >;
        };
        featuredImage?: StorefrontAPI.Maybe<
          Pick<
            StorefrontAPI.Image,
            'id' | 'url' | 'altText' | 'width' | 'height'
          >
        >;
        variants: {
          nodes: Array<
            Pick<
              StorefrontAPI.ProductVariant,
              'id' | 'title' | 'availableForSale'
            > & {
              price: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>;
              compareAtPrice?: StorefrontAPI.Maybe<
                Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>
              >;
              selectedOptions: Array<
                Pick<StorefrontAPI.SelectedOption, 'name' | 'value'>
              >;
            }
          >;
        };
      }
    >;
  };
};

interface GeneratedQueryTypes {
  '#graphql\n  query Product(\n    $country: CountryCode\n    $handle: String!\n    $language: LanguageCode\n    $selectedOptions: [SelectedOptionInput!]!\n  ) @inContext(country: $country, language: $language) {\n    product(handle: $handle) {\n      id\n      title\n      vendor\n      handle\n      productType\n      description\n      tags\n      options {\n        name\n        optionValues {\n          name\n        }\n      }\n      selectedOrFirstAvailableVariant(selectedOptions: $selectedOptions, ignoreUnknownOptions: true, caseInsensitiveMatch: true) {\n        ...ProductVariant\n      }\n      variants(first: 12) {\n        nodes {\n          ...ProductVariant\n        }\n      }\n      collections(first: 3) {\n        nodes {\n          handle\n          title\n        }\n      }\n      seo {\n        description\n        title\n      }\n      publisher: metafield(namespace: "custom", key: "publisher") { value }\n      year: metafield(namespace: "custom", key: "year") { value }\n      condition: metafield(namespace: "custom", key: "condition") { value }\n      chill: metafield(namespace: "custom", key: "chill") { value }\n      subgenre: metafield(namespace: "custom", key: "subgenre") { value }\n      synopsis: metafield(namespace: "custom", key: "synopsis") { value }\n      quote: metafield(namespace: "custom", key: "quote") { value }\n      pages: metafield(namespace: "custom", key: "pages") { value }\n      isbn: metafield(namespace: "custom", key: "isbn") { value }\n      translator: metafield(namespace: "custom", key: "translator") { value }\n      coverBg: metafield(namespace: "custom", key: "cover_bg") { value }\n      coverInk: metafield(namespace: "custom", key: "cover_ink") { value }\n    }\n  }\n  #graphql\n  fragment ProductVariant on ProductVariant {\n    id\n    title\n    availableForSale\n    price {\n      amount\n      currencyCode\n    }\n    compareAtPrice {\n      amount\n      currencyCode\n    }\n    selectedOptions {\n      name\n      value\n    }\n  }\n\n': {
    return: ProductQuery;
    variables: ProductQueryVariables;
  };
  '#graphql\n  query BookRecommendations($productId: ID!, $country: CountryCode, $language: LanguageCode)\n  @inContext(country: $country, language: $language) {\n    productRecommendations(productId: $productId) {\n      ...BookCard\n    }\n  }\n  #graphql\n  fragment BookCard on Product {\n    id\n    handle\n    title\n    vendor\n    tags\n    availableForSale\n    publisher: metafield(namespace: "custom", key: "publisher") { value }\n    year: metafield(namespace: "custom", key: "year") { value }\n    condition: metafield(namespace: "custom", key: "condition") { value }\n    chill: metafield(namespace: "custom", key: "chill") { value }\n    subgenre: metafield(namespace: "custom", key: "subgenre") { value }\n    coverBg: metafield(namespace: "custom", key: "cover_bg") { value }\n    coverInk: metafield(namespace: "custom", key: "cover_ink") { value }\n    priceRange {\n      minVariantPrice { amount currencyCode }\n    }\n    compareAtPriceRange {\n      minVariantPrice { amount currencyCode }\n    }\n    featuredImage { id url altText width height }\n    variants(first: 6) {\n      nodes {\n        id\n        title\n        availableForSale\n        price { amount currencyCode }\n        compareAtPrice { amount currencyCode }\n        selectedOptions { name value }\n      }\n    }\n  }\n\n': {
    return: BookRecommendationsQuery;
    variables: BookRecommendationsQueryVariables;
  };
  '#graphql\n  query HomeNovedades($country: CountryCode, $language: LanguageCode) @inContext(country: $country, language: $language) {\n    collection(handle: "novedades") {\n      products(first: 4) {\n        nodes {\n          ...BookCard\n        }\n      }\n    }\n  }\n  #graphql\n  fragment BookCard on Product {\n    id\n    handle\n    title\n    vendor\n    tags\n    availableForSale\n    publisher: metafield(namespace: "custom", key: "publisher") { value }\n    year: metafield(namespace: "custom", key: "year") { value }\n    condition: metafield(namespace: "custom", key: "condition") { value }\n    chill: metafield(namespace: "custom", key: "chill") { value }\n    subgenre: metafield(namespace: "custom", key: "subgenre") { value }\n    coverBg: metafield(namespace: "custom", key: "cover_bg") { value }\n    coverInk: metafield(namespace: "custom", key: "cover_ink") { value }\n    priceRange {\n      minVariantPrice { amount currencyCode }\n    }\n    compareAtPriceRange {\n      minVariantPrice { amount currencyCode }\n    }\n    featuredImage { id url altText width height }\n    variants(first: 6) {\n      nodes {\n        id\n        title\n        availableForSale\n        price { amount currencyCode }\n        compareAtPrice { amount currencyCode }\n        selectedOptions { name value }\n      }\n    }\n  }\n\n': {
    return: HomeNovedadesQuery;
    variables: HomeNovedadesQueryVariables;
  };
  '#graphql\n  query Article(\n    $articleHandle: String!\n    $blogHandle: String!\n    $country: CountryCode\n    $language: LanguageCode\n  ) @inContext(language: $language, country: $country) {\n    blog(handle: $blogHandle) {\n      handle\n      articleByHandle(handle: $articleHandle) {\n        handle\n        title\n        contentHtml\n        publishedAt\n        author: authorV2 {\n          name\n        }\n        image {\n          id\n          altText\n          url\n          width\n          height\n        }\n        seo {\n          description\n          title\n        }\n      }\n    }\n  }\n': {
    return: ArticleQuery;
    variables: ArticleQueryVariables;
  };
  '#graphql\n  query Blog(\n    $language: LanguageCode\n    $blogHandle: String!\n    $first: Int\n    $last: Int\n    $startCursor: String\n    $endCursor: String\n  ) @inContext(language: $language) {\n    blog(handle: $blogHandle) {\n      title\n      handle\n      seo {\n        title\n        description\n      }\n      articles(\n        first: $first,\n        last: $last,\n        before: $startCursor,\n        after: $endCursor\n      ) {\n        nodes {\n          ...ArticleItem\n        }\n        pageInfo {\n          hasPreviousPage\n          hasNextPage\n          hasNextPage\n          endCursor\n          startCursor\n        }\n\n      }\n    }\n  }\n  fragment ArticleItem on Article {\n    author: authorV2 {\n      name\n    }\n    contentHtml\n    handle\n    id\n    image {\n      id\n      altText\n      url\n      width\n      height\n    }\n    publishedAt\n    title\n    blog {\n      handle\n    }\n  }\n': {
    return: BlogQuery;
    variables: BlogQueryVariables;
  };
  '#graphql\n  query Blogs(\n    $country: CountryCode\n    $endCursor: String\n    $first: Int\n    $language: LanguageCode\n    $last: Int\n    $startCursor: String\n  ) @inContext(country: $country, language: $language) {\n    blogs(\n      first: $first,\n      last: $last,\n      before: $startCursor,\n      after: $endCursor\n    ) {\n      pageInfo {\n        hasNextPage\n        hasPreviousPage\n        startCursor\n        endCursor\n      }\n      nodes {\n        title\n        handle\n        seo {\n          title\n          description\n        }\n      }\n    }\n  }\n': {
    return: BlogsQuery;
    variables: BlogsQueryVariables;
  };
  '#graphql\n  query ClubPastReads($country: CountryCode, $language: LanguageCode)\n  @inContext(country: $country, language: $language) {\n    products(first: 100, query: "product_type:Libro") {\n      nodes {\n        ...BookCard\n      }\n    }\n  }\n  #graphql\n  fragment BookCard on Product {\n    id\n    handle\n    title\n    vendor\n    tags\n    availableForSale\n    publisher: metafield(namespace: "custom", key: "publisher") { value }\n    year: metafield(namespace: "custom", key: "year") { value }\n    condition: metafield(namespace: "custom", key: "condition") { value }\n    chill: metafield(namespace: "custom", key: "chill") { value }\n    subgenre: metafield(namespace: "custom", key: "subgenre") { value }\n    coverBg: metafield(namespace: "custom", key: "cover_bg") { value }\n    coverInk: metafield(namespace: "custom", key: "cover_ink") { value }\n    priceRange {\n      minVariantPrice { amount currencyCode }\n    }\n    compareAtPriceRange {\n      minVariantPrice { amount currencyCode }\n    }\n    featuredImage { id url altText width height }\n    variants(first: 6) {\n      nodes {\n        id\n        title\n        availableForSale\n        price { amount currencyCode }\n        compareAtPrice { amount currencyCode }\n        selectedOptions { name value }\n      }\n    }\n  }\n\n': {
    return: ClubPastReadsQuery;
    variables: ClubPastReadsQueryVariables;
  };
  '#graphql\n  query ClubVariants($handle: String!, $book: String!, $country: CountryCode, $language: LanguageCode)\n  @inContext(country: $country, language: $language) {\n    product(handle: $handle) {\n      variants(first: 20) {\n        nodes {\n          id\n          availableForSale\n          selectedOptions {\n            name\n            value\n          }\n        }\n      }\n    }\n    book: product(handle: $book) {\n      selectedOrFirstAvailableVariant {\n        id\n        availableForSale\n      }\n    }\n  }\n': {
    return: ClubVariantsQuery;
    variables: ClubVariantsQueryVariables;
  };
  '#graphql\n  query BookShelf(\n    $handle: String!\n    $country: CountryCode\n    $language: LanguageCode\n    $filters: [ProductFilter!]\n    $sortKey: ProductCollectionSortKeys\n    $reverse: Boolean\n    $first: Int\n    $last: Int\n    $startCursor: String\n    $endCursor: String\n  ) @inContext(country: $country, language: $language) {\n    collection(handle: $handle) {\n      id\n      handle\n      title\n      description\n      products(\n        first: $first\n        last: $last\n        before: $startCursor\n        after: $endCursor\n        filters: $filters\n        sortKey: $sortKey\n        reverse: $reverse\n      ) {\n        filters {\n          id\n          label\n          values {\n            id\n            label\n            count\n            input\n          }\n        }\n        nodes {\n          ...BookCard\n        }\n        pageInfo {\n          hasPreviousPage\n          hasNextPage\n          endCursor\n          startCursor\n        }\n      }\n    }\n  }\n  #graphql\n  fragment BookCard on Product {\n    id\n    handle\n    title\n    vendor\n    tags\n    availableForSale\n    publisher: metafield(namespace: "custom", key: "publisher") { value }\n    year: metafield(namespace: "custom", key: "year") { value }\n    condition: metafield(namespace: "custom", key: "condition") { value }\n    chill: metafield(namespace: "custom", key: "chill") { value }\n    subgenre: metafield(namespace: "custom", key: "subgenre") { value }\n    coverBg: metafield(namespace: "custom", key: "cover_bg") { value }\n    coverInk: metafield(namespace: "custom", key: "cover_ink") { value }\n    priceRange {\n      minVariantPrice { amount currencyCode }\n    }\n    compareAtPriceRange {\n      minVariantPrice { amount currencyCode }\n    }\n    featuredImage { id url altText width height }\n    variants(first: 6) {\n      nodes {\n        id\n        title\n        availableForSale\n        price { amount currencyCode }\n        compareAtPrice { amount currencyCode }\n        selectedOptions { name value }\n      }\n    }\n  }\n\n': {
    return: BookShelfQuery;
    variables: BookShelfQueryVariables;
  };
  '#graphql\n  query Catalog(\n    $country: CountryCode\n    $language: LanguageCode\n    $sortKey: ProductSortKeys\n    $reverse: Boolean\n    $first: Int\n    $last: Int\n    $startCursor: String\n    $endCursor: String\n  ) @inContext(country: $country, language: $language) {\n    products(\n      first: $first\n      last: $last\n      before: $startCursor\n      after: $endCursor\n      sortKey: $sortKey\n      reverse: $reverse\n      query: "product_type:Libro"\n    ) {\n      nodes {\n        ...BookCard\n      }\n      pageInfo {\n        hasPreviousPage\n        hasNextPage\n        startCursor\n        endCursor\n      }\n    }\n  }\n  #graphql\n  fragment BookCard on Product {\n    id\n    handle\n    title\n    vendor\n    tags\n    availableForSale\n    publisher: metafield(namespace: "custom", key: "publisher") { value }\n    year: metafield(namespace: "custom", key: "year") { value }\n    condition: metafield(namespace: "custom", key: "condition") { value }\n    chill: metafield(namespace: "custom", key: "chill") { value }\n    subgenre: metafield(namespace: "custom", key: "subgenre") { value }\n    coverBg: metafield(namespace: "custom", key: "cover_bg") { value }\n    coverInk: metafield(namespace: "custom", key: "cover_ink") { value }\n    priceRange {\n      minVariantPrice { amount currencyCode }\n    }\n    compareAtPriceRange {\n      minVariantPrice { amount currencyCode }\n    }\n    featuredImage { id url altText width height }\n    variants(first: 6) {\n      nodes {\n        id\n        title\n        availableForSale\n        price { amount currencyCode }\n        compareAtPrice { amount currencyCode }\n        selectedOptions { name value }\n      }\n    }\n  }\n\n': {
    return: CatalogQuery;
    variables: CatalogQueryVariables;
  };
  '#graphql\n  query SavedBooks($country: CountryCode, $language: LanguageCode)\n  @inContext(country: $country, language: $language) {\n    products(first: 100, query: "product_type:Libro") {\n      nodes {\n        ...BookCard\n      }\n    }\n  }\n  #graphql\n  fragment BookCard on Product {\n    id\n    handle\n    title\n    vendor\n    tags\n    availableForSale\n    publisher: metafield(namespace: "custom", key: "publisher") { value }\n    year: metafield(namespace: "custom", key: "year") { value }\n    condition: metafield(namespace: "custom", key: "condition") { value }\n    chill: metafield(namespace: "custom", key: "chill") { value }\n    subgenre: metafield(namespace: "custom", key: "subgenre") { value }\n    coverBg: metafield(namespace: "custom", key: "cover_bg") { value }\n    coverInk: metafield(namespace: "custom", key: "cover_ink") { value }\n    priceRange {\n      minVariantPrice { amount currencyCode }\n    }\n    compareAtPriceRange {\n      minVariantPrice { amount currencyCode }\n    }\n    featuredImage { id url altText width height }\n    variants(first: 6) {\n      nodes {\n        id\n        title\n        availableForSale\n        price { amount currencyCode }\n        compareAtPrice { amount currencyCode }\n        selectedOptions { name value }\n      }\n    }\n  }\n\n': {
    return: SavedBooksQuery;
    variables: SavedBooksQueryVariables;
  };
  '#graphql\n  query Page(\n    $language: LanguageCode,\n    $country: CountryCode,\n    $handle: String!\n  )\n  @inContext(language: $language, country: $country) {\n    page(handle: $handle) {\n      handle\n      id\n      title\n      body\n      seo {\n        description\n        title\n      }\n    }\n  }\n': {
    return: PageQuery;
    variables: PageQueryVariables;
  };
  '#graphql\n  fragment Policy on ShopPolicy {\n    body\n    handle\n    id\n    title\n    url\n  }\n  query Policy(\n    $country: CountryCode\n    $language: LanguageCode\n    $privacyPolicy: Boolean!\n    $refundPolicy: Boolean!\n    $shippingPolicy: Boolean!\n    $termsOfService: Boolean!\n  ) @inContext(language: $language, country: $country) {\n    shop {\n      privacyPolicy @include(if: $privacyPolicy) {\n        ...Policy\n      }\n      shippingPolicy @include(if: $shippingPolicy) {\n        ...Policy\n      }\n      termsOfService @include(if: $termsOfService) {\n        ...Policy\n      }\n      refundPolicy @include(if: $refundPolicy) {\n        ...Policy\n      }\n    }\n  }\n': {
    return: PolicyQuery;
    variables: PolicyQueryVariables;
  };
  '#graphql\n  fragment PolicyItem on ShopPolicy {\n    id\n    title\n    handle\n  }\n  query Policies ($country: CountryCode, $language: LanguageCode)\n    @inContext(country: $country, language: $language) {\n    shop {\n      privacyPolicy {\n        ...PolicyItem\n      }\n      shippingPolicy {\n        ...PolicyItem\n      }\n      termsOfService {\n        ...PolicyItem\n      }\n      refundPolicy {\n        ...PolicyItem\n      }\n      subscriptionPolicy {\n        id\n        title\n        handle\n      }\n    }\n  }\n': {
    return: PoliciesQuery;
    variables: PoliciesQueryVariables;
  };
  '#graphql\n  query BookSearch($country: CountryCode, $language: LanguageCode, $term: String!)\n  @inContext(country: $country, language: $language) {\n    search(query: $term, types: [PRODUCT], first: 24, unavailableProducts: LAST) {\n      totalCount\n      nodes {\n        ... on Product {\n          ...BookCard\n        }\n      }\n    }\n    fallback: collection(handle: "novedades") {\n      products(first: 4) {\n        nodes {\n          ...BookCard\n        }\n      }\n    }\n    suggestions: predictiveSearch(query: $term, limit: 3, types: [QUERY]) {\n      queries {\n        text\n      }\n    }\n  }\n  #graphql\n  fragment BookCard on Product {\n    id\n    handle\n    title\n    vendor\n    tags\n    availableForSale\n    publisher: metafield(namespace: "custom", key: "publisher") { value }\n    year: metafield(namespace: "custom", key: "year") { value }\n    condition: metafield(namespace: "custom", key: "condition") { value }\n    chill: metafield(namespace: "custom", key: "chill") { value }\n    subgenre: metafield(namespace: "custom", key: "subgenre") { value }\n    coverBg: metafield(namespace: "custom", key: "cover_bg") { value }\n    coverInk: metafield(namespace: "custom", key: "cover_ink") { value }\n    priceRange {\n      minVariantPrice { amount currencyCode }\n    }\n    compareAtPriceRange {\n      minVariantPrice { amount currencyCode }\n    }\n    featuredImage { id url altText width height }\n    variants(first: 6) {\n      nodes {\n        id\n        title\n        availableForSale\n        price { amount currencyCode }\n        compareAtPrice { amount currencyCode }\n        selectedOptions { name value }\n      }\n    }\n  }\n\n': {
    return: BookSearchQuery;
    variables: BookSearchQueryVariables;
  };
  '#graphql\n  query PredictiveSearch(\n    $country: CountryCode\n    $language: LanguageCode\n    $limit: Int!\n    $limitScope: PredictiveSearchLimitScope!\n    $term: String!\n    $types: [PredictiveSearchType!]\n  ) @inContext(country: $country, language: $language) {\n    predictiveSearch(\n      limit: $limit,\n      limitScope: $limitScope,\n      query: $term,\n      types: $types,\n    ) {\n      articles {\n        ...PredictiveArticle\n      }\n      collections {\n        ...PredictiveCollection\n      }\n      pages {\n        ...PredictivePage\n      }\n      products {\n        ...PredictiveProduct\n      }\n      queries {\n        ...PredictiveQuery\n      }\n    }\n  }\n  #graphql\n  fragment PredictiveArticle on Article {\n    __typename\n    id\n    title\n    handle\n    blog {\n      handle\n    }\n    image {\n      url\n      altText\n      width\n      height\n    }\n    trackingParameters\n  }\n\n  #graphql\n  fragment PredictiveCollection on Collection {\n    __typename\n    id\n    title\n    handle\n    image {\n      url\n      altText\n      width\n      height\n    }\n    trackingParameters\n  }\n\n  #graphql\n  fragment PredictivePage on Page {\n    __typename\n    id\n    title\n    handle\n    trackingParameters\n  }\n\n  #graphql\n  fragment PredictiveProduct on Product {\n    __typename\n    id\n    title\n    handle\n    vendor\n    coverBg: metafield(namespace: "custom", key: "cover_bg") {\n      value\n    }\n    coverInk: metafield(namespace: "custom", key: "cover_ink") {\n      value\n    }\n    trackingParameters\n    selectedOrFirstAvailableVariant(\n      selectedOptions: []\n      ignoreUnknownOptions: true\n      caseInsensitiveMatch: true\n    ) {\n      id\n      image {\n        url\n        altText\n        width\n        height\n      }\n      price {\n        amount\n        currencyCode\n      }\n    }\n  }\n\n  #graphql\n  fragment PredictiveQuery on SearchQuerySuggestion {\n    __typename\n    text\n    styledText\n    trackingParameters\n  }\n\n': {
    return: PredictiveSearchQuery;
    variables: PredictiveSearchQueryVariables;
  };
  '#graphql\n  query SharedBooks($country: CountryCode, $language: LanguageCode)\n  @inContext(country: $country, language: $language) {\n    products(first: 100, query: "product_type:Libro") {\n      nodes {\n        ...BookCard\n      }\n    }\n  }\n  #graphql\n  fragment BookCard on Product {\n    id\n    handle\n    title\n    vendor\n    tags\n    availableForSale\n    publisher: metafield(namespace: "custom", key: "publisher") { value }\n    year: metafield(namespace: "custom", key: "year") { value }\n    condition: metafield(namespace: "custom", key: "condition") { value }\n    chill: metafield(namespace: "custom", key: "chill") { value }\n    subgenre: metafield(namespace: "custom", key: "subgenre") { value }\n    coverBg: metafield(namespace: "custom", key: "cover_bg") { value }\n    coverInk: metafield(namespace: "custom", key: "cover_ink") { value }\n    priceRange {\n      minVariantPrice { amount currencyCode }\n    }\n    compareAtPriceRange {\n      minVariantPrice { amount currencyCode }\n    }\n    featuredImage { id url altText width height }\n    variants(first: 6) {\n      nodes {\n        id\n        title\n        availableForSale\n        price { amount currencyCode }\n        compareAtPrice { amount currencyCode }\n        selectedOptions { name value }\n      }\n    }\n  }\n\n': {
    return: SharedBooksQuery;
    variables: SharedBooksQueryVariables;
  };
}

interface GeneratedMutationTypes {
  '#graphql\n  mutation NewsletterSubscribe($email: String!, $password: String!) {\n    customerCreate(input: {email: $email, password: $password, acceptsMarketing: true}) {\n      customer {\n        id\n      }\n      customerUserErrors {\n        code\n        field\n        message\n      }\n    }\n  }\n': {
    return: NewsletterSubscribeMutation;
    variables: NewsletterSubscribeMutationVariables;
  };
}

declare module '@shopify/hydrogen' {
  interface StorefrontQueries extends GeneratedQueryTypes {}
  interface StorefrontMutations extends GeneratedMutationTypes {}
}
