'use strict';

$(function () {
  var $main = $('main');

  $('.register').on('click', showRegisterForm);
  $('.login').on('click', showLoginForm);
  $('.logout').on('click', logout);
  $('.sausage').on('click', getUsers);
  $main.on('submit', 'form', handleForm);

  function handleForm(e) {
    e.preventDefault();
    var token = localStorage.getItem('token');
    var $form = $(this);
    var url = $form.attr('action');
    var method = $form.attr('method');
    var data = $form.serialize();
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
  function showRegisterForm() {
    if (event) event.preventDefault();
    $main.html('\n      <h2>Register</h2>\n      <form method="post" action="/api/register">\n      <div class="form-group">\n      <input class="form-control" name="username" placeholder="Username">\n      </div>\n      <div class="form-group">\n      <input class="form-control" name="email" placeholder="Email">\n      </div>\n      <div class="form-group">\n      <input class="form-control" type="password" name="password" placeholder="Password">\n      </div>\n      <div class="form-group">\n      <input class="form-control" type="password" name="passwordConfirmation" placeholder="Password Confirmation">\n      </div>\n      <button class="btn btn-primary">Register</button>\n      </form>\n      ');
  }
  function showLoginForm() {
    if (event) event.preventDefault();
    $main.html('\n        <h2>Login</h2>\n        <form method="post" action="/api/login">\n        <div class="form-group">\n        <input class="form-control" name="email" placeholder="Email">\n        </div>\n        <div class="form-group">\n        <input class="form-control" type="password" name="password" placeholder="Password">\n        </div>\n        <button class="btn btn-primary">Register</button>\n        </form>\n        ');
  }
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
  function showUsers(users) {
    if (event) event.preventDefault();
    var $row = $('<div class="row"></div>');
    users.forEach(function (user) {
      $row.append('\n            <div class="col-md-4">\n            <div class="card">\n            <img class="card-img-top" src="http://fillmurray.com/300/300" alt="Card image cap">\n            <div class="card-block">\n            <h4 class="card-title">' + user.username + '</h4>\n            <p class="card-text">This is a longer card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.</p>\n            <p class="card-text"><small class="text-muted">Last updated 3 mins ago</small></p>\n            <div id="' + user._id + '" class="button-container">\n            <form action="/api/users/' + user._id + '" method="DELETE">\n            <button class="btn btn-danger">DELETE</button>\n            </form>\n            <form></form>\n            </div>\n            </div>\n            </div>\n            </div>\n            ');
    });
    $main.html($row);
  }
  function logout() {
    if (event) event.preventDefault();
    localStorage.removeItem('token');
    showLoginForm();
    isLoggedOutDisplay();
  }

  var $getDistance = function $getDistance(origin, destination) {

    $.ajax({
      url: 'https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins=' + origin + '&destinations=' + destination + '&key=AIzaSyB54_x_Vqe5uUc0eubPI6KSymlhOCJJaAM',
      method: 'GET',
      crossDomain: true

    }).done(function (data) {
      console.log(data);
    });
  };

  $getDistance("peckham", "dulwich");
});