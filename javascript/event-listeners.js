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
    elements.sidebarToggle.classList.remove('sidebar-toggle-theme-dark');
    elements.sidebarToggle.classList.add('sidebar-toggle-theme-light');
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
    elements.sidebarToggle.classList.add('sidebar-toggle-theme-dark');
    elements.sidebarToggle.classList.remove('sidebar-toggle-theme-light');

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

  // SIDEBAR CONTENT

  // INTERVENTION BUTTONS

  if (elements.interventionButtons) {
    for (let element of elements.interventionButtons) {
      element.addEventListener("click", function() {
        const slug = element.getAttribute('data-slug');
        window.mutations.setLandUse(slug);

        loadData(slug);

        element.setAttribute('aria-pressed', 'true');
        const otherButtons = Array.from(elements.interventionButtons).filter(button => button !== element);
        otherButtons.forEach(button => button.setAttribute('aria-pressed', 'false'));
      });
    };
  }

  // PUBLICATION BUTTON

  elements.publicationButton.addEventListener("click", function() {
    window.mutations.setPublicationsOpen(true);
    elements.publicationPanel.classList.remove('-translate-x-full');
  });

  elements.closePublicationPanelButton.addEventListener("click", function() {
    window.mutations.setPublicationsOpen(false);
    elements.publicationPanel.classList.add('-translate-x-full');
  });


  // PUBLICATIONS PANEL

  // SORT PUBLICATIONS BUTTON

  elements.sortPublicationsButton.addEventListener("click", function() {
    window.mutations.togglePublicationsSort();
    const publicationsSort = window.getters.publicationsSort();
    const [text, icon] = elements.sortPublicationsButton.childNodes;
    icon.classList.toggle('rotate-180');
    text.textContent = publicationsSort === 'asc' ? 'Newest first' : 'Oldest first';
  });
});
