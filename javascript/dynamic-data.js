// TEMPLATES

const publicationDetailButton = (id) =>`
  <button
    type="button"
    class="btn-publication-detail group flex items-center justify-start flex-row-reverse"
    data-id="${id}"
  >
    ${publicationDetailButtonSVG}
    <span class="pointer-events-none text-gray-500 text-xs opacity-0 transition group-hover:opacity-100 group-focus:opacity-100 min-w-fit duration-500 translate-x-0 group-hover:-translate-x-1/3 group-focus:-translate-x-1/3">Learn more</span>
  </button>
`;

const publicationDetailButtonSVG = `<svg width="16" height="16" viewBox="0 0 16 16" stroke="currentColor" fill="none" xmlns="http://www.w3.org/2000/svg" class="svg-btn-publication-detail">
<path d="M3.33325 8H12.6666H3.33325Z" fill="currentColor"/>
<path d="M3.33325 8H12.6666" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M8 3.33333L12.6667 8L8 12.6667" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;

const metaAnalysisTemplate = (metaAnalysisPublication) => {
  if(!metaAnalysisPublication) return '';
  return publicationCardTemplate({ isMetaAnalysis: true, ...metaAnalysisPublication});
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

    return `<div class="flex justify-between items-center border border-b border-main divide-x divide-main">
      <span class="text-neutral-300 text-xs py-4 px-6">${label}</span>
      <span class="text-white flex items-center justify-center text-xs leading-7 px-6 py-4 w-[128px]">${renderValue(value)}</span>
    </div>`;
  }).join('');

  return `<div class="bg-gray-650 rounded-lg">${attributes}</div>`;
}

const cardTagTemplate = ({ label, title, classNames }) => (
    `<span class="flex px-2 py-1 rounded-2xl border border-mod-sc-ev justify-start items-center text-mod-sc-ev text-xs font-medium leading-[14px] ${classNames ? classNames : ''}" ${title ? `title="${title}"` : ''} >
      <span class="truncate">${label}</span>
    </span>`);

const publicationCardTemplate = ({ isMetaAnalysis, journals, year, countries, globalQuality, id, title, authors, description, source, url, metaAnalysis, 'methodology-and-attributes': methodologyAndAttributes }) => `
<div class="flex flex-col p-6 ${isMetaAnalysis ? 'bg-green-50' : 'bg-gray-50'} rounded-lg mb-4 space-y-6 border border-gray-100">
  <div class="h-6 justify-start items-center gap-6 inline-flex">
    <div class="w-full h-6 gap-1 flex text-gray-700 text-xs">
      ${isMetaAnalysis ? cardTagTemplate({ label: 'Meta-analysis' }) : ''}
      ${!isMetaAnalysis && journals.length > 0 ?
        cardTagTemplate({ label: journals.join(', '), title: journals.join(', '), classNames: 'truncate max-w-[60%]'}) : ''}
      ${cardTagTemplate({ label: year })}
      ${!isMetaAnalysis && countries.length > 0 ? cardTagTemplate({ label: countries.join(', '), title: countries.join(', '), classNames: 'truncate max-w-[30%]' }) : ''}
      ${isMetaAnalysis ? cardTagTemplate({label: `Global quality: ${globalQuality}%` }) : ''}
    </div>
  </div>
  <header class="mb-6 text-gray-700 space-y-2">
    <div class="font-serif text-slate-700 text-base leading-relaxed">
      ${title}
    </div>
    <div class="text-slate-700 text-xs leading-[18px] italic">${authors}</div>
  </header>
  <div class="text-sm leading-7 text-slate-500">${ellipsis(description, 230)}</div>
  <div class="h-6 justify-end items-center gap-4 flex">
    <div class="pr-1 justify-center items-center gap-1 flex">
      ${publicationDetailButton(id)}
    </div>
  </div>
