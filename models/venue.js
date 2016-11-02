const mongoose = require('mongoose');

const venueSchema = new mongoose.Schema({
  venueName: { type: String, required: 'Please supply a venue name' },
  address: String,
  image:String,
  description:String,
  url:String,
  phone:String
});

module.exports = mongoose.model("venue", venueSchema);
