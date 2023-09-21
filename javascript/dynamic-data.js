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
    elements.landUsePublicationsDetail.innerHTML = publicationsNumber;
    elements.landUseMetaAnalysisDetail.innerHTML = metaAnalysisNumber;
    elements.landUseText.innerHTML = name.toLowerCase();
    elements.landUseTextDetail.innerHTML = name.toLowerCase();
    elements.legendText.innerHTML = name;

    // Load interventions
    if (landUse.interventions) {
      loadInterventions(landUse.interventions, landUse.name);
    } else {
      elements.chartCards.innerHTML = '';
    }
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
  getURL(URLS.intervention).then(data => {
    if (elements.landUseMenu && data) {
      const landUses = Object.entries(data).map(([key, value], i) => ({ slug: key, ...value, index: i }));
      window.mutations.setLandUses(landUses);

      landUses.forEach(landUse => {
        elements.landUseMenu.innerHTML += button(landUse);
      });
      loadData(landUses[0].slug);
    }
  }).then(() => {
    // Add event listeners to the intervention buttons
    const interventionButtons = document.getElementsByClassName('btn-intervention');

    // INTERVENTION BUTTONS
    if (interventionButtons) {
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
  });

  // Populate filters
  const appendListElement = (parent, value, label, slug) => {
    const listElement = document.createElement('li');
    listElement.classList.add('flex', 'items-center', 'gap-2', 'p-4',  'max-w-[265px]');
    listElement.innerHTML = `
      <input
      type="checkbox"
      class="checkbox-light"
      id="${slug}-${value}"
      value="${value}" />
      <label for="${slug}-${value}">
      ${label}
      </label>`;
      parent.appendChild(listElement)
  };

  getURL(URLS.countries).then(countries => {
    if (countries) {
      const countryList = elements.countryDropdown.querySelector('ul');
      countries.forEach(country => {
        const { iso_2digit: iso, cntry_name: label } = country;
        appendListElement(countryList, iso, label, 'year');
      });
    }
  });
  getURL(URLS.years).then(years => {
    if (years) {
      const yearList = elements.yearDropdown.querySelector('ul');
      years.forEach(date => {
        const { year } = date;
        appendListElement(yearList, year, year, 'year');
      });
    }
  });
  getURL(URLS.journals).then(journals => {
    if (journals) {
      const journalList = elements.journalDropdown.querySelector('ul');
      journals.forEach(date => {
        const { journal_id: value, journal_name: label } = date;
        appendListElement(journalList, value, capitalize(label), 'journal');
      });
    }
  });
});