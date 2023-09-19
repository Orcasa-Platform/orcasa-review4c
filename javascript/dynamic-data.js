window.addEventListener('load', function () {
  const createCards = (data, landUseName) => {
    const cards = data.map(({
      name,
      slug,
      description
    }) => {
      return `
      <div class="flex flex-col p-6 bg-gray-50 mb-2">
        <header class="mb-6">
          Impact of <span class="font-semibold">${name}</span> on soil organic carbon for ${landUseName}
        </header>
        <div
          class="">
          <div>${description}</div>
          <div id="chart-${slug}" class="chart w-full h-full flex items-center justify-center font-semibold uppercase bg-gray-50 mt-4"></div>
        </div>
      </div>
      `;
    });
    elements.chartCards.innerHTML = cards.join('');
    data.map(d => createSVGChart(d.slug, d["sub-categories"]));
  };

  const loadInterventions = (interventions, landUseName) => {
    const interventionPromises = interventions.map(getIntervention);
    Promise.all(interventionPromises).then((data) => {
      window.mutations.setInterventions(data);
      createCards(data, landUseName);
    });
  };

  // Load data on first load or when the user clicks on an intervention menu button
  window.loadData = (landUseSlug) => {
    const landUsesData = window.getters.landUses();
    const landUse = landUsesData.find(({ slug }) => slug === landUseSlug);
    const { name, publications, metaAnalysis, slug } = landUse;

    // Set on state the first land use
    window.mutations.setLandUse(slug);

    // Update the map
    addLayer(map, slug);

    // Update the description with the land use publications and meta-analysis
    const publicationsNumber = publications?.toLocaleString() || '-';
    const metaAnalysisNumber = metaAnalysis?.toLocaleString() || '-';
    elements.landUsePublications.innerHTML = publicationsNumber;
    elements.landUseMetaAnalysis.innerHTML = metaAnalysisNumber;
    elements.landUseText.innerHTML = name.toLowerCase();

    // Load interventions
    loadInterventions(landUse.interventions, landUse.name);
  };

  // Create a button for each land use
  const button = ({ slug, name, publications, index }) =>
  `<button
    type="button"
    data-slug=${slug}
    class="btn-filter btn-intervention"
    aria-pressed="${index === 0 ? "true" : "false"}"
  >
    <span class="font-semibold">
      ${name}
    </span>
    <span class="text-xs">
    (${publications?.toLocaleString()})
    </span>
    </button>
  `;

  // Get data on first load
  getData().then(data => {
    if (elements.landUseMenu && data) {
      const landUses = Object.entries(data).map(([key, value], i) => ({ slug: key, ...value, index: i }));

      window.mutations.setLandUses(landUses);

      landUses.forEach(landUse => {
        elements.landUseMenu.innerHTML += button(landUse);
      });
      loadData(landUses[0].slug);
    }
  });
});