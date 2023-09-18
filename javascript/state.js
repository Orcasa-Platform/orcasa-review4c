const state = {
  sidebarOpen: false,
  legendOpen: true,
  mapSettingsOpen: false,
  basemap: 'light',
  landUse: 'cropland',
  landUses: null,
  interventions: null,
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
  setLandUse(landUse) {
    state.landUse = landUse;
  },
  setLandUses(landUses) {
    state.landUses = landUses;
  },
  setInterventions(interventions) {
    state.interventions = interventions;
  }
};

const getters = {
  sidebarOpen: () => state.sidebarOpen,
  landUses: () => state.landUses,
  interventions: () => state.interventions,
};