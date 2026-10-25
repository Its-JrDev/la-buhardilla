import {Form, Link, useLoaderData} from 'react-router';
import type {Route} from './+types/search';
import {Analytics} from '@shopify/hydrogen';
import {type PredictiveSearchReturn, getEmptyPredictiveSearchResult} from '~/lib/search';
import type {PredictiveSearchQuery} from 'storefrontapi.generated';
import {BookGrid} from '~/components/books';
import {useQuickView} from '~/components/QuickView';
import {Icon, Cobweb} from '~/components/brand/Icons';
import {Banner, ChipLink, Crumbs, Eyebrow, SectionHead} from '~/components/ui';
import {BOOK_CARD_FRAGMENT, SHELVES, type BookCardProduct} from '~/lib/book';

export const meta: Route.MetaFunction = ({data}) => [
  {title: data && 'term' in data && data.term ? `«${data.term}» | Búsqueda | La Buhardilla` : 'Búsqueda | La Buhardilla'},
];

export async function loader({request, context}: Route.LoaderArgs) {
  const url = new URL(request.url);
  if (url.searchParams.has('predictive')) return predictiveSearch({request, context});
  return regularSearch({request, context});
}

export default function SearchPage() {
  const data = useLoaderData<typeof loader>();
  const {open, modal} = useQuickView();
  if (data.type === 'predictive') return null;
  const {term, books, suggestions, fallback, total} = data;
  const authors = [...new Set(books.map((b) => b.vendor))];

  return (
    <div className="mx-auto box-border flex max-w-[1280px] flex-col gap-10 px-4 pb-24 md:gap-14 md:px-6">
      <div className="flex flex-col gap-5">
        <Crumbs items={[{label: 'Inicio', to: '/'}, {label: 'Búsqueda'}]} />
        <Form method="get" role="search" className="flex min-h-[60px] max-w-[680px] items-center gap-2 rounded-full border-[1.5px] border-witch bg-white py-1.5 pl-5 pr-1.5 shadow-[0_14px_30px_-24px_rgba(46,16,101,.6)]">
          <span className="flex text-witch">
            <Icon name="search" size={20} />
          </span>
          <label htmlFor="q" className="sr-only">
            Buscar en la buhardilla
          </label>
          <input id="q" name="q" type="search" defaultValue={term} placeholder="Busca un título o autor" className="min-h-[46px] min-w-0 flex-1 border-0 bg-transparent font-sans text-[17px] font-bold text-midnight outline-none" />
          <button type="submit" className="btn-main btn-primary min-h-[46px] flex-none cursor-pointer rounded-full border-0 px-6 font-sans text-[15px] font-extrabold">
            Buscar
          </button>
        </Form>
      </div>

      {term && total ? (
        <section className="flex flex-col gap-7">
          <div className="flex flex-col gap-2">
            <Eyebrow>
              {total} {total === 1 ? 'libro' : 'libros'}
            </Eyebrow>
            <h1 className="m-0 font-serif text-[28px] font-black leading-[1.1] md:text-[40px]">Resultados para «{term}»</h1>
          </div>
          {authors.length === 1 || SHELVES.length ? (
            <div className="no-scrollbar -mx-4 flex items-center gap-2 overflow-x-auto px-4 md:mx-0 md:flex-wrap md:px-0">
              <span className="mr-1 hidden text-sm font-bold text-ash md:inline">También:</span>
              {authors.length === 1 ? (
                <ChipLink to={`/search?q=${encodeURIComponent(authors[0])}`} sub="Autor">
                  {authors[0]}
                </ChipLink>
              ) : null}
              {SHELVES.filter((s) => s.handle !== 'novedades').map((s) => (
                <ChipLink key={s.handle} to={`/collections/${s.handle}`} sub="Estante">
                  {s.title}
                </ChipLink>
              ))}
            </div>
          ) : null}
          <BookGrid books={books} onQuickView={open} min={190} />
        </section>
      ) : term ? (
        <div className="flex flex-col gap-5">
          <section className="relative flex flex-col items-center gap-3.5 overflow-hidden rounded-3xl bg-white px-5 py-9 text-center md:px-8 md:py-[52px]">
            <Cobweb className="absolute left-0 top-0" />
            <Icon name="ghost" size={60} strokeWidth={1.6} className="text-witch" />
            <h1 className="m-0 font-serif text-[26px] font-black leading-[1.1] md:text-[34px]">Nada responde a «{term}»</h1>
            {suggestions.length ? (
              <p className="m-0 text-[17px] text-slate md:text-[19px]">
                ¿Quisiste decir{' '}
                <Link to={`/search?q=${encodeURIComponent(suggestions[0])}`} className="font-serif font-black italic">
                  {suggestions[0]}
                </Link>
                ?
              </p>
            ) : null}
            <ul className="m-0 mt-1.5 flex list-none flex-col items-start gap-2 p-0 text-left">
              {['Revisa la ortografía.', 'Prueba con el autor o con una sola palabra.', 'Busca por estante: Horror, Thriller o Terror fantástico.'].map((t) => (
                <li key={t} className="flex items-center gap-2.5 text-[15px] text-slate">
                  <span aria-hidden="true" className="size-1.5 flex-none rounded-full bg-pumpkin-light" />
                  {t}
                </li>
              ))}
            </ul>
          </section>
          <div className="flex flex-wrap items-center gap-2">
            <span className="mr-1 text-sm font-bold text-ash">Lo más buscado:</span>
            <ChipLink to="/search?q=Lovecraft">Lovecraft</ChipLink>
            <ChipLink to="/search?q=Drácula">Drácula</ChipLink>
            <ChipLink to="/collections/ediciones-raras">Ediciones raras</ChipLink>
          </div>
        </div>
      ) : (
        <PageIntro />
      )}

      {!total && fallback.length ? (
        <section className="flex flex-col gap-6">
          <SectionHead eyebrow="Mientras tanto" title="Quizá te asuste esto" size="sm" />
          <BookGrid books={fallback} onQuickView={open} min={190} />
        </section>
      ) : null}

      <Banner
        icon="book"
        title="¿Buscas un libro que no tenemos?"
        message="Dinos cuál: lo rastreamos con editoriales y librerías de viejo."
        action="Pídenoslo"
        to="/contacto?motivo=libro"
      />
      {modal}
      <Analytics.SearchView data={{searchTerm: term, searchResults: {total, items: {}} as never}} />
    </div>
  );
}

