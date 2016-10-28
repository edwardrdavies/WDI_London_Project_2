const mongoose = require('mongoose');

const venueSchema = new mongoose.Schema({
  venueName: { type: String, required: true},
  address: String,
  image:String,
  description:String
  
});

module.exports = mongoose.model("venue", venueSchema);
