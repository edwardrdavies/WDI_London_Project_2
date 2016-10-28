$(() => {
  // assign variables that will be used throughout.
  let $main = $('main');

  //event handlers go here
  $('.register').on('click', showRegisterForm);
  $('.login').on('click', showLoginForm);
  $('.logout').on('click', logout);
  $('.map').on('click', getUsers);
  $('.clubs').on('click', getVenues);
  $main.on('submit', 'form', handleForm);


  //handles the registration form
  function handleForm(e){
    e.preventDefault();
    let token = localStorage.getItem('token');
    let $form = $(this);
    let url = $form.attr('action');
    let method = $form.attr('method');
    let data = $form.serialize();
    $.ajax({
      url,
      method,
      data,
      beforeSend: function(jqXHR) {
        if(token) return jqXHR.setRequestHeader('Authorization',`Bearer ${token}`);
      }
    })
    .done((data) => {
      if (data && data.token){
        localStorage.setItem('token', data.token);
        isLoggedInDisplay();
      }
      getUsers();
    });
  }

  // shows the registration form
  function showRegisterForm() {
    if (event) event.preventDefault();
    $main.html(`
      <h2>Register</h2>
      <form method="post" action="/api/register">
      <div class="form-group">
      <input class="form-control" name="username" placeholder="Username">
      </div>
      <div class="form-group">
      <input class="form-control" name="email" placeholder="Email">
      </div>
      <div class="form-group">
      <input class="form-control" type="password" name="password" placeholder="Password">
      </div>
      <div class="form-group">
      <input class="form-control" type="password" name="passwordConfirmation" placeholder="Password Confirmation">
      </div>
      <button class="btn btn-primary">Register</button>
      </form>
      `);
    }

    // shows the login form.
    function showLoginForm() {
      if (event) event.preventDefault();
      $main.html(`
        <h2>Login</h2>
        <form method="post" action="/api/login">
        <div class="form-group">
        <input class="form-control" name="email" placeholder="Email">
        </div>
        <div class="form-group">
        <input class="form-control" type="password" name="password" placeholder="Password">
        </div>
        <button class="btn btn-primary">Register</button>
        </form>
        `);
      }

 // get users sends the GET to the API server to get all users
      function getUsers(){
        if (event) event.preventDefault();
        let token = localStorage.getItem('token');
        $.ajax({
          url: '/api/users',
          method:'GET',
          beforeSend: function(jqXHR) {
            if(token) return jqXHR.setRequestHeader('Authorization',`Bearer ${token}`);
          }
        })
        .done((users)=> {
          showUsers(users);
          isLoggedInDisplay();
        });
      }

// runs a loop on data returned by getUsers to output the user list.
      function showUsers(users) {
        if (event) event.preventDefault();
        let $row = $('<div class="row"></div>');
        users.forEach((user) => {
          $row.append(`
            <div class="col-md-4">
            <div class="card">
            <img class="card-img-top" src="http://fillmurray.com/300/300" alt="Card image cap">
            <div class="card-block">
            <h4 class="card-title">${user.username}</h4>
            <p class="card-text">This is a longer card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.</p>
            <p class="card-text"><small class="text-muted">Last updated 3 mins ago</small></p>
            <div id="${user._id}" class="button-container">
            <form action="/api/users/${user._id}" method="DELETE">
            <button class="btn btn-danger">DELETE</button>
            </form>
            <form></form>
            </div>
            </div>
            </div>
            </div>
            `);
          });
          $main.html($row);
        }

// checks if user is logged in by checking for token
      function isLoggedIn(){
        return !!localStorage.getItem('token');
      }
      if(isLoggedIn()) {
        getUsers();
        isLoggedInDisplay();
      } else {
        showLoginForm();
        isLoggedOutDisplay();
      }
      function isLoggedInDisplay(){
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
        function getVenues(){
          if (event) event.preventDefault();
          let token = localStorage.getItem('token');
          $.ajax({
            url: '/api/venue',
            method:'GET',
            beforeSend: function(jqXHR) {
              if(token) return jqXHR.setRequestHeader('Authorization',`Bearer ${token}`);
            }
          })
          .done((venues)=> {
          showVenues(venues);
            isLoggedInDisplay();
          });
        }

// adds HTML for venue list
        function showVenues(venues) {
          if (event) event.preventDefault();
          let $row = $('<div class="row"></div>');
          venues.forEach((venue) => {
            $row.append(`
              <div class="col-md-4">
              <div class="card">
              <img class="card-img-top" src="${venue.image}" alt="Card image cap">
              <div class="card-block">
              <h4 class="card-title">${venue.venueName}</h4>
              <p class="card-text">${venue.description}</p>
              <p class="card-text"><small class="text-muted">${venue.address}</small></p>
              <p class="card-text"><small class="text-muted">${venue.url}</small></p>

              </div>
              </div>
              </div>
              </div>
              `);
            });
            $main.html($row);
          }

        function logout(){
          if(event) event.preventDefault();
          localStorage.removeItem('token');
          showLoginForm();
          isLoggedOutDisplay();
        }




      });
