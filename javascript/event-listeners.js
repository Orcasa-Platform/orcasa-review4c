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

      const [text, icon] = elements.sortPublicationsButton.childNodes;
      icon.classList.toggle('rotate-180');
      text.textContent = 'Newest first';
    }
  };

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

  const onToggleBasemapRadio = function(basemap) {
    window.mutations.setBasemap(basemap);

    // Change theme of the controls
    const isDarkTheme = basemap === 'satellite';

    if (elements.maplibreControls) {
      for (let element of elements.maplibreControls) {
        element.classList.toggle('theme-light', isDarkTheme);
      };
    }

    elements.sidebarToggle.classList.toggle('btn-icon-theme-dark', !isDarkTheme);
    elements.sidebarToggle.classList.toggle('btn-icon-theme-light', isDarkTheme);

    elements.mapSettingsButton.classList.toggle('btn-theme-dark', !isDarkTheme);
    elements.mapSettingsButton.classList.toggle('btn-theme-light', isDarkTheme);

    elements.attribution.classList.toggle('text-black', !isDarkTheme);
    elements.attribution.classList.toggle('text-white', isDarkTheme);

    // Update the attributions
    if (basemap === 'satellite') {
      elements.attributionContent.innerHTML = `
        <span>
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
          and the GIS User Community
        </span>
      `;
    } else if (basemap === 'light') {
      elements.attributionContent.innerHTML = `
        <span>
          ©
          <a
            class="hover:underline"
            rel="noopener noreferrer"
            target="_blank"
            href="https://www.openstreetmap.org/"
          >
            OpenStreetMap
          </a>
          contributors ©
          <a
            class="hover:underline"
            rel="noopener noreferrer"
            target="_blank"
            href="https://carto.com/"
          >
            CARTO
          </a>
        </span>
      `;
    } else if (basemap === 'relief') {
      elements.attributionContent.innerHTML = `
        <span>
          Tiles ©
          <a
            className="hover:underline"
            rel="noopener noreferrer"
            target="_blank"
            href="https://esri.com"
          >
            Esri
          </a>
          — Source: Esri
        </span>
      `;
    }

    // Change basemap
    map.setPaintProperty('basemap-satellite', 'raster-opacity', Number(basemap === 'satellite'));
    map.setPaintProperty('basemap-light', 'raster-opacity', Number(basemap === 'light'));
    map.setPaintProperty('basemap-relief', 'raster-opacity', Number(basemap === 'relief'));

    // Update the UI
    const basemapEntries = Object.entries({
      satellite: elements.satelliteBasemapButton,
      light: elements.lightBasemapButton,
      relief: elements.reliefBasemapButton,
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
    onToggleBasemapRadio('satellite');
  });

  elements.satelliteBasemapButton.addEventListener('keydown', function ({ key }) {
    if (key === 'ArrowUp' || key === 'ArrowLeft') {
      onToggleBasemapRadio('relief')
    } else if (key === 'ArrowDown' || key === 'ArrowRight') {
      onToggleBasemapRadio('light')
    }
  });

  elements.lightBasemapButton.addEventListener("click", function() {
    onToggleBasemapRadio('light');
  });

  elements.lightBasemapButton.addEventListener('keydown', function ({ key }) {
    if (key === 'ArrowUp' || key === 'ArrowLeft') {
      onToggleBasemapRadio('satellite')
    } else if (key === 'ArrowDown' || key === 'ArrowRight') {
      onToggleBasemapRadio('relief')
    }
  });

  elements.reliefBasemapButton.addEventListener("click", function() {
    onToggleBasemapRadio('relief');
  });

  elements.reliefBasemapButton.addEventListener('keydown', function ({ key }) {
    if (key === 'ArrowUp' || key === 'ArrowLeft') {
      onToggleBasemapRadio('light')
    } else if (key === 'ArrowDown' || key === 'ArrowRight') {
      onToggleBasemapRadio('satellite')
    }
  });

  const onToggleLabels = function (labels) {
    window.mutations.setLabels(labels);
    
    map.setLayoutProperty('countries-labels-light', 'visibility', 'none');
    map.setLayoutProperty('countries-labels-dark', 'visibility', 'none');

    if (labels !== null) {
      map.setLayoutProperty(`countries-labels-${labels}`, 'visibility', 'visible');
    }
  };

  elements.labelsSwitch.addEventListener("click", function () {
    const checked = window.getters.labels() !== null;

    elements.labelsSwitch.setAttribute('aria-checked', `${!checked}`);
    elements.labelsSwitch.dataset.state = checked ? 'unchecked' : 'checked';

    elements.labelsSwitch.children[0].dataset.state = checked ? 'unchecked' : 'checked';

    const radios = Array.from(elements.labelsRadioGroup.querySelectorAll('button[role="radio"]'));
    radios.forEach((radio) => {
      if (checked) {
        radio.setAttribute('disabled', '');
        radio.dataset.disabled = '';
        if (radio.children.length > 0) {
          radio.children[0].dataset.disabled = '';
        }
      } else {
        radio.removeAttribute('disabled');
        delete radio.dataset.disabled;
        if (radio.children.length > 0) {
          delete radio.children[0].dataset.disabled;
        }
      }
    });

    if (checked) {
      radios.forEach((radio, index) => onToggleLabelsRadio(radio, index === 0));
      onToggleLabels(null);
    } else {
      const labels = radios[0].value;
      onToggleLabels(labels)
    }
  });

  const onToggleLabelsRadio = function (radio, checked) {
    if (checked) { 
      radio.setAttribute('tabindex', 0);
      radio.setAttribute('aria-checked', true);
      radio.dataset.state = 'checked';

      onToggleLabels(radio.value);
    } else {
      radio.setAttribute('tabindex', -1);
      radio.setAttribute('aria-checked', false);
      radio.dataset.state = 'unchecked';
    }
  };

  Array.from(
    elements.labelsRadioGroup.querySelectorAll('button[role="radio"]')
  ).forEach((radio, index, radios) => {
    radio.addEventListener('click', function () {
      const disabled = radio.getAttribute('disabled') === '';
      if (!disabled) {
        onToggleLabelsRadio(radio, true);

        radios
          .filter((_, otherIndex) => otherIndex !== index)
          .map((otherRadio) => onToggleLabelsRadio(otherRadio, false));
      }
    });

    radio.addEventListener('keydown', function ({ key }) {
      const disabled = radio.getAttribute('disabled') === '';
      if (!disabled) {
        let checkedIndex;

        if (key === 'ArrowUp' || key === 'ArrowLeft') {
          checkedIndex = index === 0 ? radios.length - 1 : index - 1;
        } else if (key === 'ArrowDown' || key === 'ArrowRight') {
          checkedIndex = index + 1 === radios.length ? 0 : index + 1;
        }

        onToggleLabelsRadio(radios[checkedIndex], true);

        radios
          .filter((_, otherIndex) => otherIndex !== checkedIndex)
          .map((otherRadio) => onToggleLabelsRadio(otherRadio, false));

        radios[checkedIndex].focus();
      }
    });
  });

  // SIDEBAR

  elements.sidebarToggle.addEventListener("click", function() {
    window.mutations.toggleSidebar();
    if (state.sidebarOpen) {
      // Closing sidebar
      elements.sidebar.classList.add('-translate-x-full');
      elements.sidebarToggle.classList.add('rotate-180');

      fitMap(map, { sidebarOpen: false });
    } else {
      // Opening sidebar
      elements.sidebar.classList.remove('-translate-x-full');
      elements.sidebarToggle.classList.remove('rotate-180');

      fitMap(map, { sidebarOpen: true });
    }
  });

  // PUBLICATION BUTTON
  const closeFiltersPanel = () => {
    window.mutations.setFiltersOpen(false);
    elements.filtersPanel.classList.add('-translate-x-full', 'hidden');
    elements.filtersVeil.classList.add('hidden');
  };

  elements.publicationButton.addEventListener("click", function() {
    window.mutations.setPublicationsOpen(true);
    elements.publicationPanel.classList.remove('-translate-x-full');
    window.loadPublications();
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
  });

  // FILTERS BUTTON

  elements.filtersButton.addEventListener("click", function() {
    const buttonState = window.getters.filtersOpen();

    // Toggle filters panel
    if (buttonState) {
      closeFiltersPanel();
    } else {
      window.mutations.setFiltersOpen(true);
      elements.filtersPanel.classList.remove('-translate-x-full', 'hidden');
      elements.filtersVeil.classList.remove('hidden');
    }
  });

  elements.closeFiltersPanelButton.addEventListener("click", function() {
    closeFiltersPanel();
  });

  elements.filtersVeil.addEventListener("click", function() {
    closeFiltersPanel();
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
        selected.textContent = `${placeholder} (${formatNumber(selectedLabels.length)})`;
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
      selected.textContent = `${placeholder} (${formatNumber(inputs.length)})`;

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
