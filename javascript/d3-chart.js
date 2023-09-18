const primaryColor = "#2BB3A7";
const red = "#FA545D";
const gray400 = '#8B90A4';

// Create the SVG container
const createSVGChart = (slug, data) => {
  if(!data || data.length === 0) return;

  const heightValue = (data.length) * 35 + 100;
  const widthValue = 500;

  const RIGHT_AXIS_PADDING = 140;
  const AXIS_PADDING = 20;
  const margin = { top: 0, right: 0, bottom: 0, left: 0 };
  const chart = d3.select(`#chart-${slug}`)
    .style("text-align", 'center')
    .append("svg")
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

  // Create y scale
  const yScale = d3.scaleBand()
    .domain(data.map(d => d.title))
    .range([0, height])
    .padding(1);

  // Create x axis
  const xAxis = d3.axisTop(xScale)
    .tickFormat(d => d3.format(".0%")(d/100));

  // Draw x axis
  const xAxisElement = svg.append("g")
    .attr("class", "x-axis")
    .call(xAxis)

  const xAxisTick = xAxisElement.selectAll(".tick")

  xAxisTick.select("text")
    .attr("fill", gray400);

  xAxisTick.selectAll("line")
    .attr("stroke", 'none');

  // Create y axis
  const yAxis = d3.axisRight(yScale)
    .tickSize(0)
    .tickPadding(10)
    .tickFormat(() => '');

  const yAxisGroup = svg.append("g")
  .attr("class", "y-axis")
  .call(yAxis);

  yAxisGroup.selectAll(".tick text")
  .attr("class", "tick-text")
  .attr("x", -10)
  .attr("dy", "0.32em")
  .style("text-anchor", "start");

  const buttonHTML = (title, publications) =>
    `<button type="button" class='btn-filter-chart'>
      <span class="font-semibold text-slate-700">${title}</span>
      <span class="text-xs font-normal">(${publications})</span>
    </button>`;
  ;

  const yTickHeight = 44;
  const yTickWidth = 120;
  const yAxisTicks = svg.append("g")
  .attr("transform", `translate(${width + 30}, ${-yTickHeight / 2})`)


  yAxisTicks.call(yAxis)
  .selectAll(".tick")
  .append("foreignObject")
    .attr("width", yTickWidth)
    .attr("height", yTickHeight)
    .style("text-align", 'left')
    .html(title => {
      const dataPublications = data.find((item) => item.title === title)?.publications;
      return buttonHTML(title, dataPublications);
    }).on("click", function(_, title){
      const dataAction = data.find((item) => item.title === title)?.action;
      return dataAction && dataAction();
    });

  // Remove all domain lines
  svg.selectAll('.domain').attr('stroke-width', 0);

  // Create x grid
  const xGrid = d3.axisBottom(xScale)
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
  .attr("stroke", (d) => d === 0 ? 'black' : gray400);

  xGridElement.select(".domain").remove();

  // Create error bars
  svg.selectAll(".error-bar")
    .data(data)
    .enter()
    .append("g")
    .attr("class", "error-bar")
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
        .attr("stroke-width", 2);

      // Under zero
        g
        .append("line")
        .attr("x1", xScale(Math.min(d.low, 0)))
        .attr("x2", xScale(d.high > 0 ? 0 : d.high))
        .attr("y1", yScale(d.title) + yScale.bandwidth() / 2)
        .attr("y2", yScale(d.title) + yScale.bandwidth() / 2)
        .attr("stroke", red)
        .attr("stroke-width", 2);
    });

  // Create data points
  svg.selectAll(".data-point")
    .data(data)
    .enter()
    .append("circle")
    .attr("class", "data-point")
    .attr("cx", d => xScale(d.value))
    .attr("cy", d => yScale(d.title) + yScale.bandwidth() / 2)
    .attr("r", 5)
    .attr("fill", d => d.value >= 0 ? primaryColor : red);
  };