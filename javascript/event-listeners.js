// SHARED

window.recalculateActiveFilters = (dropdownId, options) => {
  if (options) {
    const anyOptionChecked = [...options.querySelectorAll('input')].some(input => input.checked);
    const activeFilters = window.getters.activeFilters();
    if (anyOptionChecked) {
      if (activeFilters.length === 0 || !activeFilters.includes(dropdownId) ) {
        window.mutations.setActiveFilters(activeFilters.concat(dropdownId));
      }
    } else {
      if (activeFilters.includes(dropdownId)) {
        window.mutations.setActiveFilters(activeFilters.filter(filter => filter !== dropdownId));
      }
    }
  }
  const selectedLandUse = window.getters.landUse() !== 'all';
  const selectedMainIntervention = window.getters.filter()?.mainIntervention;
  const isMainInterventionSelected = selectedMainIntervention && selectedMainIntervention !== 'all';
  const isInterventionSelected = window.getters.filter()?.intervention || window.getters.filter()?.type === 'intervention' && !!window.getters.filter()?.value;
  const isSubTypeSelected = window.getters.filter()?.type === 'sub-type' && !!window.getters.filter()?.value;
  const landUseFiltersCount = [selectedLandUse, isMainInterventionSelected, isInterventionSelected, isSubTypeSelected].filter(Boolean).length;
  const filtersActiveNumber = window.getters.activeFilters().length + landUseFiltersCount;

  const filtersButtonBadge = isMobile() ? document.getElementById('btn-filters-badge-mobile') : elements.filtersButtonBadge;
  if (filtersActiveNumber > 0) {
    filtersButtonBadge.textContent = filtersActiveNumber;
    filtersButtonBadge.classList.remove('hidden');
  } else {
    filtersButtonBadge.textContent = '';
    filtersButtonBadge.classList.add('hidden');
  }
};


// Start of the event listeners on load

