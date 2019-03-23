$(document).ready(function(){
    console.log("reading mybeer.js");
    isLoggedIn()
})
function isLoggedIn() {
    if(localStorage.length === 0){
        $('#logInReminder').toggleClass('hide')
        
    }
    else{
        getMyBeers()
    }
}

let myBeers = [];
function getMyBeers(){
    let userId = localStorage.userId;
    $.ajax({
        type: "GET",
        url: `/user/${userId}/savedbeers`,
        success: getBeerSuccess,
        error: function getBeersError(e1,e2,e3) {
            console.log(e1);
            console.log(e2);
            console.log(e3);
          }
    });
    function getBeerSuccess(result) {
        myBeers = result.result.savedBeers
      
        populate(myBeers)
    }
    
}

function populate(myBeers){
   
    myBeers.forEach(beerId => {
        $.ajax({
            method: "GET",
            url: `https://api.punkapi.com/v2/beers/${beerId}`,
            contentType: "application/json",
            dataType: "json",
            success: myBeerSuccess,
            error: function myBeersError(e1,e2,e3) {
                console.log(e1);
                console.log(e2);
                console.log(e3);
              }
          });
        function myBeerSuccess(data){
        let beer = data[0]
        
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
                </div>`
            $('#myBeer').append(card)
        }
        
    
    
})}

