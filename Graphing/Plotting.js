class Plots {
  constructor(labels, series) {
    this.labels = labels;
    this.series = [series];
  }

  plotChart(chartID) {
    var chart = new Chartist.Bar(chartID, {
      labels: this.labels,
      series: this.series
    });
    chart.on("draw", function(context) {
      if (context.type === "bar") {
        context.element.attr({
          style:
            "stroke: hsl(" +
            Math.floor((Chartist.getMultiValue(context.value) / 200) * 255) +
            ", 50%, 50%);"
        });
      }
    });
  }
}
