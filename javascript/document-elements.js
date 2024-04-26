const elements = {
  sidebar: document.getElementById('sidebar'),
  legend: document.getElementById('legend'),
  main: document.getElementById('main'),
  map: document.getElementById('map'),
  mobileMenu: document.getElementById('mobile-menu'),
  mobileMenuButton: document.getElementById('btn-mobile-menu'),
  mobileMenuClose: document.getElementById('btn-close-mobile-menu'),
  footerMenu: document.getElementById('footer-menu'),
  sidebarToggle: document.getElementById('sidebar-toggle'),
  sidebarToggleContainer: document.getElementById('sidebar-toggle-container'),
  infoTooltipButton: document.getElementById('btn-info-tooltip'),
  infoTooltipContent: document.getElementById('info-tooltip'),
  mapSettingsButton: document.getElementById('map-settings-button'),
  mapSettingsOverlay: document.getElementById('map-settings-overlay'),
  closeMapSettingsButton: document.getElementById('close-map-settings-button'),
  satelliteBasemapButton: document.getElementById('satellite-basemap-button'),
  lightBasemapButton: document.getElementById('light-basemap-button'),
  landUseButtons: document.getElementsByClassName('btn-land-use'),
  dropdowns: document.getElementsByClassName('dropdown'),
  publicationButton: document.getElementById('btn-publications'),
  methodologyButton: document.getElementById('btn-methodology'),
  publicationPanel: document.getElementById('publication-panel'),
  methodologyPanel: document.getElementById('methodology-panel'),
  closePublicationPanelButton: document.getElementById('btn-close-publication-panel'),
  closeMethodologyPanelButton: document.getElementById('btn-close-methodology-panel'),
  filtersButton: document.getElementById('btn-filters'),
  filtersButtonBadge: document.getElementById('btn-filters-badge'),
  filtersPanel: document.getElementById('filters-panel'),
  closeFiltersPanelButton: document.getElementById('btn-close-filters-panel'),
  publicationDetailButton: document.getElementsByClassName('btn-publication-detail'),
  publicationDetailPanel: document.getElementById('publication-detail-panel'),
  publicationDetailPanelContent: document.getElementById('publication-detail-panel-content'),
  closePublicationDetailPanelButton: document.getElementById('btn-close-publication-detail-panel'),
  landUseMenu: document.getElementById('land-use-menu'),
  landUseText: document.getElementById('land-use-text'),
  landUseIntro: document.getElementById('land-use-intro'),
  landUsePublications: document.getElementById('land-use-publications'),
  landUseMetaAnalysis: document.getElementById('land-use-meta-analysis'),
  landUseSelect: document.getElementById('land-use-select'),
  landUseOptions: document.getElementById('land-use-dropdown-options'),
  landUseSelectContainer: document.getElementById('land-use-select-container'),
  landUseSelectButton: document.getElementById('btn-land-use-select'),
  landUseSelectMobile: document.getElementById('land-use-select-mobile'),
  publicationsNumber: document.getElementById('publications-number'),
  metaAnalysisNumber: document.getElementById('meta-analysis-number'),
  legendTexts: document.querySelectorAll('.legend-text'),
  initialMain: document.getElementById('initial-main'),
  chartCards: document.getElementById('chart-cards'),
  sortPublicationsButton: document.getElementById('btn-sort-publications'),
  publicationsContainer: document.getElementById('publications-container'),
  countryDropdown: document.getElementById('dropdown-select-country'),
  publicationTypeDropdown: document.getElementById('dropdown-select-type-publication'),
  yearDropdown: document.getElementById('dropdown-select-year'),
  journalDropdown: document.getElementById('dropdown-select-journal'),
  typePublication: document.getElementById('type-publication'),
  yearRange: document.getElementById('year-range'),
  search: document.getElementById('search'),
  resetFiltersButton: document.getElementById('reset-filters'),
  labelsSwitch: document.getElementById('labels-switch'),
  boundariesSwitch: document.getElementById('boundaries-switch'),
}