</div>
`;

const externalLinkSVG = `<svg viewBox="0 0 22 22" class="w-4 h-4" stroke="currentColor" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path id="Vector"
    d="M13.5 6H5.25C4.65326 6 4.08097 6.23705 3.65901 6.65901C3.23705 7.08097 3 7.65326 3 8.25V18.75C3 19.3467 3.23705 19.919 3.65901 20.341C4.08097 20.7629 4.65326 21 5.25 21H15.75C16.3467 21 16.919 20.7629 17.341 20.341C17.7629 19.919 18 19.3467 18 18.75V10.5M7.5 16.5L21 3M21 3H15.75M21 3V8.25"
    stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
</svg>`;

const publicationDetailTemplate = ({ isMetaAnalysis, journals, year, countries, title, authors, landUse, description, source, url, metaAnalysis, 'methodology-and-attributes': methodologyAndAttributes }) => `
<div class="flex flex-wrap gap-16">
  <div class="flex-1 space-y-6">
    <header class="space-y-6">
      <div class="font-serif text-3xl leading-10">
        ${title}
      </div>
      <div class="text-sm leading-normal italic">${authors}</div>
    </header>
    <div class="text-sm leading-7 text-neutral-300">${description}</div>
  </div>
  <div class="flex-1 space-y-10">
    <div class="space-y-6">
      <div>
        <div class="flex gap-2 pb-4 border-b border-gray-600 mb-6">
          <i class="w-6 h-6 text-white stroke-1" alt="details icon"
            data-lucide="file-text"></i>
          <h4 class="text-xl font-serif">Details</i>
        </div>
      </div>
      <ul class="space-y-6">
        <li class="flex items-center">
          <span class="w-[64px] lg:w-[160px] text-white text-sm leading-7">Type</span>
          <span class="text-neutral-300 text-sm leading-tight">${isMetaAnalysis ? 'Meta-Analysis' : 'Publication'}</span>
        </li>
        <li class="flex items-center">
          <span class="w-[64px] lg:w-[160px] text-white text-sm leading-7">${journals?.length === 1 ? 'Journal' : 'Journals'}</span>
          <span class="text-neutral-300 text-sm leading-tight">${journals.join(', ')}</span>
        </li>
        <li class="flex items-center">
          <span class="w-[64px] lg:w-[160px] text-white text-sm leading-7">Year</span>
          <span class="text-neutral-300 text-sm leading-tight">${year}</span>
        </li>
        <li class="flex items-center">
        <span class="w-[64px] lg:w-[160px] text-white text-sm leading-7">${countries?.length === 1 ? 'Country' : 'Countries'}</span>
        <span class="text-neutral-300 text-sm leading-tight">${countries.join(', ')}</span>
        </li>
        <li class="flex items-center">
          <span class="w-[64px] lg:w-[160px] text-white text-sm leading-7">Land Use</span>
          <span class="text-neutral-300 text-sm leading-tight">${landUse}</span>
        </li>
        <li class="flex items-center">
          <span class="w-[64px] lg:w-[160px] text-white text-sm leading-7">Source</span>
          <span class="text-neutral-300 text-sm leading-tight flex gap-2">${source}
            <a href="${url}" target="_blank" rel="noopener noreferrer" class="cursor-pointer font-semibold text-mod-sc-ev hover:text-mod-sc-ev-dark flex gap-2">
              DOI ${externalLinkSVG}
            </a>
          </span>
        </li>
      </ul>
    </div>
    <div>
      <div class="flex gap-2 pb-4 border-b border-gray-600 mb-6">
        <i class="w-6 h-6 text-white stroke-1" alt="Meta-Analysis icon"
          data-lucide="file-stack"></i>
        <h4 class="text-xl font-serif">${metaAnalysis?.length ? 'Meta-Analysis' : 'Methodology and attributes'}</i>
      </div>
      ${metaAnalysis?.length ? `
        <div class="flex flex-col gap-2">
          ${metaAnalysis.map(metaAnalysisTemplate).join('')}
        </div>
      `: ''}
      ${methodologyAndAttributes ? methodologyAndAttributesTemplate(methodologyAndAttributes) : ''}
    </div>
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
      <div class="flex flex-col p-6 bg-white mb-2 rounded-lg text-gray-700">
        <header class="mb-4 flex w-full justify-between items-end">
          <div>Impact of <span class="font-semibold">${name}</span> on Soil Organic Carbon for ${landUseName}</div>
          <div class="text-gray-500 text-xs">Click in one intervention below to see more details</div>
        </header>
        <div
          class="text-2xs">
          <div>${description}</div>
          <div id="chart-${slug}" class="chart w-full h-full flex items-center justify-center mt-4"></div>
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

    // Update the footer with the land use publications and meta-analysis
    const publicationsNumber = formatNumber(publications) || '-';
    const metaAnalysisNumber = formatNumber(metaAnalysis) || '-';
    if (landUseSlug === 'all') {
      elements.landUseIntro.innerHTML = `<div>
        To date, we have gathered ${metaAnalysisNumber} meta-analyses and ${publicationsNumber} primary studies. Learn more, and view them geographically:
      </div>`;
      lucide.createIcons();

    } else {
      elements.landUseIntro.innerHTML = `<div>
        <span>These
          insights come from </span><span
          class="font-semibold">
          <span id="land-use-meta-analysis">${metaAnalysisNumber}</span> meta-analysis and
          <span id="land-use-publications">${publicationsNumber}</span> primary studies.</span><span>
          Learn more, and view them geographically:</span>
      </div>`;
    }
    Array.from(elements.legendTexts).map(text => text.innerHTML = name);

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
    <span class="text-base">
      ${name}
    </span>
    <span class="text-xs">
    (${formatNumber(publications)})
    </span>
    </button>
  `;
  // Create an option for each land use
  const option = ({ slug, name, publications, selectedSlug }) =>
  `<option
    data-slug=${slug}
    value=${slug}
    ${selectedSlug === slug ? "selected" : ""}
  >
    <span class="text-base">
      ${name}
    </span>
    <span class="text-xs">
    (${formatNumber(publications)})
    </span>
    </option>
  `;

  // Get data on first load
  getMainInterventionChartData().then(data => {
    if (elements.landUseMenu && data) {
      const landUses = Object.entries(data).map(([key, value], i) => ({ slug: key, ...value, index: i }));
      window.mutations.setLandUses(landUses);
      landUses.filter(l => l.name !== 'All').forEach(landUse => {
        elements.landUseMenu.innerHTML += button(landUse);
      });
      loadData(landUses[0].slug);
      return landUses;
    }
  }).then((landUses) => {
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
          // Show the chart cards of the selected land use
          elements.initialMain.classList.add('hidden');
          elements.chartCards.classList.remove('hidden');

          // Show the land use select container
          elements.landUseSelectContainer.classList.remove('hidden');
          if(landUses) {
            landUses.filter(l => l.name !== 'All').forEach(landUse => {
              elements.landUseSelect.innerHTML += option({...landUse, selectedSlug: slug });
            });
          }
        });
      };
    }
  });

  // LAND USE SELECT
  elements.landUseSelect.addEventListener('change', function() {
    const slug = elements.landUseSelect.value;
    window.mutations.setLandUse(slug);
    window.mutations.setFilter(null);
    loadData(slug);
  });

  // Populate filters
  const appendListElement = (parent, value, label, slug) => {
    const listElement = document.createElement('li');
    listElement.classList.add('max-w-[265px]');
    listElement.innerHTML = `
    <label for="${slug}-${value}" class="flex items-center gap-2 p-4">
      <input
        type="checkbox"
        class="checkbox"
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
    card.innerHTML = publicationCardTemplate({ isMetaAnalysis: publication.type === 'meta-analysis', ...publication});
    return card;
  };

  const updateNumbers = (metadata) => {
    const { totalPublications, totalMetaAnalysis } = metadata;

    elements.metaAnalysisNumber.innerHTML = formatNumber(totalMetaAnalysis) || 0;
    elements.publicationsNumber.innerHTML = formatNumber(totalPublications) || 0;
  };

  const populateYearChart = (years) => {
    if (!years) return;

    const yearKeys = Object.keys(years);

    const maxYearCount = Math.max(...Object.values(years));
    const barTooltip = document.getElementById('bar-tooltip');
    const barTooltipContent = document.getElementById('bar-tooltip-content');

    const addTooltip = (event, year, yearBar) =>  {
      const barRect = yearBar.getBoundingClientRect();
      const TOP_PADDING = 28;
      const bottom = barRect.height + TOP_PADDING;
      const leftOffset = elements.yearRange.getBoundingClientRect().left + barRect.width;
      const left = barRect.left - leftOffset;

      // Put on top of the bar
      barTooltip.style.bottom = `${bottom}px`;
      barTooltip.style.left = `${left}px`;
      barTooltip.classList.remove('hidden');
      barTooltipContent.innerHTML = `<div>${year}</div>`;
    }

    const yearsElements = Object.entries(years).map(([year, yearCount]) => {
      const heightPercentage = (yearCount / maxYearCount) * 100;
      const yearBar = document.createElement('div');
      yearBar.classList.add('year-bar', 'flex-1', `h-[${heightPercentage}%]`, 'bg-yellow-400', 'rounded-sm');
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
              <div class="flex-1 h-[1px] border-b border-gray-200/20 border-dashed w-full"></div>
              <div class="flex-1 h-[1px] border-b border-gray-200/20 border-dashed w-full"></div>
              <div class="flex-1 h-[1px] border-b border-gray-200/20 border-dashed w-full"></div>
              <div class="flex-1 h-[1px] border-b border-white w-full"></div>
            </div>
          </div>
        </div>
        <div class="flex justify-between items-center h-full">
          <div class="text-neutral-300 text-sm">${yearKeys[0]}</div>
          <div class="text-neutral-300 text-sm">${yearKeys[yearKeys.length - 1]}</div>
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
      { value: 'primary-study', label: 'Primary study' },
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

  const onOpenPublication = function({ target }) {
    window.mutations.setPublicationDetailOpen(true);

    elements.publicationDetailPanel.classList.remove('hidden');

    // Hide the main page
    elements.publicationPanel.classList.add('hidden');
    elements.map.classList.add('hidden');

    const publicationId = target.getAttribute('data-id');
    window.loadPublication(publicationId);
  };

  const addListenerToPublicationButton = function() {
    for (let link of elements.publicationDetailButton) {
      // We remove any previous event listener to avoid loading twice the publication. This
      // happens after scrolling since this function is called to add new publication at the
      // bottom of the list.
      link.removeEventListener('click', onOpenPublication);
      link.addEventListener("click", onOpenPublication);
    }
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
          <p class="text-center font-semibold text-neutral-300">No results based on your search criteria</p>
        `;
      }

      // Show publications
      data.forEach(publication => {
        elements.publicationsContainer.appendChild(createPublicationCard(publication));
      });

      addListenerToPublicationButton();

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

  window.loadPublication = async (publicationId) => {
    elements.publicationDetailPanelContent.innerHTML = '';

    try {
      const publication = await getPublication(publicationId);
      const metaAnalysis = publication.type === 'primary-study'
        ? await Promise.all(publication.metaAnalysis.map(id => getPublication(id)))
        : [];

      const countries = window.getters.countries();
      const journals = window.getters.journals();

      const card = document.createElement('div');
      card.innerHTML = publicationDetailTemplate({
        isMetaAnalysis: publication.type === 'meta-analysis',
        ...publication,
        countries: publication.countryIsos
          .map(iso => countries.find(({ iso_2digit }) => iso_2digit === iso)?.cntry_name)
          .filter(Boolean),
        journals: publication.journalIds
          .map(id => capitalize(journals.find(({ journal_id }) => journal_id === id)?.journal_name ?? ''))
          .filter(Boolean),
        metaAnalysis,
      });

      elements.publicationDetailPanelContent.appendChild(card);

      addListenerToPublicationButton();

      // Update lucide icons
      lucide.createIcons();
    } catch(e) {
      elements.publicationDetailPanelContent.innerHTML = '<p class="py-10 text-center font-semibold text-white">Publication not found</p>';
    }
  };

  window.renderMethodologyChart = () => {
    const existingChartData = window.getters.methodologyChartData();
    if (existingChartData) {
      window.createMethodologyChart(existingChartData);
    } else {
      getMethodologyData().then(data => {
        window.createMethodologyChart(data)
        window.mutations.setMethodologyChartData(data)
      });
    }
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
