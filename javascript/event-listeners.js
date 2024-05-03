window.addEventListener('load', function () {
  // SHARED CODE
  const resetPublicationsFilters = () => {
    for (let dropdown of elements.dropdowns) {
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

  // MOBILE MENU

  elements.mobileMenuButton.addEventListener("click", function() {
    elements.mobileMenu.classList.remove('-translate-x-full');
  });

  elements.mobileMenuClose.addEventListener("click", function() {
    elements.mobileMenu.classList.add('-translate-x-full');
  });

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
      elements.publicationPanel.classList.add('-translate-x-full');
      elements.sidebarToggle.classList.add('rotate-180', '!rounded-l-lg', '!rounded-r-none');
      elements.sidebarToggleContainer.classList.add('!left-[90px]');

      fitMap(map, { sidebarOpen: false });
    } else {
      // Opening sidebar
      elements.publicationPanel.classList.remove('-translate-x-full');
      elements.sidebarToggle.classList.remove('rotate-180', '!rounded-l-lg', '!rounded-r-none');
      elements.sidebarToggleContainer.classList.remove('!left-[90px]');

      fitMap(map, { sidebarOpen: true });
    }
  });

  // METHODOLOGY PAGE
  elements.methodologyButton.addEventListener("click", function() {
    window.mutations.setMethodologyOpen(true);
    window.renderMethodologyChart();
    elements.methodologyPanel.classList.remove('-translate-x-full');

    elements.methodologyPanel.classList.remove('hidden');
    // Hide the main page
    elements.main.classList.add('lg:hidden');
    elements.footerMenu.classList.add('lg:hidden');
  });

  elements.closeMethodologyPanelButton.addEventListener("click", function() {
    elements.methodologyPanel.classList.add('-translate-x-full');
    window.mutations.setMethodologyOpen(false);

    elements.methodologyPanel.classList.add('hidden');
    // Show the main page
    elements.main.classList.remove('lg:hidden');
    elements.footerMenu.classList.remove('lg:hidden');
  });

  // PUBLICATION BUTTON
  const closeFiltersPanel = () => {
    window.mutations.setFiltersOpen(false);
    elements.filtersPanel.classList.add('-translate-x-full', 'hidden');
    elements.filtersButton.classList.remove('!bg-yellow-500');
    elements.filtersButton.classList.remove('!text-gray-700');
  };

  elements.publicationButton.addEventListener("click", function() {
    window.mutations.setPublicationsOpen(true);
    elements.publicationPanel.classList.remove('-translate-x-full');
    window.loadPublications();

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
    elements.publicationPanel.classList.add('-translate-x-full');

    const isFiltersPanelOpen = window.getters.filtersOpen();
    if (isFiltersPanelOpen) {
      closeFiltersPanel();
    }

    // Restore main page
    elements.main.classList.remove('lg:hidden');
    elements.map.classList.add('lg:hidden');
    elements.footerMenu.classList.remove('lg:hidden');
  });

  // FILTERS BUTTON

  elements.filtersButton.addEventListener("click", function() {
    const buttonState = window.getters.filtersOpen();

    // Toggle filters panel
    if (buttonState) {
      closeFiltersPanel();
      elements.filtersButton.classList.remove('!bg-yellow-500');
      elements.filtersButtonBadge.classList.remove('bg-yellow-700');
      elements.filtersButtonBadge.classList.add('bg-green-700');
      elements.filtersButtonBadge.classList.remove('text-gray-700');
      elements.filtersButtonBadge.classList.add('text-white');
      elements.filtersButton.classList.remove('!text-gray-700');
    } else {
      window.mutations.setFiltersOpen(true);
      elements.filtersPanel.classList.remove('-translate-x-full', 'hidden');
      elements.filtersButtonBadge.classList.remove('bg-green-700');
      elements.filtersButtonBadge.classList.add('bg-yellow-700');
      elements.filtersButtonBadge.classList.remove('text-white');
      elements.filtersButtonBadge.classList.add('text-gray-700');
      elements.filtersButton.classList.add('!bg-yellow-500');
      elements.filtersButton.classList.add('!text-gray-700');
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

  for (let dropdown of elements.dropdowns) {
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

    const recalculateActiveFilters = (dropdownId, options) => {
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

      const filtersActiveNumber = window.getters.activeFilters().length;

      if (filtersActiveNumber > 0) {
        elements.filtersButtonBadge.textContent = filtersActiveNumber;
        elements.filtersButtonBadge.classList.remove('hidden');
      } else {
        elements.filtersButtonBadge.textContent = '';
        elements.filtersButtonBadge.classList.add('hidden');
      }
    };

    options.addEventListener('change', ({ target }) => {
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

      recalculateActiveFilters(dropdown.id, options);

      // Reload publications
      window.reloadPublications();
    });

    selectAllButton.addEventListener('click', () => {
      selectAllButton.setAttribute('disabled', '');
      clearButton.removeAttribute('disabled');

      const inputs = options.querySelectorAll('input');

      inputs.forEach(input => {
        input.checked = true;
      });

      const placeholder = selected.attributes['aria-placeholder'].value;
      selected.textContent = `${placeholder} (${formatNumber(inputs.length)})`;

      const inputValues = [...inputs].map(input => input.value);
      window.mutations.setPublicationFilters(dropdown.id, inputValues);

      recalculateActiveFilters(dropdown.id, options);

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

      recalculateActiveFilters(dropdown.id, options);

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

  // PUBLICATION DETAIL PANEL

  // Hide the publication detail panel when the close button is clicked
  elements.closePublicationDetailPanelButton.addEventListener('click', () => {
    window.mutations.setPublicationsOpen(false);
    elements.publicationDetailPanel.classList.add('lg:hidden');
    elements.publicationDetailPanelContent.innerHTML = '';

    // Display back publication panel and map
    elements.publicationPanel.classList.remove('lg:hidden');
    elements.map.classList.remove('lg:hidden');
  });
});
