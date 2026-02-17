const drawStackedBars = (data) => {

  d3.select("#bars").selectAll("*").remove();

  const svg = d3.select("#bars")
    .append("svg")
    .attr("viewBox", [0, 0, width, height]);

  const innerChart = svg
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

  const keys = [
    "cd",
    "vinyl",
    "cassette",
    "download",
    "eight_track",
    "streaming",
    "other"
  ];

  data.forEach(d => {
    keys.forEach(k => {
      if (!d[k] || isNaN(d[k])) {
        d[k] = 0;
      }
    });
  });

  const stack = d3.stack()
    .keys(keys)
    .order(d3.stackOrderNone)
    .offset(d3.stackOffsetExpand);

  const series = stack(data);

  const yScale = d3.scaleLinear()
    .domain([0, 1])
    .range([innerHeight, 0]);

  innerChart.selectAll("g.layer")
    .data(series)
    .join("g")
    .attr("fill", d => colorScale(d.key))
    .selectAll("rect")
    .data(d => d.map(v => ({ v, year: v.data.year })))
    .join("rect")
    .attr("x", d => xScale(d.year))
    .attr("width", xScale.bandwidth())
    .attr("y", d => yScale(d.v[1]))
    .attr("height", d => yScale(d.v[0]) - yScale(d.v[1]));

  const tickYears = d3.range(1975, 2020, 5);

  const xAxis = d3.axisBottom(xScale)
    .tickValues(tickYears)
    .tickSizeOuter(0);

  const yAxis = d3.axisLeft(yScale)
    .ticks(10)
    .tickFormat(d3.format(".1f"))
    .tickSizeOuter(0);

  innerChart.append("g")
    .attr("transform", `translate(0, ${innerHeight})`)
    .call(xAxis);

  innerChart.append("g")
    .call(yAxis);
};
