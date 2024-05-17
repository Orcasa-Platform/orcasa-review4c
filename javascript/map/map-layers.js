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

const createHTMLMarker = (feature, onClick) => {
  const element = document.createElement('button');
  element.type = 'button';

  const classes = [
    'flex',
    'items-center',
    'justify-center',
    'bg-mod-sc-ev',
    'rounded-full',
    ...getMarkerSizeClasses(feature),
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
  const { country_name, effect_outcomes } = feature?.properties || {};
  const capitalize = (string) => string.charAt(0).toUpperCase() + string.slice(1);
  const outcomesList = Object.entries(effect_outcomes)
    .sort((a, b) => b[1] - a[1])
    .map(([key, value]) => (`<div class="text-gray-700">${capitalize(key)} (${formatNumber(value)})</div>`)).join('');

  return `
    <div class="p-6 h-full flex flex-col gap-y-6">
      <h4 class="shrink-0 text-slate-700 text-xl font-serif">
        Publications in <span class="font-semibold">${country_name}</span>
      </h4>
      <button type="button" id="popup-close-button" class="btn-close absolute right-3 top-3">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"
          stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4 text-gray-700">
          <path d="M18 6 6 18"></path>
          <path d="m6 6 12 12"></path>
        </svg>
        <span class="sr-only">Close popup</span>
      </button>
      <div class="grow overflow-y-auto overflow-x-hidden font-sans text-base min-h-[88px]">
        <div class="w-full space-y-3">
          ${outcomesList}
        </div>
      </div>
      <div class="bg-white flex w-full pt-6 border-t border-gray-200 items-center gap-6">
        <div class="text-slate-700 text-sm">Learn more about concrete practices on the ground:</div>
        <a href="/practices" rel="noreferrer" class="flex px-4 py-2 rounded-lg border border-neutral-300 justify-center items-center gap-2 bg-white hover:bg-gray-50">
            <i class="w-4 h-4 relative" data-lucide="tractor"></i>
            <div class="text-slate-700 text-sm font-normal font-['Roboto'] leading-snug">Practices</div>
        </a>
        </div>
      </div>
    </div>
  `;
};

const addDataLayer = async (map, landUseSlug="all") => {
  // Remove the previous listeners from the map
  if (mapListener) {
    window.map.off('move', mapListener);
    window.map.off('moveend', mapListener);
    mapListener = null;
  }
  const layerData = await getLayer(landUseSlug);
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

    const bbox = window.map.getBounds().toArray().flat();
    const zoom = window.map.getZoom();

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
          window.map.flyTo({
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
          popup = new mapboxgl.Popup({ closeButton: false, offset: 40  })
            .setLngLat(cluster.geometry.coordinates)
            .setHTML(getHTMLPopup(cluster))
            .addTo(map);

          // Show the tractor icon
          lucide.createIcons();

          document.getElementById('popup-close-button').addEventListener("click", () => {
            popup.remove();
            popup = null;
          });
        }
      };

      const marker = new mapboxgl.Marker({
        element: createHTMLMarker(cluster, onClickMarker)
      }).setLngLat(cluster.geometry.coordinates)
        .addTo(map);

      markers.push(marker);
    });
  };

  // Add the listener to recompute the clusters and execute it once to render the initial view
  window.map.on('move', mapListener);
  window.map.on('moveend', mapListener);

  mapListener();
};