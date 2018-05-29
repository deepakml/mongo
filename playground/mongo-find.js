const {MongoClient, ObjectID} = require('mongodb');

const databaseName = "ToDoApp";

MongoClient.connect("mongodb://localhost:27017/ToDoApp", { useNewUrlParser: true }, (err, client) => {
  if(err) {
    return console.log("Unable to connect");
  }

  const db = client.db(databaseName);

  db.collection("todos").find({_id: new ObjectID("5b0d09a12d301a585f2e886a")}).toArray().then( (data) => {
    console.log(JSON.stringify(data, undefined, 2))
  }, (err) => {
    console.log("error fetching data");
  })

  client.close();

});
