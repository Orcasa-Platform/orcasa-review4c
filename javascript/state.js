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
    setCountries(countries) {
      state.countries = countries;
    },
    setInterventions(interventions) {
      state.interventions = interventions;
    },
    setFilter(filter) {
      state.filter = filter;
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
      let filterId = dropdownId;
      if (dropdownId.startsWith('dropdown-select')) {
        filterId = dropdownId.replace('dropdown-select-', '');
      }
      state.publicationFilters = { ...state.publicationFilters, [filterId]: selectedValues };
    },
    setPublications(value) {
      state.publications = value;
    },
    setSearch(value) {
      state.search = value;
    }
  };

  window.getters = {
    sidebarOpen: () => state.sidebarOpen,
    publicationsOpen: () => state.publicationOpen,
    publicationsSort: () => state.publicationsSort,
    landUse: () => state.landUse,
    landUses: () => state.landUses,
    interventions: () => state.interventions,
    chartData: () => state.chartData,
    filter: () => state.filter,
    openDropdowns: () => state.openDropdowns,
    publicationFilters: () => state.publicationFilters,
    search: () => state.search,
    countries: () => state.countries,
    publications: () => state.publications,
  };
});