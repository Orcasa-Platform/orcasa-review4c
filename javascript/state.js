const state = {
  sidebarOpen: false,
  legendOpen: true,
  mapSettingsOpen: false,
  basemap: 'light',
  intervention: 'cropland',
};

const mutations = {
  toggleSidebar() {
    state.sidebarOpen = !state.sidebarOpen;
  },
  toggleLegend() {
    state.legendOpen = !state.legendOpen;
  },
  toggleMapSettings() {
    state.mapSettingsOpen = !state.mapSettingsOpen;
  },
  closeMapSettings() {
    state.mapSettingsOpen = false;
  },
  setBasemap(basemap) {
    state.basemap = basemap;
  },
  setIntervention(intervention) {
    state.intervention = intervention;
  }
};

const getters = {
  sidebarOpen: () => state.sidebarOpen,
};