window.addEventListener('load', function () {
  // SHARED CODE
  const resetPublicationsFilters = () => {
    for (let dropdown of isMobile() ? elements.mobileDropdowns : elements.dropdowns) {
      const selected = dropdown.querySelector('.dropdown-selected');
      const options = dropdown.querySelector('.dropdown-options');
      const inputs = options.querySelectorAll('input');

      inputs.forEach(input => {
        input.checked = false;
      });

      const placeholder = selected.attributes['aria-placeholder'].value;
      selected.textContent = `${placeholder}`;

      window.mutations.setPublicationFilters(dropdown.id, undefined);
    }

    window.mutations.setSearch('');
    elements.search.querySelector('input').value = '';
  };

  const resetPublicationsSort = () => {
    if (window.getters.publicationsSort() === 'desc') {
      window.mutations.togglePublicationsSort();

      const [, icon] = elements.sortPublicationsButton.childNodes;
      icon.classList.toggle('rotate-180');
    }
  };

  const getGroupLayers = (groupId) => {
    const layers = window.map.getStyle().layers;
    return layers.filter(layer => layer.metadata && layer.metadata['mapbox:group'] === groupId);
  }

  const getGroupById = (layerId) => {
    const layers = window.map.getStyle().layers;
    return layers.find(layer => layer.id === layerId)?.metadata['mapbox:group'];
  };

  const setLayerVisibility = (layers, visibility) => layers.forEach(layer => {
    window.map.setLayoutProperty(layer.id, 'visibility', visibility);
  });

  const setFiltersButtonColor = (color='yellow') => {
    if (color === 'green') {
      elements.filtersButton.classList.remove('!bg-yellow-500');
      elements.filtersButtonBadge.classList.remove('bg-yellow-700');
      elements.filtersButtonBadge.classList.add('bg-green-700');
      elements.filtersButtonBadge.classList.remove('text-gray-700');
      elements.filtersButtonBadge.classList.add('text-white');
      elements.filtersButton.classList.remove('!text-gray-700');
    } else {
      elements.filtersPanel.classList.remove('-translate-x-full', 'hidden');
      elements.filtersButtonBadge.classList.remove('bg-green-700');
      elements.filtersButtonBadge.classList.add('bg-yellow-700');
      elements.filtersButtonBadge.classList.remove('text-white');
      elements.filtersButtonBadge.classList.add('text-gray-700');
      elements.filtersButton.classList.add('!bg-yellow-500');
      elements.filtersButton.classList.add('!text-gray-700');
    }
  };

  // MOBILE MENU

  elements.mobileMenuButton.addEventListener("click", function() {
    elements.mobileMenu.classList.remove('-translate-x-full');
  });

  elements.mobileMenuClose.addEventListener("click", function() {
    elements.mobileMenu.classList.add('-translate-x-full');
  });

  // MOBILE FOOTER

  const footerButton = (label, id) => {
    const footerButtonElement = document.createElement('button');
    footerButtonElement.type = 'button';
    footerButtonElement.id = id;

    footerButtonElement.classList.add('btn-mobile-footer');
    footerButtonElement.classList.add('flex');
    footerButtonElement.textContent = label;
    const filtersBadgeElement = document.createElement('div');
    filtersBadgeElement.id = 'btn-filters-badge-mobile';
    filtersBadgeElement.classList.add('p-1', 'rounded-full', 'flex-col', 'justify-center', 'items-center', 'h-7', 'w-7', 'flex', 'text-sm', 'font-semibold', 'transition-colors', 'duration-500', 'bg-green-700', 'text-white', 'ml-2', 'hidden');
    footerButtonElement.appendChild(filtersBadgeElement);
    return footerButtonElement;
  };

  // MOBILE FOOTER BUTTONS
  if (elements.mobileFooterPublicationsButton) {
    elements.mobileFooterPublicationsButton.addEventListener("click", function() {

      window.mutations.setPublicationsOpen(true);
      elements.publicationPanel.classList.remove('hidden');
      window.loadPublications();
      // Hide the main page and footer
      elements.main.classList.add('hidden');
      elements.chartCardsMobile.classList.add('hidden');

      // Hide the main page footer buttons
      const mainPageFooterButtons = document.getElementsByClassName('btn-mobile-footer-main');
      for (let button of mainPageFooterButtons) {
        button.classList.add('hidden');
      }
      // Show the filters footer button
      const publicationsFilterButton = document.getElementById('btn-mobile-footer-filters');
      if(publicationsFilterButton) {
        publicationsFilterButton.classList.remove('hidden');
      }

      const existingFiltersButton = document.getElementById('btn-mobile-footer-filters')
      if (!existingFiltersButton) {
        const filterButton = footerButton('Filters', 'btn-mobile-footer-filters');
        filterButton.addEventListener("click", function() {
          // Show the filters vault
          mobileFiltersDrawer.present({ animate: true })
        });
        elements.mobileFooter.appendChild(filterButton);
      }

      window.recalculateActiveFilters();

      // Show the mobile select filters
      const selectedLandUse = window.getters.landUse();
      if(selectedLandUse && selectedLandUse !== 'all') {
        window.loadMainInterventionMobileSelect(selectedLandUse);
        const selectedMainIntervention = window.getters.filter()?.mainIntervention;

        if (selectedMainIntervention) {
          window.loadInterventionMobileSelect(selectedMainIntervention);

          const selectedIntervention = window.getters.filter()?.intervention;
          if (selectedIntervention) {
            window.loadSubTypeMobileSelect(selectedIntervention);
          }
        }
      }

    });
  };

  if(elements.mobileFooterMethodologyButton) {
    elements.mobileFooterMethodologyButton.addEventListener("click", function() {
      window.mutations.setMethodologyOpen(true);
      window.renderMethodologyChart();
      elements.methodologyPanel.classList.remove('hidden');
      // Hide the main page and footer
      elements.main.classList.add('hidden');
      elements.mobileFooter.classList.add('hidden');
    });
  };

  // LEGEND

  elements.infoTooltipButton.addEventListener("mouseenter", function() {
    elements.infoTooltipContent.classList.remove('hidden');
  });

  elements.infoTooltipButton.addEventListener("mouseleave", function() {
    elements.infoTooltipContent.classList.add('hidden');
  });

  elements.infoTooltipButton.addEventListener("click", function() {
    if(elements.infoTooltipContent.classList.contains('hidden')) {
      elements.infoTooltipContent.classList.remove('hidden');
    } else {
      elements.infoTooltipContent.classList.add('hidden');
    }
  });

  // FILTERS DISCLAIMER

  elements.filtersDisclaimerCloseButton.addEventListener("click", function() {
    elements.filtersDisclaimer.classList.add('lg:hidden');
    localStorage.setItem('FILTERS_DISCLAIMER_CLOSED', 'true');
  });

  // MAP SETTINGS

  elements.mapSettingsButton.addEventListener("click", function() {
    window.mutations.toggleMapSettings();
    if (state.mapSettingsOpen) {
      elements.mapSettingsOverlay.classList.remove('hidden');

      // Turn the button green if active
      elements.mapSettingsButton.classList.add('!bg-mod-sc-ev', 'hover:!bg-gray-500','!border-mod-bg-mod-sc-ev');
    } else {
      elements.mapSettingsOverlay.classList.add('hidden');

      elements.mapSettingsButton.classList.remove('!bg-mod-sc-ev', 'hover:!bg-gray-500','!border-mod-bg-mod-sc-ev');
    }
  });

  elements.closeMapSettingsButton.addEventListener("click", function() {
    window.mutations.closeMapSettings();
    elements.mapSettingsOverlay.classList.add('hidden');
  });

  const onToggleBasemapRadio = function(basemap) {
    window.mutations.setBasemap(basemap);

    // Change basemap

    const layers = window.map.getStyle().layers;

    const lightGroupId = layers.find(layer => layer.id === 'background-light').metadata['mapbox:group'];
    const satelliteGroupId = layers.find(layer => layer.id === 'background-satellite').metadata['mapbox:group'];

    const lightLayers = layers.filter(layer => layer.metadata && layer.metadata['mapbox:group'] === lightGroupId);
    const satelliteLayers = layers.filter(layer => layer.metadata && layer.metadata['mapbox:group'] === satelliteGroupId);

    // Show or hide each layer in the group
    lightLayers.forEach(layer => {
      window.map.setLayoutProperty(layer.id, 'visibility', basemap === 'basemap-light' ? 'visible' : 'none');
    });

    satelliteLayers.forEach(layer => {
      window.map.setLayoutProperty(layer.id, 'visibility', basemap === 'basemap-satellite' ? 'visible' : 'none');
    });

    // Update labels
    const lightLabelsGroupId = getGroupById('country-label-light');
    const satelliteLabelsGroupId = getGroupById('country-label-dark');

    const lightLabelLayers = getGroupLayers(lightLabelsGroupId);
    const satelliteLabelLayers = getGroupLayers(satelliteLabelsGroupId);

    const labelsActive = window.getters.labels();

    if (labelsActive) {
      if (basemap === 'basemap-light') {
        setLayerVisibility(lightLabelLayers, 'none');
        setLayerVisibility(satelliteLabelLayers, 'visible');
      } else {
        setLayerVisibility(satelliteLabelLayers, 'none');
        setLayerVisibility(lightLabelLayers, 'visible');
      }
    };

    // Update boundaries
    const lightBoundariesGroupId = getGroupById('admin-0-boundary-bg-dark');
    const satelliteBoundariesGroupId = getGroupById('admin-0-boundary-light');

    const lightBoundariesLayers = getGroupLayers(lightBoundariesGroupId);
    const satelliteBoundariesLayers = getGroupLayers(satelliteBoundariesGroupId);

    const boundariesActive = window.getters.boundaries();

    if (boundariesActive) {
      if (basemap === 'basemap-light') {
        setLayerVisibility(lightBoundariesLayers, 'none');
        setLayerVisibility(satelliteBoundariesLayers, 'visible');
      } else {
        setLayerVisibility(satelliteBoundariesLayers, 'none');
        setLayerVisibility(lightBoundariesLayers, 'visible');
      }
    };

    // Update the UI
    const basemapEntries = Object.entries({
      'basemap-satellite': elements.satelliteBasemapButton,
      'basemap-light': elements.lightBasemapButton,
    });

    for(const [id, radio] of basemapEntries) {
      radio.setAttribute('tabindex', id === basemap ? 0 : -1);
      radio.setAttribute('aria-checked', id === basemap);
      radio.dataset.state = id === basemap ? 'checked' : 'unchecked';

      if (id === basemap) {
        radio.focus();
      }
    }
  };

  elements.satelliteBasemapButton.addEventListener("click", function() {
    onToggleBasemapRadio('basemap-satellite');
  });

  elements.satelliteBasemapButton.addEventListener('keydown', function ({ key }) {
    if (key === 'ArrowUp' || key === 'ArrowLeft') {
      onToggleBasemapRadio('basemap-satellite')
    } else if (key === 'ArrowDown' || key === 'ArrowRight') {
      onToggleBasemapRadio('basemap-light')
    }
  });

  elements.lightBasemapButton.addEventListener("click", function() {
    onToggleBasemapRadio('basemap-light');
  });

  elements.lightBasemapButton.addEventListener('keydown', function ({ key }) {
    if (key === 'ArrowUp' || key === 'ArrowLeft') {
      onToggleBasemapRadio('basemap-satellite')
    } else if (key === 'ArrowDown' || key === 'ArrowRight') {
      onToggleBasemapRadio('basemap-light')
    }
  });

  // LABELS

  const onToggleLabels = function () {
    const labelsActive = window.getters.labels();
    const selectedBasemap = window.getters.basemap();

    const lightGroupId = getGroupById('country-label-light');
    const satelliteGroupId = getGroupById('country-label-dark');

    const lightLabelLayers = getGroupLayers(lightGroupId);
    const satelliteLabelLayers = getGroupLayers(satelliteGroupId);

    if (labelsActive) {
      setLayerVisibility([...lightLabelLayers, ...satelliteLabelLayers], 'none');
    } else {
      const targetLayers = selectedBasemap === 'basemap-light' ? satelliteLabelLayers : lightLabelLayers;
      setLayerVisibility(targetLayers, 'visible');
    }

    window.mutations.setLabels(!labelsActive);
  };

  elements.labelsSwitch.addEventListener("click", function () {
    const checked = !!window.getters.labels();

    elements.labelsSwitch.setAttribute('aria-checked', `${!checked}`);
    elements.labelsSwitch.dataset.state = checked ? 'unchecked' : 'checked';

    elements.labelsSwitch.children[0].dataset.state = checked ? 'unchecked' : 'checked';

    onToggleLabels();
  });

  // BOUNDARIES

  const onToggleBoundaries = function () {
    const boundariesActive = window.getters.boundaries();
    const selectedBasemap = window.getters.basemap();
    const lightGroupId = getGroupById('admin-0-boundary-bg-dark');
    const satelliteGroupId = getGroupById('admin-0-boundary-light');

    const lightLabelBoundaries = getGroupLayers(lightGroupId);
    const satelliteLabelBoundaries = getGroupLayers(satelliteGroupId);

    if (boundariesActive) {
      setLayerVisibility([...lightLabelBoundaries, ...satelliteLabelBoundaries], 'none');
    } else {
      const targetBoundaries = selectedBasemap === 'basemap-light' ? satelliteLabelBoundaries : lightLabelBoundaries;
      setLayerVisibility(targetBoundaries, 'visible');
    }

    window.mutations.setBoundaries(!boundariesActive);
  };

  elements.boundariesSwitch.addEventListener("click", function () {
    const checked = !!window.getters.boundaries();

    elements.boundariesSwitch.setAttribute('aria-checked', `${!checked}`);
    elements.boundariesSwitch.dataset.state = checked ? 'unchecked' : 'checked';

    elements.boundariesSwitch.children[0].dataset.state = checked ? 'unchecked' : 'checked';

    onToggleBoundaries();
  });

  // SIDEBAR

  elements.sidebarToggle.addEventListener("click", function() {
    window.mutations.toggleSidebar();
    if (state.sidebarOpen) {
      // Closing sidebar
      elements.publicationPanel.classList.add('lg:-translate-x-full');
      elements.sidebarToggle.classList.add('rotate-180', '!rounded-l-lg', '!rounded-r-none');
      elements.sidebarToggleContainer.classList.add('!left-[90px]');

      fitMap(map, { sidebarOpen: false });
    } else {
      // Opening sidebar
      elements.publicationPanel.classList.remove('lg:-translate-x-full');
      elements.sidebarToggle.classList.remove('rotate-180', '!rounded-l-lg', '!rounded-r-none');
      elements.sidebarToggleContainer.classList.remove('!left-[90px]');

      fitMap(map, { sidebarOpen: true });
    }
  });

  // METHODOLOGY PAGE
  elements.methodologyButton.addEventListener("click", function() {
    window.mutations.setMethodologyOpen(true);
    window.renderMethodologyChart();
    elements.methodologyPanel.classList.remove('lg:-translate-x-full');

    elements.methodologyPanel.classList.remove('hidden');
    // Hide the main page
    elements.main.classList.add('lg:hidden');
    elements.footerMenu.classList.add('lg:hidden');
  });

  elements.closeMethodologyPanelButton.addEventListener("click", function() {
    elements.methodologyPanel.classList.add('lg:-translate-x-full');
    window.mutations.setMethodologyOpen(false);

    elements.methodologyPanel.classList.add('hidden');
    // Show the main page
    elements.main.classList.remove('lg:hidden');
    elements.footerMenu.classList.remove('lg:hidden');

    elements.mobileFooter.classList.remove('hidden');
  });

  // PUBLICATION BUTTON
  const closeFiltersPanel = () => {
    window.mutations.setFiltersOpen(false);
    elements.filtersPanel.classList.add('-translate-x-full', 'hidden');
    elements.filtersButton.classList.remove('!bg-yellow-500');
    elements.filtersButton.classList.remove('!text-gray-700');
  };

  const loadLandUseSelect = () => {
    const landUses = window.getters.landUses();
    const landUseMenuFilters = elements.landUseOptionsFilters;
    landUseMenuFilters.innerHTML = '';
    const selectedSlug = window.getters.landUse();
    landUses.forEach(landUse => {
      landUseMenuFilters.innerHTML += option({...landUse, dropdownSlug: 'land-use', selectedSlug, mobile: false });
    });

    const selectedLandUse = landUses.find(l => l.slug === selectedSlug);
    const selectedLandUseLabel = selectedLandUse.name;
    elements.landUseSelectFiltersButton.innerHTML = selectedLandUseLabel;

    // Initialize event listeners if they were not already initialized
    if (!window.getters.landUseSelectActionsInitialized()) {
      initSelectActions({ filters: true, select: 'landUse' });
      window.mutations.setLandUseSelectActionsInitialized(true);
    }
  };

  const setAllMainInterventionOption = () => {
    elements.mainInterventionOptionsFilters.innerHTML = '';
    elements.mainInterventionOptionsFilters.innerHTML += option({ slug: 'all', dropdownSlug: 'main-intervention',name: 'All', selectedSlug: 'all', mobile: false });
    elements.mainInterventionSelectFiltersButton.innerHTML = 'All';
  }

  const setAllInterventionOption = () => {
    elements.interventionOptionsFilters.innerHTML = '';
    elements.interventionOptionsFilters.innerHTML += option({ slug: 'all', dropdownSlug: 'intervention',name: 'All', selectedSlug: 'all', mobile: false });
    elements.interventionSelectFiltersButton.innerHTML = 'All';
  }

  const setAllSubTypeOption = () => {
    elements.subTypeOptionsFilters.innerHTML = '';
    elements.subTypeOptionsFilters.innerHTML += option({ slug: 'all', dropdownSlug: 'sub-type',name: 'All', selectedSlug: 'all', mobile: false });
    elements.subTypeSelectFiltersButton.innerHTML = 'All';
  }

  window.resetMainInterventionSelect = () => {
    elements.mainInterventionSelectFilters.classList.add('lg:hidden');
    window.mutations.setFilter(null);
    setAllMainInterventionOption();
    window.resetInterventionSelect();
  }

  window.resetInterventionSelect = () => {
    elements.interventionSelectFilters.classList.add('lg:hidden');
    window.mutations.setFilter(null);
    setAllInterventionOption();
    window.resetSubTypeSelect();
  }

  window.resetSubTypeSelect = () => {
    elements.subTypeSelectFilters.classList.add('lg:hidden');
    setAllSubTypeOption();
  }

  window.loadMainInterventionSelect = () => {
    const landUses = window.getters.landUses();
    const selectedLandUseSlug = window.getters.landUse();

    const isLandUseSelected = selectedLandUseSlug !== 'all';
    if (isLandUseSelected) {
      const selectedLandUse = landUses.find(l => l.slug === selectedLandUseSlug);
      const mainInterventions = selectedLandUse?.mainInterventions;
      const selectedMainIntervention = window.getters.filter()?.mainIntervention;
      if (mainInterventions && mainInterventions.length > 0) {
        elements.mainInterventionOptionsFilters.innerHTML = '';
        elements.mainInterventionSelectFiltersButton.innerHTML = selectedMainIntervention ? startCase(selectedMainIntervention) : 'All';
        elements.mainInterventionOptionsFilters.innerHTML += option({ slug: 'all', dropdownSlug: 'main-intervention',name: 'All', selectedSlug: selectedMainIntervention || 'all', mobile: false });

        mainInterventions.forEach(intervention => {
          elements.mainInterventionOptionsFilters.innerHTML += option({ dropdownSlug: 'main-intervention', slug: intervention, name: startCase(intervention), selectedSlug: selectedMainIntervention, mobile: false });
        });
        elements.mainInterventionSelectFilters.classList.remove('lg:hidden');
      }
    } else {
      setAllMainInterventionOption();
    }

    // Initialize event listeners if they were not already initialized
    if (!window.getters.mainInterventionSelectActionsInitialized()) {
      initSelectActions({ filters: true, select: 'mainIntervention'});
      window.mutations.setMainInterventionActionsInitialized(true);
    }
  };

  window.loadInterventionSelect = () => {
    const selectedMainIntervention = window.getters.filter()?.mainIntervention;
    const data = window.getters.chartData();
    const mainInterventionData = data?.[selectedMainIntervention];
    const selectedIntervention = window.getters.filter()?.type === 'intervention' ? window.getters.filter()?.value : window.getters.filter()?.intervention;
    if (mainInterventionData && mainInterventionData.length > 0) {
      elements.interventionOptionsFilters.innerHTML = '';
      elements.interventionSelectFiltersButton.innerHTML = selectedIntervention ? startCase(selectedIntervention) : 'All';
      elements.interventionOptionsFilters.innerHTML += option({ slug: 'all', dropdownSlug: 'intervention', name: 'All', selectedSlug: selectedIntervention || 'all', mobile: false });

      mainInterventionData.forEach(intervention => {
        elements.interventionOptionsFilters.innerHTML += option({ dropdownSlug: 'intervention', slug: intervention.slug, name: intervention.title, selectedSlug: selectedIntervention, mobile: false });
      });
      elements.interventionSelectFilters.classList.remove('lg:hidden');
    }

    // Initialize event listeners if they were not already initialized
    if (!window.getters.interventionSelectActionsInitialized()) {
      initSelectActions({ filters: true, select: 'intervention'});
      window.mutations.setInterventionActionsInitialized(true);
    }
  };

  window.loadSubTypeSelect = () => {
    const selectedMainIntervention = window.getters.filter()?.mainIntervention;
    const data = window.getters.chartData();
    const selectedIntervention = window.getters.filter()?.type === 'intervention' ? window.getters.filter()?.value : window.getters.filter()?.intervention;
    const subtypesData = data?.[selectedMainIntervention]?.find(d => d.slug === selectedIntervention)?.subTypes;
    const selectedSubType = window.getters.filter()?.type === 'sub-type' && window.getters.filter()?.value;

    if (subtypesData && subtypesData.length > 0) {
      elements.subTypeOptionsFilters.innerHTML = '';
      elements.subTypeSelectFiltersButton.innerHTML = selectedSubType ? startCase(selectedSubType) : 'All';
      elements.subTypeOptionsFilters.innerHTML += option({ slug: 'all', dropdownSlug: 'sub-type', name: 'All', selectedSlug: selectedSubType || 'all', mobile: false });

      subtypesData.forEach(subType => {
        elements.subTypeOptionsFilters.innerHTML += option({ dropdownSlug: 'sub-type', slug: subType.slug, name: subType.title, selectedSlug: selectedSubType, mobile: false });
      });
      elements.subTypeSelectFilters.classList.remove('lg:hidden');
    }

    // Initialize event listeners if they were not already initialized
    if (!window.getters.subTypeSelectActionsInitialized()) {
      initSelectActions({ filters: true, select: 'subType'});
      window.mutations.setSubTypeActionsInitialized(true);
    }
  };

  elements.publicationButton.addEventListener("click", function() {
    window.mutations.setPublicationsOpen(true);
    elements.publicationPanel.classList.remove('lg:-translate-x-full');
    window.loadPublications();

    // Recalculate active filters on the filters button to show land use
    window.recalculateActiveFilters();

    // Load LAND USE SELECT on filters dropdown
    loadLandUseSelect();
    window.loadMainInterventionSelect();
    window.loadInterventionSelect();
    window.loadSubTypeSelect();

    // Hide the main page
    elements.main.classList.add('lg:hidden');
    elements.map.classList.remove('lg:hidden');

    window.loadMap();

    elements.footerMenu.classList.add('lg:hidden');
  });

  elements.closePublicationPanelButton.addEventListener("click", function() {
    // We reset the whole publications view without reloading the publications
    resetPublicationsFilters();
    resetPublicationsSort();
    // We reset the pagination
    window.mutations.setPublicationPage(1);

    window.mutations.setPublicationsOpen(false);

    const landUse = window.getters.landUse();

    if(isMobile()) {
      elements.publicationPanel.classList.add('hidden');
      // Hide filters button
      const publicationsFilterButton = document.getElementById('btn-mobile-footer-filters');
      if (publicationsFilterButton) {
        publicationsFilterButton.classList.add('hidden');
      }
      // Show the main page footer buttons
      const mainPageFooterButtons = document.getElementsByClassName('btn-mobile-footer-main');
      for (let button of mainPageFooterButtons) {
        button.classList.remove('hidden');
      }

      if (landUse && landUse !== 'all') {
        elements.chartCardsMobile.classList.remove('hidden');

        // Reset filters, only keep except for land use
        window.mutations.setFilter(null);
        window.reloadPublications();
        window.resetMobileSelect('main-intervention');
        window.resetMobileSelect('intervention');
        window.resetMobileSelect('sub-type');
      } else {
        elements.landUseMenuMobile.classList.remove('land-use-menu-mobile-scroll');
      }
    } else {
      const isFiltersPanelOpen = window.getters.filtersOpen();
      if (isFiltersPanelOpen) {
        closeFiltersPanel();
      }

      // Set filters button color to green just in case the filters panel was opened
      setFiltersButtonColor('green');

      elements.publicationPanel.classList.add('lg:-translate-x-full');
      // Restore main page
      elements.main.classList.remove('lg:hidden');
      elements.map.classList.add('lg:hidden');
      elements.footerMenu.classList.remove('lg:hidden');

      const landUses = window.getters.landUses();

      if (landUse === 'all') {
        elements.initialMain.classList.remove('lg:hidden');
        elements.chartCards.classList.add('hidden');
        elements.chartCardsMobile.classList.add('hidden');
        elements.landUseSelectContainer.classList.add('hidden');
      } else {
        elements.initialMain.classList.add('lg:hidden');
        elements.chartCards.classList.remove('hidden');
        elements.chartCardsMobile.classList.remove('hidden');

        elements.landUseSelectContainer.classList.remove('hidden');
        const selectedLandUse = landUses.find(l => l.slug === landUse);
        const selectedLandUseLabel = `${selectedLandUse.name} (${formatNumber(selectedLandUse.publications)})`;
        elements.landUseSelectButton.innerHTML = selectedLandUseLabel;

        elements.landUseOptions.innerHTML = '';

        landUses.filter(l => l.name !== 'All').forEach(landUse => {
          elements.landUseOptions.innerHTML += option({...landUse, dropdownSlug: 'land-use', selectedSlug: landUse, mobile: false, filters: true, publicationNumbers: true });
        });
      }

      // Reload the chart with the correspondant opened items
      const currentData = window.getters.chartData();
      const currentMainIntervention = window.getters.filter()?.mainIntervention;
      const currentIntervention = window.getters.filter()?.type === 'intervention' && window.getters.filter()?.value;
      const currentSubType = window.getters.filter()?.type === 'sub-type' && window.getters.filter()?.value;

      if (!currentIntervention) {
        updateChartAndButtons({ slug: 'all', resetAllCharts: true });
      } else {
        // If a intervention is selected, we need to update the data marking it as active
        // If a sub-type is selected, we need to update the data marking it as active
        const updatedMainInterventionData = currentData?.[currentMainIntervention]?.map(intervention => {
          return (intervention.slug === currentIntervention) ?
            {
              ...intervention,
              active: true,
              subTypes: intervention.subTypes.map(subType => ({
                ...subType,
                active: subType.slug === currentSubType,
              }))
            } :
            {...intervention, subtypes: intervention.subTypes.map(subType => ({...subType, active: false })), active: false };
        });
        const currentSubTypeTitle = currentIntervention && currentSubType && updatedMainInterventionData.find(intervention => intervention.slug === currentIntervention)?.subTypes.find(subType => subType.slug === currentSubType)?.title;
        const currentInterventionTitle = currentIntervention && updatedMainInterventionData.find(intervention => intervention.slug === currentIntervention)?.title;
        updateChartAndButtons({ slug: currentMainIntervention, title: currentSubTypeTitle || currentInterventionTitle , data: updatedMainInterventionData, resetAllCharts: true });
      }
    }
  });

  // FILTERS BUTTON

  elements.filtersButton.addEventListener("click", function() {
    const buttonState = window.getters.filtersOpen();

    // Toggle filters panel
    if (buttonState) {
      closeFiltersPanel();
      setFiltersButtonColor('green');
    } else {
      window.mutations.setFiltersOpen(true);
      setFiltersButtonColor('yellow');
    }
  });

  elements.closeFiltersPanelButton.addEventListener("click", function() {
    closeFiltersPanel();
  });

  // PUBLICATIONS PANEL

  // SORT PUBLICATIONS BUTTON

  elements.sortPublicationsButton.addEventListener("click", function() {
    window.mutations.togglePublicationsSort();
    const [, icon] = elements.sortPublicationsButton.childNodes;
    icon.classList.toggle('rotate-180');
    window.reloadPublications();
  });

  // DROPDOWNS
  window.loadDropdowns = () => {
    const dropdowns = isMobile() ? elements.mobileDropdowns : elements.dropdowns;

    for (let dropdown of dropdowns) {
      const button = dropdown.querySelector('.btn-dropdown');
      const searchInput = dropdown.querySelector('.input-search');
      const options = dropdown.querySelector('.dropdown-options');
      const selected = dropdown.querySelector('.dropdown-selected');
      const selectAllButton = dropdown.querySelector('.btn-select-all');
      const clearButton = dropdown.querySelector('.btn-clear');

      const toggleDropdown = () => {
        button.classList.toggle('hidden');
        searchInput.classList.toggle('hidden');
        if (searchInput.classList.contains('hidden')) {
          searchInput.value = '';
          options.querySelectorAll('li').forEach(option => option.classList.remove('hidden'));
        } else {
          searchInput.focus();
        }

        Popper.createPopper(searchInput, options, {
          modifiers: [
            {
              name: 'offset',
              options: {
                offset: [0, 8],
              },
            },
          ],
        });

        options.classList.toggle('hidden');
      }

      button.addEventListener('click', () => {
        const openDropdownsInitial = window.getters.openDropdowns();
        window.mutations.setOpenDropdown(dropdown.id, !openDropdownsInitial.includes(dropdown.id));
        toggleDropdown();
      });

      // Detect clicks outside the dropdown
      document.addEventListener('click', (event) => {
        const openDropdowns = window.getters.openDropdowns();
        const isClickInsideDropdown = dropdown.contains(event.target);
        if (openDropdowns.includes(dropdown.id) && !isClickInsideDropdown) {
          window.mutations.setOpenDropdown(dropdown.id, false);
          toggleDropdown();
        }
      });

      // Detect focus outside the dropdown
      document.addEventListener('focusin', (event) => {
        const openDropdowns = window.getters.openDropdowns();
        const isFocusInsideDropdown = dropdown.contains(event.target);
        if (openDropdowns.includes(dropdown.id) && !isFocusInsideDropdown) {
          window.mutations.setOpenDropdown(dropdown.id, false);
          toggleDropdown();
        }
      });

      options.addEventListener('change', ({ target }) => {
        const filtersDisclaimerClosed = localStorage.getItem('FILTERS_DISCLAIMER_CLOSED');
        if (!filtersDisclaimerClosed) {
          elements.filtersDisclaimer.classList.remove('lg:hidden');
        }

        if (target.type !== 'checkbox') {
          return;
        }
        // If any option is checked, we remove disabled from the clear button
        const anyOptionChecked = [...options.querySelectorAll('input')].some(input => input.checked);
        if (anyOptionChecked) {
          clearButton.removeAttribute('disabled');
        } else {
          clearButton.setAttribute('disabled', '');
        }

        // If all options are checked, we add disabled to the select all button
        const allOptionsChecked = [...options.querySelectorAll('input')].every(input => input.checked);
        if (allOptionsChecked) {
          selectAllButton.setAttribute('disabled', '');
        } else {
          selectAllButton.removeAttribute('disabled');
        }

        const selectedValues = [];
        const selectedLabels = [];

        options.querySelectorAll('input').forEach(input => {
          if (input.checked) {
            selectedValues.push(input.value);
            const label = document.querySelector(`label[for="${input.id}"]`);
            selectedLabels.push(label.textContent);
          }
        });

        const placeholder = selected.attributes['aria-placeholder'].value;
        if (selectedValues.length === 0) {
          selected.textContent = placeholder;
          window.mutations.setPublicationFilters(dropdown.id, []);
        } else {
          const label = document.querySelector(`label[for="${selected?.id?.replace('-selected', '')}"]`);
          selected.textContent = `${label?.textContent} (${formatNumber(selectedLabels.length)})`;
          window.mutations.setPublicationFilters(dropdown.id, selectedValues);
        };

        window.recalculateActiveFilters(dropdown.id, options);

        // Reload publications
        window.reloadPublications();
      });

      selectAllButton.addEventListener('click', () => {
        selectAllButton.setAttribute('disabled', '');
        clearButton.removeAttribute('disabled');

        const filtersDisclaimerClosed = localStorage.getItem('FILTERS_DISCLAIMER_CLOSED');
        if (!filtersDisclaimerClosed) {
          elements.filtersDisclaimer.classList.remove('lg:hidden');
        }

        const inputs = options.querySelectorAll('input');

        inputs.forEach(input => {
          input.checked = true;
        });

        const placeholder = selected.attributes['aria-placeholder'].value;
        selected.textContent = `${placeholder} (${formatNumber(inputs.length)})`;

        const inputValues = [...inputs].map(input => input.value);
        window.mutations.setPublicationFilters(dropdown.id, inputValues);

        window.recalculateActiveFilters(dropdown.id, options);

        window.reloadPublications();
      });

      clearButton.addEventListener('click', () => {
        clearButton.setAttribute('disabled', '');
        selectAllButton.removeAttribute('disabled');

        options.querySelectorAll('input').forEach(input => {
          input.checked = false;
        });

        const placeholder = selected.attributes['aria-placeholder'].value;
        selected.textContent = placeholder;
        window.mutations.setPublicationFilters(dropdown.id, []);

        window.recalculateActiveFilters(dropdown.id, options);

        window.reloadPublications();
      });

      searchInput.addEventListener('input', ({ target: { value: keyword } }) => {
        options.querySelectorAll('li').forEach(option => {
          const { textContent } = option.querySelector('label');

          if (keyword.length === 0 || textContent.toLowerCase().includes(keyword.toLowerCase())) {
            option.classList.remove('hidden');
          } else {
            option.classList.add('hidden');
          }
        })
      });
    }
  }

  window.loadDropdowns();

  // SEARCH
  elements.search.addEventListener('input', debounce(() => {
      const searchInput = elements.search.querySelector('input');
      window.mutations.setSearch(searchInput.value);
      window.reloadPublications();
    }, 250)
  );

  // RESET FILTERS
  elements.resetFiltersButton.addEventListener('click', () => {
    resetPublicationsFilters();

    window.mutations.setLandUse('all');
    window.mutations.setFilter(null);
    resetMainInterventionSelect();
    window.reloadPublications();

    // Reset the active filters badge
    window.mutations.setActiveFilters([]);
    elements.filtersButtonBadge.textContent = '';
    elements.filtersButtonBadge.classList.add('hidden');

    // Activate all Select All buttons and disable all Clear buttons
    for (let dropdown of elements.dropdowns) {
      const selectAllButton = dropdown.querySelector('.btn-select-all');
      const clearButton = dropdown.querySelector('.btn-clear');

      selectAllButton.removeAttribute('disabled');
      clearButton.setAttribute('disabled', '');
    }
  });

  // RESET FILTERS MOBILE
  elements.resetFiltersMobileButton.addEventListener('click', () => {
    resetPublicationsFilters();
    window.mutations.setLandUse('all');
    window.mutations.setFilter(null);
    // Select the all button on the land use select

    window.initLandUseSelectMobile();

    window.resetMobileSelect('main-intervention');
    window.resetMobileSelect('intervention');
    window.resetMobileSelect('sub-type');
    window.reloadPublications();

    // Reset the active filters badge
    window.mutations.setActiveFilters([]);

    window.recalculateActiveFilters();
    // Activate all Select All buttons and disable all Clear buttons
    for (let dropdown of isMobile() ? elements.mobileDropdowns : elements.dropdowns) {
      const selectAllButton = dropdown.querySelector('.btn-select-all');
      const clearButton = dropdown.querySelector('.btn-clear');

      selectAllButton.removeAttribute('disabled');
      clearButton.setAttribute('disabled', '');
    }
  });

  // PUBLICATION DETAIL PANEL

  // Hide the publication detail panel when the close button is clicked
  elements.closePublicationDetailPanelButton.addEventListener('click', () => {
    window.mutations.setPublicationsOpen(false);
    elements.publicationDetailPanel.classList.add('hidden');
    elements.publicationDetailPanelContent.innerHTML = '';

    // Display back publication panel and map
    elements.publicationPanel.classList.remove('hidden');
    elements.map.classList.remove('lg:hidden');
  });
});
