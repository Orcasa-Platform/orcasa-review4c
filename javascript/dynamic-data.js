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
      <span class="text-white flex items-center justify-center text-xs leading-7 px-6 py-4 w-[128px] shrink-0">${renderValue(value)}</span>
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
<div class="flex flex-col lg:flex-row gap-4 lg:gap-16">
  <div class="flex-1 space-y-4 lg:space-y-6">
    <header class="space-y-4 lg:space-y-6">
      <div class="font-serif text-2xl lg:text-3xl leading-10">
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
          <span class="shrink-0 w-[128px] lg:w-[160px] text-white text-sm leading-7">Type</span>
          <span class="text-neutral-300 text-sm leading-tight">${isMetaAnalysis ? 'Meta-Analysis' : 'Publication'}</span>
        </li>
        <li class="flex items-center">
          <span class="shrink-0 w-[128px] lg:w-[160px] text-white text-sm leading-7">${journals?.length === 1 ? 'Journal' : 'Journals'}</span>
          <span class="text-neutral-300 text-sm leading-tight">${journals.join(', ')}</span>
        </li>
        <li class="flex items-center">
          <span class="shrink-0 w-[128px] lg:w-[160px] text-white text-sm leading-7">Year</span>
          <span class="text-neutral-300 text-sm leading-tight">${year}</span>
        </li>
        <li class="flex items-center">
        <span class="shrink-0 w-[128px] lg:w-[160px] text-white text-sm leading-7">${countries?.length === 1 ? 'Country' : 'Countries'}</span>
        <span class="text-neutral-300 text-sm leading-tight">${countries.join(', ')}</span>
        </li>
        <li class="flex items-center">
          <span class="shrink-0 w-[128px] lg:w-[160px] text-white text-sm leading-7">Source</span>
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

  // Create an option for each land use
  const option = ({ dropdownSlug = "land-use", slug, name, publications, selectedSlug, mobile = true, publicationNumbers = false }) => {
    return mobile ? `<option
      data-slug=${slug}
      value=${slug}
      ${selectedSlug === slug ? "selected" : ""}
    >
      <span class="text-base">
        ${name}
      </span>
      ${publicationNumbers ? `<span class="text-xs">
      (${formatNumber(publications)})
      </span`: ''}
      </option>
    ` :
    `<button
      data-slug=${slug}
      data-=${slug}
      value=${slug}
      class="btn-select-option btn-${dropdownSlug}-option group"
      ${selectedSlug === slug ? "selected" : ""}
    >
      <span>
        ${name}${publicationNumbers ? ` (${formatNumber(publications)})`: ''}
      </span>
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="${selectedSlug === slug ? '' : 'hidden'}">
        <path d="M20 6L9 17L4 12" stroke="white" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </button>
    `;
  };

