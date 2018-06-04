var mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");


var userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    minlength: 6,
    trim: true,
    unique: true,
    validate: {
      validator: function(v) {
        return validator.isEmail(v)
      },
      message: '{VALUE} is not a valid E-mail address'
    },
  },
  password: {
    type: String,
    minlength: 8,
    required: true
  },
  tokens: [{
    access: {
      type: String,
      required: true
    },
    token: {
      type: String,
      required: true
    }
  }]
})

userSchema.methods.generateAuthToken = function () {
  var user = this;

  var access = "auth";
  var token = jwt.sign({_id: user._id.toString()}, "mySecret123");

  user.tokens.push({access, token})
  return user.save().then( () => {
    return token;
  })
}

var user = mongoose.model("Users",  userSchema);

module.exports = {user};
