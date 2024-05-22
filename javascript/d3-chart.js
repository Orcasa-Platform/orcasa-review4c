const getInterventionByTitle = (data, title) => data.find((item) => item.title === title);

const getSlugByTitle = (data, title) => {
  const isIntervention = !!getInterventionByTitle(data, title);
  const activeInterventionItem = !isIntervention && data.find((item) => item.active);
  return isIntervention ? kebabCase(title) : kebabCase(`${activeInterventionItem.title}-${title}`);
};

const updateButtons = (title, data) => {
  const buttons = document.querySelectorAll('.btn-filter-chart');
  buttons.forEach(button => button.setAttribute('aria-pressed', 'false'));

  if (title) {
    const button = document.querySelector(`#btn-${getSlugByTitle(data, title)}`);
    button.setAttribute('aria-pressed', 'true');
  }
};

const updateChartAndButtons = ({ slug, title, data, resetAllCharts }) => {
  if (resetAllCharts) {
    // All the other charts should close their sub-types
    const chartData = window.getters.chartData();
    if (chartData) {
      Object.keys(chartData).forEach((key) => {
        if (key !== slug) {
          const data = chartData[key];
          const updatedData = data.map(d => ({
            ...d,
            active: false,
          }));
          createSVGChart(key, updatedData);
        }
      });
    }
  }
  if (slug !== 'all') {
    createSVGChart(slug, data);
    updateButtons(title, data)
  }
}

const click = (_, title, chartSlug, data, isIntervention) => {
  const currentSelection = window.getters.filter();
  let currentTitle = title;
  const activeInterventionItem = data.find((item) => item.active);
  const slug = isIntervention ? data.find(d => d.title === title).slug : activeInterventionItem.subTypes.find(st => st.title === title).slug;

  // If the clicked intervention was selected clear the filter and close the sub-types

  if (currentSelection?.type === 'intervention' && currentSelection?.value === slug) {
    window.mutations.setFilter(null);
    const updatedData = data.map(d => ({
      ...d,
      active: false,
    }));
    updateChartAndButtons({ slug: chartSlug, title: null, data: updatedData })
    return;
  }

  // If the clicked sub-type was selected select the active intervention

  if (currentSelection?.type === 'sub-type' && currentSelection?.value === slug) {
    currentTitle = activeInterventionItem.title;
    window.mutations.setFilter({type: 'intervention', value: activeInterventionItem.slug, mainIntervention: chartSlug, intervention: null});
    // Rerender chart to hide sub-types
    const updatedData = data.map(d => {
      if (d.title === currentTitle) {
        return {
          ...d,
          active: true,
        };
      }
      return {
        ...d,
        active: false,
      };
    });
    updateChartAndButtons({ slug: chartSlug, title: currentTitle, data: updatedData })
    return;
  }


  // Select intervention or sub-types

  let updatedData = data;
  if (isIntervention) {
    updatedData = data.map(d => {
      if (d.title === title) {
        return {
          ...d,
          active: true,
        };
      }
      return {
        ...d,
        active: false,
      };
    });
  }
  window.mutations.setFilter({ type: isIntervention ? 'intervention' : 'sub-type', value: slug, mainIntervention: chartSlug, intervention: !isIntervention && data.find((item) => item.active).slug });
  // Rerender to show sub-types or filter opacity of error bars
  updateChartAndButtons({ slug: chartSlug, title, data: updatedData, resetAllCharts: isIntervention })
};

