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
  </button>`

const loadData = (landUseSlug) => {
  const landUsesData = getters.landUses();
  const landUse = landUsesData.find(({ slug }) => slug === landUseSlug);
  const { name, publications, metaAnalysis, slug } = landUse;
  // Set on state the first land use
  mutations.setLandUse(slug);

  // Update the description with the land use publications and meta-analysis
  const publicationsNumber = publications?.toLocaleString() || '-';
  const metaAnalysisNumber = metaAnalysis?.toLocaleString() || '-';
  elements.landUsePublications.innerHTML = publicationsNumber;
  elements.landUseMetaAnalysis.innerHTML = metaAnalysisNumber;
  elements.landUseText.innerHTML = name.toLowerCase();
};

getData().then(data => {
  if (elements.landUseMenu && data) {
    const landUses = Object.entries(data).map(([key, value], i) => ({ slug: key, ...value, index: i }));

    mutations.setLandUses(landUses);

    landUses.forEach(landUse => {
      elements.landUseMenu.innerHTML += button(landUse);
    });
    loadData(landUses[0].slug);
  }
});