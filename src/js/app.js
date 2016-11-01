$(() => {

  // assign variables that will be used throughout.
  let $main = $('main');

  //event handlers go here
  // $('.register').on('click', showRegisterForm);
  // $('.login').on('click', showLoginForm);
  $('.logout').on('click', logout);
  $('.edit').on('click', showEditBar);
  // $('.map').on('click', getUsers);
  // $('.clubs').on('click', getVenues);
  // $main.on('click', '.userPage', getUser);
  // $main.on('click', '.venuePage', getVenue);
  $('body').on('submit', 'form', handleForm);
  let geocoder = new google.maps.Geocoder();

  //handles the registration form
  //handles the registration form
  function handleForm(e){
    console.log("form clicked");
    e.preventDefault();
    let $form = $(this);


    if($form.attr('action') === '/register') {
      let postcode = $form.find('[name=postcode]').val();
      geocoder.geocode({ address: `${postcode}, UK` }, (results, status) => {
        if(status == google.maps.GeocoderStatus.OK) {
          $form.find('[name=lat]').val(results[0].geometry.location.lat());
          $form.find('[name=lng]').val(results[0].geometry.location.lng());
          sendFormData($form);
        }

      });
    }
    else {
      sendFormData($form);
    }
  }

  function sendFormData($form) {
    let url = $form.attr('action');
    let method = $form.attr('method');
    let data = $form.serialize();
    let token = localStorage.getItem('token');

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
        if (window.location.pathname === "/") {
       window.location.replace("/members");
     }
     showMembersPage();
      }

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
      <button class="btn btn-primary" type="submit">Login</button>
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


        function logout(){
          if(event) event.preventDefault();
          localStorage.removeItem('token');
          showLoginForm();
          $('.loggedIn').toggle();
        }

        // display users if loggedin - users if not.

        const showMembersPage = () => {

          if ( isLoggedIn() ) {
            $main.empty();
            listUsers();
            $('.loggedIn').show();
          } else {
            showLoginForm();
            showRegForm();
          }};

          showMembersPage();

        });

        const showEditBar = () => {
          console.log('clicked');
          $('.editBar').slideToggle( "slow", function() {
            // Animation complete.
          });
        };

const showRegForm =() => {
  $('.register').html(`
    <p class="jointoday">
      Join the community today!
    </p>
  <form method="post" action="/register">

    <input type="hidden" name="lat">
    <input type="hidden" name="lng">

    <div class="form-group">

      <input class="form-control" name="username" placeholder="Username">
    </div>
    <div class="form-group">

      <input class="form-control" name="fullname" placeholder="Full Name">
    </div>
    <div class="form-group">
      <input class="form-control" name="image" placeholder="Image">
    </div>
    <div class="form-group">
      <input class="form-control" name="postcode" placeholder="Postcode">
    </div>
    <div class="form-group">
      <select class="form-control" id="skill_level">
        <option>Absolute Novice</option>
        <option>Beginner</option>
        <option>Intermediate</option>
        <option>Advanced</option>
        <option>Total Pro</option>
      </select>
    </div>
    <div class="form-group">
      <input class="form-control" name="availability" placeholder="Availability">
    </div>
    <div class="form-group">
      <select class="form-control" id="ageRange">
        <option>Under 18</option>
        <option>18-35</option>
        <option>35-59</option>
      </select>
    </div>
    <div class="form-group">
      <input class="form-control" name="travel_distance" placeholder="Travel Distance">
    </div>
    <div class="form-group">
      <input class="form-control" name="email" placeholder="Email">
    </div>
    <div class="form-group">
      <input class="form-control" name="phone_number" placeholder="Phone Number">
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
};
