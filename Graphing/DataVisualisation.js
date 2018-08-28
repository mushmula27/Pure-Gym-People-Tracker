console.log("Yamum.")

axios.get("https://playground.hungryturtlecode.com/api/puregym/data")
  .then(res => {
    data = res.data;
    console.log(data)

    //moment.js lookup to make timestamp in usable format
  });
