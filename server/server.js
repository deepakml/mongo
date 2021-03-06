require('./config/config');

const express = require("express");
const bodyParser = require("body-parser");
const ObjectID = require('mongodb').ObjectID;
const _ = require("lodash");
const validator = require("validator");
const jwt = require("jsonwebtoken");


var {mongoose} = require("./db/db.js");
var {todo} = require("./models/todo.js");
var {user} = require("./models/user.js");
var {authenticate} = require("./middleware/authenticate.js");

var app = new express();

app.use(bodyParser.json());

app.post("/todos", authenticate, (req, res) => {

  var tds = new todo( {
    text: req.body.text,
    _creator: req.user._id
  } )

  tds.save().then( (doc) => {
    console.log(doc)
    res.send(doc);
  }, (err) => {
    res.status(400).send(err);
    console.log(err)
  })
})

app.post("/user/register", (req, res) => {
  var body = _.pick(req.body, ["email", "password"]);

  if(! ( _.has(body, 'email') && validator.isEmail(body.email ) ) ) {
    return res.send({error: "Email field is required."})
  }

  if(! ( _.has(body, 'password') && body.password.length >= 8 ) )  {
    return res.send({error: "Password field is required and must be atleast 8 characters in length"})
  }

  var usr = new user(body)

  usr.save().then( () => {
    return usr.generateAuthToken();
  }).then( (token) => {
    res.header('x-auth', token).send(usr)
  }).catch( (e) => {
    res.send(e)
  })

})

app.post("/user/login", (req, res) => {
  var body = _.pick(req.body, ["email", "password"]);
  user.getUserByEmailPassword(body.email, body.password).then( (result) => {
    return result.generateAuthToken().then( (token) => {
        res.header('x-auth', token).send("Logged in successfully!");
    });
  }).catch( (e) => {
    return res.send(e);
  });

})

app.get("/todos", authenticate, (req, res) => {
  todo.find({
    _creator: req.user._id
  }).then( (docs) => {
    res.send({docs})
  }, (e) => {
    res.send(e)
  })
})

app.get("/todos/:id", authenticate, (req, res) => {
  var id = req.params.id;
  console.log(req.user._id);
  console.log(id);
  todo.findOne({
    _id: id,
    _creator: req.user._id
  }).then( (doc) => {
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

app.get("/user/me", authenticate, (req, res) => {
  res.send(req.user);
})

app.get("/user/logout", authenticate, (req, res) => {
  var usr = req.user;
  usr.removeToken(req.token).then( (val) => {
    res.status(200).send();
  }).catch( (e) => {
    res.status(404).send();
  })
})

app.delete("/delete_todo/:id", authenticate, (req, res) => {
  var id = req.params.id;
  if(!ObjectID.isValid(id)) {
    console.log("Not a valid id");
    res.status(404).send()
    return;
  }
  todo.findOneAndRemove({
    _id: id,
    _creator: req.user._id
  }).then( (doc) => {
    if(!doc) {
      return res.status(404).send()
    }
    res.send({doc})
  }).catch( (e) => {
    res.status(404).send()
  })
})

app.patch("/todo/:id", authenticate, (req, res) => {
  var id = req.params.id;
  if(!ObjectID.isValid(id)) {
    Promise.reject("Not a valid id");
  }

  var body = _.pick(req.body, ["text", "completed"]);

  if(_.isBoolean(body.completed) && body.completed) {
    body.completedAt = new Date().getTime();
  }
  else {
    body.completed = false;
    body.completedAt = null;
  }

  todo.findOneAndUpdate({
    _id : id,
    _creator: req.user._id,
  },{$set: body}, {new:true}).then( (doc) => {
    if(!doc) {
      return Promise.reject();
    }
    res.send({doc})
  }).catch( (e) => {
    res.status(404).send(e)
  })
})

app.listen(process.env.PORT, () => {
  console.log("Listening to port 3000")
});

module.exports = {app};
