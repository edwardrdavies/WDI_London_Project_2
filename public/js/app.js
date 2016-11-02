'use strict';

$(function () {

  // assign variables that will be used throughout.
  var $main = $('main');
  var $map = $('#all-map');

  //event handlers go here
  $('.logout').on('click', logout);
  $('.edit').on('click', showEditBar);

  $('body').on('submit', 'form', handleForm);
  var geocoder = new google.maps.Geocoder();

  //handles the registration form

  function handleForm(e) {
    console.log("form has been submitted");

    e.preventDefault();
    var $form = $(this);

    // if() {
    //   console.log(event);
    //   console.log('need logic to validate form & to remove slider ');
    //     }

    if ($form.attr('action') === '/register' || $form.attr('method') === 'PUT') {
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

    console.log("Sending form data");

    $.ajax({
      url: url,
      method: method,
      data: data,
      beforeSend: function beforeSend(jqXHR) {
        if (token) return jqXHR.setRequestHeader('Authorization', 'Bearer ' + token);
      }
    }).done(function (data) {

      if (data && data.token) {
        console.log(data);
        localStorage.setItem('_id', data.user._id);
        localStorage.setItem('token', data.token);
        if (window.location.pathname === "/") {
          window.location.replace("/members");
        }
      }
      showMembersPage();
    }).fail(function (err) {

      if (err.responseJSON.message) {
        $form.find('small.error').addClass('error').html(err.responseJSON.message);
        console.log(err.responseJSON.message);
      } else {

        for (var name in err.responseJSON) {
          console.log(name);
          console.log(err.responseJSON[name].message);
          $form.find('[name=' + name + ']').parent('.form-group').addClass('error').find('small.error').html('<p> ' + err.responseJSON[name].message + ' </p>');
        }
      }
    });
  }

  // shows the login form.
  function showLoginForm() {

    if (event) event.preventDefault();
    $main.append('\n      <div class="loginForm">\n      <h2 class="form-signin-heading">Login</h2>\n      <form method="post" action="/login">\n      <div class="form-group">\n      <input class="form-control" name="email" placeholder="Email">\n\n      </div>\n      <div class="form-group">\n      <input class="form-control" type="password" name="password" placeholder="Password">\n      </div>\n          <small class="error"></small><br>\n      <button class="btn btn-primary" type="submit">Login</button>\n      </form></div>\n      ');
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
      $main.prepend('\n            <div class="col-md-4">\n            <div class="card">\n            <img class="card-img-top" src="' + user.image + '" alt="Card image cap">\n            <div class="card-block">\n            <h4 class="card-title">' + user.username + '</h4>\n            <p class="card-text">blah</p>\n            <p class="card-text"><small class="text-muted">blah</small></p>\n            <p class="card-text"><small class="text-muted">blah</small></p>\n            <button class="venuePage" data-id="' + user._id + '">See More</button>\n            </div>\n            </div>\n            </div>\n            </div>\n            ');

      isLoggedInDisplay();
    });
  }

  isLoggedIn();
  // checks if user is logged in by checking for token
  function isLoggedIn() {

    return !!localStorage.getItem('token');
  }

  function logout() {
    if (event) event.preventDefault();
    localStorage.removeItem('token');
    localStorage.removeItem('_id');
    $map.hide();
    showLoginForm();
    $('.loggedIn').toggle();
  }

  // display users if loggedin - users if not.

  function showMembersPage() {

    if (isLoggedIn()) {
      console.log('is logged in');
      $map.show();
      $('.loggedIn').show();
      $('.loginForm').hide();
    } else {
      $('.loggedIn').hide();
      showLoginForm();
      showRegForm();
      $map.hide();
    }
  }

  showMembersPage();
});

var showEditBar = function showEditBar() {
  showRegForm("edit");

  $('.editBar').slideToggle("slow", function () {
    // Animation complete.
    $('#password').prop("hidden", true);
    $('#confPassword').prop("hidden", true);
  });
};

