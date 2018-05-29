const MongoClient = require('mongodb').MongoClient;

const databaseName = "ToDoApp";

MongoClient.connect("mongodb://localhost:27017/ToDoApp", { useNewUrlParser: true }, (err, client) => {
  if(err) {
    return console.log("Unable to connect");
  }

  const db = client.db(databaseName);

  db.collection("Users").insertOne({
    name: "Deepak",
    age: 25,
    location: "Trivandrum"

   }, (err, result) => {
    if(err) {
      return console.log("Error in inserting data")
    }

    console.log("Data inserted successfully");

    console.log(JSON.stringify(result.ops, undefined, 2));

  })

  console.log("Connected to database");

  client.close();

});
