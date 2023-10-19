// TEMPLATES
const metaAnalysisTemplate = (id) => {
  const publications = window.getters.publications()?.data;
  const metaAnalysisPublication = publications.find(publication => String(publication.id) === String(id));
  if(!metaAnalysisPublication) return '';
  const { title, authors, description } = metaAnalysisPublication;
  return `<div class="flex flex-col gap-1 px-[50px] py-[30px] bg-green-50">
        <div class="flex-col gap-4 flex">
            <div class="text-slate-700 text-lg leading-[30px]">${title}</div>
            <div class="text-slate-700 text-xs leading-[18px]">${authors}</div>
        </div>
        <div>
          <div class="text-slate-500 text-sm leading-7">${description}</div>
        </div>
        <div class="flex pr-1 justify-end gap-1">
          <button data-id="${id}" class="btn-publication-detail text-teal-500 text-base font-semibold">Learn more</button>
          <i data-lucide="arrow-right" class="w-6 h-6 relative stroke-teal-500"></i>
        </div>
    </div>`;
};

const methodologyAndAttributesTemplate = (methodologyAndAttributes) => {
  const attributes = methodologyAndAttributes && Object.entries(methodologyAndAttributes).map(([key, value]) => {
    const label = key.replace(/_/g, ' ');
    const renderValue = (value) => {
      if (value === 'yes') {
        return '<img src="/assets/icons/yes.svg" alt="yes icon" class="w-6 h-6" />';
      }
      if (value === 'no') {
        return '<img src="/assets/icons/no.svg" alt="no icon" class="w-6 h-6" />';
      }
      if (value === '-') {
        return '<img src="/assets/icons/blank.svg" alt="no icon" class="w-6 h-6" />';
      }
      return `<span class="pr-2">${value}</span>`;
    };

    return `<div class="flex gap-1 justify-between items-center even:bg-gray-50 py-4 px-6">
      <span class="text-slate-600 text-sm">${label}</span>
      <span class="text-slate-500 text-sm leading-7 px-6 py-4">${renderValue(value)}</span>
    </div>`;
  }).join('');
  return (`<div class="flex flex-col gap-4 border-t border-gray-300 border-dashed">
    <div class="text-slate-700 text-2xl leading-10 pt-4">Methodology and attributes</div>
    ${attributes}
  </div>`);
}

const publicationCardTemplate = ({ isDetail = false, isMetaAnalysis, journals, year, countries, globalQuality, id, title, authors, description, source, url, metaAnalysis, 'methodology-and-attributes': methodologyAndAttributes }) => `
<div class="flex flex-col ${isDetail ? '' : `p-6 ${isMetaAnalysis ? 'bg-green-50' : 'bg-gray-50'} mb-2`} space-y-4">
  ${!isDetail && isMetaAnalysis ? `<div class="flex">
    <div class="px-2 text-white text-base px-2 bg-teal-500 rounded border border-teal-500">
      Meta-analysis
    </div>
  </div>` : ''}
  <div class="h-6 justify-start items-center gap-6 inline-flex">
  ${isDetail && isMetaAnalysis ? `<div class="flex flex-shrink-0">
    <div class="px-2 text-white text-base px-2 bg-teal-500 rounded border border-teal-500">
      Meta-analysis
    </div>
    </div>` : ''}
    <div class="w-full h-6 gap-4 flex text-slate-500 text-xs">
        ${!isMetaAnalysis && journals.length > 0 ? `<div class="justify-start items-center gap-2 flex max-w-[60%] w-fit">
          <i data-lucide="newspaper" class="w-6 h-6 relative"></i>
          <div class="flex-1 truncate" title="${journals.join(', ')}">${journals.join(', ')}</div>
        </div>`: ''}
        <div class="justify-start items-center gap-2 flex">
          <i data-lucide="calendar" class="w-6 h-6 relative max-width-[10%]"></i>
          <div>${year}</div>
        </div>
        ${!isMetaAnalysis && countries.length > 0 ? `<div class="justify-start items-center gap-2 flex max-w-[30%]">
          <i data-lucide="globe-2" class="w-6 h-6 relative"></i>
          <div class="truncate" title="${countries.join(', ')}">${countries.join(', ')}</div>
        </div>` : ''}
        ${isMetaAnalysis ? `<div class="justify-start items-center gap-2 flex">
        <i data-lucide="award" class="w-6 h-6 relative"></i>
        <div>Global quality: ${globalQuality}%</div>
      </div>` : ''}
    </div>
  </div>
  <header class="mb-6 text-slate-700">
    <div class="${isDetail ? 'text-slate-700 text-[34px] leading-[50px]' : 'text-2xl font-semibold leading-10'}">
      ${title}
    </div>
    <div class="text-slate-700 text-xs leading-[18px] italic">${authors}</div>
  </header>
  <div class="text-sm leading-7 text-slate-500">${isDetail ? description : ellipsis(description, 230)}</div>
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
      ${methodologyAndAttributes ? methodologyAndAttributesTemplate(methodologyAndAttributes) : ''}
      `
    : ''}
