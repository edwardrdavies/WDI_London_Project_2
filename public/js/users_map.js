"use strict";

var googleMap = googleMap || {};
var venueInfoWindow = void 0;

googleMap.getUsers = function () {
  $.get("http://localhost:8000/users").done(this.loopThroughtUsers);
};

googleMap.addInfoWindowForUser = function (user, marker) {
  var _this = this;

  google.maps.event.addListener(marker, 'click', function () {
    console.log(user);
    if (_this.infowindow) {
      _this.infowindow.close();
    }
    _this.infowindow = new google.maps.InfoWindow({

      content: "\n      <h4>" + user.fullname + "</h4>\n      <p><b>Location: </b>" + user.postcode + "</p>\n      <b>Phone:</b><p>" + user.phoneNumber + "</p>\n      <p><b>Willing to travel</b>: " + user.travelDistance + " miles</p>\n      <p><b>Typical availability</b>: " + user.availability + "</p>\n      <a href=\"mailto:" + user.email + "\"><button class=\"btn btn-info\">Email</button></a>\n      "
    });
    _this.infowindow.open(_this.map, marker);
  });
};

googleMap.mapSetup = function () {
  var canvas = document.getElementById("all-map");

  var latLng = { lat: 51.5,
    lng: -0.08 };

  var mapOptions = {
    zoom: 14,
    center: new google.maps.LatLng(51.5, -0.08),
    mapTypeId: google.maps.MapTypeId.ROADMAP
  };
  this.map = new google.maps.Map(canvas, mapOptions);
  this.getUsers();
  getVenues(latLng);

  this.map.addListener('idle', function () {
    // 3 seconds after the center of the map has changed search for places again.
    window.setTimeout(function () {
      var newLocation = googleMap.map.getCenter();
      var latLng = { lat: newLocation.lat(),
        lng: newLocation.lng() };
      getVenues(latLng);
    }, 3000);
  });
};

googleMap.createMarkerForUser = function (user) {
  var latLng = new google.maps.LatLng(user.lat, user.lng);

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

function getVenues(latLng) {

  // console.log(google.maps.places);
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
  }
}

function createVenueMarker(place) {
  var placeLoc = place.geometry.location;
  var marker = new google.maps.Marker({
    map: googleMap.map,
    title: place.name,
    position: place.geometry.location,

    icon: {
      url: '../images/tennis-ball.png',
      anchor: new google.maps.Point(10, 10),
      scaledSize: new google.maps.Size(35, 35)
    }

  });

  marker.addListener('click', function () {

    var website = "";
    var marker = this;

    var service = new google.maps.places.PlacesService(googleMap.map);
    service.getDetails({
      placeId: place.place_id
    }, function (place, status) {

      if (status === google.maps.places.PlacesServiceStatus.OK) {

        google.maps.places.photo = place.photos ? place.photos[0].getUrl({ 'maxWidth': 200, 'maxHeight': 200 }) : "";
        google.maps.places.url = place.url;

        if (typeof venueInfoWindow !== "undefined") {
          venueInfoWindow.close();
        }

        venueInfoWindow = new google.maps.InfoWindow();

        venueInfoWindow.setContent("<b>" + place.name + "</b><br>\n              " + place.formatted_address + " <br>\n              <a href=\"" + google.maps.places.url + "\">More Info...</a>\n              <br><img src=\"" + google.maps.places.photo + "\" alt=\"venue img\">\n              ");

        venueInfoWindow.open(googleMap.map, marker);
      }
    });
    console.log(this);
  });
}

$(googleMap.mapSetup.bind(googleMap));