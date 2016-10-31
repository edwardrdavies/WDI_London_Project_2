"use strict";

var googleMap = googleMap || {};

googleMap.getUsers = function () {
  $.get("http://localhost:8000/api/users").done(this.loopThroughtUsers);
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
  var canvas = document.getElementById("map");
  var mapOptions = {
    zoom: 14,
    center: new google.maps.LatLng(51.5, -0.08),
    mapTypeId: google.maps.MapTypeId.ROADMAP
  };
  this.map = new google.maps.Map(canvas, mapOptions);
  this.getUsers();
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
$(googleMap.mapSetup.bind(googleMap));