const {MongoClient, ObjectID} = require('mongodb');

const databaseName = "ToDoApp";

MongoClient.connect("mongodb://localhost:27017/ToDoApp", { useNewUrlParser: true }, (err, client) => {
  if(err) {
    return console.log("Unable to connect");
  }

  const db = client.db(databaseName);

  //db.collection("todos").deleteMany({text: "A"}).then( (res) => { console.log(JSON.stringify(res.ops, undefined, 2))  })

  //db.collection("todos").deleteOne({text: "B"}).then( (res) => { console.log(JSON.stringify(res))  })

  //db.collection("todos").findOneAndDelete({ _id: new ObjectID("5b0d09a12d301a585f2e886a") }).then( (res) => { console.log(JSON.stringify(res))  })

  //client.close();

});
