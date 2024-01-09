window.createMethodologyChart = (data) => {
  const element = document.querySelector('#methodology-chart');
  const CHART_HEIGHT = 455;
  const margin = { top: 20, right: 20, bottom: 30, left: 40 };
  const { publications, metaAnalysis } = data;
  const publicationsData = Object.keys(publications).map(key => ({ date: d3.timeParse("%Y")(key), value: publications[key] }));
  const metaAnalysisData = Object.keys(metaAnalysis).map(key => ({ date: d3.timeParse("%Y")(key), value: metaAnalysis[key] }));

  const width = element.clientWidth - margin.left - margin.right;
  const height = CHART_HEIGHT - margin.top - margin.bottom;

  const svg = d3.select('#methodology-chart')
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

  // Get the min and max years between the publicationsData and the metaAnalysisData
  const minYear = Math.floor(d3.min(publicationsData.concat(metaAnalysisData), d => d.date.getFullYear()) / 10) * 10;
  const maxYear = Math.ceil(d3.max(publicationsData.concat(metaAnalysisData), d => d.date.getFullYear()) / 10) * 10;


  // Add X axis
  const x = d3.scaleTime()
    .domain([new Date(minYear, 0, 1), new Date(maxYear, 0, 1)])
    .range([ 0, width ]);

  const xAxis = d3.axisBottom(x);

  // Only display the tens years
  let years = [];
  for (let i = minYear; i <= maxYear; i += 10) {
    years.push(new Date(i, 0, 1)); // January 1st of the year
  }
  xAxis.tickValues(years)

  svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis)
    .select(".domain").remove(); // Remove the bottom line

  const y = d3.scaleLinear()
    .domain(d3.extent(publicationsData, d => d.value ))
    .range([ height, 0 ]);

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