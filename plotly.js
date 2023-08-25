const source = [
  {title: 'Warming', number: 32, value: -10, min: -20, max: 40 },
  {title: 'Fire', number: 40, value: 50, min: 30, max: 60},
  {title: 'Flood', number: 52, value: 0, min: -10, max: 20}
];

const data = [
  {
    mode: 'markers',
    marker: { size: 10 },
    x: source.map(d => d.value),
    y: ['Warming', 'Fire', 'Flood'],
    error_x: {
      symetric: false,
      array: source.map(d => d.max - d.value),
      arrayminus: source.map(d => d.value - d.min),
      width: 0
    },
    type: 'scatter',
  }
];

const layout = {

  xaxis: {
    side: 'top',
    tickformat: '.0%',
  },
  yaxis: {
    side: 'right',
    tickmode: 'array',
    tickvals: [0, 1, 2],
    ticktext: source.map(d => `<b>${d.title} (${d.number})</b>`
    //   `<tspan class="hello w-[91px] h-6 justify-start items-center gap-1 inline-flex">
    // <div class="text-slate-700 text-base font-semibold leading-normal">${d.title}</div>
    // <div class="text-slate-600 text-xs font-normal leading-[18px]">(23)</div>
    // </tspan>`
    )
  }
};

Plotly.newPlot('chart-2', data, layout, {  displayModeBar: false,
  responsive: true });