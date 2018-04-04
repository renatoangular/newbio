/*
 |--------------------------------------
 | Request Model
 |--------------------------------------
 */

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const requestSchema = new Schema({
  userId: { type: String, required: true },
  name: { type: String, required: true },
  donationsID: { type: String, required: true },
  wishList: { type: Boolean, required: true },
  quantity: Number,
  comments: String
});

module.exports = mongoose.model('Request', requestSchema);
