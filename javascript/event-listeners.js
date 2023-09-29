window.addEventListener('load', function () {
  // LEGEND

  elements.legendToggle.addEventListener("click", function() {
    window.mutations.toggleLegend();
    if (!state.legendOpen) {
      elements.legend.classList.add('h-9');
      elements.legendToggle.classList.add('rotate-180');
    } else {
      elements.legend.classList.remove('h-9');
      elements.legendToggle.classList.remove('rotate-180');
    }
  });

  // MAP SETTINGS

  elements.mapSettingsButton.addEventListener("click", function() {
    window.mutations.toggleMapSettings();
    if (state.mapSettingsOpen) {
      elements.mapSettingsOverlay.classList.remove('hidden');
    } else {
      elements.mapSettingsOverlay.classList.add('hidden');
    }
  });

  elements.closeMapSettingsButton.addEventListener("click", function() {
    window.mutations.closeMapSettings();
    elements.mapSettingsOverlay.classList.add('hidden');
  });

  elements.satelliteBasemapButton.addEventListener("click", function() {
    window.mutations.setBasemap('satellite');

    // Change theme in buttons and attribution
    if (elements.maplibreControls) {
      for (let element of elements.maplibreControls) {
        element.classList.add('theme-light');
      };
    }
    elements.sidebarToggle.classList.remove('btn-icon-theme-dark');
    elements.sidebarToggle.classList.add('btn-icon-theme-light');
    elements.mapSettingsButton.classList.remove('btn-theme-dark');
    elements.mapSettingsButton.classList.add('btn-theme-light');

    elements.attribution.classList.add('text-white');
    elements.attribution.classList.remove('text-black');

    // Update attribution content
    elements.attributionContent.innerHTML = `<span>
    Tiles ©
    <a
      className="hover:underline"
      rel="noopener noreferrer"
      target="_blank"
      href="https://esri.com"
    >
      Esri
    </a>
    — Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP,
    and the GIS User Community</span>`;

    // Update map settings popup
    elements.lightBasemapContainer.classList.remove('outline');
    elements.satelliteBasemapContainer.classList.add('outline');

    // Change basemap
    map.setPaintProperty(
      'basemap-light',
      'raster-opacity',
      0
    );
    map.setPaintProperty(
      'basemap-satellite',
      'raster-opacity',
      1
    );
  });

  elements.lightBasemapButton.addEventListener("click", function() {

    // Change theme in buttons and attribution
    window.mutations.setBasemap('light');
    if (elements.maplibreControls) {
      for (let element of elements.maplibreControls) {
        element.classList.remove('theme-light');
      }
    }
    elements.mapSettingsButton.classList.add('btn-theme-dark');
    elements.mapSettingsButton.classList.remove('btn-theme-light');
    elements.sidebarToggle.classList.add('btn-icon-theme-dark');
    elements.sidebarToggle.classList.remove('btn-icon-theme-light');

    elements.attribution.classList.add('text-black');
    elements.attribution.classList.remove('text-white');

    // Update attribution content
    elements.attributionContent.innerHTML = `<span>©
    <a
      class="hover:underline"
      rel="noopener noreferrer"
      target="_blank"
      href="https://www.openstreetmap.org/">
      OpenStreetMap
    </a>
    contributors ©
    <a
      class="hover:underline"
      rel="noopener noreferrer"
      target="_blank"
      href="https://carto.com/">
      CARTO
    </a></span>`;

    // Update map settings popup
    elements.lightBasemapContainer.classList.add('outline');
    elements.satelliteBasemapContainer.classList.remove('outline');

    // Change basemap
    map.setPaintProperty(
      'basemap-light',
      'raster-opacity',
      1
    );
    map.setPaintProperty(
      'basemap-satellite',
      'raster-opacity',
      0
    );
  });

  // SIDEBAR

  elements.sidebarToggle.addEventListener("click", function() {
    window.mutations.toggleSidebar();
    if (state.sidebarOpen) {
      elements.sidebar.classList.add('-translate-x-full');
      elements.sidebarToggle.classList.add('rotate-180');
    } else {
      elements.sidebar.classList.remove('-translate-x-full');
      elements.sidebarToggle.classList.remove('rotate-180');
    }
  });

  // PUBLICATION BUTTON

  elements.publicationButton.addEventListener("click", function() {
    window.mutations.setPublicationsOpen(true);
    elements.publicationPanel.classList.remove('-translate-x-full');
    window.loadPublications();
  });

  elements.closePublicationPanelButton.addEventListener("click", function() {
    window.mutations.setPublicationsOpen(false);
    elements.publicationPanel.classList.add('-translate-x-full');
  });

  // FILTERS BUTTON

  elements.filtersButton.addEventListener("click", function() {
    const buttonState = window.getters.filtersOpen();
    // Toggle filters panel
    if (buttonState) {
      window.mutations.setFiltersOpen(false);
      elements.filtersPanel.classList.add('-translate-x-full');
    } else {
      window.mutations.setFiltersOpen(true);
      elements.filtersPanel.classList.remove('-translate-x-full');
    }
  });

  elements.closeFiltersPanelButton.addEventListener("click", function() {
    window.mutations.setFiltersOpen(false);
    elements.filtersPanel.classList.add('-translate-x-full');
  });

  // PUBLICATIONS PANEL

  // SORT PUBLICATIONS BUTTON

  elements.sortPublicationsButton.addEventListener("click", function() {
    window.mutations.togglePublicationsSort();
    const publicationsSort = window.getters.publicationsSort();
    const [text, icon] = elements.sortPublicationsButton.childNodes;
    icon.classList.toggle('rotate-180');
    text.textContent = publicationsSort === 'asc' ? 'Newest first' : 'Oldest first';
    window.reloadPublications();
  });

  // DROPDOWNS

  for (let dropdown of elements.dropdowns) {
    const button = dropdown.querySelector('.btn-dropdown');
    const searchInput = dropdown.querySelector('.search');
    const buttonIcon = dropdown.querySelector('svg');
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

      options.classList.toggle('min-h-[190px]');
      options.classList.toggle('hidden');
      buttonIcon.classList.toggle('rotate-180');
      selected.classList.toggle('text-gray-500');
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
      if (target.type !== 'checkbox') {
        return;
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
        selected.textContent = `${placeholder} (${selectedLabels.length})`;
        window.mutations.setPublicationFilters(dropdown.id, selectedValues);
      };

      // Reload publications
      window.reloadPublications();
    });

    selectAllButton.addEventListener('click', () => {
      const inputs = options.querySelectorAll('input');

      inputs.forEach(input => {
        input.checked = true;
      });

      const placeholder = selected.attributes['aria-placeholder'].value;
      selected.textContent = `${placeholder} (${inputs.length})`;

      const inputValues = [...inputs].map(input => input.value);
      window.mutations.setPublicationFilters(dropdown.id, inputValues);
      window.reloadPublications();
    });

    clearButton.addEventListener('click', () => {
      options.querySelectorAll('input').forEach(input => {
        input.checked = false;
      });

      const placeholder = selected.attributes['aria-placeholder'].value;
      selected.textContent = placeholder;
      window.mutations.setPublicationFilters(dropdown.id, []);
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

  // PUBLICATION TYPE CHECKBOXES
  elements.typePublication.addEventListener('click', ({ target }) => {
    if (target.type !== 'checkbox') {
      return;
    }

    const selectedValues = [];

    elements.typePublication.querySelectorAll('input').forEach(input => {
      if (input.checked) {
        selectedValues.push(input.value);
      }
    });
    window.mutations.setPublicationFilters('type-publication', selectedValues);

    // Reload publications
    window.reloadPublications();
  });

  // SEARCH
  elements.search.addEventListener('input', debounce(() => {
      const searchInput = elements.search.querySelector('input');
      window.mutations.setSearch(searchInput.value);
      window.reloadPublications();
    }, 250)
  );

  // RESET FILTERS
  elements.resetFiltersButton.addEventListener('click', () => {
    window.mutations.setPublicationFilters('type-publication', ['meta-analysis', 'primary-paper']);
    elements.typePublication.querySelectorAll('input').forEach(input => input.checked = true);

    for (let dropdown of elements.dropdowns) {
      const selected = dropdown.querySelector('.dropdown-selected');
      const options = dropdown.querySelector('.dropdown-options');
      const inputs = options.querySelectorAll('input');

      inputs.forEach(input => {
        input.checked = true;
      });

      const placeholder = selected.attributes['aria-placeholder'].value;
      selected.textContent = `${placeholder} (${inputs.length})`;

      const inputValues = [...inputs].map(input => input.value);
      window.mutations.setPublicationFilters(dropdown.id, inputValues);
    }

    window.mutations.setSearch('');
    elements.search.querySelector('input').value = '';

    window.reloadPublications();
  });

  // PUBLICATION DETAIL PANEL

  // Hide the modal when the close button is clicked
  elements.closePublicationDetailPanelButton.addEventListener('click', () => {
    window.mutations.setPublicationsOpen(false);
    elements.publicationDetailModal.classList.add('hidden');
  });

  // Hide the modal when the user clicks outside of it
  elements.publicationDetailModal.addEventListener('click', (event) => {
    if (event.target === elements.publicationDetailModal) {
      window.mutations.setPublicationsOpen(false);
      elements.publicationDetailModal.classList.add('hidden');
    }
  });

  // Trap the focus inside the modal when it is opened
  elements.publicationDetailModal.addEventListener('focusin', (event) => {
    if (!elements.publicationDetailModal.contains(event.target)) {
      elements.closePublicationDetailPanelButton.focus();
    }
  });

  // Release the focus when the modal is closed
  elements.publicationDetailModal.addEventListener('focusout', (event) => {
    if (!elements.publicationDetailModal.contains(event.relatedTarget)) {
      elements.publicationDetailModal.focus();
    }
  });
});
