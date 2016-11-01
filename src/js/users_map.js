var googleMap = googleMap || {};


googleMap.getUsers = function () {
  $.get("http://localhost:8000/api/users")
    .done(this.loopThroughtUsers);
};
googleMap.addInfoWindowForUser = function (user, marker) {
  google.maps.event.addListener(marker, 'click', () => {
    if (this.infowindow) {
      this.infowindow.close();
    }
    this.infowindow = new google.maps.InfoWindow({
      content: `${user.username}<p>${user.postcode}</p>`
    });
    this.infowindow.open(this.map, marker);
  });
};

googleMap.mapSetup = function () {
  let canvas = document.getElementById("map");
  let mapOptions = {
    zoom: 14,
    center: new google.maps.LatLng(51.5, -0.08),
    mapTypeId: google.maps.MapTypeId.ROADMAP
  };
  this.map = new google.maps.Map(canvas, mapOptions);
  this.getUsers();
};

googleMap.createMarkerForUser = (user) => {
  let latLng = new google.maps.LatLng(user.lat, user.lng);
  console.log(user);
  let marker = new google.maps.Marker({
    position: latLng,
    map: googleMap.map,
    icon: '../images/user-marker.png'
  });
  googleMap.addInfoWindowForUser(user, marker);

};


googleMap.loopThroughtUsers = (users) => {
  $.each(users, (index, user) => {
    googleMap.createMarkerForUser(user);
  });
};
$(googleMap.mapSetup.bind(googleMap));
