var mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcryptjs = require("bcryptjs");


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

userSchema.methods.removeToken = function (token) {
  var user = this;
  return user.update( {
    $pull: {
      tokens: {
        token: token
      }
    }
  } )
}


userSchema.statics.getUserByToken = function (token) {
  var user = this;
  try {
    decoded = jwt.verify(token, 'mySecret123');
    return user.findOne({
      "tokens.token" : token,
      "tokens.access" : "auth"
    }).then( (res) => {
      return res;
    }).catch( (e) => {
      return  Promise.reject(encodeURIComponent());
    })
  } catch(err) {
    return  Promise.reject(err);
  }
}

userSchema.statics.getUserByEmailPassword = function (email, password) {
  var user = this;
  return user.findOne({
      "email" : email,
    }).then( (res) => {
      if(!res) {
          return  Promise.reject("Invalid email");
      }
      return bcryptjs.compare(password, res.password).then( (doc) => {
        if(!doc) {
          return  Promise.reject("Invalid password");
        }
        return Promise.resolve(res);
      })
  }).catch( (e) => {
    return  Promise.reject(e);
  })

}

userSchema.pre("save", function(next) {
  var user = this;

  if (this.isModified("password")) {
    bcryptjs.genSalt(10, (err, salt) => {
      if(err) {
        return Promise.reject("Unable to salt")
      }
      bcryptjs.hash(user.password, salt, (err, hash) => {
        if(err) {
          return Promise.reject("Unable to hash");
        }
        user.password = hash;
        next();
      })
    })
  }
  else {
    next();
  }
})

var user = mongoose.model("Users",  userSchema);

module.exports = {user};
