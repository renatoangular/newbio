/*
 |--------------------------------------
 | Item Model
 |--------------------------------------
 */

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ItemSchema = new Schema({
  itemName: { type: String, required: false },
  donatedBy: { type: String, required: false },
  MT: {        type: String,  required: false },
  quantity: {  type: String,  required: false },
  category: { type: String, required: false},
  donatedDatetime: { type: String, required: false },  
  description: {type: String, required: false },
  viewPublic: { type: Boolean, required: false }
});

module.exports = mongoose.model('Item', ItemSchema);
