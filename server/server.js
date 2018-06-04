const express = require("express");
const bodyParser = require("body-parser");
const ObjectID = require('mongodb').ObjectID;

var {mongoose} = require("./db/db.js");
var {todo} = require("./models/todo.js");
var {user} = require("./models/user.js");

var app = new express();

app.use(bodyParser.json());

app.post("/todos", (req, res) => {

  var tds = new todo( {
    text: req.body.text,
  } )

  tds.save().then( (doc) => {
    console.log(doc)
    res.send(doc);
  }, (err) => {
    res.status(400).send(err);
    console.log(err)
  })
})

app.get("/todos", (req, res) => {
  todo.find().then( (docs) => {
    res.send({docs})
  }, (e) => {
    res.send(e)
  })
})

app.get("/todos/:id", (req, res) => {
  var id = req.params.id;
  todo.findById(id).then( (doc) => {
    if(!doc) {
      res.send("Invalid ID")
      return console.log("Invalid id");
    }
    res.send(doc)
    },
    (e) => {
      res.status(404).send("Not a valid ID")
  }).catch( (e) => {
    res.send("Not a valid ID");
  })
})

app.delete("/delete_todo/:id", (req, res) => {
  var id = req.params.id;
  if(!ObjectID.isValid(id)) {
    console.log("Not a valid id");
    res.status(404).send()
    return;
  }
  todo.findByIdAndRemove(id).then( (doc) => {
    if(!doc) {
      return res.status(404).send()
    }
    res.send({doc})
  }).catch( (e) => {
    res.status(404).send()
  })
})


app.listen(3000, () => {
  console.log("Listening to port 3000")
});

module.exports = {app};
