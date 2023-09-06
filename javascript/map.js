const map = new maplibregl.Map({
  container: 'map',
  style: 'https://demotiles.maplibre.org/style.json', // stylesheet location
  center: [-74.5, 40], // starting position [lng, lat]
  zoom: 1 // starting zoom
});

map.addControl(new maplibregl.NavigationControl({ showCompass: false }));

map.on('load', function() {
  map.addSource('basemap-satellite', {
    'type': 'raster',
    "tiles": ["https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"],
  });

  map.addLayer(
    {
      "id": "basemap-satellite",
      "type": "raster",
      "source": "basemap-satellite"
  });

  map.addSource('basemap-light', {
    'type': 'raster',
    "tiles": ["https://a.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png"],
  });

  map.addLayer(
    {
      "id": "basemap-light",
      "type": "raster",
      "source": "basemap-light"
  });

});