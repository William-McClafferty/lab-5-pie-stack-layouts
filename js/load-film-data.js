d3.csv("data/films.csv", d3.autoType)
  .then((filmData) => {
    console.log("Loaded films rows:", filmData.length);

    const genres = Array.from(new Set(filmData.map(d => d.genre)));

    const grouped = d3.rollups(
      filmData,
      (rows) => {
        const obj = {};
        genres.forEach((g) => {
          const match = rows.find((d) => d.genre === g);
          obj[g] = match ? +match.inflation_adjusted_gross : 0;
        });
        return obj;
      },
      (d) => d.year
    );

    const wideData = grouped
      .map(([year, values]) => ({ year: +year, ...values }))
      .sort((a, b) => a.year - b.year);

    const filmFormats = genres.map((g, i) => ({
      id: g,
      label: g,
      color: d3.schemeTableau10[i % 10],
    }));

    defineFilmScales(wideData, filmFormats);
    drawFilmStreamGraph(wideData, filmFormats);
    drawFilmStackedBars(wideData, filmFormats);
    addFilmLegend(filmFormats);
  })
  .catch((err) => {
    console.error("Film CSV load failed:", err);
  });
