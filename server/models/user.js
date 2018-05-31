var mongoose = require("mongoose");

var user = mongoose.model("Users", {
  email: {
    type: String,
    required: true,
    minlength: 1,
    trim: true,
  },
  password: {
    type: String,
    default: null
  },
  todo: {
    type: String,
    default: null
  }
} )

module.exports = {user};
