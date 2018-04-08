/*
 |--------------------------------------
 | Event Model
 |--------------------------------------
 */

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const DonationsSchema = new Schema({
  itemName: { type: String, required: true },
  donatedBy: { type: String, required: true },
  MT: {        type: String,  required: false },
  quantity: {  type: String,  required: false },

  category: { type: String, required: false},
  donatedDatetime: { type: Date, required: false },  
  description: {type: String, required: false },
  viewPublic: { type: Boolean, required: false
   },
});

module.exports = mongoose.model('Donations', DonationsSchema);
