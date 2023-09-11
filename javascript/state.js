const state = {
  sidebarOpen: false,
  mapSettingsOpen: false,
  basemap: 'light',
};

const mutations = {
  toggleSidebar() {
    state.sidebarOpen = !state.sidebarOpen;
  },
  toggleMapSettings() {
    state.mapSettingsOpen = !state.mapSettingsOpen;
  },
  closeMapSettings() {
    state.mapSettingsOpen = false;
  },
  setBasemap(basemap) {
    state.basemap = basemap;
  }
};

const getters = {
  sidebarOpen: () => state.sidebarOpen,
};