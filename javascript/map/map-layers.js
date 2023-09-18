const addLayer = (map, layerSlug) => {
  const currentLayers = map.getStyle().layers;
  const currentSources = map.getStyle().sources;
  getLayer(layerSlug).then(layer => {
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
    const layerName = layerSlug ? `layer-${layerSlug}` : 'layer-all';

    if (!currentSources[layerName]) {
      map.addSource(layerName, {
        'type': 'geojson',
        'data': geoJSONContent
      });
    }

    const textLayerName = `${layerName}-text`;
    if (!currentLayers.find(l => l.id === textLayerName)) {
      map.addLayer({
        'id': `${layerName}-text`,
        'source': layerName,
        'type': 'symbol',
        'layout': {
          'text-field': '{number_primary_studies}',
          'text-size': 10,
          'text-offset': [0, -0.5],
          'text-anchor': 'top',
          'text-allow-overlap': true,
          'text-ignore-placement': true,
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
            '#6EE7B7',
            10,
            '#14B8A6',
            50,
            '#288F86',
            100,
            '#1E6B65'
          ]
        }
      });
    }
  });

  // TOOLTIP

  map.on('click', 'all-layer-text', (event) => {
    const feature = event.features?.[0];
    const { country_name, number_primary_studies, effect_outcomes } = feature?.properties || {};
    const parsedEffectOutcomes = effect_outcomes && JSON.parse(effect_outcomes);
    const outcomesList = Object.entries(parsedEffectOutcomes).map(([key, value]) => (
      `<div class="flex w-full">
        <span class="text-right w-[24px] mr-2">${value}</span>
        <span >${key}</span>
      </div>`
    )).join('');

    const tooltipHTML = `
      <div class="space-y-4">
        <h4 class="text-slate-700 text-xl font-semibold font-serif leading-[30px]">
          ${country_name}
        </h4>
        <button type="button" id="popup-close-button" class="absolute right-4 top-4 !m-0">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"
            stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-6 w-6">
            <path d="M18 6 6 18"></path>
            <path d="m6 6 12 12"></path>
          </svg>
        </button>
        <div class="flex flex-col max-h-[140px] overflow-y-auto overflow-x-hidden gap-4">
          <div class="text-slate-700">
            <span>${number_primary_studies}</span>
            <span>total</span>
          </div>
          <div>${outcomesList}</div>
        </div>
      </div>`

      const popup = new maplibregl.Popup({ closeButton:false })
        .setLngLat(feature.geometry.coordinates)
        .setHTML(tooltipHTML)
        .addTo(map)
      document.getElementById('popup-close-button').addEventListener("click", () => popup.remove());
  })
};