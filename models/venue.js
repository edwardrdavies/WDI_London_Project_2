const mongoose = require('mongoose');

const venueSchema = new mongoose.Schema({
  venue: { type: String, required: true},
  meat: String,
  girth: Number
});

module.exports = mongoose.model("venue", venueSchema);
