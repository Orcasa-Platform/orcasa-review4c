const URLS = {
    'allLayer': 'http://review4c.net/files/int0.json',
    'countries': '/javascript/mocks/country.json', // Replace with real URL
    'years': '/javascript/mocks/date.json', // Replace with real URL
    'journals': '/javascript/mocks/journal.json', // Replace with real URL
    // ...
}

const mockLayers = {
  cropland: cropLandMock,
  "forest-land": forestLandMock,
  'grassland': grassLandMock,
  'wetlands': wetLandMock,
  'other-land': otherLandMock,
};

const getLayer = async (layerSlug) => {
  let layer;
  try {
    // Currently we have CORS errors when fetching so we are using a mock
    // const response = await fetch(URLS.allLayer);
    // layer = await response.json();
  } catch (error) {
    console.error(error);
  }

  return layer || mockLayers[layerSlug] || allLayerMock;
};

const getData = async () => {
  let data;
  try {
    // Using a mock until we have real data
    // const response = await fetch(URLS.data);
    // layer = await response.json();
  } catch (error) {
    console.error(error);
  }

  return data || interventionData;
};

const getIntervention = async (intervention) => {
  const {
    // URL,
    slug
  } = intervention;
  let interventionData;
  try {
    // Using a mock until we have real data
    // const response = await fetch(URL);
    // layer = await response.json();
  } catch (error) {
    console.error(error);
  }
  return interventionData || interventionMocks[slug];
};

const getURL = async (url) => {
  let data;
  try {
    const response = await fetch(url);
    data = await response.json();
  } catch (error) {
    console.error(error);
  }
  return data;
}