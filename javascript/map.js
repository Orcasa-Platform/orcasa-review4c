const map = new maplibregl.Map({
  container: 'map',
  style: mapStyle, // stylesheet location
  center: [-74.5, 40], // starting position [lng, lat]
  zoom: 1 // starting zoom
});

map.addControl(new maplibregl.NavigationControl({ showCompass: false }));

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