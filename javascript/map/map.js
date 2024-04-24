window.loadMap = function() {
  mapboxgl.accessToken = window.MAPBOX_TOKEN;

  window.map = new mapboxgl.Map({
    container: 'map',
    style: "mapbox://styles/orcasa/clu14cfkp01nx01nrc851220b",
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
  window.map.setPadding(getMapPadding(true));

  window.map.addControl(new mapboxgl.NavigationControl({ showCompass: false }));

  window.map.on('load', function() {
    addSquareIcon(map);
    zoomButtonStyling();

    // disable map rotation using right click + drag
    window.map.dragRotate.disable();

    // disable map rotation using touch rotation gesture
    window.map.touchZoomRotate.disableRotation();


    // Disable the zoom out button if the zoom level is the minZoom = 1 (standard behaviour does not work)
    const zoomOutButton = document.getElementsByClassName('mapboxgl-ctrl-zoom-out')?.[0];
    window.map.on('zoomend', () => {
      const zoomLevel = window.map.getZoom();
      if (zoomOutButton) {
        zoomOutButton.disabled = zoomLevel === 1;
      }
    });
  });

  // Start with light boundaries and labels active
  window.mutations.setLabels(true);
  window.mutations.setBoundaries(true);

  addDataLayer(map);

  new Promise((resolve) => {
    if (window.map.isStyleLoaded()) {
      resolve();
    } else {
      window.map.on('load', resolve);
    }
  }).then(() => {
    const layers = window.map.getStyle().layers;
    // Hide the dark boundary layers from the map
    const darkBoundaryLayersGroup = layers.find((layer) => layer.id === 'admin-0-boundary-bg-dark').metadata['mapbox:group'];
    const darkBoundaryLayers = layers.filter((layer) => layer.metadata?.['mapbox:group'] === darkBoundaryLayersGroup);
    darkBoundaryLayers.forEach((layer) => {
      window.map.setLayoutProperty(layer.id, 'visibility', 'none');
    });

    // Show light boundary layers
    const lightBoundaryLayersGroup = layers.find((layer) => layer.id === 'admin-0-boundary-light').metadata['mapbox:group'];
    const lightBoundaryLayers = layers.filter((layer) => layer.metadata?.['mapbox:group'] === lightBoundaryLayersGroup);
    lightBoundaryLayers.forEach((layer) => {
      window.map.setLayoutProperty(layer.id, 'visibility', 'visible');
    });

    // Show the light label layers
    const lightLabelLayersGroup = layers.find((layer) => layer.id === 'country-label-dark');
    const lightLabelLayers = layers.filter((layer) => layer.metadata?.['mapbox:group'] === lightLabelLayersGroup.metadata['mapbox:group']);
    lightLabelLayers.forEach((layer) => {
      window.map.setLayoutProperty(layer.id, 'visibility', 'visible');
    });
    console.log('layers', layers.map(layer => [layer.id, layer.layout?.visibility]));
  }).catch((error) => {
    console.error('Error loading style:', error);
  });
};