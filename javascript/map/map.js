const map = new maplibregl.Map({
  container: 'map',
  style: mapStyle, // stylesheet location
  center: [-74.5, 40], // starting position [lng, lat]
  zoom: 2, // starting zoom
  minZoom: 1,
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

  addSquareIcon(map);
  addLayer(map);
  zoomButtonStyling();
});