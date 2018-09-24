console.log("Yamum.");

class Parameters {
  constructor(dataMoment, plot, groupingParam1, groupingParam2) {
    this.dataMoment = dataMoment;
    this.plot = plot;
    this.groupingParam1 = groupingParam1;
    this.groupingParam2 = groupingParam2;
  }
}

const dataObject = new Parameters(dataMoment, plot, hour, dayOfWeek);
loadMaData();
// Scrape data from the API
function loadMaData() {
  axios
    .get("https://playground.hungryturtlecode.com/api/puregym/data")
    .then(res => {
      var data = res.data;

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
      // Getting current number of people in the gym
      getCurNum(dataMoment);
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
      // var grouped = groupBy(dataMoment, "Timestamp", hour);
      // var keys = Object.keys(grouped);
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

      plotChart(plot);
    });
}

////// FUNCTIONS /////
function getCurNum(data) {
  var latestObj = data[data.length - 1];
  var timestamp = latestObj["Timestamp"].format("MMMM Do YYYY, h:mm:ss a");
  var num = latestObj["Number of people"];
  var message = "There are " + num + " people in the gym on " + timestamp + ".";
  document.getElementById("currentVisitors").innerHTML = message;
}

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

// Stacked plots
function stackedPlot(data, groupingParam1, groupingParam2) {
  var grouped = groupBy(data, "Timestamp", groupingParam1);
  var keys = Object.keys(grouped);
  var sorted = {};

  for (let i = 0; i < keys.length; i++) {
    sorted[keys[i]] = groupBy(grouped[keys[i]], "Timestamp", groupingParam2);
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
}

// Plotting the data
function plotChart(plot) {
  chart = new Chartist.Bar("#chart1", plot);
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

var button = document.getElementById("get");

button.addEventListener("click", () => {
  console.log("button was licked.");
  stackedPlot(dataMoment, hour, dayOfWeek);
  plotChart(plot);
});
