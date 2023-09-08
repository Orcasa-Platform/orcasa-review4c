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
    elements.mapSettingsOverlay.classList.add('opacity-0');
    elements.mapSettingsOverlay.classList.remove('opacity-100');
  }
});

elements.closeMapSettingsButton.addEventListener("click", function() {
  mutations.closeMapSettings();
  elements.mapSettingsOverlay.classList.add('opacity-0');
  elements.mapSettingsOverlay.classList.remove('opacity-100');
});

elements.satelliteBasemapButton.addEventListener("click", function() {
  mutations.setBasemap('satellite');

  // Change theme in buttons
  if (elements.maplibreControls) {
    for (let element of elements.maplibreControls) {
      element.classList.add('theme-light');
    };
  }
  elements.sidebarToggle.classList.remove('btn-theme-dark');
  elements.sidebarToggle.classList.add('btn-theme-light');
  elements.mapSettingsButton.classList.remove('btn-theme-dark');
  elements.mapSettingsButton.classList.add('btn-theme-light');

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

  // Change theme in buttons
  mutations.setBasemap('light');
  if (elements.maplibreControls) {
    for (let element of elements.maplibreControls) {
      element.classList.remove('theme-light');
    }
  }
  elements.mapSettingsButton.classList.add('btn-theme-dark');
  elements.mapSettingsButton.classList.remove('btn-theme-light');
  elements.sidebarToggle.classList.add('btn-theme-dark');
  elements.sidebarToggle.classList.remove('btn-theme-light');

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