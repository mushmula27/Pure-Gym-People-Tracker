console.log("Yamum.");

// Scrape data from the API
axios
  .get("https://playground.hungryturtlecode.com/api/puregym/data")
  .then(res => {
    data = res.data;
    console.log(data[data.length - 1]);

    // Apply moment.js to the timestamps in data.
    // Create new object with keys Number of people and Timestamp where
    // Number of people is converted to int and
    // Timestamp has moment.js applied to it.
    var dataMoment = data.map(x => {
      return {
        "Number of people": parseInt(x["Number of people"]),
        Timestamp: moment(x.Timestamp)
      };
    });
    // Group dataMoment by date(default)/time/whatever
    var day = "D MMM YYYY";
    var month = "MMM YYYY";
    var year = "YYYY";
    var dayOfWeek = "ddd";
    var hour = "HH";
    //var hpd = "HH ddd";

    // Prep empty plot variable
    var plot = {
      labels: [],
      series: []
    };
    var seriesData = [];

    // // Single bar plots
    var grouped = groupBy(dataMoment, "Timestamp", hour);
    var keys = Object.keys(grouped);
    //
    // for (let i = 0; i < keys.length; i++) {
    //   filter = keys[i];
    //   total = totalPeeps(grouped, filter);
    //   ave = average(total, grouped, filter);
    //
    //   plot["labels"].push(filter);
    //   seriesData.push(ave);
    // }
    // plot["series"].push(seriesData);

    // Stacked plots
    var sorted = {};

    for (let i = 0; i < keys.length; i++) {
      sorted[keys[i]] = groupBy(grouped[keys[i]], "Timestamp", dayOfWeek);
    }
    var keysSorted = Object.keys(sorted);
    // plot["labels"] = keysSorted;
    var subkey = [];
    for (let i = 0; i < keysSorted.length; i++) {
      subkey = Object.keys(sorted[keysSorted[i]]);
      var total = [];
      var ave = [];
      for (let p = 0; p < subkey.length; p++) {
        total[p] = totalPeeps(sorted[keysSorted[i]], subkey[p]);
        ave[p] = average(total[p], sorted[keysSorted[i]], subkey[p]);
      }
      plot["series"].push(ave);
    }
    plot["labels"] = subkey;

    // Plotting the data

    var chart = new Chartist.Bar("#chart1", plot);
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
  });

// Group data in any format. Default is "D MMM YYYY".
//Declare any other format as argument in groupBy function
function groupBy(objectArray, property, dateFormat = "D MMM YYYY") {
  return objectArray.reduce((acc, obj) => {
    var key = obj[property];
    var keyF = key.format(dateFormat);
    if (!acc[keyF]) {
      acc[keyF] = [];
    }
    acc[keyF].push(obj);
    return acc;
  }, {});
}

function totalPeeps(objectArray, date) {
  return objectArray[date].reduce(
    (acc, currentVal) => acc + currentVal["Number of people"],
    0
  );
}

function average(total, data, filter) {
  return Math.round(total / data[filter].length);
}
