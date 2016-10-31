$(() => {
  let $main = $('main');

    $('.register').on('click', showRegisterForm);
    $('.login').on('click', showLoginForm);
    $('.logout').on('click', logout);
    $('.sausage').on('click', getUsers);
    $main.on('submit', 'form', handleForm);

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

    function showRegisterForm() {
  if(event) event.preventDefault();
  $main.html(`
    <h2>Register Here</h2>
      <form method="post" action="/register">
      <div class="form-group">
      <input class="form-control" name="username" placeholder="HELLLLOOOOO">
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



    function showLoginForm() {
        if (event) event.preventDefault();
        $main.html(`
        <h2>Login</h2>
        <form method="post" action="/login">
            <div class="form-group">
                <input class="form-control" name="username" placeholder="Username">
            </div>
            <div class="form-group">
                <input class="form-control" type="password" name="password" placeholder="Password">
            </div>
            <button class="btn btn-primary">Login</button>
        </form>
        `);
    }
    function getUsers(){
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
        isLoggedInDisplay();
      });
    }
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
                          <form action="/users/${user._id}" method="DELETE">
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
    function logout(){
      if(event) event.preventDefault();
      localStorage.removeItem('token');
      showLoginForm();
      isLoggedOutDisplay();
    }


});
