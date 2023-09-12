const elements = {
  sidebar: document.getElementById('sidebar'),
  sidebarToggle: document.getElementById('sidebar-toggle'),
  mapSettingsButton: document.getElementById('map-settings-button'),
  mapSettingsOverlay: document.getElementById('map-settings-overlay'),
  closeMapSettingsButton: document.getElementById('close-map-settings-button'),
  satelliteBasemapButton: document.getElementById('satellite-basemap-button'),
  lightBasemapButton: document.getElementById('light-basemap-button'),
  satelliteBasemapContainer: document.getElementById('satellite-basemap-container'),
  lightBasemapContainer: document.getElementById('light-basemap-container'),
  maplibreControls: document.getElementsByClassName('maplibregl-ctrl'),
  attribution: document.getElementById('attribution'),
  attributionContent: document.getElementById('attribution-content'),
}

// SIDEBAR

elements.sidebarToggle.addEventListener("click", function() {
  mutations.toggleSidebar();
  if (state.sidebarOpen) {
    elements.sidebar.classList.add('-translate-x-full');
    elements.sidebarToggle.classList.add('rotate-180');
  } else {
    elements.sidebar.classList.remove('-translate-x-full');
    elements.sidebarToggle.classList.remove('rotate-180');
  }
});

// MAP SETTINGS

elements.mapSettingsButton.addEventListener("click", function() {
  mutations.toggleMapSettings();
  if (state.mapSettingsOpen) {
    elements.mapSettingsOverlay.classList.remove('hidden');
  } else {
    elements.mapSettingsOverlay.classList.add('hidden');
  }
});

elements.closeMapSettingsButton.addEventListener("click", function() {
  mutations.closeMapSettings();
  elements.mapSettingsOverlay.classList.add('hidden');
});

elements.satelliteBasemapButton.addEventListener("click", function() {
  mutations.setBasemap('satellite');

  // Change theme in buttons and attribution
  if (elements.maplibreControls) {
    for (let element of elements.maplibreControls) {
      element.classList.add('theme-light');
    };
  }
  elements.sidebarToggle.classList.remove('sidebar-toggle-theme-dark');
  elements.sidebarToggle.classList.add('sidebar-toggle-theme-light');
  elements.mapSettingsButton.classList.remove('btn-theme-dark');
  elements.mapSettingsButton.classList.add('btn-theme-light');

  elements.attribution.classList.add('text-white');
  elements.attribution.classList.remove('text-black');

  // Update attribution content
  elements.attributionContent.innerHTML = `<span>
  Tiles ©
  <a
    className="hover:underline"
    rel="noopener noreferrer"
    target="_blank"
    href="https://esri.com"
  >
    Esri
  </a>
  — Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP,
  and the GIS User Community</span>`;

  // Update map settings popup
  elements.lightBasemapContainer.classList.remove('outline');
  elements.satelliteBasemapContainer.classList.add('outline');

  // Change basemap
  map.setPaintProperty(
    'basemap-light',
    'raster-opacity',
    0
  );
  map.setPaintProperty(
    'basemap-satellite',
    'raster-opacity',
    1
  );
});

elements.lightBasemapButton.addEventListener("click", function() {

  // Change theme in buttons and attribution
  mutations.setBasemap('light');
  if (elements.maplibreControls) {
    for (let element of elements.maplibreControls) {
      element.classList.remove('theme-light');
    }
  }
  elements.mapSettingsButton.classList.add('btn-theme-dark');
  elements.mapSettingsButton.classList.remove('btn-theme-light');
  elements.sidebarToggle.classList.add('sidebar-toggle-theme-dark');
  elements.sidebarToggle.classList.remove('sidebar-toggle-theme-light');

  elements.attribution.classList.add('text-black');
  elements.attribution.classList.remove('text-white');

  // Update attribution content
  elements.attributionContent.innerHTML = `<span>©
  <a
    class="hover:underline"
    rel="noopener noreferrer"
    target="_blank"
    href="https://www.openstreetmap.org/">
    OpenStreetMap
  </a>
  contributors ©
  <a
    class="hover:underline"
    rel="noopener noreferrer"
    target="_blank"
    href="https://carto.com/">
    CARTO
  </a></span>`;

  // Update map settings popup
  elements.lightBasemapContainer.classList.add('outline');
  elements.satelliteBasemapContainer.classList.remove('outline');

  // Change basemap
  map.setPaintProperty(
    'basemap-light',
    'raster-opacity',
    1
  );
  map.setPaintProperty(
    'basemap-satellite',
    'raster-opacity',
    0
  );
});