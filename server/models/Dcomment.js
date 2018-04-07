/*
 |--------------------------------------
 |  Model
 |--------------------------------------
 */

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const dcommentSchema = new Schema({
  userId: { type: String, required: false },
  name: { type: String, required: false },
  eventId: { type: String, required: false },
  wishList: { type: Boolean, required: false },
  numberWished:{ type: Number, required: false},
  comments:{type: String, required: false}
 
});

module.exports = mongoose.model('Dcomment', dcommentSchema);
