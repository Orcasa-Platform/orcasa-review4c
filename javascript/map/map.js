const map = new maplibregl.Map({
  container: 'map',
  style: mapStyle, // stylesheet location
  center: [0, 0], // starting position [lng, lat]
  zoom: 2, // starting zoom
  pitch: 0,
  bearing: 0,
  // The southern longitude doesn't go up to -90 on purpose so that the map looks better by
  // default i.e. less of the Antarctica is shown
  bounds: [-180, -80, 180, 90],
  minZoom: 1,
  maxZoom: 12,
});

// Set the default padding
map.setPadding(getMapPadding(true));

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

  map.addSource('basemap-relief', {
    type: 'raster',
    tiles: ['https://server.arcgisonline.com/ArcGIS/rest/services/World_Shaded_Relief/MapServer/tile/{z}/{y}/{x}'],
    tileSize: 256,
  });

  map.addLayer(
    {
      id: 'basemap-satellite',
      type: 'raster',
      source: 'basemap-satellite',
      paint: {
        'raster-opacity': 0,
      },
  }, 'background');

  map.addLayer(
    {
      id: 'basemap-light',
      type: 'raster',
      source: 'basemap-light',
      paint: {
        'raster-opacity': 0,
      },
  }, 'background');

  map.addLayer(
    {
      id: 'basemap-relief',
      type: 'raster',
      source: 'basemap-relief',
      paint: {
        'raster-opacity': 1,
      },
  }, 'background');

  addSquareIcon(map);
  zoomButtonStyling();

  // disable map rotation using right click + drag
  map.dragRotate.disable();

  // disable map rotation using touch rotation gesture
  map.touchZoomRotate.disableRotation();


  // Disable the zoom out button if the zoom level is the minZoom = 1 (standard behaviour does not work)
  const zoomOutButton = document.getElementsByClassName('maplibregl-ctrl-zoom-out')?.[0];
  map.on('zoomend', () => {
    const zoomLevel = map.getZoom();
    if (zoomOutButton) {
      zoomOutButton.disabled = zoomLevel === 1;
    }
  });
});
