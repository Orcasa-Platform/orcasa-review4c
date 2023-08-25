const primaryColor = "#2BB3A7";

const dataSource = [
  { title: 'Warming', number: 32, value: -10, min: -20, max: 40 },
  { title: 'Fire', number: 40, value: 50, min: 30, max: 60 },
  { title: 'Flood', number: 52, value: 0, min: -10, max: 20 }
];

// Create the SVG container
const svgWidth = 800;
const svgHeight = 300;
const margin = { top: 20, right: 200, bottom: 20, left: 80 };
const width = svgWidth - margin.left - margin.right;
const height = svgHeight - margin.top - margin.bottom;

const svg = d3.select("#chart-1")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight)
  .append("g")
  .attr("transform", `translate(${margin.left},${margin.top})`);

// Create x scale
const xScale = d3.scaleLinear()
  .domain([-100, 100])
  .range([0, width]);

// Create y scale
const yScale = d3.scaleBand()
  .domain(dataSource.map(d => d.title))
  .range([0, height])
  .padding(1);

// Create x axis
const xAxis = d3.axisTop(xScale)
  .tickFormat(d => d3.format(".0%")(d/100));

// Draw x axis
const xAxisElement = svg.append("g")
  .attr("class", "x-axis")
  .call(xAxis)

  xAxisElement.select(".domain").remove();

const xAxisTick = xAxisElement.selectAll(".tick")

xAxisTick.select("text")
  .attr("fill", 'gray');

xAxisTick.selectAll("line")
  .attr("stroke", 'none');

// Create y axis
const yAxis = d3.axisRight(yScale)
  .tickSize(0)
  .tickPadding(10)
  // .tickFormat(i => `<div class="tick-label"><span class="tick-value">${i}</span><span class="tick-text">Some text</span></div>`);

const yAxisGroup = svg.append("g")
.attr("class", "y-axis")
.call(yAxis);

yAxisGroup.selectAll(".tick text")
.attr("class", "tick-text")
.attr("x", -10)
.attr("dy", "0.32em")
.style("text-anchor", "start");

yAxisGroup
.attr("transform", `translate(${width + 30}, 0)`)
.select(".domain").remove();

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
.attr("stroke-dasharray", (d) => d === 0 ? 'none' : "2,2")
.attr("stroke", (d) => d === 0 ? 'black' : "gray");

xGridElement.select(".domain").remove();

// Create error bars
const errorBars = svg.selectAll(".error-bar")
  .data(dataSource)
  .enter()
  .append("line")
  .attr("class", "error-bar")
  .attr("x1", d => xScale(d.min))
  .attr("x2", d => xScale(d.max))
  .attr("y1", d => yScale(d.title) + yScale.bandwidth() / 2)
  .attr("y2", d => yScale(d.title) + yScale.bandwidth() / 2)
  .attr("stroke", primaryColor)
  .attr("stroke-width", 2);

// Create data points
const dataPoints = svg.selectAll(".data-point")
  .data(dataSource)
  .enter()
  .append("circle")
  .attr("class", "data-point")
  .attr("cx", d => xScale(d.value))
  .attr("cy", d => yScale(d.title) + yScale.bandwidth() / 2)
  .attr("r", 5)
  .attr("fill", primaryColor);
