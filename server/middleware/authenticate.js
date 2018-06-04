const {user} = require('./../models/user.js');

var authenticate = (req, res, next) => {
  var token = req.header("x-auth");

  user.getUserByToken(token).then( (doc) => {
    if(!doc) {
      return Promise.reject();
    }

    req.user = doc;
    req.token = token;
    next();

  }).catch( (e) => {
    return res.status(401).send(e)
  })
}

module.exports = {authenticate};
