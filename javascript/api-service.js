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