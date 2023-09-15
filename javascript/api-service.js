const URLS = {
    'allLayer': 'http://review4c.net/files/int0.json',
}

const getLayer = async () => {
  let layer;
  try {
    // Currently we have CORS errors when fetching so we are using a mock
    const response = await fetch(URLS.allLayer);
    layer = await response.json();
  } catch (error) {
    console.error(error);
  }

  return layer || allLayerMock;
};