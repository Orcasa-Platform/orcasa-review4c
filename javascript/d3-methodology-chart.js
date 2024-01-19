window.createMethodologyChart = (data) => {
  const container = d3.select('#methodology-chart');
  // Clear previous chart
  container.selectAll("*").remove();

  const element = container.node();
  const CHART_HEIGHT = 455;
  const margin = { top: 20, right: 20, bottom: 40, left: 36 };
  const { publications, metaAnalysis } = data || {};
  const publicationsData = Object.keys(publications).map(key => ({ date: d3.timeParse("%Y")(key), value: publications[key] }));
  const metaAnalysisData = Object.keys(metaAnalysis).map(key => ({ date: d3.timeParse("%Y")(key), value: metaAnalysis[key] }));

  const width = element.getBoundingClientRect().width - margin.left - margin.right;
  const height = CHART_HEIGHT - margin.top - margin.bottom;

  const svg = container
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          `translate(${margin.left},${margin.top})`);

  // Get the min and max years between the publicationsData and the metaAnalysisData
  const minYear = Math.floor(d3.min(publicationsData.concat(metaAnalysisData), d => d.date.getFullYear()) / 10) * 10;
  const maxYear = Math.ceil(d3.max(publicationsData.concat(metaAnalysisData), d => d.date.getFullYear()) / 10) * 10;

  // Add years with no data
  for (let i = minYear; i <= maxYear; i++) {
    if (!publicationsData.find(d => d.date.getFullYear() === i)) {
      publicationsData.push({ date: new Date(i, 0, 1), value: 0 });
    }
    if (!metaAnalysisData.find(d => d.date.getFullYear() === i)) {
      metaAnalysisData.push({ date: new Date(i, 0, 1), value: 0 });
    }
  }

  // Sort the data by date
  publicationsData.sort((a, b) => a.date - b.date);
  metaAnalysisData.sort((a, b) => a.date - b.date);

  const RANGE_PADDING = 12;
  // Add X axis
  const x = d3.scaleTime()
    .domain([new Date(minYear, 0, 1), new Date(maxYear, 0, 1)])
    .range([ 0 + RANGE_PADDING, width - RANGE_PADDING ]);

  const xAxis = d3.axisBottom(x);

  // Only display the tens years
  let years = [];
  for (let i = minYear; i <= maxYear; i += 10) {
    years.push(new Date(i, 0, 1)); // January 1st of the year
  }
  xAxis.tickValues(years)
  const xAxisTicks = svg.append("g")
    .attr("transform", `translate(0,${height - 10})`)
    .call(xAxis);

  xAxisTicks.select(".domain").remove() // Remove the bottom line


  xAxisTicks.selectAll(".tick text")
    .style("font-size", 12)
    .style("fill", gray500);

  xAxisTicks.selectAll(".tick line").remove();

  const VERTICAL_AXIS_PADDING = 24;
  const y = d3.scaleLinear()
    .domain([0, Math.max(...publicationsData.map(d => d.value))])
    .range([ height - VERTICAL_AXIS_PADDING, 0 ]);

  const TICK_DISTANCE = 500;
  const numTicks = Math.ceil((y.domain()[1] - y.domain()[0]) / TICK_DISTANCE);
  const tickValues = Array.from({length: numTicks}, (_, i) => {
    return y.domain()[0] + i * TICK_DISTANCE;
  });

  const yAxis = d3.axisLeft(y)
    .tickValues(tickValues)
    .tickFormat(d3.format("d"))
    .tickSizeInner(-width); // Make the inner ticks extend across the chart area


  const yAxisTicks = svg.append("g")
    .call(yAxis)

  yAxisTicks.select(".domain").remove() // Remove the left line

  yAxisTicks.selectAll(".tick text")
    .attr("transform", "translate(-20,0)");

  yAxisTicks.selectAll(".tick line")
    .style("stroke", gray400);
  yAxisTicks.selectAll(".tick:not(:first-child) line")
    .style("stroke-dasharray", "2,10")
    .style("stroke", gray400);

  // Add the publications line
  svg.append("path")
    .datum(publicationsData)
    .attr("fill", "none")
    .attr("stroke", gray700)
    .attr('stroke-dasharray', '2,2')
    .attr("stroke-width", 1.5)
    .attr("d", d3.line()
      .x(d => x(d.date))
      .y(d => y(d.value))
    )

  // Add the meta-analysis line
  svg.append("path")
    .datum(metaAnalysisData)
    .attr("fill", "none")
    .attr("stroke", primaryColor)
    .attr("stroke-width", 3)
    .attr("d", d3.line()
      .x(d => x(d.date))
      .y(d => y(d.value))
    )
}

// Rerender chart on window resize

window.addEventListener('resize', () => {
  createMethodologyChart(window.getters.methodologyChartData());
} );