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
const getPublications = async ({ landUse, intervention, subCategory, subType, publicationFilters }) => {
  const url = `${BASE_PUBLICATIONS_URL}/${landUse}${intervention ? `/${intervention}` : ''}${subCategory ? `/${subCategory}` : ''}${subType ? `/${subType}` : ''}/publications.json`;

  // This should be done on the backend and the publicationFilters sent as part of the URL
  const applyFilters = (publications) => {
    let filteredPublications = publications;
    if (publicationFilters) {
      console.log('publicationFilters', publicationFilters)
      filteredPublications = publications.filter(publication => {
        console.log(publication)
        const { country, year, journal } = publication;
        const countryFilter = publicationFilters.country?.length ? publicationFilters.country.includes(country) : true;
        const yearFilter = publicationFilters.year?.length ? publicationFilters.year.includes(year) : true;
        const journalFilter = publicationFilters.journal?.length ? publicationFilters.journal.includes(journal) : true;
        return countryFilter && yearFilter && journalFilter;
      });
    }
    return filteredPublications;
  };

  const parseData = (publications) => {
    const countries = window.getters.countries();
    return publications.map(publication => {
      const country = countries.find(country => country.iso_2digit === publication.country);
      publication.country = country?.cntry_name;
      return publication;
    });
  };

  return getURL(url).then(data => parseData(applyFilters(data)));
}