</div>
`;

window.addEventListener('load', function () {
  const createCards = (data, landUseName) => {
    const existingData = data?.filter(Boolean);
    const cards = existingData.map(({
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
    existingData.map(d => createSVGChart(d.slug, d["interventions"]));
  };

  const loadMainInterventionCharts = (landUse) => {
    const { name: landUseName, mainInterventions, slug: landUseSlug } = landUse;
    const mainInterventionPromises = mainInterventions.map((mainInterventionSlug) => getMainInterventionChartData(landUseSlug, mainInterventionSlug));
    Promise.all(mainInterventionPromises).then((data) => {
      window.mutations.setMainInterventions(data);
      createCards(data, landUseName);
    });
  };

  // Load data on first load or when the user clicks on an main intervention menu button
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
    if (landUseSlug === 'all') {
      elements.landUseIntro.innerHTML = `<div class="space-y-6">
        <div class="text-slate-700 text-[32px] leading-[48px]">
          <span>Scientific Evidence brings impartial evidence from </span>
          <span class="font-semibold">peer-reviewed literature.</span>
        </div>
        <div class="text-slate-700 text-2xl leading-10">
          We analyse the effects of land management, land-use change and climate change on Soil Organic Carbon. To date, Scientific Evidence gathers <span id="land-use-meta-analysis">${metaAnalysisNumber}</span> meta-analyses and ${publicationsNumber} scientific publications.
        </div>
        <div class="flex pt-6 pb-10 justify-evenly items-center gap-4">
          <div class="flex items-center gap-4">
            <i class="w-20 h-20 stroke-teal-500 stroke-1" data-lucide="file-stack"></i>
            <div class="flex-col justify-center flex">
                <div class="text-slate-700 text-[32px] font-semibold leading-[48px]">${publicationsNumber}</div>
                <div class="text-slate-700 text-base">Scientific publications</div>
            </div>
          </div>
          <img class="w-[58px]" src="/assets/icons/arrow-all.svg" alt="arrow" class="w-8 h-8" />
          <div class="flex items-center gap-2">
            <i class="w-20 h-20 stroke-teal-500 stroke-1" data-lucide="file-bar-chart-2"></i>
            <div class="flex-col justify-center flex">
                <div class="text-slate-700 text-[32px] font-semibold leading-[48px]">${metaAnalysisNumber}</div>
                <div class="text-slate-700 text-base">Meta-analyses</div>
            </div>
          </div>
        </div>
      </div>`;
      lucide.createIcons();

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

    elements.legendText.innerHTML = name;

    // Load main intervention charts
    if (landUse.mainInterventions) {
      loadMainInterventionCharts(landUse);
    } else {
      elements.chartCards.innerHTML = '';
    }
  };

  // Create a button for each land use
  const button = ({ slug, name, publications, index }) =>
  `<button
    type="button"
    data-slug=${slug}
    class="btn-filter btn-land-use"
    aria-pressed="${index === 0 ? "true" : "false"}"
  >
    <span>
      ${name}
    </span>
    <span class="text-xs">
    (${publications?.toLocaleString()})
    </span>
    </button>
  `;

  // Get data on first load
  getMainInterventionChartData().then(data => {
    if (elements.landUseMenu && data) {
      const landUses = Object.entries(data).map(([key, value], i) => ({ slug: key, ...value, index: i }));
      window.mutations.setLandUses(landUses);

      landUses.forEach(landUse => {
        elements.landUseMenu.innerHTML += button(landUse);
      });
      loadData(landUses[0].slug);
    }
  }).then(() => {
    // Add event listeners to the land use buttons
    const landUseButtons = document.getElementsByClassName('btn-land-use');

    // LAND USE BUTTONS
    if (landUseButtons) {
      for (let element of elements.landUseButtons) {
        element.addEventListener("click", function() {
          const slug = element.getAttribute('data-slug');
          window.mutations.setLandUse(slug);
          window.mutations.setFilter(null);
          loadData(slug);

          element.setAttribute('aria-pressed', 'true');
          const otherButtons = Array.from(elements.landUseButtons).filter(button => button !== element);
          otherButtons.forEach(button => button.setAttribute('aria-pressed', 'false'));
        });
      };
    }
  });

  // Populate filters
  const appendListElement = (parent, value, label, slug) => {
    const listElement = document.createElement('li');
    listElement.classList.add('max-w-[265px]');
    listElement.innerHTML = `
    <label for="${slug}-${value}" class="flex items-center gap-2 p-4">
      <input
        type="checkbox"
        class="checkbox-light"
        id="${slug}-${value}"
        value="${value}"
      />
      ${label}
    </label>`;
      parent.appendChild(listElement)
  };

  getFilters('country').then(window.mutations.setCountries);
  getFilters('journal').then(window.mutations.setJournals);

  // LOAD PUBLICATIONS
  const createPublicationCard = (publication) => {
    const card = document.createElement('div');
    card.innerHTML = publicationCardTemplate({ isDetail: false, isMetaAnalysis: publication.type === 'meta-analysis', ...publication});
    return card;
  };

  const updateNumbers = (metadata, publicationRequest) => {
    const { totalPublications, totalMetaAnalysis } = metadata;

    const getLandUse = (landUseSlug) =>
      window.getters.landUses().find(({ slug }) => slug === landUseSlug);

    const getMainIntervention = (mainInterventionSlug) =>
      window.getters.mainInterventions().find(({ slug }) => slug === mainInterventionSlug);

    const getIntervention = (mainInterventionSlug, interventionSlug) => {
      const mainIntervention = getMainIntervention(mainInterventionSlug);
      return mainIntervention?.interventions.find(({ slug }) => slug === interventionSlug);
    };

    const getSubType = (mainInterventionSlug, interventionSlug, subTypeSlug) => {
      const intervention = getIntervention(mainInterventionSlug, interventionSlug);
      return intervention?.subTypes.find(({ slug }) => slug === subTypeSlug);
    };

    let selection = 'all publications';
    if (publicationRequest.landUse !== 'all') {
      const landUseName = getLandUse(publicationRequest.landUse)?.name.toLowerCase();

      if (publicationRequest.subType) {
        const subTypeName = getSubType(
          publicationRequest.mainIntervention,
          publicationRequest.intervention,
          publicationRequest.subType
        )?.title.toLowerCase();
        selection = `${subTypeName} for ${landUseName}`;
      } else if (publicationRequest.intervention) {
        const interventionName = getIntervention(
          publicationRequest.mainIntervention,
          publicationRequest.intervention
        )?.title.toLowerCase();
        selection = `${interventionName} for ${landUseName}`;
      } else {
        selection = landUseName;
      }
    }

    elements.metaAnalysisNumber.innerHTML = totalMetaAnalysis || 0;
    elements.publicationsNumber.innerHTML = totalPublications || 0;

    elements.filtersSelectionText.innerHTML = selection;
  };

  const populateYearChart = (years) => {
    if (!years) return;

    const yearKeys = Object.keys(years);

    const maxYearCount = Math.max(...Object.values(years));
    const barTooltip = document.getElementById('bar-tooltip');
    const barTooltipContent = document.getElementById('bar-tooltip-content');

    const addTooltip = (event, year, yearBar) =>  {
      const barRect = yearBar.getBoundingClientRect();
      const top = barRect.top;
      const TOP_PADDING = 68;
      const leftOffset = (elements.yearRange.getBoundingClientRect().left - elements.publicationPanel.getBoundingClientRect().width)
      const left = barRect.left - leftOffset + barRect.width / 2;

      // Put on top of the bar
      barTooltip.style.top = `${top - TOP_PADDING}px`;
      barTooltip.style.left = `${left}px`;
      barTooltip.classList.remove('hidden');
      barTooltipContent.innerHTML = `<div>${year}</div>`;
    }

    const yearsElements = Object.entries(years).map(([year, yearCount]) => {
      const heightPercentage = (yearCount / maxYearCount) * 100;
      const yearBar = document.createElement('div');
      yearBar.classList.add('year-bar', 'flex-1', `h-[${heightPercentage}%]`, 'bg-chart-color', 'rounded-sm');
      yearBar.setAttribute('data-year', year);
      return yearBar.outerHTML;
    }).join('');

    elements.yearRange.innerHTML = `
      <div>
        <div class="relative w-full h-full px-1">
          <div class="flex gap-1 items-end justify-between h-[125px]">
            ${yearsElements}
          </div>
          <div class="absolute bottom-0 left-0 w-full h-full pointer-events-none">
            <div class="flex flex-col justify-between items-end h-full">
              <div class="flex-1 h-[1px] border-b border-gray-300 border-dashed w-full"></div>
              <div class="flex-1 h-[1px] border-b border-gray-300 border-dashed w-full"></div>
              <div class="flex-1 h-[1px] border-b border-gray-300 border-dashed w-full"></div>
              <div class="flex-1 h-[1px] border-b-2 border-black w-full"></div>
            </div>
          </div>
        </div>
        <div class="flex justify-between items-center h-full">
          <div class="text-slate-700 text-sm">${yearKeys[0]}</div>
          <div class="text-slate-700 text-sm">${yearKeys[yearKeys.length - 1]}</div>
        </div>
      </div>
    `;

    const yearBars = document.getElementsByClassName('year-bar');
    for (let yearBar of yearBars) {
      const year = yearBar.getAttribute('data-year');
      yearBar.addEventListener('mouseenter', (event) => addTooltip(event, year, yearBar));
      yearBar.addEventListener('mouseleave', () => barTooltip.classList.add('hidden'));
    }
  };

  const populateFilters = (metadata) => {
    const countries = window.getters.countries();
    const journals = window.getters.journals();
    const { years: availableYearObjects, countries: availableCountries, journals: availableJournals } = metadata;
    const publicationTypes = [
      { value: 'primary-paper', label: 'Primary paper' },
      { value: 'meta-analysis', label: 'Meta-analysis' },
    ];

    const publicationTypesList = elements.publicationTypeDropdown.querySelector('ul');
    publicationTypesList.innerHTML = '';
    publicationTypes.forEach(({ value, label }) => {
      appendListElement(publicationTypesList, value, label, 'type-publication');
    });

    const countryList = elements.countryDropdown.querySelector('ul');
    countryList.innerHTML = '';
    const filteredCountries = availableCountries ? countries.filter(c => availableCountries.includes(c.iso_2digit)) : [];
    filteredCountries.forEach(country => {
      const { iso_2digit: iso, cntry_name: label } = country;
      appendListElement(countryList, iso, label, 'year');
    });

    // Start with all countries selected
    window.mutations.setPublicationFilters('countries', filteredCountries.map(c => c.iso_2digit));

    const journalList = elements.journalDropdown.querySelector('ul');
    journalList.innerHTML = '';
    const filteredJournals = availableJournals ? journals.filter(j => availableJournals.includes(j.journal_id)) : [];
    filteredJournals.forEach(journal => {
      const { journal_id: value, journal_name: label } = journal;
      appendListElement(journalList, value, capitalize(label), 'journal');
    });

    // Start with all journals selected
    window.mutations.setPublicationFilters('journals', filteredJournals.map(c => c.journal_id));

    const availableYears = availableYearObjects && Object.keys(availableYearObjects) || [];
    const yearList = elements.yearDropdown.querySelector('ul');
    yearList.innerHTML = '';
    availableYears.forEach((year) => {
      appendListElement(yearList, year, year, 'year');
    });

    // Start with all years selected
    window.mutations.setPublicationFilters('years', availableYears.map(c => c.journal_id));
  };

  window.loadPublications = (reload, addNewPage) => {
    if (reload && !addNewPage) {
      // Go to page 1 of the new selection
      window.mutations.setPublicationPage(1);
    }

    const filter = window.getters.filter();
    const publicationRequest = {
      landUse: window.getters.landUse(),
      mainIntervention: filter?.mainIntervention,
      intervention:  filter?.intervention || filter?.value,
      subType: filter?.type === 'sub-type' ? filter?.value : null,
      publicationFilters: window.getters.publicationFilters(),
      search: window.getters.search(),
      sort: window.getters.publicationsSort(),
      page: window.getters.publicationPage(),
    };

    getPublications(publicationRequest).then(({ data, metadata }) => {
      // First clear publications container
      if(!addNewPage) {
        elements.publicationsContainer.innerHTML = '';
      }

      if (data.length === 0) {
        elements.publicationsContainer.innerHTML = `
          <p class="text-center font-semibold text-slate-500">No results based on your search criteria</p>
        `;
      }

      // Show publications
      data.forEach(publication => {
        elements.publicationsContainer.appendChild(createPublicationCard(publication));
      });
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

      if(!addNewPage) {
        updateNumbers(metadata, publicationRequest);
      }

      // Update lucide icons
      lucide.createIcons();

      if (addNewPage) {
        const { data: currentData } = window.getters.publications() || {};
        window.mutations.setPublications({ data: currentData.concat(data).flat(), metadata });
      } else {
        window.mutations.setPublications({ data, metadata });
      }
    });
  };

  window.reloadPublications = () => window.loadPublications(true);
  window.addPublications = () => window.loadPublications(true, true);

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
        window.addPublications();
      }
    }
  });
});