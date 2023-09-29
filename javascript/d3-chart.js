const primaryColor = "#2BB3A7";
const red = "#FA545D";
const gray700 = '#3C4363';
const gray400 = '#8B90A4';
const gray100 = '#F0F0F5';

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
  createSVGChart(slug, data);
  updateButtons(title, data)
}
const updateMapLayer = (map, chartSlug, interventionSlug, subTypeSlug) => {
  const currentLandUse = window.getters.landUse();
   // We can't have a main intervention without an intervention
  addLayer(map, currentLandUse, interventionSlug ? chartSlug : null, interventionSlug, subTypeSlug);
};

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
    updateMapLayer(map, null, null, null);
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
    updateMapLayer(map, chartSlug, activeInterventionItem.slug, null);
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
  updateMapLayer(map, chartSlug, isIntervention ? slug : activeInterventionItem.slug, isIntervention ? null : slug)
  updateChartAndButtons({ slug: chartSlug, title, data: updatedData, resetAllCharts: isIntervention })
};

// Create the SVG container
const createSVGChart = (slug, data) => {
  if(!data || data.length === 0) return;

  // Save data for resize
  const savedData = window.getters.chartData();
  window.mutations.setChartData({...savedData, [slug]: data });

  const selected = window.getters.filter();

  // Data with active sub-types
  const activeData = data.find(d => d.active);

  const dataWithSubTypes = data.map(d =>
    d.active ? [d].concat(d['subTypes']) : d
  ).flat();

  const ITEM_HEIGHT = 60;
  const HEIGHT_PADDING = 100;

  const yTickHeight = 44;
  const yTickWidth = 120;

  const xTickValues = [-100, -75, -50, -25, 0, 25, 50, 75, 100];

  const activeDataHeight = !!activeData ? activeData.subTypes?.length * ITEM_HEIGHT : 0;
  const heightValue = (data.length) * ITEM_HEIGHT + activeDataHeight + HEIGHT_PADDING;
  const widthValue = 300;

  const RIGHT_AXIS_PADDING = 200;
  const AXIS_PADDING = 20;
  const margin = { top: 0, right: 0, bottom: 0, left: 0 };

  // Remove any existing chart
  d3.select(`#chart-${slug}`).selectAll("*").remove();

  const chart = d3.select(`#chart-${slug}`)
    .style("text-align", 'center')
    .append("svg")
    .attr("preserveAspectRatio", "xMinYMin meet")
    .attr("viewBox", `-${AXIS_PADDING} -${AXIS_PADDING} ${widthValue + RIGHT_AXIS_PADDING} ${heightValue}`)

    const width = widthValue - margin.left - margin.right;
  const height = heightValue - margin.top - margin.bottom;
  const svg = chart
  .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  // Create x scale
  const xScale = d3.scaleLinear()
    .domain([-100, 100])
    .range([0, width]);

    const domainTitles = data.map(d => d.active ? [d.title].concat(d.subTypes.map(dt => dt.title)) : d.title).flat();
  // Create y scale
  const yScale = d3.scaleBand()
    .domain(domainTitles)
    .range([0, height])
    .padding(1);

  // Create x axis
  const xAxis = d3.axisTop(xScale)
    .tickFormat(d => d3.format(".0%")(d/100))
    .tickValues(xTickValues);

  // Draw x axis
  const xAxisElement = svg.append("g")
    .attr("class", "x-axis")
    .call(xAxis)

  const xAxisTick = xAxisElement.selectAll(".tick")

  xAxisTick.select("text")
    .attr('class', 'font-sans text-xs text-gray-400')

  xAxisTick.selectAll("line")
    .attr("stroke", 'none');

  // Create y axis
  const yAxis = d3.axisRight(yScale)
    .tickSize(0)
    .tickPadding(10)
    .tickFormat(() => '');

  const windowWidth = window.innerWidth;
  // Change scale of the button depending on the window width
  const buttonScale = windowWidth > 1024 ? 0.8 : 1;

  const buttonHTML = (title, publications, slug) =>
    `<button type="button" class='btn-filter-chart mt-2' aria-pressed="false" id="btn-${kebabCase(slug)}" style="transform: scale(${buttonScale});">
      <span class="font-semibold text-slate-700">${title}</span>
      <span class="text-xs font-normal">(${publications})</span>
    </button>`;
  ;

  const yAxisRegions = svg
  .append("g")
  .attr("class", "y-axis-regions")
  .attr("transform", `translate(0, ${-yTickHeight / 2})`)

  const yAxisTicks = svg
    .append("g")
    .attr("class", "y-axis-ticks")
    .attr("transform", `translate(${width + 30}, ${-yTickHeight / 2})`)

  yAxisRegions.selectAll(".y-axis-region")
    .data(dataWithSubTypes)
    .enter()
    .append("rect")
    .attr("class", "y-axis-region pointer-events-none")
    .attr("x", -AXIS_PADDING)
    .attr("y", d => yScale(d.title))
    .attr("width", width + 30 + RIGHT_AXIS_PADDING)
    .attr("height", ITEM_HEIGHT + 10)
    .attr("fill", (d) => d.subTypes ? 'transparent' : gray100)

  yAxisTicks.call(yAxis)
  .selectAll(".tick")
  .append("foreignObject")
    .attr("width", yTickWidth)
    .attr("height", ITEM_HEIGHT + yTickHeight)
    .style("text-align", 'left')
    .html((title) => {
      const interventionItem = getInterventionByTitle(data, title);
      const activeInterventionItem = !interventionItem && data.find((item) => item.active);
      const dataItem = interventionItem || activeInterventionItem.subTypes.find(st => st.title === title);
      const slug = getSlugByTitle(data, title);
      return buttonHTML(title, dataItem?.publications, slug);
    }).on("click", (_, title) => click(_, title, slug, data, !!getInterventionByTitle(data, title)));

  // Remove all domain lines
  svg.selectAll('.domain').attr('stroke-width', 0);

  // Create x grid
  const xGrid = d3.axisBottom(xScale)
    .tickValues(xTickValues)
    .tickSize(-height + margin.top + margin.bottom)
    .tickFormat("");

  // Draw x grid
  const xGridElement = svg.append("g")
    .attr("class", "x-grid")
    .attr("transform", `translate(0, ${height - margin.bottom})`)
    .call(xGrid)

  xGridElement.selectAll(".tick line")
    .attr("stroke-opacity",(d) => d === 0 ? 1 : 0.2)
    .attr("stroke-dasharray", (d) => d === 0 ? 'none' : "5,3")
    .attr("stroke", gray700);

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

    chartTooltip.html(`<div>min: ${d.low.toFixed(1)}% median: ${d.value.toFixed(1)}% max: ${d.high.toFixed(1)}%</div>`);
  }

  // Create error bars
  svg.selectAll(".error-bar")
    .data(dataWithSubTypes)
    .enter()
    .append("g")
    .attr("class", "error-bar")
    .attr("id", d => `error-bar-${getSlugByTitle(data, d.title)}`)
    .each(function(d) {
      const g = d3.select(this);
      // Over zero
        g
        .append("line")
        .attr("x1", xScale(d.low < 0 ? 0 : d.low))
        .attr("x2", xScale(Math.max(d.high, 0)))
        .attr("y1", yScale(d.title) + yScale.bandwidth() / 2)
        .attr("y2", yScale(d.title) + yScale.bandwidth() / 2)
        .attr("stroke", primaryColor)
        .attr("opacity", getOpacity)
        .attr("stroke-width", 2)
        .on("mouseover", addTooltip)
        .on("mouseout", () => chartTooltip.classed('hidden', true));

      // Under zero
        g
        .append("line")
        .attr("x1", xScale(Math.min(d.low, 0)))
        .attr("x2", xScale(d.high > 0 ? 0 : d.high))
        .attr("y1", yScale(d.title) + yScale.bandwidth() / 2)
        .attr("y2", yScale(d.title) + yScale.bandwidth() / 2)
        .attr("stroke", red)
        .attr("opacity", getOpacity)
        .attr("stroke-width", 2)
        .on("mouseover", addTooltip)
        .on("mouseout", () => chartTooltip.classed('hidden', true));
    });

  // Create data points
  svg.selectAll(".data-point")
    .data(dataWithSubTypes)
    .enter()
    .append("circle")
    .attr("class", "data-point")
    .attr("cx", d => xScale(d.value))
    .attr("cy", d => yScale(d.title) + yScale.bandwidth() / 2)
    .attr("r", 5)
    .attr("opacity", getOpacity)
    .attr("fill", d => d.value >= 0 ? primaryColor : red)
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