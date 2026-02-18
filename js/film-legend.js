const addFilmLegend = (filmFormats) => {

  const container = d3.select(".film-legend-container");
  container.selectAll("*").remove();

  const legend = container.append("div")
    .style("display", "flex")
    .style("justify-content", "center")
    .style("gap", "25px");

  const items = legend.selectAll("div")
    .data(filmFormats)
    .join("div")
    .style("display", "flex")
    .style("align-items", "center")
    .style("gap", "8px");

  items.append("span")
    .style("width", "14px")
    .style("height", "14px")
    .style("border-radius", "4px")
    .style("background", d => d.color);

  items.append("span")
    .text(d => d.label);
};
