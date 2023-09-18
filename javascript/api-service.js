const URLS = {
    'allLayer': 'http://review4c.net/files/int0.json',
    // ...
}

const mockLayers = {
  cropland: croplandMock,
  "forest-land": forestLandMock,
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