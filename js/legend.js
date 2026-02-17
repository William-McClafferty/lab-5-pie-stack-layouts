const addLegend = () => {

  const container = d3.select(".legend-container");
  container.selectAll("*").remove();

  const legend = container.append("div")
    .style("display", "flex")
    .style("justify-content", "center")
    .style("align-items", "center")
    .style("gap", "30px");

  const items = legend.selectAll("div")
    .data(formatsInfo)
    .join("div")
    .style("display", "flex")
    .style("align-items", "center")
    .style("gap", "8px");

  items.append("span")
    .style("width", "14px")
    .style("height", "14px")
    .style("border-radius", "4px")
    .style("display", "inline-block")
    .style("background", d => d.color);

  items.append("span")
    .text(d => d.label)
    .style("font-size", "14px")
    .style("color", "#444");
};