// Create the SVG container
const createSVGChart = (slug, data) => {
  const mainInterventionName = startCase(slug);
  if(!data || data.length === 0) return;

  // Sort data by value
  const sortedData = data.sort((a, b) => b.value - a.value).map(d => {
    if (d.subTypes) {
      d.subTypes = d.subTypes.sort((a, b) => b.value - a.value);
    }
    return d;
  });

  // Save data for resize
  const savedData = window.getters.chartData();
  window.mutations.setChartData({...savedData, [slug]: sortedData });

  const selected = window.getters.filter();

  // Data with active sub-types
  const activeData = sortedData.find(d => d.active);
  const dataWithSubTypes = sortedData.map(d =>
    d.active ? [d].concat(d['subTypes']) : d
  ).flat();

  const ITEM_HEIGHT = 40;
  const ACTIVE_ITEMS_TEXT_HEIGHT = 78;
  const activeItemsTextOffset = activeData ? ACTIVE_ITEMS_TEXT_HEIGHT : 0;
  const heightValue = (sortedData.length + (activeData?.subTypes?.length ?? 0)) * ITEM_HEIGHT + 50;
  const widthValue = window.innerWidth >= 1536 ? 1040 : 800;

  const RIGHT_AXIS_PADDING = 200;
  const AXIS_PADDING = 20;

  const margin = { top: 0, right: 0, bottom: 0, left: 0 };

  // Padding for the arrows and "Positive effect" and "Negative effect" labels
  const LOWER_LABELS_PADDING = 40;

  const width = widthValue - margin.left - margin.right - 100;
  const height = heightValue - margin.top - margin.bottom - LOWER_LABELS_PADDING;

  const xTickValues = [-100, -75, -50, -25, 0, 25, 50, 75, 100];
  const yTickWidth = widthValue + RIGHT_AXIS_PADDING - width - 70;

  // Remove any existing chart
  d3.select(`#chart-${slug}`).selectAll("*").remove();

  const chart = d3.select(`#chart-${slug}`)
    .style("text-align", 'center')
    .append("svg")
    .attr("preserveAspectRatio", "xMinYMin meet")
    .attr("viewBox", `-${AXIS_PADDING} -${AXIS_PADDING} ${widthValue + RIGHT_AXIS_PADDING} ${heightValue + activeItemsTextOffset}`)

  const svg = chart
  .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  // Create x scale
  const xScale = d3.scaleLinear()
    .domain([-100, 100])
    .range([0, width]);

    const domainTitles = sortedData.map(d => d.active ? [d.title].concat(d.subTypes.map(dt => dt.title)) : d.title).flat();
  // Create y scale
  const yScale = d3.scaleBand()
    .domain(domainTitles)
    .range([0, height])
    .padding(1);

  // Create x axis
  const xAxis = d3.axisTop(xScale)
    .tickFormat(d => d3.format("d")(d))
    .tickValues(xTickValues);

  // Draw x axis
  const xAxisElement = svg.append("g")
    .attr("class", "x-axis")
    .call(xAxis)

  const xAxisTick = xAxisElement.selectAll(".tick")

  xAxisTick.select("text")
    .attr('class', 'font-sans text-2xs text-gray-500')

  xAxisTick.selectAll("line")
    .attr("stroke", 'none');

  // Create y axis
  const yAxis = d3.axisRight(yScale)
    .tickSize(0)
    .tickPadding(10)
    .tickFormat(() => '');

  const buttonHTML = (title, publications, slug, isSubType) =>
    isSubType ? `<div class="flex items-center"><span class="mx-1">•</span><button type="button" class="btn-filter-chart btn-filter-chart-subtype mt-0.5 max-w-[${yTickWidth}px]" aria-pressed="false" id="btn-${kebabCase(slug)}" title="${title} (${formatNumber(publications)})">
  <span class="mr-1.5 overflow-hidden whitespace-nowrap text-ellipsis underline">${title}</span><span class="text-xs shrink-0">(${formatNumber(publications)})</span>
</button></div>` :
    `<button type="button" class="btn-filter-chart mt-0.5 max-w-[${yTickWidth}px]" aria-pressed="false" id="btn-${kebabCase(slug)}" title="${title} (${formatNumber(publications)})">
      <span class="mr-1.5 overflow-hidden whitespace-nowrap text-ellipsis underline">${title}</span><span class="text-xs shrink-0">(${formatNumber(publications)})</span>
    </button>`;
  ;

  const yAxisRegions = svg
    .append("g")
    .attr("class", "y-axis-regions")
    .attr("transform", `translate(0, ${-ITEM_HEIGHT / 2 - 6})`)

  const previousItemOffset = (interventionItem, title) => {
    const isSubType = !interventionItem;
    const anyPreviousItemsAreActive = dataWithSubTypes.find((item, index) => (
      item.active
      && ((interventionItem && index < dataWithSubTypes.indexOf(interventionItem)) ||
      (isSubType && !!item.subTypes?.find(st => st.title === title)))
    ));

    return anyPreviousItemsAreActive ? ACTIVE_ITEMS_TEXT_HEIGHT : 0;
  }

  const calculateY = ({ title, interventionItem }) => {
    const _interventionItem = interventionItem || getInterventionByTitle(sortedData, title);
    return yScale(_interventionItem.title) + previousItemOffset(_interventionItem, title);
  };

  const yAxisTicks = svg
    .append("g")
    .attr("class", "y-axis-ticks")
    .attr("transform", `translate(${width + 50}, ${-ITEM_HEIGHT / 2})`)

  yAxisRegions.selectAll(".y-axis-region")
    .data(dataWithSubTypes)
    .enter()
    .append("rect")
    .attr("class", "y-axis-region pointer-events-none")
    .attr("x", -AXIS_PADDING)
    .attr("y", interventionItem => calculateY({ interventionItem }))
    .attr("width", widthValue + RIGHT_AXIS_PADDING)
    .attr("height", (d) => d.active ? ITEM_HEIGHT + ACTIVE_ITEMS_TEXT_HEIGHT : ITEM_HEIGHT)
    .attr("fill", 'transparent');

  yAxisTicks.call(yAxis)
  .selectAll(".tick")
  .append("foreignObject")
    .attr("width", yTickWidth)
    .attr("height", (title) => {
      const interventionItem = getInterventionByTitle(sortedData, title);
      return (interventionItem?.active) ? ITEM_HEIGHT + ACTIVE_ITEMS_TEXT_HEIGHT : ITEM_HEIGHT;
    })
    .attr("y", (title) => {
      const interventionItem = getInterventionByTitle(sortedData, title);
      return previousItemOffset(interventionItem, title);
    })
    .style("text-align", 'left')
    .html((title) => {
      const interventionItem = getInterventionByTitle(sortedData, title);
      const activeInterventionItem = !interventionItem && sortedData.find((item) => item.active);
      const dataItem = interventionItem || activeInterventionItem.subTypes.find(st => st.title === title);
      const slug = getSlugByTitle(sortedData, title);
      const isActive = !!interventionItem?.active;
      const fixedValue = interventionItem?.value.toFixed(1);
      const activeText = `<div class="text-xs leading-5 py-3 px-1">${descriptionText(mainInterventionName, title, fixedValue)}</div>`
      const isSubType = !interventionItem;
      return isActive ? `<div>${buttonHTML(title, dataItem?.publications, slug, isSubType)}${activeText}</div>`: buttonHTML(title, dataItem?.publications, slug, isSubType);
    }).on("click", (_, title) => click(_, title, slug, sortedData, !!getInterventionByTitle(sortedData, title)));

  // Remove all domain lines
  svg.selectAll('.domain').attr('stroke-width', 0);

  // Create x grid
  const xGrid = d3.axisBottom(xScale)
    .tickSize(-height + margin.top + margin.bottom - activeItemsTextOffset)
    .tickFormat("");

  // Draw x grid
  const xGridElement = svg.append("g")
    .attr("class", "x-grid")
    .attr("transform", `translate(0, ${height - margin.bottom + activeItemsTextOffset})`)
    .call(xGrid)


  // Create labels for Positive and Negative effects
  const centralPosition = xScale(0);
  const arrowY = height + activeItemsTextOffset + 10;
  const INNER_PADDING = 10;
  const arrowGroup = svg.append("g")
  .attr("class", "arrow-group");

  // Draw the positive effect arrow
  arrowGroup.append("path")
  .attr("class", "stroke-gray-200")
  .attr("d", `M${centralPosition + 100},${arrowY} L${xScale(155)},${arrowY} m-3,-3 l3,3 l-3,3`)
  .attr("fill", "none")

  // Draw the negative effect arrow
  arrowGroup.append("path")
  .attr("class", "stroke-gray-200")
  .attr("d", `M${centralPosition - 105},${arrowY} L${xScale(-155)},${arrowY} m5,-5 l-5,5 l5,5`)
  .attr("fill", "none")

  // Add the Positive Effect label
  arrowGroup.append("text")
    .attr("class", "text-xs text-gray-500 fill-current")
    .attr("x", centralPosition + INNER_PADDING)
    .attr("y", arrowY + 4)
    .text("Positive effect")


  // Add the Negative Effect label
  arrowGroup.append("text")
    .attr("class", "text-xs text-gray-500 fill-current")
    .attr("x", centralPosition - INNER_PADDING)
    .attr("y", arrowY + 4)
    .attr("text-anchor", "end")
    .text("Negative effect")

  xGridElement.selectAll(".tick line")
    .attr("stroke-opacity", (d) => d === 0 ? 1 : 0.2)
    .attr("stroke-dasharray", (d) =>  d === 0 ? '0' : "2,1")
    .attr("stroke", (d) => d === 0 ? neutral300 : gray700)


  xGridElement.select(".domain").remove();
  const getOpacity = (d) => (!selected || selected?.type !== 'subType' || selected?.value === d.title) ? 1 : 0.5;

  const chartTooltip = d3.select('#chart-tooltip');

  const addTooltip = (event, d) =>  {
    const top = event.clientY;
    const TOP_PADDING = 64;
    chartTooltip
      .style("top", top - TOP_PADDING + "px")
      .style("left", (event.clientX - chart.node().getBoundingClientRect().left) + "px")
      .classed('hidden', false);

    chartTooltip.html(`<div>${d.value.toFixed(1)}% [Confidence interval -${d.low.toFixed(1)}%, +${d.high.toFixed(1)}%]</div>`);
  }

  const currentSelection = window.getters.filter();

  const isHighlighted = (d) =>  !currentSelection ||
    currentSelection.mainIntervention !== slug ||
    !currentSelection.value ||
    (currentSelection.mainIntervention === slug && currentSelection.value === d.slug);

  // Create error bars
  svg.selectAll(".error-bar")
    .data(dataWithSubTypes)
    .enter()
    .append("g")
    .attr("class", "error-bar")
    .attr("id", d => `error-bar-${getSlugByTitle(sortedData, d.title)}`)
    .each(function(d) {
      const y = calculateY({ interventionItem: d }) + yScale.bandwidth() / 2;
      const g = d3.select(this);

      g
        .append("line")
        .attr("class", isHighlighted(d) ? "stroke-gray-700" : "stroke-gray-200")
        .attr("stroke-width", "2")
        .attr("x1", xScale(d.low < 0 ? 0 : d.low))
        .attr("x2", d.high > 100  ? xScale(100) : xScale((Math.max(d.high, 0))))
        .attr("y1", y)
        .attr("y2", y)
        .attr("opacity", getOpacity)
        .on("mouseover", addTooltip)
        .on("mouseout", () => chartTooltip.classed('hidden', true));

        g
        .append("line")
        .attr("class", isHighlighted(d) ? "stroke-darkRed-600" : "stroke-gray-200")
        .attr("stroke-width", "2")
        .attr("x1", d.low < -100 ? xScale(-100) : xScale((Math.min(d.low, 0))))
        .attr("x2", xScale(d.high > 0 ? 0 : d.high))
        .attr("y1", y)
        .attr("y2", y)
        .attr("opacity", getOpacity)
        .on("mouseover", addTooltip)
        .on("mouseout", () => chartTooltip.classed('hidden', true));
    });

  // Create data points
  svg.selectAll(".data-point")
    .data(dataWithSubTypes)
    .enter()
    .append("circle")
    .attr("class", (d) => {
         return `data-point ${isHighlighted(d) ? "fill-gray-700" : "fill-gray-200"}`;
    })
    .attr("cx", d => xScale(d.value))
    .attr("cy", d => calculateY({ interventionItem: d }) + yScale.bandwidth() / 2)
    .attr("r", 4)
    .attr("opacity", getOpacity)
    .on("mouseover", addTooltip)
    .on("mouseout", () => chartTooltip.classed('hidden', true));
};


const onResize = () => {
  const charts = document.querySelectorAll('.chart');
  const chartData = window.getters.chartData();
  charts.forEach(chart => {
    const slug = chart.id.replace('chart-', '');
    const data = chartData[slug];
    createSVGChart(slug, data);
  });
};

// Rerender charts on window resize
window.addEventListener('resize', onResize );