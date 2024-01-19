window.addEventListener('load', function () {
  window.state = {
    sidebarOpen: false,
    legendOpen: true,
    filtersOpen: false,
    mapSettingsOpen: false,
    basemap: 'relief',
    labels: null,
    landUse: 'all',
    landUses: null,
    mainInterventions: [],
    filter: null,
    publicationsOpen: false,
    methodologyOpen: false,
    publicationDetailOpen: false,
    chartData: null,
    methodologyChartData: null,
    publicationsSort: 'asc',
    publicationFilters: { 'type-publication': ['meta-analysis', 'primary-paper'] },
    publicationPage: 1,
    openDropdowns: [],
    countries: null,
    journals: null,
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
    setMethodologyOpen(methodologyOpen) {
      state.methodologyOpen = methodologyOpen;
    },
    setFiltersOpen(filtersOpen) {
      state.filtersOpen = filtersOpen;
    },
    setPublicationDetailOpen(publicationOpen) {
      state.publicationDetailOpen = publicationOpen;
    },
    closeMapSettings() {
      state.mapSettingsOpen = false;
    },
    setBasemap(basemap) {
      state.basemap = basemap;
    },
    setLabels(labels) {
      state.labels = labels;
    },
    setLandUse(landUse) {
      state.landUse = landUse;
    },
    setLandUses(landUses) {
      state.landUses = landUses;
    },
    setMainInterventions(mainInterventions) {
      state.mainInterventions = mainInterventions;
    },
    setCountries(countries) {
      state.countries = countries;
    },
    setJournals(journals) {
      state.journals = journals;
    },
    setFilter(filter) {
      state.filter = filter;
    },
    setChartData(chartData) {
      state.chartData = chartData;
    },
    setMethodologyChartData(methodologyChartData) {
      state.methodologyChartData = methodologyChartData;
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
    setPublicationPage(page) {
      state.publicationPage = page;
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
    methodologyOpen: () => state.publicationOpen,
    filtersOpen: () => state.filtersOpen,
    publicationDetailOpen: () => state.publicationDetailOpen,
    publicationsSort: () => state.publicationsSort,
    landUse: () => state.landUse,
    landUses: () => state.landUses,
    mainInterventions: () => state.mainInterventions,
    chartData: () => state.chartData,
    methodologyChartData: () => state.methodologyChartData,
    filter: () => state.filter,
    openDropdowns: () => state.openDropdowns,
    publicationFilters: () => state.publicationFilters,
    publicationPage: () => state.publicationPage,
    search: () => state.search,
    countries: () => state.countries,
    journals: () => state.journals,
    publications: () => state.publications,
    labels: () => state.labels,
  };
});