console.log("Yamum.");

// Scrape data from the API
axios
  .get("https://playground.hungryturtlecode.com/api/puregym/data")
  .then(res => {
    data = res.data;

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
    var grouped = groupBy(dataMoment, "Timestamp", dayOfWeek);
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
      sorted[keys[i]] = groupBy(grouped[keys[i]], "Timestamp", hour);
    }
    var keysSorted = Object.keys(sorted);
    plot["labels"].push(keysSorted);
    var total = [];
    var ave = [];

    for (let i = 0; i < keysSorted.length; i++) {
      subkey = Object.keys(sorted[keysSorted[i]]);
      for (let p = 0; p < subkey.length; p++) {
        total[p] = totalPeeps(sorted[keysSorted[i]], subkey[p]);
        ave[p] = average(total[p], sorted[keysSorted[i]], subkey[p]);
      }
      plot["series"].push(ave);
    }

    // Plotting the data

    new Chartist.Bar("#chart1", plot);
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
