const map = new maplibregl.Map({
  container: 'map',
  style: mapStyle, // stylesheet location
  center: [-74.5, 40], // starting position [lng, lat]
  zoom: 1, // starting zoom
  minZoom: 1,
});

map.addControl(new maplibregl.NavigationControl({ showCompass: false }));

const addSquareIcon = (map) => {
  const width = 64; // The image will be 64 pixels square
  const bytesPerPixel = 4; // Each pixel is represented by 4 bytes: red, green, blue, and alpha.
  const data = new Uint8Array(width * width * bytesPerPixel);
  for (let x = 0; x < width; x++) {
    for (let y = 0; y < width; y++) {
      const offset = (y * width + x) * bytesPerPixel;
      data[offset + 0] = 0; // red
      data[offset + 1] = 0; // green
      data[offset + 2] = 0; // blue
      data[offset + 3] = 200; // alpha
    }
  }
  // sdf is needed to be able to change icon color
  map.addImage('square', { width, height: width, data}, { sdf: true } );
}

map.on('load', function() {
  map.addSource('basemap-satellite', {
    type: 'raster',
    tiles: ['https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'],
    tileSize: 256,
  });

  map.addSource('basemap-light', {
    type: 'raster',
    tiles: ['https://a.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png'],
    tileSize: 256,
  });

  map.addLayer(
    {
      id: 'basemap-light',
      type: 'raster',
      source: 'basemap-light',
      paint: {
        'raster-opacity': 1,
      },
  }, 'countries-labels');

  map.addLayer(
    {
      id: 'basemap-satellite',
      type: 'raster',
      source: 'basemap-satellite',
      paint: {
        'raster-opacity': 0,
      },
  }, 'countries-labels');

  // Fetch main layer
  getLayer().then(layer => {
    const countryValues = layer && Object.values(layer);
    const features = countryValues && countryValues.map(country => {
      const geom = country.geom && JSON.parse(country.geom)?.[0];
      return ({
        type: "Feature",
        geometry: geom.geometry,
        properties: {
          number_primary_studies: country.number_primary_studies,
          effect_outcomes: country.effect_outcomes,
          country_name: geom?.properties?.long_name,
          id: geom?.properties?.id,
        }
      }
  )});
    const geoJSONContent = {
      type: 'FeatureCollection',
      features: features,
    };
    console.log(geoJSONContent)
    map.addSource('layer', {
      'type': 'geojson',
      'data': geoJSONContent
    });

    addSquareIcon(map);

    map.addLayer({
      'id': 'all-layer-text',
      'source': 'layer',
      'type': 'symbol',
      'layout': {
        'text-field': '{number_primary_studies}',
        'text-size': 10,
        'text-offset': [0, -0.5],
        'text-anchor': 'top',
        'icon-image': 'square',
        'icon-size': [
          'interpolate',
          ['linear'],
          ['get', 'number_primary_studies'],
          0, 0.4,
          50000, 2
        ],
        'icon-allow-overlap': true,
        'icon-ignore-placement': true,
      },
      'paint': {
        'text-color': '#fff',
        'icon-color': [
          'step',
          ['get', 'number_primary_studies'],
          '#63C5B9',
          10,
          '#2BB3A7',
          50,
          '#288F86',
          100,
          '#1E6B65'
        ]
      }
    });
  });
  const zoomInButton = document.querySelector('button.maplibregl-ctrl-zoom-in .maplibregl-ctrl-icon');
  const zoomOutButton = document.querySelector('button.maplibregl-ctrl-zoom-out .maplibregl-ctrl-icon');

  const zoomInSVG = `<svg xmlns="http://www.w3.org/2000/svg" class="h-[24px] w-[24px]" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-full w-full">
    <line x1="12" x2="12" y1="5" y2="19">
    </line>
    <line x1="5" x2="19" y1="12" y2="12"></line>
  </svg>`
  const zoomOutSVG = `<svg xmlns="http://www.w3.org/2000/svg" class="h-[24px] w-[24px]" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-full w-full">
    <line x1="5" x2="19" y1="12" y2="12"></line>
  </svg>`;
  zoomInButton.innerHTML = zoomInSVG;
  zoomOutButton.innerHTML = zoomOutSVG;
});