// Replace all with real URLs
const URLS = {
  'all':  '/mocks/layers/all-layer.json',
  'cropland':  '/mocks/layers/cropland.json',
  'forest-land':  '/mocks/layers/forest-land.json',
  'grassland':  '/mocks/layers/grassland.json',
  'wetlands':  '/mocks/layers/wetlands.json',
  'other-land':  '/mocks/layers/other-land.json',
  'countries': '/mocks/filters/country.json',
  'years': '/mocks/filters/date.json',
  'journals': '/mocks/filters/journal.json',
  'intervention': '/mocks/data/intervention.json',
  'climate-change': '/mocks/data/climate-change.json',
  'land-use': '/mocks/data/land-use.json',
  'management': '/mocks/data/management.json',
};
const BASE_PUBLICATIONS_URL = '/mocks/data/publications';

const getURL = async (url) => {
  let data;
  try {
    const response = await fetch(url);
    data = await response.json();
  } catch (error) {
    console.error(url, error);
  }
  return data;
};

const getLayer = async (layerSlug = 'all') => getURL(URLS[layerSlug]);
const getIntervention = async (intervention) => getURL(URLS[intervention]);

const getPublications = async ({ landUse, intervention, subCategory, subType, publicationFilters, search, sort, page }) => {

  const url = `${BASE_PUBLICATIONS_URL}/${landUse === 'all' ? '' : landUse}${intervention ? `/${intervention}` : ''}${subCategory ? `/${subCategory}` : ''}${subType ? `/${subType}` : ''}/publications.json`;

  // This should be done on the backend and the publicationFilters sent as part of the URL
  const applyFilters = (publications) => {
    let filteredPublications = publications || [];
    if (publicationFilters) {
      filteredPublications = publications.filter(publication => {
        const { country, year, journalId } = publication;
        const countryFilter = publicationFilters.country?.length ? publicationFilters.country.includes(country) : true;
        const yearFilter = publicationFilters.year?.length ? publicationFilters.year.includes(String(year)) : true;
        const journalFilter = publicationFilters.journal?.length ? publicationFilters.journal.includes(String(journalId)) : true;
        const typePublicationFilter = publicationFilters['type-publication']?.length ? publicationFilters['type-publication'].includes(publication.type) : true;
        return countryFilter && yearFilter && journalFilter && typePublicationFilter;
      });
    }

    if (search) {
      filteredPublications = filteredPublications.filter(publication => {
        const { title, authors } = publication;
        const titleFilter = title.toLowerCase().includes(search.toLowerCase());
        const authorsFilter = authors.toLowerCase().includes(search.toLowerCase());
        return titleFilter || authorsFilter;
      });
    }

    const sortAlphabetically = (a, b) => a.title.localeCompare(b.title);
    const sortedPublications = filteredPublications.sort(sortAlphabetically);
    return sort === 'asc' ? sortedPublications : sortedPublications.reverse();
  };

  const parseData = (publications) => {
    const countries = window.getters.countries();
    const journals = window.getters.journals();
    return publications.map(publication => {
      const country = countries.find(country => country.iso_2digit === publication.country);
      const journal = journals.find(journal => journal.journal_id === publication.journalId);
      publication.country = country?.cntry_name;
      publication.journal = capitalize(journal?.journal_name);
      return publication;
    });
  };

  const PAGE_SIZE = 20;

  const getMetadata = (data) => {
    const yearCounts = data.reduce((counts, publication) => {
      const year = publication.year;
      counts[year] = (counts[year] || 0) + 1;
      return counts;
    }, {});

    return {
      years: yearCounts,
      pages: Math.ceil(data.length / PAGE_SIZE),
    };
  };

  const paginate = (data) => {
    if (!page) return data;
    return data.slice(0, PAGE_SIZE * page);
  };

  return getURL(url).then((data) => {
    const filteredData = applyFilters(data);
    const parsedData = parseData(filteredData);
    const paginatedData = paginate(parsedData);

    return { data: paginatedData, metadata: getMetadata(filteredData) };
  });
}