function PageIntro() {
  return (
    <div className="flex flex-col gap-2">
      <Eyebrow>Búsqueda</Eyebrow>
      <h1 className="m-0 font-serif text-[28px] font-black md:text-[40px]">¿Qué buscas en la oscuridad?</h1>
      <p className="m-0 text-[17px] text-ash">Escribe un título, un autor o un estante.</p>
    </div>
  );
}

const SEARCH_QUERY = `#graphql
  query BookSearch($country: CountryCode, $language: LanguageCode, $term: String!)
  @inContext(country: $country, language: $language) {
    search(query: $term, types: [PRODUCT], first: 24, unavailableProducts: LAST) {
      totalCount
      nodes {
        ... on Product {
          ...BookCard
        }
      }
    }
    fallback: collection(handle: "novedades") {
      products(first: 4) {
        nodes {
          ...BookCard
        }
      }
    }
    suggestions: predictiveSearch(query: $term, limit: 3, types: [QUERY]) {
      queries {
        text
      }
    }
  }
  ${BOOK_CARD_FRAGMENT}
` as const;

async function regularSearch({request, context}: Pick<Route.LoaderArgs, 'request' | 'context'>) {
  const url = new URL(request.url);
  const term = String(url.searchParams.get('q') || '').trim();
  if (!term) return {type: 'regular' as const, term, books: [] as BookCardProduct[], total: 0, suggestions: [] as string[], fallback: [] as BookCardProduct[]};
  const data = await context.storefront.query(SEARCH_QUERY, {variables: {term}});
  const books = (data.search.nodes.filter((n) => 'handle' in n) as BookCardProduct[]).filter((b) => b.handle !== 'club-de-medianoche');
  return {
    type: 'regular' as const,
    term,
    books,
    total: books.length,
    suggestions: (data.suggestions?.queries ?? []).map((q) => q.text).filter((t) => t.toLowerCase() !== term.toLowerCase()),
    fallback: (data.fallback?.products.nodes ?? []) as BookCardProduct[],
  };
}

