const express = require("express");
const bodyParser = require("body-parser");

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

app.listen(3000, () => {
  console.log("Listening to port 3000")
});
