const markers = [];
let popup = null;
let mapListener = null;

const getMarkerSizeClasses = (feature) => {
  const countClassesTuples = [
    [10, ['h-5', 'w-5']],
    [500, ['h-10', 'w-10']],
    [5000, ['h-[60px]', 'w-[60px]']],
    [Infinity, ['h-20', 'w-20']],
  ];

  const count = feature.properties.number_primary_studies;
  return countClassesTuples.find(([limit]) => count < limit)[1];
}

const createHTMLMarker = (feature, isCluster, onClick) => {
  const element = document.createElement('button');
  element.type = 'button';

  const classes = [
    'flex',
    'items-center',
    'justify-center',
    'bg-mod-sc-ev',
    ...getMarkerSizeClasses(feature),
    ...(!isCluster ? ['border-2', 'border-gray-800'] : [])
  ];
  element.classList.add(...classes);

  element.innerHTML = `
    <div class="text-sm text-white">
      ${formatNumber(feature.properties.number_primary_studies)}
    </div>
  `;

  element.addEventListener('click', onClick);

  return element;
};

const getHTMLPopup = (feature) => {
  const { country_name, number_primary_studies, effect_outcomes } = feature?.properties || {};
  const outcomesList = Object.entries(effect_outcomes)
    .sort((a, b) => b[1] - a[1])
    .map(([key, value]) => (`
      <span class="text-right">${formatNumber(value)}</span>
      <span class="font-semibold text-mod-sc-ev">${key}</span>
    `)).join('');

  return `
    <div class="h-full flex flex-col gap-y-4">
      <h4 class="shrink-0 text-slate-700 text-lg font-serif">
        Publications in ${country_name}
      </h4>
      <button type="button" id="popup-close-button" class="shrink-0 inline-flex items-center justify-center text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 font-sans bg-gray-700 hover:bg-gray-500 text-white h-10 w-10 absolute right-0 top-0">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"
          stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-6 w-6">
          <path d="M18 6 6 18"></path>
          <path d="m6 6 12 12"></path>
        </svg>
        <span class="sr-only">Close popup</span>
      </button>
      <div class="grow overflow-y-auto overflow-x-hidden font-sans text-base">
        <div class="grid grid-cols-[min-content_1fr] auto-rows-auto gap-x-2 w-full">
          <span class="mb-6">${formatNumber(number_primary_studies)}</span>
          <span class="mb-6 font-semibold text-mod-sc-ev">total</span>
          <hr class="col-span-2 mb-4 border-dashed border-gray-200 h-0" />
          ${outcomesList}
        </div>
      </div>
    </div>
  `;
};

const addLayer = async (map, landUseSlug="all", mainInterventionSlug, interventionSlug, subTypeSlug) => {
  // Remove the previous listeners from the map
  if (mapListener) {
    map.off('move', mapListener);
    map.off('moveend', mapListener);
    mapListener = null;
  }

  const layerData = await getLayer(landUseSlug, mainInterventionSlug, interventionSlug, subTypeSlug);
  const features = Object.values(layerData ?? {}).map(country => {
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

  // The clustering depends on the map's current position and zoom level
  mapListener = () => {
    // Remove all the markers from the map
    markers.forEach((marker) => {
      marker.remove();
    });
  
    markers.length = 0;

    const bbox = map.getBounds().toArray().flat();
    const zoom = map.getZoom();
    
    const supercluster = new Supercluster({
      radius: 100,
      reduce: (res, { number_primary_studies }) => {
        res.number_primary_studies += number_primary_studies;
      },
    }).load(features);
    const clusters = supercluster.getClusters(bbox, zoom);

    clusters.map((cluster) => {
      const isCluster = cluster.properties.cluster;

      const onClickMarker = (e) => {
        e.stopPropagation();

        if (isCluster) {
          // We zoom to expand the cluster
          const targetZoom = supercluster.getClusterExpansionZoom(cluster.properties.cluster_id);
          map.flyTo({
            center: cluster.geometry.coordinates,
            zoom: targetZoom,
          });
        } else {
          // We remove the eventual popup
          if (popup) {
            popup.remove();
            popup = null;
          }

          // We display a popup with the country's publications data
          popup = new maplibregl.Popup({ closeButton: false, offset: 40  })
            .setLngLat(cluster.geometry.coordinates)
            .setHTML(getHTMLPopup(cluster))
            .addTo(map);

          document.getElementById('popup-close-button').addEventListener("click", () => {
            popup.remove();
            popup = null;
          });
        }
      };

      const marker = new maplibregl.Marker({
        element: createHTMLMarker(cluster, isCluster, onClickMarker)
      }).setLngLat(cluster.geometry.coordinates)
        .addTo(map);

      markers.push(marker);
    });
  };

  // Add the listener to recompute the clusters and execute it once to render the initial view
  map.on('move', mapListener);
  map.on('moveend', mapListener);

  mapListener();
};