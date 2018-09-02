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
    var grouped = groupBy(dataMoment, "Timestamp");

    var filter = "1 Aug 2018";
    var total = totalPeeps(grouped, filter);
    var ave = Math.round(total / grouped[filter].length);
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