const PREDICTIVE_SEARCH_ARTICLE_FRAGMENT = `#graphql
  fragment PredictiveArticle on Article {
    __typename
    id
    title
    handle
    blog {
      handle
    }
    image {
      url
      altText
      width
      height
    }
    trackingParameters
  }
` as const;

const PREDICTIVE_SEARCH_COLLECTION_FRAGMENT = `#graphql
  fragment PredictiveCollection on Collection {
    __typename
    id
    title
    handle
    image {
      url
      altText
      width
      height
    }
    trackingParameters
  }
` as const;

const PREDICTIVE_SEARCH_PAGE_FRAGMENT = `#graphql
  fragment PredictivePage on Page {
    __typename
    id
    title
    handle
    trackingParameters
  }
` as const;

const PREDICTIVE_SEARCH_PRODUCT_FRAGMENT = `#graphql
  fragment PredictiveProduct on Product {
    __typename
    id
    title
    handle
    vendor
    coverBg: metafield(namespace: "custom", key: "cover_bg") {
      value
    }
    coverInk: metafield(namespace: "custom", key: "cover_ink") {
      value
    }
    trackingParameters
    selectedOrFirstAvailableVariant(
      selectedOptions: []
      ignoreUnknownOptions: true
      caseInsensitiveMatch: true
    ) {
      id
      image {
        url
        altText
        width
        height
      }
      price {
        amount
        currencyCode
      }
    }
  }
` as const;

const PREDICTIVE_SEARCH_QUERY_FRAGMENT = `#graphql
  fragment PredictiveQuery on SearchQuerySuggestion {
    __typename
    text
    styledText
    trackingParameters
  }
` as const;

// NOTE: https://shopify.dev/docs/api/storefront/latest/queries/predictiveSearch
const PREDICTIVE_SEARCH_QUERY = `#graphql
  query PredictiveSearch(
    $country: CountryCode
    $language: LanguageCode
    $limit: Int!
    $limitScope: PredictiveSearchLimitScope!
    $term: String!
    $types: [PredictiveSearchType!]
  ) @inContext(country: $country, language: $language) {
    predictiveSearch(
      limit: $limit,
      limitScope: $limitScope,
      query: $term,
      types: $types,
    ) {
      articles {
        ...PredictiveArticle
      }
      collections {
        ...PredictiveCollection
      }
      pages {
        ...PredictivePage
      }
      products {
        ...PredictiveProduct
      }
      queries {
        ...PredictiveQuery
      }
    }
  }
  ${PREDICTIVE_SEARCH_ARTICLE_FRAGMENT}
  ${PREDICTIVE_SEARCH_COLLECTION_FRAGMENT}
  ${PREDICTIVE_SEARCH_PAGE_FRAGMENT}
  ${PREDICTIVE_SEARCH_PRODUCT_FRAGMENT}
  ${PREDICTIVE_SEARCH_QUERY_FRAGMENT}
` as const;

/**
 * Predictive search fetcher
 */
async function predictiveSearch({
  request,
  context,
}: Pick<
  Route.ActionArgs,
  'request' | 'context'
>): Promise<PredictiveSearchReturn> {
  const {storefront} = context;
  const url = new URL(request.url);
  const term = String(url.searchParams.get('q') || '').trim();
  const limit = Number(url.searchParams.get('limit') || 10);
  const type = 'predictive';

  if (!term) return {type, term, result: getEmptyPredictiveSearchResult()};

  // Predictively search articles, collections, pages, products, and queries (suggestions)
  const {
    predictiveSearch: items,
    errors,
  }: PredictiveSearchQuery & {errors?: Array<{message: string}>} =
    await storefront.query(PREDICTIVE_SEARCH_QUERY, {
      variables: {
        // customize search options as needed
        limit,
        limitScope: 'EACH',
        term,
      },
    });

  if (errors) {
    throw new Error(
      `Shopify API errors: ${errors.map(({message}: {message: string}) => message).join(', ')}`,
    );
  }

  if (!items) {
    throw new Error('No predictive search data returned from Shopify API');
  }

  const total = Object.values(items).reduce(
    (acc: number, item: Array<unknown>) => acc + item.length,
    0,
  );

  return {type, term, result: {items, total}};
}
