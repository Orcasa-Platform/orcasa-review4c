// TEMPLATES
const metaAnalysisTemplate = (id) => {
  const publications = window.getters.publications()?.data;
  const metaAnalysisPublication = publications.find(publication => String(publication.id) === String(id));
  if(!metaAnalysisPublication) return '';
  const { title, authors, description } = metaAnalysisPublication;
  return `<div class="flex flex-col gap-1 px-[50px] py-[30px] bg-green-50">
        <div class="flex-col gap-4 flex">
            <div class="text-slate-700 text-lg leading-[30px]">${title}</div>
            <div class="w-[350px] text-slate-700 text-xs font-normal font-['Roboto'] leading-[18px]">${authors}</div>
        </div>
        <div class="w-[668px] h-[100px] relative">
          <div class="text-slate-500 text-sm leading-7">${description}</div>
        </div>
        <div class="flex pr-1 justify-end gap-1">
          <button data-id="${id}" class="btn-publication-detail text-teal-500 text-base font-semibold">Learn more</button>
          <i data-lucide="arrow-right" class="w-6 h-6 relative stroke-teal-500"></i>
        </div>
    </div>`;
};

const publicationCardTemplate = ({ isDetail = false, isMetaAnalysis, journal, year, country, globalQuality, id, title, authors, description, source, url, metaAnalysis }) => `
<div class="flex flex-col ${isDetail ? '' : `p-6 ${isMetaAnalysis ? 'bg-green-50' : 'bg-gray-50'} mb-2`} space-y-4">
  ${isMetaAnalysis ? `<div class="flex">
  <div class="px-2 py-1 bg-green-100 text-teal-600 text-base">
    Meta-analysis
  </div>
  </div>` : ''}
  <div class="h-6 justify-start items-center gap-2 inline-flex">
    <div class="h-6 gap-4 flex">
        ${!isMetaAnalysis ? `<div class="justify-start items-center gap-2 flex">
          <i data-lucide="newspaper" class="w-6 h-6 relative stroke-teal-500"></i>
          <div class="text-slate-500 text-base">${journal}</div>
        </div>`: ''}
        <div class="justify-start items-center gap-2 flex">
          <i data-lucide="calendar" class="w-6 h-6 relative stroke-teal-500"></i>
          <div class="text-slate-500 text-base">${year}</div>
        </div>
        ${!isMetaAnalysis ? `<div class="justify-start items-center gap-2 flex">
          <i data-lucide="globe-2" class="w-6 h-6 relative stroke-teal-500"></i>
          <div class="text-slate-500 text-base">${country}</div>
        </div>` : ''}
        ${isMetaAnalysis ? `<div class="justify-start items-center gap-2 flex">
        <i data-lucide="award" class="w-6 h-6 relative stroke-teal-500"></i>
        <div class="text-slate-500 text-base">Global quality: ${globalQuality}%</div>
      </div>` : ''}
    </div>
  </div>
  <header class="mb-6 text-slate-700">
    <div class="text-2xl font-semibold leading-10">
      ${title}
    </div>
    <div class="text-slate-700 text-base">${authors}</div>
  </header>
  <div class="text-slate-500 text-base">${isDetail ? description : ellipsis(description, 230)}</div>
  ${!isDetail ? `<div class="h-6 justify-end items-center gap-4 flex">
    <div class="pr-1 justify-center items-center gap-1 flex">
        <button data-id="${id}" class="btn-publication-detail text-teal-500 text-base font-semibold">Learn more</button>
        <i data-lucide="arrow-right" class="w-6 h-6 relative stroke-teal-500"></i>
    </div>
  </div>`: ''}
  ${isDetail ?
    `<div>
      <div class="flex w-full justify-between items-center mb-6">
        <div>
          <span class="text-slate-500 text-base">Source: </span>
          <span class="text-slate-700 text-base">${source}</span>
        </div>
        <a href="${url}" target="_blank" rel="noopener noreferrer" class="btn-secondary flex gap-2">
          Visit DOI
          <i data-lucide="external-link" class="w-6 h-6 color-slate-700 stroke-current"></i>
        </a>
      </div>
    ${metaAnalysis ? `
    <div class="pt-2.5 border-t border-dashed border-gray-300 flex-col gap-5 flex">
      <div class="text-slate-700 text-2xl leading-10 font-serif">Meta-analysis</div>
      ${metaAnalysis.map(metaAnalysisTemplate).join('')}
    </div>
  </div>
  `: ''}
    `
    : ''}
</div>
`;

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
    const { name, publications, metaAnalysis, comparisons, slug } = landUse;

    // Set on state the first land use
    window.mutations.setLandUse(slug);

    // Update the map
    addLayer(map, slug);

    // Update the description with the land use publications and meta-analysis
    const publicationsNumber = publications?.toLocaleString() || '-';
    const metaAnalysisNumber = metaAnalysis?.toLocaleString() || '-';
    const comparisonsNumber = comparisons?.toLocaleString() || '-';
    if(landUseSlug === 'all') {
      elements.landUseIntro.innerHTML = `<span>Scientific Evidence brings impartial evidence from peer-reviewed literature to analyse the effects of land management, land-use change and climate change on Soil Organic Carbon. To date, Scientific Evidence gathers </span>
      <span id="land-use-meta-analysis">${metaAnalysisNumber}</span> meta-analyses,
      <span
        class="font-semibold">
        <span id="land-use-publications">${publicationsNumber}</span> scientific publications</span> and includes over </span>
        <span id="land-use-publications">${comparisonsNumber}</span> <span>
         comparisons of practices to increase soil carbon storage.</span>`
    } else {
      elements.landUseIntro.innerHTML = `<span>These
        insights come from the analysis of</span><span
        class="font-semibold">
        <span id="land-use-publications">${publicationsNumber}</span> scientific publications</span><span>
        and <span id="land-use-meta-analysis">${metaAnalysisNumber}</span> meta-analysis
        related
        to </span><span
        class="font-semibold" id="land-use-text">${name.toLowerCase()}</span><span>
        interventions on SOC.</span>`
    }

    // elements.landUsePublications.innerHTML = publicationsNumber;
    // elements.landUseMetaAnalysis.innerHTML = metaAnalysisNumber;
    // elements.landUseText.innerHTML = name.toLowerCase();
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
  getURL(URLS.allLandUses).then(data => {
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
      checked
      value="${value}" />
      <label for="${slug}-${value}">
      ${label}
      </label>`;
      parent.appendChild(listElement)
  };

  getURL(URLS.countries).then(window.mutations.setCountries);
  getURL(URLS.journals).then(window.mutations.setJournals);

  // LOAD PUBLICATIONS
  const createPublicationCard = (publication) => {
    const card = document.createElement('div');
    card.innerHTML = publicationCardTemplate({ isDetail: false, isMetaAnalysis: publication.type === 'meta-analysis', ...publication});
    return card;
  };

  const updateNumbers = (data, publicationRequest) => {
    const selection = publicationRequest.landUse === 'all'
    ? 'all publications'
    : [
      publicationRequest.landUse,
      publicationRequest.intervention,
      publicationRequest.subCategory,
      publicationRequest.subType
    ].join(' ');
    const metaAnalysisNumber = data.filter(publication => publication.type === 'meta-analysis').length;
    elements.metaAnalysisNumber.innerHTML = metaAnalysisNumber;
    elements.publicationsNumber.innerHTML = data.length - metaAnalysisNumber;
    elements.filtersSelectionText.innerHTML = selection;
  };

  const populateYearChart = (years) => {
    elements.yearRange.innerHTML = '';

    years && Object.values(years).forEach(yearCount => {
      const YEAR_COUNT_HEIGHT = 2;
      const yearElement = document.createElement('div');
      yearElement.classList.add('flex-1', `h-[${yearCount * YEAR_COUNT_HEIGHT}px]`, 'bg-gray-300');
      elements.yearRange.appendChild(yearElement);
    });
  };

  const populateFilters = (metadata) => {
    const countries = window.getters.countries();
    const journals = window.getters.journals();
    const { years: availableYearObjects, countries: availableCountries, journals: availableJournals } = metadata;
    const countryList = elements.countryDropdown.querySelector('ul');
    countryList.innerHTML = '';
    const filteredCountries = countries.filter(c => availableCountries.includes(c.iso_2digit))
    filteredCountries.forEach(country => {
      const { iso_2digit: iso, cntry_name: label } = country;
      appendListElement(countryList, iso, label, 'year');
    });

    // Start with all countries selected
    window.mutations.setPublicationFilters('countries', filteredCountries.map(c => c.iso_2digit));

    const journalList = elements.journalDropdown.querySelector('ul');
    journalList.innerHTML = '';
    const filteredJournals = journals.filter(j => availableJournals.includes(j.journal_id));
    filteredJournals.forEach(journal => {
      const { journal_id: value, journal_name: label } = journal;
      appendListElement(journalList, value, capitalize(label), 'journal');
    });

    // Start with all journals selected
    window.mutations.setPublicationFilters('journals', filteredJournals.map(c => c.journal_id));

    const availableYears = availableYearObjects && Object.keys(availableYearObjects);
    const yearList = elements.yearDropdown.querySelector('ul');
    yearList.innerHTML = '';
    availableYears.forEach((year) => {
      appendListElement(yearList, year, year, 'year');
    });

    // Start with all years selected
    window.mutations.setPublicationFilters('years', availableYears.map(c => c.journal_id));
  };

  window.loadPublications = (reload) => {
    const filter = window.getters.filter();
    const publicationRequest = {
      landUse: window.getters.landUse(),
      intervention: filter?.intervention,
      subCategory:  filter?.subCategory || filter?.value,
      subType: filter?.type === 'sub-type' ? filter?.value : null,
      publicationFilters: window.getters.publicationFilters(),
      search: window.getters.search(),
      sort: window.getters.publicationsSort(),
      page: window.getters.publicationPage(),
    };

    getPublications(publicationRequest).then(({ data, metadata }) => {
      // First clear publications container
      elements.publicationsContainer.innerHTML = '';

      // Show publications
      data.forEach(publication => {
        elements.publicationsContainer.appendChild(createPublicationCard(publication));
      });

      // Add event listeners to the publication buttons

      for (let link of elements.publicationDetailButton) {
        link.addEventListener("click", function() {
          window.mutations.setPublicationDetailOpen(true);

          elements.publicationDetailModal.classList.remove('hidden');
          elements.closePublicationDetailPanelButton.focus();

          const publicationId = link.getAttribute('data-id');
          window.loadPublication(publicationId);
        });
      }

      if(!reload) {
        populateYearChart(metadata.years);
        populateFilters(metadata);
      }

      updateNumbers(data, publicationRequest);

      // Update lucide icons
      lucide.createIcons();

      window.mutations.setPublications({ data, metadata });
    });
  };

  window.reloadPublications = () => window.loadPublications(true);

  window.loadPublication = (publicationId) => {
    elements.publicationDetailPanelContent.innerHTML = '';
    const publication = window.getters.publications()?.data.find(publication => String(publication.id) === publicationId);
    const card = document.createElement('div');
    card.innerHTML = publicationCardTemplate({ isDetail: true, isMetaAnalysis: publication.type === 'meta-analysis', ...publication});
    elements.publicationDetailPanelContent.appendChild(card);

    const linkButtons = document.getElementsByClassName('btn-publication-detail');
    for (let link of linkButtons) {
      link.addEventListener("click", function() {
        const publicationId = link.getAttribute('data-id');
        window.loadPublication(publicationId);
      });
    }

    // Update lucide icons
    lucide.createIcons();
  };




  // Add event listener on scroll on publications list to load more publications
  elements.publicationPanel.addEventListener('scroll', () => {
    const { scrollHeight, scrollTop, clientHeight } = elements.publicationPanel;
    const { pages } = window.getters.publications()?.metadata;
    const currentPage = window.getters.publicationPage();

    // When we get to the end of the scroll, load more publications
    if (scrollHeight - scrollTop === clientHeight) {
      if (pages > currentPage) {
        window.mutations.setPublicationPage(window.getters.publicationPage() + 1);
        window.reloadPublications();
      }
    }
  });
});