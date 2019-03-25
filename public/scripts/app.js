$(document).ready(function(){
    $('.modal').modal();
    checkForLogin()
    
})
if(window.location.pathname === '/'){
    getBeer()
}
//localStorage.length > 0 ? console.log(localStorage) : console.log('no local storage');

let loggedIn ;
let user ;

$('#logout').on('click', handleLogout);
$('#signupform').on('submit', submitSignup)
$('#loginform').on('submit', submitLogin)
$('#beer').on('click','.addBeer', addBeer)


function addBeer() {
    let beerId = this.id
    let userId= localStorage.userId
    console.log(beerId);
    $.ajax({
        type: "PUT",
        url: `/user/${userId}/${beerId}`,
        success: addBeerSuccess,
        error: addBeerError
    });
    function addBeerSuccess() {
        console.log("added");
    }
    function addBeerError() {
        console.log("error");    
}
}
function checkForLogin(){
    if(localStorage.length > 0){
        $('#login, #signup').addClass('hide')
        $('#logout').removeClass('hide')
        let jwt = localStorage.token
        $.ajax({
            type: "POST",
            url: '/verify',  
            beforeSend: function (xhr) {   
                xhr.setRequestHeader("Authorization", 'Bearer '+ jwt);
            }
        }).done(function (response) {
            if(response.result != null){
                response = response.result
            }
            localStorage.userId = response._id
            user = { email: response.email, _id: response._id }
            //console.log("you can access variable user: " , user)
        }).fail(function (err) {
            console.log(err);
        });
    }else{
        $('#login, #signup').removeClass('hide')
        $('#logout').addClass('hide')
    }
}
  function handleLogout(e) {
    console.log("LOGGED OUT")
    localStorage.clear()
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
        console.log(e1);
        console.log(e2);
         console.log(e3);
      },
      success: function signupSuccess(json) {
       console.log(json);
        user = {email: json.result.email, _id: json.result._id}
        localStorage.token = json.signedJwt;
        window.location.replace("/");
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
        url: `https://api.punkapi.com/v2/beers?page1&per_page=25`,
        contentType: "application/json",
        data: data,
        dataType: "json",
        success: updateBeerSuccess,
        error: updateBeerError
      });
      function updateBeerSuccess(data) {
        let beers = data
        console.log(beers);
        beers.forEach(beer => {
            if(!beer.image_url.includes('keg') && beer.image_url){
                let card = `
                <div class="col s12 l7">
                        <div class="card">
                            <div class="row">
                                <div class="col s2">
                                    <div class="card-image waves-effect waves-block waves-light">
                                        <img class="activator" src="${beer.image_url}">
                                    </div>
                                </div>
                                <div class="col s10">
                                    <div class="card-content">
                                    
                                        <span class="card-title activator grey-text text-darken-4"> ${beer.name} - <span class="tagline">${beer.tagline}</span><i class="material-icons right">more_vert</i></span>
                                        <p class="flow-text">${beer.description}</p>
                                        <a id=${beer.id} class="btn-floating addBeer right btn-small waves-effect waves-light red"><i class="material-icons">add</i></a>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="card-reveal">
            <span class="card-title grey-text text-darken-4">${beer.name}<i class="material-icons right">close</i></span>
                                <div class="row">
                                    <div class="col s2">
                                        <div class="card-image waves-effect waves-block waves-light">
                                            <img class="activator" src="${beer.image_url}">
                                        </div>
                                    </div>
                                    <div class="col s3">
                                        <h5>Brewers Tips</h5>
                                        <p>${beer.brewers_tips}</p>
                                    </div>
                                    <div class="col s3">
                                        <h5>Food Pairings</h5>
                                        <ul class="pairings">
                                            ${beer.food_pairing.map(pair => `<li>- ${pair}</li>`).join('')}
                                        </ul>
                                    </div>
                                    <div class="col s4">
                                        <h5>Ingredients</h5>
                                        <div class="row">
                                            <div class="col s6">
                                                <h6>Malts</h6>
                                                <ul class="ingredients">
                                                    ${beer.ingredients.malt.map(malt => `<li>- ${malt.name}</li>`).join('')}
                                                </ul>
                                            </div>
                                            <div class="col s6">
                                                <h6>Hops</h6>
                                                <ul class="ingredients">
                                                    ${beer.ingredients.hops.map(hop => `<li>- ${hop.name}</li>`).join('')}
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
            
            `
            $('#beer').append(card)
            }else{
            // getBeer()
            }
            
        });

        
      }
      function updateBeerError() {
       // console.log("error");
      }
}

