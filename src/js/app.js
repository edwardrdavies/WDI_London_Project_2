$(() => {

  // assign variables that will be used throughout.
  let $main = $('main');
  let $map = $('#all-map');

  //event handlers go here
  $('.logout').on('click', logout);
  $('.edit').on('click', showEditBar);
  $('#skillLevel').on('change', resetUsers);
  $('body').on('submit', 'form', handleForm);
  let geocoder = new google.maps.Geocoder();

  //handles the registration form

  function resetUsers() {

    googleMap.filterMarkers($(this).val());
    // googleMap.clearOverlays();
  }

  function handleForm(e){
    console.log("form has been submitted");

    e.preventDefault();
    let $form = $(this);

    // if() {
    //   console.log(event);
    //   console.log('need logic to validate form & to remove slider ');
    //     }

    if($form.attr('action') === '/register' || $form.attr('method') === `PUT`) {
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

    console.log("Sending form data");

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
        console.log(data);
        localStorage.setItem('_id',data.user._id);
        localStorage.setItem('token', data.token);
        if (window.location.pathname === "/") {
          window.location.replace("/members");
        }
      }
      showMembersPage();
    })
    .fail((err) => {

      if (err.responseJSON.message) {
        $form.find(`small.error`).addClass('error').html(err.responseJSON.message);
        console.log(err.responseJSON.message);
      }
      else {

      for(let name in err.responseJSON) {
        console.log(name);
        console.log(err.responseJSON[name].message);
        $form.find(`[name=${name}]`).parent('.form-group').addClass('error').find('small.error').html(`<p> ${err.responseJSON[name].message} </p>`);
      }}
    });
  }


  // shows the login form.
  function showLoginForm() {

    if (event) event.preventDefault();
    $('.login').append(`
      <div class="loginForm">
      <h2 class="form-signin-heading">Login</h2>
      <form method="post" action="/login">
      <div class="form-group">
      <input class="form-control" name="email" placeholder="Email">

      </div>
      <div class="form-group">
      <input class="form-control" type="password" name="password" placeholder="Password">
      </div>
          <small class="error"></small><br>
      <button class="btn btn-primary" type="submit">Login</button>
      </form></div>
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
          localStorage.removeItem('_id');
          $map.hide();
          showLoginForm();
          $('.loggedIn').toggle();
        }

        // display users if loggedin - users if not.

        function showMembersPage() {

          if ( isLoggedIn() ) {
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

        const showEditBar = () => {
          showRegForm("edit");

          $('.editBar').slideToggle( "slow", function() {
            // Animation complete.
              $('#password').prop("hidden", true);
              $('#confPassword').prop("hidden", true);
              $("button").click(function(){
                  $(".editBar").slideUp();
              });

          });
        };

const showRegForm = (action) => {

  let token = localStorage.getItem('token');
  let _id = localStorage.getItem('_id');

  let method = "POST";
  let button = "Register";
  let message ="Join the community today!";
  let formAction ="/register";
  if (action == "edit") {
    method = "PUT";
    button = 'Update';
    formAction = `/user/${_id}`;
    message ="Update Your Profile";

  }


if (token) {

  $.ajax({
    url: `/user/${_id}`,
    method:'GET',
    beforeSend: function(jqXHR) {
      if(token) return jqXHR.setRequestHeader('Authorization',`Bearer ${token}`);
    }
  })
  .done((user)=> {

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

  $('.register').html(`
    <p class="jointoday">
    ${message}
    </p>
  <form method="${method}" action="${formAction}">

 <input type="hidden" name="lat">   <input type="hidden" name="lng">
    <div class="form-group username">
      <input class="form-control" name="username" placeholder="Username">
      <small class="error">Some error message</small>
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
      <select class="form-control" name="skillLevel">
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
      <select class="form-control" name="ageRange">
        <option>Under 18</option>
        <option>18-35</option>
        <option>36-59</option>
        <option>60+</option>
      </select>
    </div>
    <div class="form-group">
      <input class="form-control" name="travelDistance" placeholder="Travel Distance">
      <small class="error"></small>
    </div>
    <div class="form-group">
      <input class="form-control" name="email" placeholder="Email">
        <small class="error"></small>
    </div>
    <div class="form-group">
      <input class="form-control" name="phoneNumber" placeholder="Phone Number">
    </div>

      <div class="form-group">


      <input class="form-control" type="password" name="password" placeholder="Password" id="password">
      <small class="error"></small>

    </div>
    <div class="form-group">
      <input class="form-control" type="password" name="passwordConfirmation" placeholder="Password Confirmation" id="confPassword">
    </div><button class="btn btn-primary regButton">${button}</button>
      </form>`);


};
