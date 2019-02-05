// Scrape data from the API
axios
  .get("https://playground.hungryturtlecode.com/api/puregym/data")
  .then(res => {
    data = res.data;
    var dataMoment = data.map(x => {
      return {
        // Ensure number of people are ints
        "Number of people": parseInt(x["Number of people"]),
        // Appy moment.js to timestamps
        Timestamp: moment(x.Timestamp)
      };
    });
    // Getting current number of people in the gym
    Datapoints.getCurNum(dataMoment);
    // Group dataMoment by date(default)/time/whatever
    var day = "D MMM YYYY";
    var month = "MMM YYYY";
    var year = "YYYY";
    var dayOfWeek = "ddd";
    var hour = "HH";
    //var hpd = "HH ddd";

    var datapoint = new Datapoints(dataMoment);
    singlePlot = datapoint.singlePlot(month);

    var plot = new Plots(singlePlot[0], singlePlot[1]);
    plot.plotChart("#chart1");

    ///////// Stacked plots - not working

    // var plot2 = new Plots();

    //   var plot2 = {
    //     labels: [],
    //     series: []
    //   };
    //
    //   var sorted = {};
    //
    //   // First sort
    //   for (let i = 0; i < keys.length; i++) {
    //     sorted[keys[i]] = Datapoints.groupBy(grouped[keys[i]], "Timestamp", year);
    //   }
    //   console.log(sorted);
    //   var keysSorted = Object.keys(sorted);
    //   // plot2["labels"] = keysSorted;
    //   var subkey = [];
    //   for (let i = 0; i < keysSorted.length; i++) {
    //     subkey = Object.keys(sorted[keysSorted[i]]);
    //     var total = [];
    //     var ave = [];
    //     for (let p = 0; p < subkey.length; p++) {
    //       total[p] = Datapoints.totalPeeps(sorted[keysSorted[i]], subkey[p]);
    //       ave[p] = Datapoints.average(total[p], sorted[keysSorted[i]], subkey[p]);
    //     }
    //     plot2["series"].push(ave);
    //   }
    //   plot2["labels"].push(subkey);
    //
    //   console.log(plot2);
    //
    //   var chart = new Chartist.Bar("#chart2", plot2);
    //   chart.on("draw", function(context) {
    //     if (context.type === "bar") {
    //       context.element.attr({
    //         style:
    //           "stroke: hsl(" +
    //           Math.floor((Chartist.getMultiValue(context.value) / 200) * 255) +
    //           ", 50%, 50%);"
    //       });
    //     }
    //   });
  });

////// FUNCTIONS /////
class Datapoints {
  constructor(data) {
    this.data = data;
  }

  static getCurNum(data) {
    var latestObj = data[data.length - 1];
    var timestamp = latestObj["Timestamp"].format("MMMM Do YYYY, h:mm:ss a");
    var num = latestObj["Number of people"];
    var message =
      "There are " + num + " people in the gym on " + timestamp + " .";
    return (document.getElementById("currentVisitors").innerHTML = message);
  }

  // Group data in any format. Default is "D MMM YYYY".
  //Declare any other format as argument in groupBy function
  groupBy(property, dateFormat = "D MMM YYYY") {
    return this.data.reduce((acc, obj) => {
      var key = obj[property];
      var keyF = key.format(dateFormat);
      if (!acc[keyF]) {
        acc[keyF] = [];
      }
      acc[keyF].push(obj);
      return acc;
    }, {});
  }

  static totalPeeps(object, date) {
    return object[date].reduce(
      (acc, currentVal) => acc + currentVal["Number of people"],
      0
    );
  }

  static average(total, data, filter) {
    return Math.round(total / data[filter].length);
  }

  singlePlot(groupingParam) {
    var grouped = Datapoints.groupBy("Timestamp", groupingParam);
    var labels = Object.keys(grouped);
    var series = [];
    for (let i = 0; i < labels.length; i++) {
      var filter = labels[i];
      var total = Datapoints.totalPeeps(grouped, filter);
      var ave = Datapoints.average(total, grouped, filter);
      series.push(ave);
    }
    return [labels, series];
  }
}

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
