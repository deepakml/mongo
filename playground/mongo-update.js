const {MongoClient, ObjectID} = require('mongodb');

const databaseName = "ToDoApp";

MongoClient.connect("mongodb://localhost:27017/ToDoApp", { useNewUrlParser: true }, (err, client) => {
  if(err) {
    return console.log("Unable to connect");
  }

  const db = client.db(databaseName);

  db.collection("Users").findOneAndUpdate(
    {
      name: "Deepak"
    },
    {
      $set: {
        name: "Deepak ML"
      }
    },
    {
      returnOriginal: false
    }
  ).then( (res) => { console.log(res, undefined, 2) } )

  //client.close();

});
