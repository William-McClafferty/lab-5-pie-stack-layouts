const drawFilmStreamGraph = (data, filmFormats) => {
  d3.select("#film-streamgraph").selectAll("*").remove();

  const keys = filmFormats.map(d => d.id);

  const stack = d3.stack()
    .keys(keys)
    .offset(d3.stackOffsetSilhouette);

  const series = stack(data);

  // Recompute y domain from the stacked series
  filmYStreamScale.domain([
    d3.min(series, s => d3.min(s, d => d[0])),
    d3.max(series, s => d3.max(s, d => d[1]))
  ]);

  const svg = d3.select("#film-streamgraph")
    .append("svg")
    .attr("viewBox", [0, 0, width, height]);

  const innerChart = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

  // Area
  const area = d3.area()
    .x((d, i) => filmXScale(new Date(data[i].year, 0, 1)))
    .y0(d => filmYStreamScale(d[0]))
    .y1(d => filmYStreamScale(d[1]));

  innerChart.selectAll("path")
    .data(series)
    .join("path")
    .attr("d", area)
    .attr("fill", d => filmColorScale(d.key));

  // Axes
  const xAxis = d3.axisBottom(filmXScale)
    .ticks(d3.timeYear.every(5))
    .tickFormat(d3.timeFormat("%Y"));

  const yAxis = d3.axisLeft(filmYStreamScale)
    .ticks(6)
    .tickFormat(d3.format("~s"));

  innerChart.append("g")
    .attr("transform", `translate(0, ${innerHeight})`)
    .call(xAxis);

  innerChart.append("g")
    .call(yAxis);

  // Label like the example
  svg.append("text")
    .attr("x", margin.left)
    .attr("y", margin.top - 18)
    .style("font-size", "14px")
    .style("font-family", "sans-serif")
    .text("Adjusted for inflation");
};
