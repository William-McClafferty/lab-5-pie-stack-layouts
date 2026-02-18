const drawFilmStackedBars = (data, filmFormats) => {
  // Safety checks
  const root = d3.select("#film-bars");
  if (root.empty()) {
    console.error('Missing container: #film-bars');
    return;
  }
  if (!Array.isArray(data) || data.length === 0) {
    console.error("Film stacked bars received no data");
    return;
  }

  // Clear
  root.selectAll("*").remove();

  // Fallbacks in case shared-constants.js is not loaded
  const W = (typeof width !== "undefined") ? width : 900;
  const H = (typeof height !== "undefined") ? height : 260;
  const M = (typeof margin !== "undefined")
    ? margin
    : { top: 20, right: 20, bottom: 45, left: 60 };

  const innerW = W - M.left - M.right;
  const innerH = H - M.top - M.bottom;

  const keys = filmFormats.map(d => d.id);

  // Proportional stacking (0..1)
  const stack = d3.stack()
    .keys(keys)
    .offset(d3.stackOffsetExpand);

  const series = stack(data);

  // X uses band scale (years as categories)
  const years = data.map(d => d.year);

  const xBand = d3.scaleBand()
    .domain(years)
    .range([0, innerW])
    .padding(0.08);

  const y = d3.scaleLinear()
    .domain([0, 1])
    .range([innerH, 0]);

  // Use your filmColorScale if it exists, else fallback to format colors
  const color = (typeof filmColorScale !== "undefined")
    ? filmColorScale
    : d3.scaleOrdinal()
        .domain(keys)
        .range(filmFormats.map(d => d.color));

  const svg = root.append("svg")
    .attr("viewBox", `0 0 ${W} ${H}`);

  const g = svg.append("g")
    .attr("transform", `translate(${M.left}, ${M.top})`);

  // Bars
  g.selectAll("g.layer")
    .data(series)
    .join("g")
    .attr("class", "layer")
    .attr("fill", d => color(d.key))
    .selectAll("rect")
    .data(d => d.map(v => ({ v, year: v.data.year })))
    .join("rect")
    .attr("x", d => xBand(d.year))
    .attr("width", xBand.bandwidth())
    .attr("y", d => y(d.v[1]))
    .attr("height", d => y(d.v[0]) - y(d.v[1]));

  // X ticks every 5 years
  const first = years[0];
  const tickYears = years.filter(yr => (yr - first) % 5 === 0);

  const xAxis = d3.axisBottom(xBand)
    .tickValues(tickYears)
    .tickFormat(d3.format("d"));

  const yAxis = d3.axisLeft(y)
    .ticks(6)
    .tickFormat(d3.format(".1f"));

  // Axes groups
  g.append("g")
    .attr("transform", `translate(0, ${innerH})`)
    .call(xAxis);

  g.append("g")
    .call(yAxis);
};
