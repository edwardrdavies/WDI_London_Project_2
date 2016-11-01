"use strict";

var googleMap = googleMap || {};

googleMap.getUsers = function () {
  $.get("http://localhost:8000/users").done(this.loopThroughtUsers);
};
googleMap.addInfoWindowForUser = function (user, marker) {
  var _this = this;

  google.maps.event.addListener(marker, 'click', function () {
    if (_this.infowindow) {
      _this.infowindow.close();
    }
    _this.infowindow = new google.maps.InfoWindow({
      content: user.username + "<p>" + user.postcode + "</p>"
    });
    _this.infowindow.open(_this.map, marker);
  });
};

googleMap.mapSetup = function () {
  var canvas = document.getElementById("all-map");

  var latLng = { lat: 51.5,
    lng: -0.08 };
  console.log(latLng);
  var mapOptions = {
    zoom: 14,
    center: new google.maps.LatLng(51.5, -0.08),
    mapTypeId: google.maps.MapTypeId.ROADMAP
  };
  this.map = new google.maps.Map(canvas, mapOptions);
  this.getUsers();
  getVenues(latLng, this.map);
};

googleMap.createMarkerForUser = function (user) {
  var latLng = new google.maps.LatLng(user.lat, user.lng);
  console.log(user);
  var marker = new google.maps.Marker({
    position: latLng,
    map: googleMap.map,
    icon: '../images/user-marker.png'
  });
  googleMap.addInfoWindowForUser(user, marker);
};

googleMap.loopThroughtUsers = function (users) {
  $.each(users, function (index, user) {
    googleMap.createMarkerForUser(user);
  });
};

function getVenues(latLng, canvas) {
  console.log("getvenue", latLng);
  // console.log(google.maps.places);
  var request = {
    location: latLng,
    // radius: 50,
    query: 'tennis courts',
    rankby: 'distance'
  };
  console.log(canvas);
  var service = new google.maps.places.PlacesService(canvas);
  service.textSearch(request, callback);
}

function callback(results, status, pagination) {
  console.log(results.length);
  if (status == google.maps.places.PlacesServiceStatus.OK) {
    for (var i = 0; i < results.length; i++) {
      var place = results[i];
      createVenueMarker(results[i]);
    }
  }
}

function createVenueMarker(place) {
  var placeLoc = place.geometry.location;
  var marker = new google.maps.Marker({
    map: googleMap.map,
    title: place.name,
    position: place.geometry.location,

    icon: {
      url: 'https://s21.postimg.org/4qxzdfjwn/tennis_court.png',
      anchor: new google.maps.Point(10, 10),
      scaledSize: new google.maps.Size(35, 35)
    }

  });
  var infowindow = new google.maps.InfoWindow();
  google.maps.event.addListener(marker, 'click', function () {

    var website = "";

    service.getDetails({
      placeId: place.place_id
    }, function (place, status) {

      if (status === google.maps.places.PlacesServiceStatus.OK) {

        google.maps.places.photo = place.photos ? place.photos[0].getUrl({ 'maxWidth': 200, 'maxHeight': 200 }) : "";
        google.maps.places.url = place.url;
      }
    });

    infowindow.setContent("<b>" + place.name + "</b><br>\n            " + place.formatted_address + " <br>\n            " + google.maps.places.photo + "\n            ");

    infowindow.open(map, this);
  });
}

// map.addListener('idle', function() {
//   // 3 seconds after the center of the map has changed search for places again.
//   window.setTimeout(function() {
//     console.log("changed");
//     let newLocation = map.getCenter();
//     let latLng= {lat: newLocation.lat(),
//       lng:newLocation.lng()};
//       getVenues(latLng);
//     }, 3000);
//   });

$(googleMap.mapSetup.bind(googleMap));