$(document).ready(function(){
    $('.modal').modal();
    checkForLogin()
})
//localStorage.length > 0 ? console.log(localStorage) : console.log('no local storage');

let loggedIn ;
let user ;




$('#logout').on('click', handleLogout);
$('#signupform').on('submit', submitSignup)
$('#loginform').on('submit', submitLogin)

function checkForLogin(){
    if(localStorage.length > 0){
        $('#login, #signup').addClass('hide')
        $('#logout').removeClass('hide')
        let jwt = localStorage.token
        $.ajax({
            type: "POST", //GET, POST, PUT
            url: '/verify',  
            beforeSend: function (xhr) {   
                xhr.setRequestHeader("Authorization", 'Bearer '+ localStorage.token);
            }
        }).done(function (response) {
           // console.log(response)
            user = { email: response.email, _id: response._id }
            //console.log("you can access variable user: " , user)
        }).fail(function (err) {
                //console.log(err);
        });
    }else{
        $('#login, #signup').removeClass('hide')
        $('#logout').addClass('hide')
    }
}
  function handleLogout(e) {
    console.log("LOGGED OUT")
    delete localStorage.token;
    user = null;
    
    }
  
  function submitSignup(e){
    e.preventDefault();
    let userData = $(this).serialize()
    $.ajax({
      method: "POST",
      url: "/user/signup",
      data: userData,
      error: function signupError(e1,e2,e3) {
        //console.log(e1);
        // console.log(e2);
        // console.log(e3);
      },
      success: function signupSuccess(json) {
       // console.log(json);
        user = {email: json.result.email, _id: json.result._id}
        localStorage.token = json.signedJwt;
       
  
      }
  
    })
  }
  
  function submitLogin(e){
    e.preventDefault();
    
    let userData = $(this).serialize()
   // console.log("LOGIN: ", userData)
    $.ajax({
      method: "POST",
      url: "/user/login",
      data: userData,
    }).done(function signupSuccess(json) {
     // console.log("LOG IN SUCCESSFUL")
      //console.log(json);
      localStorage.token = json.token;
      window.location.replace("/");
    checkForLogin();
    }).fail(function signupError(e1,e2,e3) {
     // console.log(e2);
    })
  }

function getBeer(data){
    $.ajax({
        method: "GET",
        url: `https://api.punkapi.com/v2/beers/random`,
        contentType: "application/json",
        data: data,
        dataType: "json",
        success: updateUserSuccess,
        error: updateUserError
      });
      function updateUserSuccess(data) {
        //console.log(data);

        $('#beer').append(`
        <div class="row">
            <div class="col s12 m7 l3">
            <div class="card">
                <div class="card-image">
                <img src="${data[0].image_url}" alt="image unavailavle>
                <span class="card-title">Card Title</span>
                </div>
                <div class="card-content">
                <p>${data[0].description}</p>
                </div>
                <div class="card-action">
                <a href="#">This is a link</a>
                </div>
            </div>
            </div>
        </div>`)
      }
      function updateUserError() {
       // console.log("error");
      }
}

getBeer()