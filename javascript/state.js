window.addEventListener('load', function () {
  window.state = {
    sidebarOpen: false,
    legendOpen: true,
    mapSettingsOpen: false,
    basemap: 'light',
    landUse: 'cropland',
    landUses: null,
    interventions: null,
    filter: null,
    publicationsOpen: false,
    chartData: null,
  };

  window.mutations = {
    toggleSidebar() {
      state.sidebarOpen = !state.sidebarOpen;
    },
    toggleLegend() {
      state.legendOpen = !state.legendOpen;
    },
    toggleMapSettings() {
      state.mapSettingsOpen = !state.mapSettingsOpen;
    },
    setPublicationsOpen(publicationsOpen) {
      state.publicationsOpen = publicationsOpen;
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
    },
    setFilter(type, value) {
      state.filter = { type: type, value: value };
    },
    setChartData(chartData) {
      state.chartData = chartData;
    },
  };

  window.getters = {
    sidebarOpen: () => state.sidebarOpen,
    publicationsOpen: () => state.publicationOpen,
    landUses: () => state.landUses,
    interventions: () => state.interventions,
    chartData: () => state.chartData,
    filter: () => state.filter,
  };
});