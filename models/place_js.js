const mongoose = require('mongoose');

const placeSchema = mongoose.Schema({
  url: String,
  photoReference: String,
  name: String,
  location: {
    lat: String,
    lng: String
  }
});

module.exports = mongoose.model('Place', placeSchema);
