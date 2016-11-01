var googleMap = googleMap || {};


googleMap.getUsers = function () {
  $.get("http://localhost:8000/users")
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
  let canvas = document.getElementById("all-map");

    let latLng= {lat:51.5,
    lng:-0.08};
    console.log(latLng);
  let mapOptions = {
    zoom: 14,
    center: new google.maps.LatLng(51.5, -0.08),
    mapTypeId: google.maps.MapTypeId.ROADMAP
  };
  this.map = new google.maps.Map(canvas, mapOptions);
  this.getUsers();
  getVenues(latLng,this.map);
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



    function getVenues(latLng,canvas) {
      console.log("getvenue",latLng);
      // console.log(google.maps.places);
      var request = {
        location: latLng,
        // radius: 50,
        query: 'tennis courts',
        rankby: 'distance'
      };
      console.log(canvas);
      let service = new google.maps.places.PlacesService(canvas);
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
      let  infowindow = new google.maps.InfoWindow();
      google.maps.event.addListener(marker, 'click', function() {

      let website = "";


        service.getDetails({
          placeId: place.place_id
        }, function(place, status) {

          if (status === google.maps.places.PlacesServiceStatus.OK) {

          google.maps.places.photo = place.photos ? place.photos[0].getUrl({'maxWidth': 200, 'maxHeight': 200}) : "";
          google.maps.places.url = place.url;

          }
          });


          infowindow.setContent(`<b>${place.name}</b><br>
            ${place.formatted_address} <br>
            ${google.maps.places.photo}
            `);

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