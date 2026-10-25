import {useLoaderData} from 'react-router';
import type {Route} from './+types/collections.all';
import {getPaginationVariables} from '@shopify/hydrogen';
import type {ProductSortKeys} from '@shopify/hydrogen/storefront-api-types';
import {CollectionView} from '~/components/CollectionView';
import {BOOK_CARD_FRAGMENT} from '~/lib/book';
import {sortFromUrl} from '~/lib/collection';

export const meta: Route.MetaFunction = () => [{title: 'Todo el catálogo | La Buhardilla'}];

const SORT_KEYS: Record<string, ProductSortKeys> = {CREATED: 'CREATED_AT', PRICE: 'PRICE', TITLE: 'TITLE', BEST_SELLING: 'BEST_SELLING'};

export async function loader({context, request}: Route.LoaderArgs) {
  const sort = sortFromUrl(new URL(request.url));
  const {products} = await context.storefront.query(CATALOG_QUERY, {
    variables: {
      sortKey: SORT_KEYS[sort.sortKey] ?? 'CREATED_AT',
      reverse: sort.reverse,
      ...getPaginationVariables(request, {pageBy: 12}),
    },
  });
  return {products, sort: sort.value};
}

export default function Catalog() {
  const {products, sort} = useLoaderData<typeof loader>();
  return (
    <CollectionView
      title="Todo el catálogo"
      description="Los tres estantes de la buhardilla, de la primera repisa a la última."
      products={products}
      sort={sort}
    />
  );
}

const CATALOG_QUERY = `#graphql
  query Catalog(
    $country: CountryCode
    $language: LanguageCode
    $sortKey: ProductSortKeys
    $reverse: Boolean
    $first: Int
    $last: Int
    $startCursor: String
    $endCursor: String
  ) @inContext(country: $country, language: $language) {
    products(
      first: $first
      last: $last
      before: $startCursor
      after: $endCursor
      sortKey: $sortKey
      reverse: $reverse
      query: "product_type:Libro"
    ) {
      nodes {
        ...BookCard
      }
      pageInfo {
        hasPreviousPage
        hasNextPage
        startCursor
        endCursor
      }
    }
  }
  ${BOOK_CARD_FRAGMENT}
` as const;
