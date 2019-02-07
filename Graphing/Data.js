class Datapoints {
  constructor(data) {
    this.data = data;
  }

  static getCurrentNum(data) {
    var latestObj = data[data.length - 1];
    var timestamp = latestObj["Timestamp"].format("MMMM Do YYYY, h:mm:ss a");
    var num = latestObj["Number of people"];
    return [num, timestamp];
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

class App {
  constructor(url) {
    this.init(url);
  }

  init(url) {
    getData = new getData(url);
    getData.loadMaData().then(data => {
      this.datapoint = new Datapoints(data);
      const currentNum = Datapoints.getCurrentNum(data); // Display current number of visitors
      dispCurrentNum(currentNum);
      this.plotting();
      document
        .getElementById("grouping")
        .addEventListener("change", () => this.plotting());
      //Ensuring the correct context is passed in.
      //You can write it also with this.plotting.bind(this)
    });
  }
  plotting() {
    var singlePlot = this.datapoint.singlePlot(timeFormat()); // Pass in the form selection value
    var plot = new Plots(singlePlot[0], singlePlot[1]);
    plot.plotChart("#chart1");
  }
}

var app = new App("https://playground.hungryturtlecode.com/api/puregym/data");

// Update the current number of people every 10 mins
setInterval(
  () =>
    getData.loadMaData().then(data => {
      const currentNum = Datapoints.getCurrentNum(data);
      dispCurrentNum(currentNum);
      console.log("update");
    }),
  600000
);
