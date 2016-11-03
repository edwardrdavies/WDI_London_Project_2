const mongoose = require('mongoose');
const request = require('request-promise');
const Promise = require('bluebird');
mongoose.Promise = Promise;
const Place = require('../models/place_js');

mongoose.connect('mongodb://localhost/game-set-match');

Place.collection.drop();

request({
  url: 'https://maps.googleapis.com/maps/api/place/radarsearch/json',
  qs: {
    location: '51.5,-0.08',
    radius: 50000,
    keyword: 'tennis courts',
    key: 'AIzaSyCfo1wlojXFUA8qUAor384VxJmU4vfmBhY'
  },
  json: true
})
.then((data) => {
  return Promise.all(data.results.map((place) => {
    return request({
      url: 'https://maps.googleapis.com/maps/api/place/details/json',
      qs: {
        placeid: place.place_id,
        key: 'AIzaSyCfo1wlojXFUA8qUAor384VxJmU4vfmBhY'
      },
      json: true
    });
  }));
})
.then((data) => {
  let places = [];
  data.forEach((place) => {
    if(place.result) {
      places.push({
        url: place.result.url,
        name: place.result.name,
        photoReference: place.result.photos ? place.result.photos[0].photo_reference : null,
        location: place.result.geometry.location
      });
    }
  });

  return places;
})
.then((places) => {
  return Place.create(places);
})
.catch((err) => {
  console.log("ERROR", err);
})
.finally(() => {
  mongoose.connection.close();
});
