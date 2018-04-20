var passport = require('passport');
var mongoose = require('mongoose');
var User = mongoose.model('User');

var sendJSONresponse = function(res, status, content) {
  res.status(status);
  res.json(content);
};

module.exports.register = function(req, res) {

  // if(!req.body.name || !req.body.email || !req.body.password) {
  //   sendJSONresponse(res, 400, {
  //     "message": "All fields required"
  //   });
  //   return;
  // }

  var user = new User();

  user.name = req.body.name;
  user.getnewsletter = req.body.getnewsletter;
  user.isadmin = req.body.isadmin;
  user.email = req.body.email;

   console.log('this is an email and password', req.body.isadmin, req.body.password);
  user.setPassword(req.body.password);

  user.save(function(err) {
    var token;
    token = user.generateJwt();
    res.status(200).json({
      "token" : token
    });
  });

};

module.exports.login = function(req, res) {

  // if(!req.body.email || !req.body.password) {
  //   sendJSONresponse(res, 400, {
  //     "message": "All fields required"
  //   });
  //   return;
  // }
  console.log(req.body);
  passport.authenticate('local', function(err, user, info){
    var token;
    
     console.log('at authentication object' + user);    
    // If Passport throws/catches an error
    if (err) {
      res.status(404).json(err);
      return;
    }

    // If a user is found
    if(user){
      token = user.generateJwt();
      res.status(200);
      res.json({
        "token" : token
      });
    } else {
      // If user is not found
      res.status(401).json('testtesttesttest' + info);
    }
  })(req, res);

};