/*
 |--------------------------------------
 | Event Model
 |--------------------------------------
 */

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const registerSchema = new Schema({
  email: { type: String, required: true },
  name: { type: String, required: true },
  password: { type: Date, required: true },
  isadmin: { type: Date, required: true }, 
  getnewsletter: { type: Boolean, required: true }
});

module.exports = mongoose.model('Register', registerSchema);
