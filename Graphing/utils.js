function timeFormat() {
  var time = document.getElementById("grouping").value;
  console.log(time);
  return time;
}

function dispCurrentNum([num, timestamp]) {
  var message =
    "There are " + num + " people in the gym on " + timestamp + " .";
  return (document.getElementById("currentVisitors").innerHTML = message);
}
