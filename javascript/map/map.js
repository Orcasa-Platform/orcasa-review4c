const map = new maplibregl.Map({
  container: 'map',
  style: mapStyle, // stylesheet location
  center: [-74.5, 40], // starting position [lng, lat]
  zoom: 0, // starting zoom
  minZoom: 0,
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
  }, 'background');

  map.addLayer(
    {
      id: 'basemap-satellite',
      type: 'raster',
      source: 'basemap-satellite',
      paint: {
        'raster-opacity': 0,
      },
  }, 'background');

  addSquareIcon(map);
  zoomButtonStyling();

  fitMap(map, { initial: true });

  // disable map rotation using right click + drag
  map.dragRotate.disable();

  // disable map rotation using touch rotation gesture
  map.touchZoomRotate.disableRotation();


  // Disable the zoom out button if the zoom level is 0 (standard behaviour does not work)
  const zoomOutButton = document.getElementsByClassName('maplibregl-ctrl-zoom-out')?.[0];
  map.on('zoomend', () => {
    const zoomLevel = map.getZoom();
    if (zoomOutButton) {
      zoomOutButton.disabled = zoomLevel === 0;
    }
  });
});
