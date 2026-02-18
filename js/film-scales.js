let filmColorScale;
let filmXScale;
let filmYStreamScale;
let filmBandScale;

const defineFilmScales = (data, filmFormats) => {

  const keys = filmFormats.map(d => d.id);

  filmColorScale = d3.scaleOrdinal()
    .domain(keys)
    .range(filmFormats.map(d => d.color));

  filmXScale = d3.scaleTime()
    .domain(d3.extent(data, d => new Date(d.year, 0, 1)))
    .range([0, innerWidth]);

  const stack = d3.stack()
    .keys(keys)
    .offset(d3.stackOffsetSilhouette);

  const series = stack(data);

  filmYStreamScale = d3.scaleLinear()
    .domain([
      d3.min(series, s => d3.min(s, d => d[0])),
      d3.max(series, s => d3.max(s, d => d[1]))
    ])
    .range([innerHeight, 0]);

  filmBandScale = d3.scaleBand()
    .domain(data.map(d => d.year))
    .range([0, innerWidth])
    .padding(0.08);
};
