$(() => {


  // assign variables that will be used throughout.
  let $main = $('.container');

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
  function handleForm(e){
    console.log("form clicked");
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
      console.log("the done form action has been working");
      if (data && data.token){
        console.log(data,data.token,"ready to set token");
        localStorage.setItem('token', data.token);
      }
      listUsers();
    });
  }



  // shows the login form.
  function showLoginForm() {

    if (event) event.preventDefault();
    $main.html(`

      <h2 class="form-signin-heading">Login</h2>
      <form method="post" action="/login">
    <div class="form-group">
      <input class="form-control" name="email" placeholder="Email">
      </div>
      <div class="form-group">
      <input class="form-control" type="password" name="password" placeholder="Password">
      </div>
      <button class="btn btn-primary" type="submit">Register</button>
      </form>
      `);
    }

    // get users sends the GET to the API server to get all users
    function listUsers(){
      if (event) event.preventDefault();
      let token = localStorage.getItem('token');

      $.ajax({
        url: '/users',
        method:'GET',
        beforeSend: function(jqXHR) {
          if(token) return jqXHR.setRequestHeader('Authorization',`Bearer ${token}`);
        }
      })
      .done((users)=> {

        showUsers(users);
        // isLoggedInDisplay();


      });

    }





    // runs a loop on data returned by getUsers to output the user list.
    function showUsers(users) {
      if (event) event.preventDefault();

      users.forEach((user) => {
        $main.append(`
          <div class="col-md-4">
          <div class="card">
          <img class="card-img-top" src="http://fillmurray.com/300/300" alt="Card image cap">
          <div class="card-block">
          <h4 class="card-title">${user.username}</h4>
          <p class="card-text">This is a longer card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.</p>
          <p class="card-text"><small class="text-muted">Last updated 3 mins ago</small></p>

          <button class="userPage" data-id="${user._id}">See More</button>
          </div>
          </div>

          </div>
          </div>


          </form>
          `);
        });
      }


      function getUser(userID){

        if (event) {
          event.preventDefault();

        }
        let id = $(event.target).data('id');
        let token = localStorage.getItem('token');
        $.ajax({
          url: `/api/user/${id}`,
          method:'GET',
          beforeSend: function(jqXHR) {
            if(token) return jqXHR.setRequestHeader('Authorization',`Bearer ${token}`);
          }
        })
        .done((user)=> {
          // needs to be edited so that it places the data where it's meant to go!
          $main.prepend(`
            <div class="col-md-4">
            <div class="card">
            <img class="card-img-top" src="${user.image}" alt="Card image cap">
            <div class="card-block">
            <h4 class="card-title">${user.username}</h4>
            <p class="card-text">blah</p>
            <p class="card-text"><small class="text-muted">blah</small></p>
            <p class="card-text"><small class="text-muted">blah</small></p>
            <button class="venuePage" data-id="${user._id}">See More</button>
            </div>
            </div>
            </div>
            </div>
            `);



            console.log(venue);
            isLoggedInDisplay();
          });
        }

isLoggedIn();
        // checks if user is logged in by checking for token
        function isLoggedIn(){

          return !!localStorage.getItem('token');

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
              <button class="venuePage" data-id="${venue._id}">See More</button>
              </div>
              </div>
              </div>
              </div>
              `);
            });
            $main.html($row);
          }

          // get One Venue, needs to be edited to display in relevant part of the page.
          function getVenue(venueID){

            if (event) {
              event.preventDefault();

            }
            let id = $(event.target).data('id');
            let token = localStorage.getItem('token');
            $.ajax({
              url: `/api/venue/${id}`,
              method:'GET',
              beforeSend: function(jqXHR) {
                if(token) return jqXHR.setRequestHeader('Authorization',`Bearer ${token}`);
              }
            })
            .done((venue)=> {
              // needs to be edited so that it places the data where it's meant to go!
              $main.prepend(`
                <div class="col-md-4">
                <div class="card">

                <img class="card-img-top" src="${venue.image}" alt="Card image cap">
                <div class="card-block">
                <h4 class="card-title">${venue.venueName}</h4>
                <p class="card-text">${venue.description}</p>
                <p class="card-text"><small class="text-muted">${venue.address}</small></p>
                <p class="card-text"><small class="text-muted">${venue.url}</small></p>
                <button class="venuePage" data-id="${venue._id}">See More</button>

                </div>
                </div>
                </div>
                </div>
                `);





              });
            }


            function logout(){
              if(event) event.preventDefault();
              localStorage.removeItem('token');
              showLoginForm();

            }

            // display users if loggedin - users if not.
    if ( isLoggedIn() ) {
      $main.empty();
      listUsers();
    } else {
    showLoginForm();
  }
});
