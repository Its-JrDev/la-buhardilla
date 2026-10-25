import {redirect, useLoaderData} from 'react-router';
import type {Route} from './+types/collections.$handle';
import {Analytics, getPaginationVariables} from '@shopify/hydrogen';
import {CollectionView} from '~/components/CollectionView';
import {redirectIfHandleIsLocalized} from '~/lib/redirect';
import {BOOK_CARD_FRAGMENT} from '~/lib/book';
import {filtersFromUrl, sortFromUrl} from '~/lib/collection';

export const meta: Route.MetaFunction = ({data}) => [
  {title: `${data?.collection.title ?? 'Estante'} | La Buhardilla`},
  {name: 'description', content: data?.collection.description ?? ''},
];

export async function loader({context, params, request}: Route.LoaderArgs) {
  const {handle} = params;
  const {storefront} = context;
  if (!handle) throw redirect('/collections');
  const url = new URL(request.url);
  const sort = sortFromUrl(url);
  const {collection} = await storefront.query(COLLECTION_QUERY, {
    variables: {
      handle,
      filters: filtersFromUrl(url),
      sortKey: sort.sortKey,
      reverse: sort.reverse,
      ...getPaginationVariables(request, {pageBy: 12}),
    },
  });
  if (!collection) throw new Response(`Collection ${handle} not found`, {status: 404});
  redirectIfHandleIsLocalized(request, {handle, data: collection});
  return {collection, sort: sort.value};
}

export default function Collection() {
  const {collection, sort} = useLoaderData<typeof loader>();
  return (
    <>
      <CollectionView
        title={collection.title}
        description={collection.description}
        products={collection.products}
        filters={collection.products.filters}
        sort={sort}
      />
      <Analytics.CollectionView data={{collection: {id: collection.id, handle: collection.handle}}} />
    </>
  );
}

const COLLECTION_QUERY = `#graphql
  query BookShelf(
    $handle: String!
    $country: CountryCode
    $language: LanguageCode
    $filters: [ProductFilter!]
    $sortKey: ProductCollectionSortKeys
    $reverse: Boolean
    $first: Int
    $last: Int
    $startCursor: String
    $endCursor: String
  ) @inContext(country: $country, language: $language) {
    collection(handle: $handle) {
      id
      handle
      title
      description
      products(
        first: $first
        last: $last
        before: $startCursor
        after: $endCursor
        filters: $filters
        sortKey: $sortKey
        reverse: $reverse
      ) {
        filters {
          id
          label
          values {
            id
            label
            count
            input
          }
        }
        nodes {
          ...BookCard
        }
        pageInfo {
          hasPreviousPage
          hasNextPage
          endCursor
          startCursor
        }
      }
    }
  }
  ${BOOK_CARD_FRAGMENT}
` as const;
