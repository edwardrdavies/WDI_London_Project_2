'use strict';

$(function () {

  // assign variables that will be used throughout.
  var $main = $('main');
  var geocoder = new google.maps.Geocoder();

  //event handlers go here
  // $('.register').on('click', showRegisterForm);
  // $('.login').on('click', showLoginForm);
  // $('.logout').on('click', logout);
  // $('.map').on('click', getUsers);
  // $('.clubs').on('click', getVenues);
  // $main.on('click', '.userPage', getUser);
  // $main.on('click', '.venuePage', getVenue);
  $main.on('submit', 'form', handleForm);

  //handles the registration form
  function handleForm(e) {
    console.log("form clicked");
    e.preventDefault();
    var $form = $(this);

    if ($form.attr('action') === '/register') {
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
      console.log("the done form action has been working");
      if (data && data.token) {
        console.log(data, data.token, "ready to set token");
        localStorage.setItem('token', data.token);
      }
      listUsers();
    });
  }

  // shows the login form.
  function showLoginForm() {

    if (event) event.preventDefault();
    $main.html('\n      <h2 class="form-signin-heading">Login</h2>\n      <form method="post" action="/login">\n    <div class="form-group">\n      <input class="form-control" name="email" placeholder="Email">\n      </div>\n      <div class="form-group">\n      <input class="form-control" type="password" name="password" placeholder="Password">\n      </div>\n      <button class="btn btn-primary" type="submit">Register</button>\n      </form>\n      ');
  }

  // get users sends the GET to the API server to get all users
  function listUsers() {
    if (event) event.preventDefault();
    var token = localStorage.getItem('token');

    $.ajax({
      url: '/users',
      method: 'GET',
      beforeSend: function beforeSend(jqXHR) {
        if (token) return jqXHR.setRequestHeader('Authorization', 'Bearer ' + token);
      }
    }).done(function (users) {

      showUsers(users);
      // isLoggedInDisplay();

    });
  }

  // runs a loop on data returned by getUsers to output the user list.
  function showUsers(users) {
    if (event) event.preventDefault();

    users.forEach(function (user) {
      $main.append('\n          <div class="col-md-4">\n          <div class="card">\n          <img class="card-img-top" src="http://fillmurray.com/300/300" alt="Card image cap">\n          <div class="card-block">\n          <h4 class="card-title">' + user.username + '</h4>\n          <p class="card-text">This is a longer card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.</p>\n          <p class="card-text"><small class="text-muted">Last updated 3 mins ago</small></p>\n\n          <button class="userPage" data-id="' + user._id + '">See More</button>\n          </div>\n          </div>\n\n          </div>\n          </div>\n\n\n          </form>\n          ');
    });
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
      $main.prepend('\n            <div class="col-md-4">\n              <div class="card">\n                <img class="card-img-top" src="' + user.image + '" alt="Card image cap">\n                <div class="card-block">\n                  <h4 class="card-title">' + user.username + '</h4>\n                  <p class="card-text">blah</p>\n                  <p class="card-text"><small class="text-muted">blah</small></p>\n                  <p class="card-text"><small class="text-muted">blah</small></p>\n                  <button class="venuePage" data-id="' + user._id + '">See More</button>\n                </div>\n                </div>\n              </div>\n            </div>\n          ');

      console.log(venue);
      isLoggedInDisplay();
    });
  }

  isLoggedIn();
  // checks if user is logged in by checking for token
  function isLoggedIn() {

    return !!localStorage.getItem('token');
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
      $main.prepend('\n                <div class="col-md-4">\n                <div class="card">\n\n                <img class="card-img-top" src="' + venue.image + '" alt="Card image cap">\n                <div class="card-block">\n                <h4 class="card-title">' + venue.venueName + '</h4>\n                <p class="card-text">' + venue.description + '</p>\n                <p class="card-text"><small class="text-muted">' + venue.address + '</small></p>\n                <p class="card-text"><small class="text-muted">' + venue.url + '</small></p>\n                <button class="venuePage" data-id="' + venue._id + '">See More</button>\n\n                </div>\n                </div>\n                </div>\n                </div>\n                ');
    });
  }

  function logout() {
    if (event) event.preventDefault();
    localStorage.removeItem('token');
    showLoginForm();
  }

  // display users if loggedin - users if not.
  if (isLoggedIn()) {
    $main.empty();
    listUsers();
  } else {
    showLoginForm();
  }
});