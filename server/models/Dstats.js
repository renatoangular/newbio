/*
 |--------------------------------------
 | Event Model
 |--------------------------------------
 */

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const DonationsSchema = new Schema({
  donationId: { type: String, required: true },
  Total: { type: String, required: true } 
});

module.exports = mongoose.model('Dstats', DstatsSchema);
