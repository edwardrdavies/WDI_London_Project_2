const googleMap = googleMap || {};
let venueInfoWindow;

googleMap.markers = [];

googleMap.getUsers = function () {
  let token = localStorage.getItem('token');
  $.ajax({
    url: '/users',
    method:'GET',
    beforeSend: function(jqXHR) {
      if(token) return jqXHR.setRequestHeader('Authorization',`Bearer ${token}`);
    }
  })
  .done((this.loopThroughtUsers));
};

googleMap.getPlaces = function () {
  let token = localStorage.getItem('token');
  $.ajax({
    url: '/place',
    method:'GET',
    beforeSend: function(jqXHR) {
      if(token) return jqXHR.setRequestHeader('Authorization',`Bearer ${token}`);
    }
  })
  .done(this.loopThroughPlaces);
};

googleMap.addInfoWindowForUser = function (user, marker) {
  google.maps.event.addListener(marker, 'click', () => {

    if (this.infowindow) {
      this.infowindow.close();
    }
    this.infowindow = new google.maps.InfoWindow({


      content: `
      <h4>${user.fullname}</h4>
      <p><b>Location: </b>${user.postcode}</p>



      <div class="userImage" style="background-image: url(${user.image})"></div>

      <b>Phone:</b><p>${user.phoneNumber}</p>
      <p><b>Willing to travel</b>: ${user.travelDistance} miles</p>
      <p><b>Typical availability</b>: ${user.availability}</p>
      <p><b>Skill Level</b>: ${user.skillLevel}</p>
      <a href="mailto:${user.email}"><button class="btn btn-info">Email</button></a>
      `
    });
    this.infowindow.open(this.map, marker);
  });
};

googleMap.addInfoWindowForPlace = function (place, marker) {

  google.maps.event.addListener(marker, 'click', () => {

    if (this.infowindow) {
      this.infowindow.close();
    }
    this.infowindow = new google.maps.InfoWindow({
      content: `${place.name}`
    });
    this.infowindow.open(this.map, marker);
  });
};


googleMap.mapSetup = function () {
  let canvas = document.getElementById("all-map");

  let latLng= {lat:51.5,
    lng:-0.08};

    let mapOptions = {
      zoom: 12,
      center: new google.maps.LatLng(51.5, -0.08),
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      scrollwheel: false,
      styles: [{"featureType":"water","elementType":"all","stylers":[{"hue":"#7fc8ed"},{"saturation":55},{"lightness":-6},{"visibility":"on"}]},{"featureType":"water","elementType":"labels","stylers":[{"hue":"#7fc8ed"},{"saturation":55},{"lightness":-6},{"visibility":"off"}]},{"featureType":"poi.park","elementType":"geometry","stylers":[{"hue":"#83cead"},{"saturation":1},{"lightness":-15},{"visibility":"on"}]},{"featureType":"landscape","elementType":"geometry","stylers":[{"hue":"#f3f4f4"},{"saturation":-84},{"lightness":59},{"visibility":"on"}]},{"featureType":"landscape","elementType":"labels","stylers":[{"hue":"#ffffff"},{"saturation":-100},{"lightness":100},{"visibility":"off"}]},{"featureType":"road","elementType":"geometry","stylers":[{"hue":"#ffffff"},{"saturation":-100},{"lightness":100},{"visibility":"on"}]},{"featureType":"road","elementType":"labels","stylers":[{"hue":"#bbbbbb"},{"saturation":-100},{"lightness":26},{"visibility":"on"}]},{"featureType":"road.arterial","elementType":"geometry","stylers":[{"hue":"#ffcc00"},{"saturation":100},{"lightness":-35},{"visibility":"simplified"}]},{"featureType":"road.highway","elementType":"geometry","stylers":[{"hue":"#ffcc00"},{"saturation":100},{"lightness":-22},{"visibility":"on"}]},{"featureType":"poi.school","elementType":"all","stylers":[{"hue":"#d7e4e4"},{"saturation":-60},{"lightness":23},{"visibility":"on"}]}]
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

  googleMap.createMarkerForUser = (user) => {
    let latLng = new google.maps.LatLng(user.lat, user.lng);

    let marker = new google.maps.Marker({
      position: latLng,
      map: googleMap.map,
      icon: '../images/user-marker.png',
      skillLevel: user.skillLevel
    });
    googleMap.addInfoWindowForUser(user, marker);


    googleMap.markers.push(marker);
  };

  googleMap.createMarkerForPlace = (place) => {
    let latLng = new google.maps.LatLng(place.location.lat, place.location.lng);
    var icon = {
      url: "../images/tennis-ball.png", // url
      scaledSize: new google.maps.Size(20, 20), // scaled size
    };
    let marker = new google.maps.Marker({
      position: latLng,
      map: googleMap.map,
      icon
    });
    googleMap.addInfoWindowForPlace(place, marker);
  };

  googleMap.filterMarkers = (skillLevel) => {
    googleMap.markers.forEach((marker)=> {
      if(marker.skillLevel === skillLevel || skillLevel === 'All Skill Levels') {
        marker.setMap(googleMap.map);
      } else {
        marker.setMap(null);
      }
    });
  };

  googleMap.loopThroughPlaces = (places) => {
    $.each(places, (index, place) => {
      googleMap.createMarkerForPlace(place);
    });
  };


  googleMap.loopThroughtUsers = (users) => {

    $.each(users, (index, user) => {
      let $skillLevel = $('#skillLevel').val();
      if ($skillLevel == "All Skill Levels" ) {
        googleMap.createMarkerForUser(user);
      }
      else if ($skillLevel == user.skillLevel) {
        googleMap.createMarkerForUser(user);

      }


    });
  };


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
  navigator.geolocation.getCurrentPosition((position) => {

    let latLng= {lat: position.coords.latitude,
      lng:position.coords.longitude};
      googleMap.map.panTo(latLng);
      let market = new google.maps.Marker({
        position: latLng,
        animation:google.maps.Animation.DROP,
        draggable: true,
        map: googleMap.map,
      });
    });
