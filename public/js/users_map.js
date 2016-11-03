"use strict";

var googleMap = googleMap || {};
var venueInfoWindow = void 0;

googleMap.markers = [];

googleMap.getUsers = function () {
  $.get("http://localhost:8000/users").done(this.loopThroughtUsers);
};

googleMap.getPlaces = function () {
  $.get("/place").done(this.loopThroughPlaces);
};

googleMap.addInfoWindowForUser = function (user, marker) {
  var _this = this;

  google.maps.event.addListener(marker, 'click', function () {

    if (_this.infowindow) {
      _this.infowindow.close();
    }
    _this.infowindow = new google.maps.InfoWindow({

      content: "\n      <h4>" + user.fullname + "</h4>\n      <p><b>Location: </b>" + user.postcode + "</p>\n\n      <p><img src=\"" + user.image + "\" class=\"img-circle img-container\" alt=\"Image Coming\"></p>\n\n      <b>Phone:</b><p>" + user.phoneNumber + "</p>\n      <p><b>Willing to travel</b>: " + user.travelDistance + " miles</p>\n      <p><b>Typical availability</b>: " + user.availability + "</p>\n      <p><b>Skill Level</b>: " + user.skillLevel + "</p>\n      <a href=\"mailto:" + user.email + "\"><button class=\"btn btn-info\">Email</button></a>\n      "
    });
    _this.infowindow.open(_this.map, marker);
  });
};

googleMap.addInfoWindowForPlace = function (place, marker) {
  var _this2 = this;

  google.maps.event.addListener(marker, 'click', function () {

    if (_this2.infowindow) {
      _this2.infowindow.close();
    }
    _this2.infowindow = new google.maps.InfoWindow({
      content: "" + place.name
    });
    _this2.infowindow.open(_this2.map, marker);
  });
};

googleMap.mapSetup = function () {
  var canvas = document.getElementById("all-map");

  var latLng = { lat: 51.5,
    lng: -0.08 };

  var mapOptions = {
    zoom: 14,
    center: new google.maps.LatLng(51.5, -0.08),
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    scrollwheel: false,
    styles: [{ "featureType": "water", "elementType": "all", "stylers": [{ "hue": "#7fc8ed" }, { "saturation": 55 }, { "lightness": -6 }, { "visibility": "on" }] }, { "featureType": "water", "elementType": "labels", "stylers": [{ "hue": "#7fc8ed" }, { "saturation": 55 }, { "lightness": -6 }, { "visibility": "off" }] }, { "featureType": "poi.park", "elementType": "geometry", "stylers": [{ "hue": "#83cead" }, { "saturation": 1 }, { "lightness": -15 }, { "visibility": "on" }] }, { "featureType": "landscape", "elementType": "geometry", "stylers": [{ "hue": "#f3f4f4" }, { "saturation": -84 }, { "lightness": 59 }, { "visibility": "on" }] }, { "featureType": "landscape", "elementType": "labels", "stylers": [{ "hue": "#ffffff" }, { "saturation": -100 }, { "lightness": 100 }, { "visibility": "off" }] }, { "featureType": "road", "elementType": "geometry", "stylers": [{ "hue": "#ffffff" }, { "saturation": -100 }, { "lightness": 100 }, { "visibility": "on" }] }, { "featureType": "road", "elementType": "labels", "stylers": [{ "hue": "#bbbbbb" }, { "saturation": -100 }, { "lightness": 26 }, { "visibility": "on" }] }, { "featureType": "road.arterial", "elementType": "geometry", "stylers": [{ "hue": "#ffcc00" }, { "saturation": 100 }, { "lightness": -35 }, { "visibility": "simplified" }] }, { "featureType": "road.highway", "elementType": "geometry", "stylers": [{ "hue": "#ffcc00" }, { "saturation": 100 }, { "lightness": -22 }, { "visibility": "on" }] }, { "featureType": "poi.school", "elementType": "all", "stylers": [{ "hue": "#d7e4e4" }, { "saturation": -60 }, { "lightness": 23 }, { "visibility": "on" }] }]
  };
  this.map = new google.maps.Map(canvas, mapOptions);
  this.getUsers();
  this.getPlaces();
  // getVenues(latLng);

  // this.map.addListener('idle', function() {
  //   // 3 seconds after the center of the map has changed search for places again.
  //   window.setTimeout(function() {
  //     let newLocation = googleMap.map.getCenter();
  //     let latLng= {lat: newLocation.lat(),
  //       lng:newLocation.lng()};
  //       getVenues(latLng);
  //     }, 3000);
  //   });
};

