class Datapoints {
  constructor(data) {
    this.data = data;
  }

  getCurrentNum() {
    var latestObj = this.data[this.data.length - 1];
    var timestamp = latestObj["Timestamp"].format("MMMM Do YYYY, h:mm:ss a");
    var num = latestObj["Number of people"];
    var message =
      "There are " + num + " people in the gym on " + timestamp + " .";
    return (document.getElementById("currentVisitors").innerHTML = message);
  }

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

  totalPeeps(object, date) {
    return object[date].reduce(
      (acc, currentVal) => acc + currentVal["Number of people"],
      0
    );
  }

  average(total, data, filter) {
    return Math.round(total / data[filter].length);
  }

  singlePlot(groupingParam) {
    var grouped = this.groupBy("Timestamp", groupingParam);
    var labels = Object.keys(grouped);
    var series = [];
    for (let i = 0; i < labels.length; i++) {
      var filter = labels[i];
      var total = this.totalPeeps(grouped, filter);
      var ave = this.average(total, grouped, filter);
      series.push(ave);
      // series.push(total);
    }
    return [labels, series];
  }
}

class getData {
  constructor(url) {
    this.url = url;
  }
  loadMaData() {
    return axios.get(this.url).then(res => {
      const data = res.data;
      const dataMoment = this.parser(data);
      return dataMoment;
    });
  }

  parser(data) {
    var dataMoment = data.map(x => {
      return {
        // Ensure number of people are ints
        "Number of people": parseInt(x["Number of people"]),
        // Appy moment.js to timestamps
        Timestamp: moment(x.Timestamp)
      };
    });
    return dataMoment;
  }
}

function timeFormat() {
  const day = "D MMM YYYY";
  const month = "MMM YYYY";
  const year = "YYYY";
  const dayOfWeek = "ddd";
  const hour = "HH";
  const hpd = "HH ddd";

  var time = document.getElementById("grouping").value;
  console.log(time);
  return time;
}

class App {
  constructor(url) {
    this.init(url);
  }

  init(url) {
    getData = new getData(url);
    const data = getData.loadMaData().then(data => {
      var datapoint = new Datapoints(data);
      datapoint.getCurrentNum(); // Display current number of visitors
      plotting();
      document.getElementById("grouping").addEventListener("change", plotting);
      function plotting() {
        var singlePlot = datapoint.singlePlot(timeFormat()); // Pass in the form selection value
        var plot = new Plots(singlePlot[0], singlePlot[1]);
        plot.plotChart("#chart1");
      }
    });
  }
}

var app = new App("https://playground.hungryturtlecode.com/api/puregym/data");
