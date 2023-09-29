const addLayer = (map, landUseSlug="all", mainInterventionSlug, interventionSlug, subTypeSlug) => {
  const layerSlug = landUseSlug === 'all' ? 'all' : `${landUseSlug}${mainInterventionSlug ? `-${mainInterventionSlug}` : ''}${interventionSlug ? `-${interventionSlug}` : ''}${subTypeSlug ? `-${subTypeSlug}` : ''}`;
  const currentLayers = map.getStyle()?.layers;
  const currentSources = map.getStyle()?.sources;
  const layerName = `layer-${layerSlug}`;

  // Get the layer and load it if not already loaded
  if (!currentSources[layerName] || !currentLayers.find(l => l.id === layerName)) {
    getLayer(landUseSlug, mainInterventionSlug, interventionSlug, subTypeSlug).then(layer => {
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

      if (!currentSources[layerName]) {
        // ADD SOURCE. SAME FOR CLUSTERS AND LAYER
        map.addSource(layerName, {
          'type': 'geojson',
          'data': geoJSONContent,
          cluster: true,
          clusterMaxZoom: 14, // Max zoom to cluster points on
          clusterRadius: 100, // Radius of each cluster when clustering points
          clusterProperties: {
            number_primary_studies: ['+', ['get', 'number_primary_studies']]
          }
        });
      }

      if (!currentLayers.find(l => l.id === layerName)) {

        // ADD CLUSTERS
        map.addLayer({
          id: `clusters-${layerName}`,
          type: 'symbol',
          source: layerName,
          filter: ['has', 'point_count'],
          'layout': {
            'text-field': '{number_primary_studies}',
            'text-size': 16,
            'text-font': ['Roboto Slab'],
            'text-offset': [0, -0.5],
            'text-anchor': 'top',
            'icon-image': 'square',
            'icon-size': [
              'interpolate',
              ['exponential', 2],
              ['get', 'number_primary_studies'],
              0, 0.8,
              50000, 1.6
            ],
            // We need to allow overlap to avoid dissapearing clusters
            'text-allow-overlap' : true,
            'text-ignore-placement': true,
            'icon-allow-overlap': true,
            'icon-ignore-placement': true,
          },
          'paint': {
            'text-color': '#3C4363',
            'icon-color': [
              'step',
              ['get', 'number_primary_studies'],
              '#B0F2BC',
              100,
              '#89E8AC',
              500,
              '#67DBA5',
              1000,
              '#4CC8A3',
              5000,
              '#2BB3A7'
            ]
          }
        });

        // ADD LAYER
        map.addLayer({
          'id': layerName,
          'source': layerName,
          'type': 'symbol',
          filter: ['!', ['has', 'point_count']],
          'layout': {
            'text-field': '{number_primary_studies}',
            'text-size': 16,
            'text-font': ['Roboto Slab'],
            'text-offset': [0, -0.5],
            'text-anchor': 'top',
            'text-allow-overlap': true,
            'text-ignore-placement': true,
            'icon-image': 'square',
            'icon-size': [
              'interpolate',
              ['exponential', 2],
              ['get', 'number_primary_studies'],
              0, 0.8,
              50000, 1.6
            ],
            'icon-allow-overlap': true,
            'icon-ignore-placement': true,
          },
          'paint': {
            'text-color': '#fff',
            'icon-color':"#3C4363"
          }
        });

        // Clusters zoom on click
        map.on('click', `clusters-${layerName}`, (e) => {
          const features = map.queryRenderedFeatures(e.point, {
            layers: [`clusters-${layerName}`]
          });
          const clusterId = features[0].properties.cluster_id;
          const leftPadding = elements.sidebar.getBoundingClientRect().right;
          map.getSource(layerName).getClusterExpansionZoom(
              clusterId,
              (err, zoom) => {
                  if (err) return;

                  map.easeTo({
                      center: features[0].geometry.coordinates,
                      zoom,
                      padding: { left: leftPadding }
                  });
              }
          );
        });

        // ADD TOOLTIP
        map.on('click', layerName, (event) => {
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

            const popup = new maplibregl.Popup({ closeButton: false })
              .setLngLat(feature.geometry.coordinates)
              .setHTML(tooltipHTML)
              .addTo(map);

            document.getElementById('popup-close-button').addEventListener("click", () => popup.remove());
        })
      }
    });
  }

  currentLayers.forEach(layer => {
    const layerId = layer.id;
    const selectedLayerId = `layer-${layerSlug}`;
    if (
      layerId.startsWith('layer-') && layerId !== selectedLayerId ||
      layerId.startsWith('clusters-') && !layerId.startsWith(`clusters-${selectedLayerId}`)
    ) {
      map.setLayoutProperty(layerId, 'visibility', 'none');
    }

    if (layerId === selectedLayerId || layerId === `clusters-${selectedLayerId}`) {
      map.setLayoutProperty(layerId, 'visibility', 'visible');
    }
  });
};