googleMap.createMarkerForUser = function (user) {
  var latLng = new google.maps.LatLng(user.lat, user.lng);

  var marker = new google.maps.Marker({
    position: latLng,
    map: googleMap.map,
    icon: '../images/user-marker.png',
    skillLevel: user.skillLevel
  });
  googleMap.addInfoWindowForUser(user, marker);

  googleMap.markers.push(marker);
};

googleMap.createMarkerForPlace = function (place) {
  var latLng = new google.maps.LatLng(place.location.lat, place.location.lng);

  var icon = {
    url: "../images/tennis-ball.png", // url
    scaledSize: new google.maps.Size(20, 20) };
  var marker = new google.maps.Marker({
    position: latLng,
    map: googleMap.map,
    icon: icon
  });
  googleMap.addInfoWindowForPlace(place, marker);
};

googleMap.filterMarkers = function (skillLevel) {
  googleMap.markers.forEach(function (marker) {
    if (marker.skillLevel === skillLevel || skillLevel === 'All Skill Levels') {
      marker.setMap(googleMap.map);
    } else {
      marker.setMap(null);
    }
  });
};

googleMap.loopThroughPlaces = function (places) {
  $.each(places, function (index, place) {
    googleMap.createMarkerForPlace(place);
  });
};

googleMap.loopThroughtUsers = function (users) {

  $.each(users, function (index, user) {
    var $skillLevel = $('#skillLevel').val();
    if ($skillLevel == "All Skill Levels") {
      googleMap.createMarkerForUser(user);
    } else if ($skillLevel == user.skillLevel) {
      googleMap.createMarkerForUser(user);
    }
  });
};

function getVenues(latLng) {

  var request = {
    location: latLng,
    // radius: 50,
    query: 'tennis courts',
    rankby: 'distance'
  };

  var service = new google.maps.places.PlacesService(googleMap.map);
  service.textSearch(request, callback);
}

function callback(results, status, pagination) {

  if (status == google.maps.places.PlacesServiceStatus.OK) {
    for (var i = 0; i < results.length; i++) {
      var place = results[i];
      createVenueMarker(results[i]);
    }
    if ($skillLevel == "All Skill Levels") {
      googleMap.createMarkerForUser(user);
    } else if ($skillLevel == user.skillLevel) {
      googleMap.createMarkerForUser(user);
    }
  }
}

//
// function getVenues(latLng) {
//
//
//   var request = {
//     location: latLng,
//     // radius: 50,
//     query: 'tennis courts',
//     rankby: 'distance'
//   };
//
//   let service = new google.maps.places.PlacesService(googleMap.map);
//   service.textSearch(request, callback);
// }


// function callback(results, status, pagination) {
//
//   if (status == google.maps.places.PlacesServiceStatus.OK) {
//     for (var i = 0; i < results.length; i++) {
//       var place = results[i];
//       createVenueMarker(results[i]);
//     }
//   }
// }

// function createVenueMarker(place) {
//   var placeLoc = place.geometry.location;
//   var marker = new google.maps.Marker({
//     map: googleMap.map,
//     title: place.name,
//     position: place.geometry.location,
//     // animation: google.maps.Animation.DROP,
//
//
//
//     icon: {
//       url: '../images/tennis-ball.png',
//       anchor: new google.maps.Point(10, 10),
//       scaledSize: new google.maps.Size(35, 35),
//     }
//
//   });
//
//
//
//   marker.addListener('click', function() {
//
//     let website = "";
//     let marker = this;
//

//
//
//
//     });
//   }

$(googleMap.mapSetup.bind(googleMap));

// reset map to current location
navigator.geolocation.getCurrentPosition(function (position) {

  var latLng = { lat: position.coords.latitude,
    lng: position.coords.longitude };
  googleMap.map.panTo(latLng);
  var market = new google.maps.Marker({
    position: latLng,
    animation: google.maps.Animation.DROP,
    draggable: true,
    map: googleMap.map
  });
});