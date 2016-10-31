'use strict';

$(function () {
  // assign variables that will be used throughout.
  var $main = $('main');
  var geocoder = new google.maps.Geocoder();

  //event handlers go here
  $('.register').on('click', showRegisterForm);
  $('.login').on('click', showLoginForm);
  $('.logout').on('click', logout);
  $('.map').on('click', getUsers);
  $('.clubs').on('click', getVenues);
  $main.on('click', '.userPage', getUser);
  $main.on('click', '.venuePage', getVenue);
  $main.on('submit', 'form', handleForm);

  //handles the registration form
  function handleForm(e) {
    e.preventDefault();
    var $form = $(this);

    if ($form.attr('action') === '/api/register') {
      var postcode = $form.find('[name=postcode]').val();
      geocoder.geocode({ address: postcode + ', UK' }, function (results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
          $form.find('[name=lat]').val(results[0].geometry.location.lat());
          $form.find('[name=lng]').val(results[0].geometry.location.lng());
          sendFormData($form);
        }
      });
    } else {
      sendFormData($form);
    }
  }

  function sendFormData($form) {
    var url = $form.attr('action');
    var method = $form.attr('method');
    var data = $form.serialize();
    var token = localStorage.getItem('token');

    $.ajax({
      url: url,
      method: method,
      data: data,
      beforeSend: function beforeSend(jqXHR) {
        if (token) return jqXHR.setRequestHeader('Authorization', 'Bearer ' + token);
      }
    }).done(function (data) {
      if (data && data.token) {
        localStorage.setItem('token', data.token);
        isLoggedInDisplay();
      }
      getUsers();
    });
  }

  // shows the registration form
  function showRegisterForm() {
    if (event) event.preventDefault();
    $main.html('\n      <h2>Register</h2>\n      <form method="post" action="/api/register">\n        <input type="hidden" name="lat">\n        <input type="hidden" name="lng">\n        <div class="form-group">\n          <input class="form-control" name="username" placeholder="Username">\n        </div>\n        <div class="form-group">\n          <input class="form-control" name="email" placeholder="Email">\n        </div>\n        <div class="form-group">\n          <input class="form-control" type="password" name="password" placeholder="Password">\n        </div>\n        <div class="form-group">\n          <input class="form-control" type="password" name="passwordConfirmation" placeholder="Password Confirmation">\n        </div>\n        <div class="form-group">\n          <input class="form-control" type="postcode" name="postcode" placeholder="postcode">\n        </div>\n        <button class="btn btn-primary">Register</button>\n      </form>\n      ');
  }

  // shows the login form.
  function showLoginForm() {
    if (event) event.preventDefault();
    $main.html('\n        <h2>Login</h2>\n        <form method="post" action="/api/login">\n        <div class="form-group">\n        <input class="form-control" name="email" placeholder="Email">\n        </div>\n        <div class="form-group">\n        <input class="form-control" type="password" name="password" placeholder="Password">\n        </div>\n        <button class="btn btn-primary">Register</button>\n        </form>\n        ');
  }

  // get users sends the GET to the API server to get all users
  function getUsers() {
    if (event) event.preventDefault();
    var token = localStorage.getItem('token');
    $.ajax({
      url: '/api/users',
      method: 'GET',
      beforeSend: function beforeSend(jqXHR) {
        if (token) return jqXHR.setRequestHeader('Authorization', 'Bearer ' + token);
      }
    }).done(function (users) {
      showUsers(users);
      isLoggedInDisplay();
    });
  }

  // runs a loop on data returned by getUsers to output the user list.
  function showUsers(users) {
    if (event) event.preventDefault();
    var $row = $('<div class="row"></div>');
    users.forEach(function (user) {
      $row.append('\n            <div class="col-md-4">\n            <div class="card">\n            <img class="card-img-top" src="http://fillmurray.com/300/300" alt="Card image cap">\n            <div class="card-block">\n            <h4 class="card-title">' + user.username + '</h4>\n            <p class="card-text">This is a longer card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.</p>\n            <p class="card-text"><small class="text-muted">Last updated 3 mins ago</small></p>\n\n            <button class="userPage" data-id="' + user._id + '">See More</button>\n            </div>\n            </div>\n            </div>\n            </div>\n            ');
    });
    $main.html($row);
  }

  function getUser(userID) {

    if (event) {
      event.preventDefault();
    }
    var id = $(event.target).data('id');
    var token = localStorage.getItem('token');
    $.ajax({
      url: '/api/user/' + id,
      method: 'GET',
      beforeSend: function beforeSend(jqXHR) {
        if (token) return jqXHR.setRequestHeader('Authorization', 'Bearer ' + token);
      }
    }).done(function (user) {
      // needs to be edited so that it places the data where it's meant to go!
      $main.prepend('\n              <div class="col-md-4">\n                <div class="card">\n                  <img class="card-img-top" src="' + user.image + '" alt="Card image cap">\n                  <div class="card-block">\n                    <h4 class="card-title">' + user.username + '</h4>\n                    <p class="card-text">blah</p>\n                    <p class="card-text"><small class="text-muted">blah</small></p>\n                    <p class="card-text"><small class="text-muted">blah</small></p>\n                    <button class="venuePage" data-id="' + user._id + '">See More</button>\n                  </div>\n                  </div>\n                </div>\n              </div>\n              ');

      console.log(venue);
      isLoggedInDisplay();
    });
  }

  //   function showMap(){
  //
  //     let $mapDiv = $('#map');
  //
  //     let map = new google.maps.Map($mapDiv[0], {
  //       center: { lat: 51.5153427, lng: -0.0721773 },
  //       zoom: 14
  //     });
  //     navigator.geolocation.getCurrentPosition((position) => {
  //       let latLng = {
  //         lat: position.coords.latitude,
  //         lng: position.coords.longitude
  //       };
  //       map.panTo(latLng);
  //       map.setZoom(16);
  //
  //       let marker = new google.maps.Marker({
  //         position: latLng,
  //         animation: google.maps.Animation.BOUNCE,
  //         draggable: true,
  //         map
  //       });
  //
  //     });
  //   }
  // showMap();

  // checks if user is logged in by checking for token
  function isLoggedIn() {
    return !!localStorage.getItem('token');
  }
  if (isLoggedIn()) {
    getUsers();
    isLoggedInDisplay();
  } else {
    showLoginForm();
    isLoggedOutDisplay();
  }
  function isLoggedInDisplay() {
    $('.login--nav-item').hide();
    $('.register--nav-item').hide();
    $('.logout--nav-item').show();
  }
  function isLoggedOutDisplay() {
    $('.login--nav-item').show();
    $('.register--nav-item').show();
    $('.logout--nav-item').hide();
  }

  // similar to getUsers, sends a get request to get venue list.
  function getVenues() {
    if (event) event.preventDefault();
    var token = localStorage.getItem('token');
    $.ajax({
      url: '/api/venue',
      method: 'GET',
      beforeSend: function beforeSend(jqXHR) {
        if (token) return jqXHR.setRequestHeader('Authorization', 'Bearer ' + token);
      }
    }).done(function (venues) {
      showVenues(venues);
      isLoggedInDisplay();
    });
  }

  // adds HTML for venue list
  function showVenues(venues) {
    if (event) event.preventDefault();
    var $row = $('<div class="row"></div>');
    venues.forEach(function (venue) {
      $row.append('\n              <div class="col-md-4">\n              <div class="card">\n              <img class="card-img-top" src="' + venue.image + '" alt="Card image cap">\n              <div class="card-block">\n              <h4 class="card-title">' + venue.venueName + '</h4>\n              <p class="card-text">' + venue.description + '</p>\n              <p class="card-text"><small class="text-muted">' + venue.address + '</small></p>\n              <p class="card-text"><small class="text-muted">' + venue.url + '</small></p>\n              <button class="venuePage" data-id="' + venue._id + '">See More</button>\n              </div>\n              </div>\n              </div>\n              </div>\n              ');
    });
    $main.html($row);
  }

  // get One Venue, needs to be edited to display in relevant part of the page.
  function getVenue(venueID) {

    if (event) {
      event.preventDefault();
    }
    var id = $(event.target).data('id');
    var token = localStorage.getItem('token');
    $.ajax({
      url: '/api/venue/' + id,
      method: 'GET',
      beforeSend: function beforeSend(jqXHR) {
        if (token) return jqXHR.setRequestHeader('Authorization', 'Bearer ' + token);
      }
    }).done(function (venue) {
      // needs to be edited so that it places the data where it's meant to go!
      $main.prepend('\n                <div class="col-md-4">\n                <div class="card">\n                <img class="card-img-top" src="' + venue.image + '" alt="Card image cap">\n                <div class="card-block">\n                <h4 class="card-title">' + venue.venueName + '</h4>\n                <p class="card-text">' + venue.description + '</p>\n                <p class="card-text"><small class="text-muted">' + venue.address + '</small></p>\n                <p class="card-text"><small class="text-muted">' + venue.url + '</small></p>\n                <button class="venuePage" data-id="' + venue._id + '">See More</button>\n                </div>\n                </div>\n                </div>\n                </div>\n                ');

      isLoggedInDisplay();
    });
  }

  function logout() {
    if (event) event.preventDefault();
    localStorage.removeItem('token');
    showLoginForm();
    isLoggedOutDisplay();
  }
});