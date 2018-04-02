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
  donatedDatetime: { type: Date, required: true },
  checkedOutDatetime: { type: Date, required: false },
  description: String,
  viewPublic: { type: Boolean, required: false }
});

module.exports = mongoose.model('Donations', DonationsSchema);
