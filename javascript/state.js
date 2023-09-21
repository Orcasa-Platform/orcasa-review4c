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
    publicationsSort: 'asc',
    publicationFilters: {},
    openDropdowns: [],
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
    togglePublicationsSort() {
      state.publicationsSort = state.publicationsSort === 'asc' ? 'desc' : 'asc';
    },
    setOpenDropdown(dropdown, value) {
      if (value) {
        state.openDropdowns.push(dropdown);
      } else {
        if(!state.openDropdowns) state.openDropdowns = [];
        if(!state.openDropdowns.includes(dropdown)) return state.openDropdowns;
        state.openDropdowns = state.openDropdowns.filter(item => item !== dropdown);
      }
    },
    setPublicationFilters(dropdownId, selectedValues) {
      state.publicationFilters = { ...state.publicationFilters, [dropdownId]: selectedValues };
    },
    setSearch(value) {
      state.search = value;
    }
  };

  window.getters = {
    sidebarOpen: () => state.sidebarOpen,
    publicationsOpen: () => state.publicationOpen,
    publicationsSort: () => state.publicationsSort,
    landUses: () => state.landUses,
    interventions: () => state.interventions,
    chartData: () => state.chartData,
    filter: () => state.filter,
    openDropdowns: () => state.openDropdowns,
    publicationFilters: () => state.publicationFilters,
    search: () => state.search,
  };
});