const initSelectActions = ({ filters = false, select } = {}) => {
  const selectElements = {
    filters: {
      landUse: {
        options: document.getElementsByClassName('btn-land-use-option'),
        selectButton: elements.landUseSelectFiltersButton,
        selectOptions: elements.landUseOptionsFilters,
      },
      mainIntervention: {
        options: document.getElementsByClassName('btn-main-intervention-option'),
        selectButton: elements.mainInterventionSelectFiltersButton,
        selectOptions: elements.mainInterventionOptionsFilters,
      },
      intervention: {
        options: document.getElementsByClassName('btn-intervention-option'),
        selectButton: elements.interventionSelectFiltersButton,
        selectOptions: elements.interventionOptionsFilters,
      },
      subType: {
        options: document.getElementsByClassName('btn-sub-type-option'),
        selectButton: elements.subTypeSelectFiltersButton,
        selectOptions: elements.subTypeOptionsFilters,
      }
    },
    main: {
      landUse: {
        options: document.getElementsByClassName('btn-land-use-option'),
        selectButton: elements.landUseSelectButton,
        selectOptions: elements.landUseOptions,
      }
    }
  }
  const options =  selectElements[filters ? 'filters' : 'main'][select].options;
  const selectButton = selectElements[filters ? 'filters' : 'main'][select].selectButton;
  const selectOptions = selectElements[filters ? 'filters' : 'main'][select].selectOptions;

  // Store the popper of the last opened filter
  let popper = null;

  const toggleSelect = () => {
    if (popper) {
      // Without this line, the position of the popper is incorrect
      popper.destroy();
    }

    popper = Popper.createPopper(selectButton, selectOptions, {
      modifiers: [
        {
          name: 'offset',
          options: {
            offset: [0, 8],
          },
        },
      ],
    });

    selectOptions.classList.toggle('hidden');

    if (!selectOptions.classList.contains('hidden') && options && options.length > 0) {
      options[0].focus();
    }
  }

  // Close on click outside
  document.addEventListener('click', function(event) {
    const isOpen = !selectOptions.classList.contains('hidden');
    if (isOpen && !selectOptions.contains(event.target) && !selectButton.contains(event.target)) {
      toggleSelect();
    }
  });

  if(!selectButton._eventListeners?.click) {
    selectButton.addEventListener('click', toggleSelect);
  }

  if(!selectButton._eventListeners?.keydown) {
    selectButton.addEventListener('keydown', function(event) {
      if (event.key === 'ArrowDown' || event.key === 'ArrowUp' || event.key === ' ') {
        event.preventDefault(); // Prevent scrolling
        if (options) {
          if (selectOptions.classList.contains('hidden')) {
            selectOptions.classList.remove('hidden');
          }
          options[0].focus();
        }
      }
    });
  }

  // Desktop options
  const selectOption = (target) => {
    // Get the slug of the selected land use
    const slug = target.getAttribute('data-slug');
    const filter = window.getters.filter();
    const selectedMainIntervention = filter?.mainIntervention;
    const selectedIntervention = filter?.type === 'intervention' ? filter?.value : filter?.intervention;
    if (select === 'landUse') {
      window.mutations.setLandUse(slug);
      window.mutations.setFilter(null);
      loadData(slug);
      // Load also map data only if we change the land use
      addDataLayer(map, slug);

      if (slug === 'all') {
        window.resetMainInterventionSelect();
      } else {
        window.loadMainInterventionSelect();
      }
    } else if (select === 'mainIntervention') {
      window.mutations.setFilter({ mainIntervention: slug });

      if (slug === 'all') {
        window.resetInterventionSelect();

        window.mutations.setFilter(null);
        // Update the chart deselecting any intervention
        updateChartAndButtons({ slug: 'all', resetAllCharts: true })
      } else {
        window.loadInterventionSelect();

        // This is the chart filter too
        window.mutations.setFilter({ mainIntervention: slug })
      }
    } else if (select === 'intervention') {
      if (slug === 'all') {
        window.mutations.setFilter({ mainIntervention: selectedMainIntervention })
        window.resetSubTypeSelect();
      } else {
        window.mutations.setFilter({ type: 'intervention', value: slug, mainIntervention: filter.mainIntervention, intervention: slug });
        window.loadSubTypeSelect();
      }
    } else if (select === 'subType') {

      if (slug === 'all') {
        window.mutations.setFilter({ type: 'intervention', value: selectedIntervention, mainIntervention: selectedMainIntervention, intervention: selectedIntervention });
      } else {
        window.mutations.setFilter({ type: 'sub-type', value: slug, mainIntervention: filter.mainIntervention, intervention: selectedIntervention });
      }
    }
    if (filters) {
      // Load instead of reload to reset the filters
      window.loadPublications();
    }

    // Recalculate the active filters on the filters button
    window.recalculateActiveFilters();

    // Close the dropdown
    selectOptions.classList.add('hidden');
    // Update the selected text
    const textSpan = target.querySelector('span');
    selectButton.innerHTML = textSpan.innerText;
    // Update the selected option
    // Set selected false to all options
    for (let option of options) {
      option.setAttribute('selected', 'false');
      const svg = option.querySelector('svg');
      if (option === target) {
        svg.classList.remove('hidden');
      } else {
        svg.classList.add('hidden');
      }
    }
    target.setAttribute('selected', 'true');
  };

  if(!selectOptions._eventListeners?.click) {
    selectOptions.addEventListener('click', function({ target }) {
      let buttonTarget = target;
      // Check if the target is a child of the button
      if (buttonTarget.nodeName !== 'BUTTON' && this.contains(buttonTarget)) {
        // Get the button
        buttonTarget = target.parentNode;
      }
      selectOption(buttonTarget);
    });
  }

  if(!selectOptions._eventListeners?.keydown) {
    selectOptions.addEventListener('keydown', function(event) {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        selectOption(event.target);
      } else if (event.key === 'ArrowDown') {
        event.preventDefault(); // Prevent scrolling
        const nextButton = event.target.nextElementSibling;
        if (nextButton) {
          nextButton.focus();
        }
      } else if (event.key === 'ArrowUp') {
        event.preventDefault(); // Prevent scrolling
        const prevButton = event.target.previousElementSibling;
        if (prevButton) {
          prevButton.focus();
        }
      } else if (event.key === 'Escape') {
        selectOptions.classList.add('hidden');
      } else if (event.key === 'Tab') {
        selectOptions.classList.add('hidden');
      }
    });
  };
};

window.initLandUseSelectMobile = () => {
  const landUsesData = window.getters.landUses();
  const landUseList = elements.publicationFiltersMobile.querySelector('#dropdown-select-land-use');
  landUseList.innerHTML = '';
  const currentLandUse = window.getters.landUse();
  landUsesData.forEach(landUse => {
    landUseList.innerHTML += option({...landUse, dropdownSlug: 'land-use', selectedSlug: currentLandUse });
  });

  loadData(currentLandUse);
};

