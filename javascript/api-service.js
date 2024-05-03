// Replace all mock data with real URLs
// Eg. const BASE_PUBLICATIONS_URL = 'https://review4c.org/.../publications';

const BASE_PUBLICATIONS_URL = '/mocks/data/publications';
const BASE_PUBLICATIONS_COUNT_URL = '/mocks/data/publications-count';
const BASE_CHARTS_URL = '/mocks/data/charts';
const BASE_LAYERS_URL = '/mocks/layers';
const BASE_FILTERS_URL = '/mocks/filters';

const getURLParams = (filterParams) => {
  const formData = new FormData();
  Object.entries(filterParams).forEach(([key, value]) => {
    if (value) {
      formData.append(key, value);
    }
  });
  return  new URLSearchParams(formData).toString();
};

const getURL = async (url) => {
  let data;
  try {
    const response = await fetch(url);

    if (!response.ok && response.status === 404) {
      throw new Error("Missing file:", { cause: response });
    } else {
      data = await response.json();
    }
  } catch (error) {
    console.error(error, url);
  }
  return data;
};

// Base data for the filters of the publications
// Note: We are getting the years from the available publications so the date.json file is not used
const getFilters = async (filter) => {
  return getURL(`${BASE_FILTERS_URL}/${filter}.json`);
};

const getPathname = (baseURL, landUse, sectionParams) => {
  const filteredSectionParams = sectionParams?.filter(Boolean);
  const landUsePath = landUse === 'all' ? '' : `${landUse}/`;
  const sectionPath = filteredSectionParams?.length ? `/${filteredSectionParams.join("/")}/` : '';
  return `${baseURL}/${landUsePath}${sectionPath}index.json`;
}

// GeoJSON layers on the map
const getLayer = async (landUseSlug = 'all', mainInterventionSlug, interventionSlug, subTypeSlug) => {
  const url = getPathname(BASE_LAYERS_URL, landUseSlug, [mainInterventionSlug, interventionSlug, subTypeSlug]);
  return getURL(url);
}

// Gets main interventions data for each of the the charts on a land use page
const getMainInterventionChartData = async (landUseSlug='all', mainInterventionSlug) => {
  const url = getPathname(BASE_CHARTS_URL, landUseSlug, [mainInterventionSlug]);
  return getURL(url);
};

const PAGE_SIZE = 20;

// Publication data
const getPublications = async ({ landUse, mainIntervention, intervention, subType, publicationFilters, search, sort, page, pageSize=PAGE_SIZE }) => {
  const sectionParams = [mainIntervention, intervention, subType];
  const pathname = getPathname(BASE_PUBLICATIONS_URL, landUse, sectionParams);

  // Filter params are not used now but they will be needed on the backend
  const filterParams = { ...publicationFilters, search, sort, page, pageSize };
  const params = getURLParams(filterParams);

  const url = `${pathname}?${params}`;

  // This should be done on the backend and the publicationFilters sent as part of the URL
  const applyFilters = (publications) => {
    if(!publications) return [];
    let filteredPublications = (publications || []).concat();
    if (publicationFilters) {
      filteredPublications = publications.filter(publication => {
        const { countryIsos, year, journalIds } = publication;
        const { country: countrySelection, year: yearSelection, journal: journalSelection, 'type-publication': typeSelection } = publicationFilters;

        const countryFilter = countrySelection?.length && countryIsos.length > 0 ? countrySelection.some(iso => countryIsos.includes(iso)) : true;
        const yearFilter = yearSelection?.length ? yearSelection.includes(String(year)) : true;
        const journalFilter = journalSelection?.length && journalIds.length > 0 ? journalSelection.some(jID => journalIds.map(String).includes(jID)) : true;
        const typePublicationFilter = typeSelection?.length ? typeSelection.includes(publication.type) : true;
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
      const countryNames = publication.countryIsos.map(iso => countries.find(country => country.iso_2digit === iso)?.cntry_name);
      const journalNames = publication.journalIds.map(jId => {
        const journal = journals.find(journal => journal.journal_id === jId)
        const journalName = journal?.journal_name;
        return journalName && capitalize(journalName);
      });

      publication.countries = countryNames;
      publication.journals = journalNames;

      return publication;
    });
  };

  const getMetadata = (data) => {
    if(!data) return {};

    const yearCounts = data.concat().reduce((counts, publication) => {
      const year = publication.year;
      counts[year] = (counts[year] || 0) + 1;
      return counts;
    }, {});

    const filteredData = applyFilters(data);
    return {
      totalPublications: filteredData.filter(publication => publication.type === 'primary-study').length || 0,
      totalMetaAnalysis: filteredData.filter(publication => publication.type === 'meta-analysis').length || 0,
      years: yearCounts,
      // The pages should be after filtering
      pages: Math.ceil(filteredData.length / PAGE_SIZE),
      countries: uniq(data.map(d => d.countryIsos).flat()),
      journals: uniq(data.map(d => d.journalIds).flat()),
    };
  };

  const paginate = (data) => {
    if (!page) return data;
    return data.slice(PAGE_SIZE * (page - 1), PAGE_SIZE * page);
  };

  return getURL(url).then((data) => {
    const updatedData = data;
    const metadata = getMetadata(updatedData);
    const filteredData = applyFilters(data);
    const parsedData = parseData(filteredData);
    const paginatedData = paginate(parsedData);
    return { data: paginatedData, metadata };
  });
}

const getMethodologyData = async () => {
  const url = `${BASE_PUBLICATIONS_COUNT_URL}/index.json`;
  return getURL(url);
}

// Publication data
const getPublication = async (publicationId) => {
  // NOTE: This URL will point to the endpoint that returns the details of a publication
  const url = `${BASE_PUBLICATIONS_URL}/${publicationId}.json`;
  return getURL(url);
};