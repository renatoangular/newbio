const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); 

// User1 Schema
const Schema = mongoose.Schema;
const User1Schema = new Schema ({
  name: {
    type: String 
  },
  email: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  admin: {
    type: Boolean,
  },
  teacher_request: {
    type: Boolean
    
  },
  teacher_confirmed: {
    type: Boolean
    
  },
  school: {
    type: String
    
  }
});

const User1 = module.exports = mongoose.model('User1', User1Schema);

module.exports.getUserById = function(id, callback) {
  User1.findById(id, callback);
}

module.exports.getUserByUsername = function(username, callback) {
  const query = {username: username}
  User1.findOne(query, callback);
}

module.exports.addUser = function(newUser, callback) {
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(newUser.password, salt, (err, hash) => {
      if(err) throw err;
      newUser.password = hash;
      newUser.save(callback);
    });
  });
}

module.exports.comparePassword = function(candidatePassword, hash, callback) {
  bcrypt.compare(candidatePassword, hash, (err, isMatch) => {
    if(err) throw err;
    callback(null, isMatch);
  });
}

module.exports.getUsers = function(users, callback) {
  const query = {}
  User1.find(query, callback);
}