// Load data on first load or when the user clicks on an main intervention menu button
window.loadData = (landUseSlug) => {
  const landUsesData = window.getters.landUses();
  const landUse = landUsesData.find(({ slug }) => slug === landUseSlug);
  const { name, publications, metaAnalysis, slug } = landUse;

  // Set on state the first land use
  window.mutations.setLandUse(slug);

  // Update the footer with the land use publications and meta-analysis
  const publicationsNumber = publications ? formatNumber(publications) : 0;
  const metaAnalysisNumber = metaAnalysis ? formatNumber(metaAnalysis) : 0;
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

const loadMainInterventionCharts = (landUse) => {
  const { name: landUseName, mainInterventions, slug: landUseSlug } = landUse;
  const mainInterventionPromises = mainInterventions.map((mainInterventionSlug) => getMainInterventionChartData(landUseSlug, mainInterventionSlug));
  Promise.all(mainInterventionPromises).then((data) => {
    window.mutations.setMainInterventions(data);
    createCards(data, landUseName);
  });
};

const createCards = (data, landUseName) => {
  const existingData = data?.filter(Boolean);
  const cards = existingData.map(({
    name,
    slug,
    description
  }) => {
    return isMobile() ?
    `
    <div class="flex flex-col mb-2 py-4 border-b border-slate-600 gap-3">
      <header class="w-full text-base">
        Impact of <span class="font-semibold"> ${name} </span> on Soil Organic Carbon for <span class="font-semibold">${landUseName}</span>
      </header>
      <div
        class="text-neutral-300 text-sm leading-7">
        <div>${description}</div>
        <div id="chart-mobile-${slug}" class="chart w-full h-full"></div>
      </div>
    </div>
    `
    : `
    <div class="flex flex-col p-6 bg-white mb-2 rounded-lg text-gray-700">
      <header class="mb-4 flex w-full justify-between items-end">
        <div>Impact of <span class="font-semibold">${name}</span> on Soil Organic Carbon for <span class="font-semibold">${landUseName}</span></div>
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

  if (isMobile()) {
    // Save data for filters
    const existingChartData = existingData.reduce((acc, curr) => {
      acc[curr.slug] = curr.interventions;
      return acc;
    }, {});
    window.mutations.setChartData(existingChartData);

    if (existingData.length === 0) {
      elements.chartCardsMobile.innerHTML = `<p class="font-semibold text-neutral-300 text-lg h-full flex items-center justify-center">No data</p>`;
    } else {
      elements.chartCardsMobile.innerHTML = cards.join('');
      existingData.map(d => createMobileChart(d.slug, d["interventions"]));
    }
  } else {
    if (existingData.length === 0) {
      elements.chartCards.innerHTML = `<p class="font-semibold text-neutral-300 text-lg h-full flex items-center justify-center">No data</p>`;
    } else {
      elements.chartCards.innerHTML = cards.join('');
      existingData.map(d => createSVGChart(d.slug, d["interventions"]));
    }
  }
};

const createMobileChart = (slug, data) => {
  const chartElement = document.getElementById(`chart-mobile-${slug}`);
  if(!data || data.length === 0) return;

  // Sort data by value
  const sortedData = data.sort((a, b) => b.value - a.value).map(d => {
    if (d.subTypes) {
      d.subTypes = d.subTypes.sort((a, b) => b.value - a.value);
    }
    return d;
  });

  if (chartElement) {
    const selectedIntervention = window.getters.filter()?.type === 'intervention' ? window.getters.filter()?.value : window.getters.filter()?.intervention;
    const chart = `<div class="flex flex-col justify-between mt-4 gap-[12px]">
      ${sortedData.map(({ title, value, publications, slug: interventionSlug }) => {
        const fixedValue = value.toFixed(1);

        const isSelected = selectedIntervention === interventionSlug;

        const mainInterventionName = startCase(slug);
        const chartDescriptionText =  descriptionText(mainInterventionName, name, fixedValue)

        return (`
        <div class="flex flex-col gap-4 data-[active=true]:border-y data-[active=true]:border-y-gray-650 data-[active=true]:p-4 data-[active=true]:-mx-4" data-active="${isSelected}" id="chart-item-${slug}-${title}">
          <div class="w-full flex text-white items-center justify-between" >
            <span class="text-base w-16 font-semibold ${value > 0 ? 'text-darkRed-500' : ''}">
              ${value.toFixed(1)}%
            </span>
            <button type="button" class="btn-filter flex-1 btn-chart-mobile" aria-pressed="${isSelected}" id="btn-${kebabCase(title)}" data-main-intervention-slug="${slug}" data-intervention-slug="${interventionSlug}" data-intervention-name="${title}" data-fixed-value="${fixedValue}" title="${title} (${formatNumber(publications)})">
              <span class="underline">${title}</span> (${formatNumber(publications)})
            </button>
          </div>
          <div class="chart-description text-base ${isSelected ? '' : 'hidden'}" id="chart-description-${slug}-${title}">${isSelected ? chartDescriptionText : ''}</div>
          <div class="sub-type-container flex flex-col gap-4"></div>
        </div>`);
      }).join('')
      }
    </div>`;

    chartElement.innerHTML = chart;

    const addSubTypesToChartItem = (chartItem, mainInterventionSlug, interventionName, interventionSlug) => {
      // Remove all existing sub-types
      const subTypeContainers = document.querySelectorAll('.sub-type-container');
      const subTypeContainer = chartItem.querySelector('.sub-type-container');

      const selectedIntervention = window.getters.filter()?.type === 'intervention' ? window.getters.filter()?.value : window.getters.filter()?.intervention;

      // Add the sub-types to the chart-item
      const subTypesData = sortedData.find(d => d.title === interventionName)?.subTypes;

      if (subTypesData) {
        const subTypesHTML = subTypesData.map(({ title, value, publications, slug }) => {
          const isSelected = interventionSlug === selectedIntervention && window.getters.filter()?.type === 'sub-type' && window.getters.filter()?.value === slug;
          return (`
          <div class="flex flex-col gap-4 data-[active=true]:border-y data-[active=true]:border-y-gray-650 data-[active=true]:p-4 data-[active=true]:-mx-4" id="chart-sub-type-${mainInterventionSlug}-${interventionName}-${title}">
            <div class="w-full flex text-white items-center justify-between" >
              <span class="text-base w-16 font-semibold ${value > 0 ? '' : 'text-darkRed-500'}">
                ${value.toFixed(1)}%
              </span>
              <button type="button" class="btn-filter flex-1 btn-chart-mobile btn-chart-sub-type" aria-pressed="${isSelected}" id="btn-${kebabCase(title)}" data-main-intervention-slug="${mainInterventionSlug}"
                data-intervention-slug=${interventionSlug} data-sub-type-slug="${slug}" title="${title}"
              >
                <span class="underline">${title}</span> (${formatNumber(publications)})
              </button>
            </div>
          </div>`)
        }).join('');

        Array.from(subTypeContainers).map(d => {
          if(d === subTypeContainer) {
            subTypeContainer.innerHTML = subTypesHTML;
          } else {
            d.innerHTML = ''
          }
        });
      }

      // Add event listeners after the HTML is inserted
      document.querySelectorAll('.btn-chart-sub-type').forEach(button => {
        if(!button._eventListeners?.click) {
          button.addEventListener('click', function() {
            const isSubTypePressed = button.getAttribute('aria-pressed') === 'true';
            const mainInterventionSlug = button.getAttribute('data-main-intervention-slug');
            const subTypeSlug = button.getAttribute('data-sub-type-slug');
            const interventionSlug = button.getAttribute('data-intervention-slug');

            if (isSubTypePressed) {
              button.setAttribute('aria-pressed', 'false');

              // Leave intervention selected
              window.mutations.setFilter({ type: 'intervention', value: interventionSlug, mainIntervention: mainInterventionSlug, intervention: interventionSlug });
            } else {
              // Set aria-pressed to true
              Array.from(document.querySelectorAll('.btn-chart-sub-type')).map(b => b.setAttribute('aria-pressed', 'false'));
              button.setAttribute('aria-pressed', 'true');

              window.mutations.setFilter({ type: 'sub-type', value: subTypeSlug, mainIntervention: mainInterventionSlug, intervention: interventionSlug });
            }
          });
        };
      });
    };

    // Add subtypes if one intervention is selected
    if (selectedIntervention) {
      const selectedInterventionData = sortedData.find(d => d.slug === selectedIntervention);
      if (selectedInterventionData) {
        addSubTypesToChartItem(chartElement, slug, selectedInterventionData.title, selectedIntervention);
      }
    }

    // Mobile chart buttons click
    let chartMobileButtons = chartElement.getElementsByClassName('btn-chart-mobile');
    // Filter so we don't pick the sub-type buttons
    chartMobileButtons = Array.from(chartMobileButtons).filter(b => !b.classList.contains('btn-chart-sub-type'));


    if (chartMobileButtons) {
      for (let element of chartMobileButtons) {
        if(!element._eventListeners?.click) {
          element.addEventListener("click", function() {
            // Deselect style in other buttons
            const chartMobileButtons = document.getElementsByClassName('btn-chart-mobile');
            Array.from(chartMobileButtons).map(d => {
              d.setAttribute('aria-pressed', 'false');
            });

            const chartDescriptions = document.querySelectorAll('[id^="chart-description-"]');
            // Hide other chart descriptions
            Array.from(chartDescriptions).map(d => d.classList.add('hidden'));
            // If the button is already pressed
            if (element.getAttribute('aria-pressed') === 'true') {
              element.setAttribute('aria-pressed', 'false');

              const subTypeContainers = document.querySelectorAll('.sub-type-container');
              Array.from(subTypeContainers).map(d => d.innerHTML = '');

              window.mutations.setFilter(null);

              // Set all data-actives to false
              const chartItems = document.querySelectorAll('[id^="chart-item-"]');
              Array.from(chartItems).map(d => d.setAttribute('data-active', 'false'));
            } else {
              // Fill and show the chart description

              const mainInterventionSlug = element.getAttribute('data-main-intervention-slug');
              const mainInterventionName = startCase(mainInterventionSlug);
              const interventionSlug = element.getAttribute('data-intervention-slug');
              const interventionName = element.getAttribute('data-intervention-name');
              const fixedValue = element.getAttribute('data-fixed-value');
              const chartDescription = document.getElementById(`chart-description-${mainInterventionSlug}-${interventionName}`);
              const chartDescriptionText =  descriptionText(mainInterventionName, interventionName, fixedValue)

              chartDescription.innerHTML = chartDescriptionText;
              chartDescription.classList.remove('hidden');


              // Set all chart items to inactive
              const chartItems = document.querySelectorAll('[id^="chart-item-"]');
              Array.from(chartItems).map(d => d.setAttribute('data-active', 'false'));

              // Set the clicked chart item as active
              const chartItem = document.getElementById(`chart-item-${mainInterventionSlug}-${interventionName}`);
              chartItem.setAttribute('data-active', 'true');

              // Set the button as pressed
              Array.from(chartMobileButtons).map(b => {
                if (b === element) {
                  element.setAttribute('aria-pressed', 'true');
                } else {
                  b.setAttribute('aria-pressed', 'false')
                }
              });

              addSubTypesToChartItem(chartItem, mainInterventionSlug, interventionName, interventionSlug);

              window.mutations.setFilter({ type: 'intervention', value: interventionSlug, mainIntervention: mainInterventionSlug, intervention: interventionSlug });
            }
          });
        }
      };
    }
  };
};

const loadDataAndSetButtons = () => {
  // Create a button for each land use
  const button = ({ slug, name, publications }, selectedLandUse) =>
    `<button
      type="button"
      data-slug=${slug}
      class="btn-filter flex btn-land-use"
      aria-pressed="${selectedLandUse === slug ? "true" : "false"}"
    >
      <span class="text-base">
        ${name}
      </span>
      <span class="text-xs">
      (${formatNumber(publications)})
      </span>
      </button>
    `;

  getMainInterventionChartData().then(data => {
    const landUseMenu = isMobile() ? elements.landUseMenuMobile : elements.landUseMenu;
    if (landUseMenu && data) {
      const selectedLandUse = window.getters.landUse();
      const landUses = Object.entries(data).map(([key, value], i) => ({ slug: key, ...value, index: i }));
      window.mutations.setLandUses(landUses);
      landUseMenu.innerHTML = '';
      landUses.filter(l => l.name !== 'All').forEach(landUse => {
        landUseMenu.innerHTML += button(landUse, selectedLandUse);
      });
      loadData(selectedLandUse || landUses[0].slug);
      return landUses;
    }
  }).then((landUses) => {
    // Add event listeners to the land use buttons
    const landUseButtons = document.getElementsByClassName('btn-land-use');
    // LAND USE BUTTONS
    if (landUseButtons) {
      for (let element of elements.landUseButtons) {
        element.addEventListener("click", function() {
          elements.landUseMenuMobile.classList.add('land-use-menu-mobile-scroll');
          const slug = element.getAttribute('data-slug');
          window.mutations.setLandUse(slug);
          window.mutations.setFilter(null);
          loadData(slug);

          element.setAttribute('aria-pressed', 'true');

          // Only for mobile
          Array.from(landUseButtons).filter(b => b !== element).map(b => b.setAttribute('aria-pressed', 'false'));
          const studiesDisclaimer = document.getElementById('primary-studies-disclaimer')
          if (studiesDisclaimer) {
            studiesDisclaimer.classList.add('hidden');
          }

          // Show the chart cards of the selected land use
          elements.initialMain.classList.add('lg:hidden');
          elements.chartCards.classList.remove('hidden');
          elements.chartCardsMobile.classList.remove('hidden');

          elements.landUseSelectContainer.classList.remove('hidden');
          elements.landUseSelectButton.innerHTML = element.innerText;

          elements.landUseOptions.innerHTML = '';

          landUses.filter(l => l.name !== 'All').forEach(landUse => {
            elements.landUseOptions.innerHTML += option({...landUse, dropdownSlug: 'land-use', selectedSlug: slug, mobile: false, publicationNumbers: true});
          });
        });
      };
    }

    // LAND USE SELECT ACTIONS
    initSelectActions({ select: 'landUse' });
  });
};

window.addEventListener('resize', function () {
  const currentIsMobile = isMobile();
  const hasChangedBreakpoint = window.getters.isMobile() !== currentIsMobile;
  const isPublicationsOpen = window.getters.publicationsOpen();
  const isMethodologyOpen = window.getters.methodologyOpen();
  if (hasChangedBreakpoint) {
    loadDataAndSetButtons();

    // Close filters panel to avoid problems
    if (currentIsMobile) {
      window.closeFiltersPanel();

      // Close dropdowns
      elements.landUseOptions.classList.add('hidden');
      for (let dropdown of elements.dropdowns) {
        const button = dropdown.querySelector('.btn-dropdown');
        const searchInput = dropdown.querySelector('.input-search');
        const options = dropdown.querySelector('.dropdown-options');

        if (!options.classList.contains('hidden')) {
          window.mutations.setOpenDropdown(dropdown.id, false);
          window.toggleDropdown(button, searchInput, options);
        }
      }
    } else {
      window.mobileFiltersDrawer.destroy({animate: true});
    }

    // Update the charts
    const landUse = window.getters.landUse();
    loadData(landUse);

    if (isPublicationsOpen) {
      window.loadPublicationsOpen();

      // Load  both mobile and desktop filters
      window.loadDropdowns();

      if (currentIsMobile) {
        // Also initialize the rest of the mobile filters
        window.initLandUseMobileDropdowns()
      }

      window.recalculateActiveFilters();
    }

    if (isMethodologyOpen) {
      window.loadMethodologyOpen();
    }
  }
  window.mutations.setIsMobile(currentIsMobile);
});

window.addEventListener('load', function () {
  // Get data on first load
  loadDataAndSetButtons();

  // Close the mobile banner if it was closed before
  const mobileBannerClosed = localStorage.getItem('MOBILE_BANNER_CLOSED');
  if (!mobileBannerClosed) {
    elements.mobileBanner.classList.remove('hidden');
  }

  window.mobileFiltersDrawer = new CupertinoPane(
    '.cupertino-pane',
    {
      parentElement: 'body',
      fitHeight: true, // Open the drawer to the height of the content
      backdrop: true, // Adds veil
      bottomClose: true, // Close the drawer by swiping down
      buttonDestroy: false, // Remove the close button
      breaks: {
          middle: { enabled: true, height: 300 },
          bottom: { enabled: true, height: 80 },
      },
      events: {
        onBackdropTap: () => {
          // Close the drawer when the backdrop is clicked
          window.mobileFiltersDrawer.destroy({animate: true});
        },
      }
    }
  );

  elements.bannerCloseButton.addEventListener('click', function() {
    elements.mobileBanner.classList.add('hidden');
    // Add to local storage
    localStorage.setItem('MOBILE_BANNER_CLOSED', 'true');
  });

  // LAND USE SELECT on main page
  if(!elements.landUseSelect._eventListeners?.change) {
    elements.landUseSelect.addEventListener('change', function() {
      const slug = elements.landUseSelect.value;
      window.mutations.setLandUse(slug);
      window.mutations.setFilter(null);
      loadData(slug);
    });
  }

  // Initialize event listeners if they were not already initialized
  if (!window.getters.mainInterventionSelectActionsInitialized()) {
    initSelectActions({ filters: true, select: 'mainIntervention'});
    window.mutations.setMainInterventionActionsInitialized(true);
  }

  window.resetMobileSelect = (id) => {
    const selectMobile = elements.publicationFiltersMobile.querySelector(`#${id}`);
    selectMobile.classList.add('hidden');
  }

  window.loadMainInterventionMobileSelect = (selectedLandUse) => {
    const publicationFilters = getPublicationFilters();
    // Initialize the main intervention dropdown
    const mainInterventionMobile = publicationFilters.querySelector('#main-intervention');
    if(mainInterventionMobile) {
      mainInterventionMobile.classList.remove('hidden');
    }

    const mainInterventionSelect = publicationFilters.querySelector('#dropdown-select-main-intervention');
    const landUsesData = window.getters.landUses();
    const mainInterventionData = landUsesData?.find(({ slug }) => slug === selectedLandUse)?.mainInterventions;
    const selectedMainIntervention = window.getters.filter()?.mainIntervention;
    if (mainInterventionData) {
      mainInterventionSelect.innerHTML = '';
      mainInterventionSelect.innerHTML += option({ name: 'All', slug: 'all', dropdownSlug: 'main-intervention', selectedSlug: selectedMainIntervention });
      mainInterventionData.forEach(mainIntervention => {
        mainInterventionSelect.innerHTML += option({ name: startCase(mainIntervention), slug: mainIntervention, dropdownSlug: 'main-intervention', selectedSlug: selectedMainIntervention });
      });
    }
  }

  window.loadInterventionMobileSelect = (selectedMainIntervention) => {
    const publicationFilters = getPublicationFilters();
    // Initialize the intervention dropdown
    const interventionMobile = publicationFilters.querySelector('#intervention');
    if (interventionMobile) {
      interventionMobile.classList.remove('hidden');
    }

    const interventionSelect = publicationFilters.querySelector('#dropdown-select-intervention');
    const mainInterventionsData = window.getters.chartData();
    const interventionsData = mainInterventionsData?.[selectedMainIntervention];
    const selectedIntervention = window.getters.filter()?.intervention;

    interventionSelect.innerHTML = '';
    interventionSelect.innerHTML += option({ name: 'All', slug: 'all', dropdownSlug: 'intervention', selectedSlug: selectedIntervention });
    if (interventionsData) {
      interventionsData.forEach(intervention => {
        interventionSelect.innerHTML += option({ name: intervention.title, slug: intervention.slug, dropdownSlug: 'intervention', selectedSlug: selectedIntervention });
      });
    }
  }

  const getPublicationFilters = () => isMobile() ? elements.publicationFiltersMobile : elements.publicationFilters;

  window.loadSubTypeMobileSelect = (selectedIntervention) => {
    const publicationFilters = getPublicationFilters();
    // Initialize the sub-types dropdown
    const subTypeMobile = publicationFilters.querySelector('#sub-type');
    if(subTypeMobile) {
      subTypeMobile.classList.remove('hidden');
    }

    const subTypeSelect = publicationFilters.querySelector('#dropdown-select-sub-type');
    const landUseData = window.getters.chartData();
    const selectedMainIntervention = window.getters.filter()?.mainIntervention;
    const interventionsData = landUseData?.[selectedMainIntervention];
    const subTypesData = interventionsData?.find(({ slug }) => slug === selectedIntervention)?.subTypes;
    const selectedSubType =  window.getters.filter()?.type === 'sub-type' && window.getters.filter()?.value;
    subTypeSelect.innerHTML = '';
    subTypeSelect.innerHTML += option({ name: 'All', slug: 'all', dropdownSlug: 'sub-type', selectedSlug: selectedSubType });
    if (subTypesData) {
      subTypesData.forEach(subType => {
        subTypeSelect.innerHTML += option({ name: subType.title, slug: subType.slug, dropdownSlug: 'sub-type', selectedSlug: selectedSubType });
      });
    }

    window.mutations.setFilter({ type: 'sub-type', intervention: selectedIntervention, value: selectedSubType, mainIntervention: selectedMainIntervention });
  }

  // LAND USE SELECT MOBILE on filters
  const publicationFilters = getPublicationFilters();
  const landUseSelectMobile = publicationFilters.querySelector('#dropdown-select-land-use');
  if (landUseSelectMobile) {
    if(!(elements.landUseSelectMobile._eventListeners?.click)) {
      landUseSelectMobile.addEventListener('change', function(event) {
        const selected = event.target.value;

        if (selected === 'all') {
          window.resetMobileSelect('main-intervention');
          window.resetMobileSelect('intervention');
          window.resetMobileSelect('sub-type');
          window.mutations.setFilter(null);
        } else {
          window.resetMobileSelect('main-intervention');
          window.resetMobileSelect('intervention');
          window.resetMobileSelect('sub-type');
          window.mutations.setFilter(null);
          window.loadMainInterventionMobileSelect(selected);
        }

        window.mutations.setLandUse(selected);
        loadData(selected);

        // Reload publications
        window.reloadPublications();
        window.recalculateActiveFilters();
      });
    }
  }

  const mainInterventionMobile = publicationFilters.querySelector('#dropdown-select-main-intervention');
  if (mainInterventionMobile && !mainInterventionMobile._eventListeners?.change) {
    mainInterventionMobile.addEventListener('change', function(event) {
      const selectedMainIntervention = event.target.value;
      if (selectedMainIntervention === 'all') {
        window.resetMobileSelect('intervention');
        window.resetMobileSelect('sub-type');
        window.mutations.setFilter(null);
      } else {
        window.resetMobileSelect('sub-type');
        window.loadInterventionMobileSelect(selectedMainIntervention);
        const interventionMobile = publicationFilters.querySelector('#intervention');
        interventionMobile.classList.remove('hidden');
        window.mutations.setFilter({ mainIntervention: selectedMainIntervention });
      }
      window.reloadPublications();
    });
  }

  const interventionMobile = publicationFilters.querySelector('#dropdown-select-intervention');
  if(interventionMobile && !interventionMobile._eventListeners?.change) {
    interventionMobile.addEventListener('change', function(event) {
      const selected = event.target.value;
      const mainIntervention = window.getters.filter()?.mainIntervention;

      if (selected === 'all') {
        window.resetMobileSelect('sub-type');
        window.mutations.setFilter({ mainIntervention });
      } else {
        window.loadSubTypeMobileSelect(selected);
        const interventionMobile = publicationFilters.querySelector('#intervention');
        interventionMobile.classList.remove('hidden');

        // Reset the subtype selecting the All option
        const subTypeSelect = publicationFilters.querySelector('#dropdown-select-sub-type');
        subTypeSelect.value = 'all';

        window.mutations.setFilter({ type: 'intervention', value: selected, mainIntervention, intervention: selected });
      }
      window.reloadPublications();
    });
  }

  const subTypeMobile = publicationFilters.querySelector('#dropdown-select-sub-type');
  if(subTypeMobile && !subTypeMobile._eventListeners?.change) {
    subTypeMobile.addEventListener('change', function(event) {
      const selected = event.target.value;
      const mainIntervention = window.getters.filter()?.mainIntervention;
      const intervention = window.getters.filter()?.intervention;
      if (selected === 'all') {
        window.mutations.setFilter({ type: 'intervention', value: selected, mainIntervention, intervention });
      } else {
        window.mutations.setFilter({ type: 'sub-type', value: selected, mainIntervention, intervention });
       }
      window.reloadPublications();
    });
  }


  const appendListElement = (parent, value, label, slug) => {
    const listElement = document.createElement('li');
    listElement.classList.add('max-w-[265px]');
    listElement.innerHTML = `
    <label for="${slug}-${value}" class="flex items-center gap-2 py-2 px-4 text-sm">
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

    elements.resultsSentence.innerHTML = `Showing ${totalMetaAnalysis ? formatNumber(totalMetaAnalysis) : 0} meta-analyses and ${totalPublications ? formatNumber(totalPublications) : 0} primary studies.`;
  };

  const populateYearChart = (years) => {
    if (!years) {
      elements.yearRange.innerHTML = `<div class="h-[125px] border-b border-white w-full"></div>`;
      return;
    }
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
          <div class="text-neutral-300 text-sm">${yearKeys[0] || ''}</div>
          <div class="text-neutral-300 text-sm">${yearKeys[yearKeys.length - 1] || ''}</div>
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

  // Populate filters
  const populateFilters = (metadata) => {
    const countries = window.getters.countries();
    const journals = window.getters.journals();
    const { years: availableYearObjects, countries: availableCountries, journals: availableJournals } = metadata;
    const publicationTypes = [
      { value: 'primary-study', label: 'Primary study' },
      { value: 'meta-analysis', label: 'Meta-analysis' },
    ];
    const publicationFilters = getPublicationFilters();
    const publicationTypesList = publicationFilters.querySelector('#dropdown-select-type-publication ul')
    publicationTypesList.innerHTML = '';
    publicationTypes.forEach(({ value, label }) => {
      appendListElement(publicationTypesList, value, label, 'type-publication');
    });

    const countryList = publicationFilters.querySelector('#dropdown-select-country ul')
    countryList.innerHTML = '';
    const filteredCountries = availableCountries ? countries.filter(c => availableCountries.includes(c.iso_2digit)) : [];
    filteredCountries.forEach(country => {
      const { iso_2digit: iso, cntry_name: label } = country;
      appendListElement(countryList, iso, label, 'year');
    });

    // Start with all countries selected
    window.mutations.setPublicationFilters('countries', filteredCountries.map(c => c.iso_2digit));

    const journalList = publicationFilters.querySelector('#dropdown-select-journal ul')
    journalList.innerHTML = '';
    const filteredJournals = availableJournals ? journals.filter(j => availableJournals.includes(j.journal_id)) : [];
    filteredJournals.forEach(journal => {
      const { journal_id: value, journal_name: label } = journal;
      appendListElement(journalList, value, capitalize(label), 'journal');
    });

    // Start with all journals selected
    window.mutations.setPublicationFilters('journals', filteredJournals.map(c => c.journal_id));

    const availableYears = availableYearObjects && Object.keys(availableYearObjects) || [];
    const yearList = publicationFilters.querySelector('#dropdown-select-year ul')
    yearList.innerHTML = '';
    availableYears.forEach((year) => {
      appendListElement(yearList, year, year, 'year');
    });

    // Start with all years selected
    window.mutations.setPublicationFilters('years', availableYears.map(c => c.journal_id));

    // Land use select initialization
    if (isMobile()) {
      window.initLandUseSelectMobile()
    }
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
        populateFilters(metadata);
      }

      if(!addNewPage) {
        populateYearChart(metadata.years);
        updateNumbers(metadata);
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