var showRegForm = function showRegForm(action) {

  var token = localStorage.getItem('token');
  var _id = localStorage.getItem('_id');

  var method = "POST";
  var button = "Register";
  var message = "Join the community today!";
  var formAction = "/register";
  if (action == "edit") {
    method = "PUT";
    button = 'Update';
    formAction = '/user/' + _id;
    message = "Update Your Profile";
  }

  if (token) {

    $.ajax({
      url: '/user/' + _id,
      method: 'GET',
      beforeSend: function beforeSend(jqXHR) {
        if (token) return jqXHR.setRequestHeader('Authorization', 'Bearer ' + token);
      }
    }).done(function (user) {

      $("input[name=username]").val(user.username);
      $("input[name=fullname]").val(user.fullname);
      $("input[name=image]").val(user.image);
      $("input[name=postcode]").val(user.postcode);
      $("input[name=skill_level]").val(user.skill_level);
      $("input[name=availability]").val(user.availability);
      $("input[name=ageRange]").val(user.ageRange);
      $("input[name=travelDistance]").val(user.travelDistance);
      $("input[name=email]").val(user.email);
      $("input[name=phoneNumber]").val(user.phoneNumber);
    });
  }

<<<<<<< HEAD
  $('.register').html('\n    <p class="jointoday">\n    ' + message + '\n    </p>\n  <form method="' + method + '" action="' + formAction + '">\n\n\n    <div class="form-group">\n\n      <input class="form-control" name="username" placeholder="Username">\n    </div>\n    <div class="form-group">\n\n      <input class="form-control" name="fullname" placeholder="Full Name">\n    </div>\n    <div class="form-group">\n      <input class="form-control" name="image" placeholder="Image">\n    </div>\n    <div class="form-group">\n      <input class="form-control" name="postcode" placeholder="Postcode">\n    </div>\n    <div class="form-group">\n      <select class="form-control" id="skill_level">\n        <option>Absolute Novice</option>\n        <option>Beginner</option>\n        <option>Intermediate</option>\n        <option>Advanced</option>\n        <option>Total Pro</option>\n      </select>\n    </div>\n    <div class="form-group">\n      <input class="form-control" name="availability" placeholder="Availability">\n    </div>\n    <div class="form-group">\n      <select class="form-control" id="ageRange">\n        <option>Under 18</option>\n        <option>18-35</option>\n        <option>36-59</option>\n        <option>60+</option>\n      </select>\n    </div>\n    <div class="form-group">\n      <input class="form-control" name="travelDistance" placeholder="Travel Distance">\n    </div>\n    <div class="form-group">\n      <input class="form-control" name="email" placeholder="Email">\n    </div>\n    <div class="form-group">\n      <input class="form-control" name="phoneNumber" placeholder="Phone Number">\n    </div>\n\n      <div class="form-group">\n      <input class="form-control" type="password" name="password" placeholder="Password" id="password">\n    </div>\n    <div class="form-group">\n      <input class="form-control" type="password" name="passwordConfirmation" placeholder="Password Confirmation" id="confPassword">\n    </div><button class="btn btn-primary regButton">' + button + '</button>\n      </form>');
=======
  $('.register').html('\n    <p class="jointoday">\n    ' + message + '\n    </p>\n  <form method="' + method + '" action="' + formAction + '">\n\n <input type="hidden" name="lat">   <input type="hidden" name="lng">\n    <div class="form-group">\n      <input class="form-control" name="username" placeholder="Username">\n      <small class="error">Some error message</small>\n    </div>\n    <div class="form-group">\n\n      <input class="form-control" name="fullname" placeholder="Full Name">\n    </div>\n    <div class="form-group">\n      <input class="form-control" name="image" placeholder="Image">\n    </div>\n    <div class="form-group">\n      <input class="form-control" name="postcode" placeholder="Postcode">\n    </div>\n    <div class="form-group">\n      <select class="form-control" id="skill_level">\n        <option>Absolute Novice</option>\n        <option>Beginner</option>\n        <option>Intermediate</option>\n        <option>Advanced</option>\n        <option>Total Pro</option>\n      </select>\n    </div>\n    <div class="form-group">\n      <input class="form-control" name="availability" placeholder="Availability">\n    </div>\n    <div class="form-group">\n      <select class="form-control" id="ageRange">\n        <option>Under 18</option>\n        <option>18-35</option>\n        <option>36-59</option>\n        <option>60+</option>\n      </select>\n    </div>\n    <div class="form-group">\n      <input class="form-control" name="travelDistance" placeholder="Travel Distance">\n      <small class="error"></small>\n    </div>\n    <div class="form-group">\n      <input class="form-control" name="email" placeholder="Email">\n        <small class="error"></small>\n    </div>\n    <div class="form-group">\n      <input class="form-control" name="phoneNumber" placeholder="Phone Number">\n    </div>\n\n      <div class="form-group">\n      <input class="form-control" type="password" name="password" placeholder="Password">\n      <small class="error"></small>\n    </div>\n    <div class="form-group">\n      <input class="form-control" type="password" name="passwordConfirmation" placeholder="Password Confirmation">\n    </div><button class="btn btn-primary regButton">' + button + '</button>\n      </form>');
>>>>>>> development
};