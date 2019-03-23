function getRandom(data){
    $.ajax({
        method: "GET",
        url: `https://api.punkapi.com/v2/beers/random`,
        contentType: "application/json",
        data: data,
        dataType: "json",
        success: updateBeerSuccess,
        error: updateBeerError
      });
      function updateBeerSuccess(data) {
        let beer = data[0]
        console.log(beer);
        if(beer.image_url){
            if(!beer.image_url.includes('keg')){
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
            $('#randomBeer').append(card)
            }
            else{
                getRandom()
            }
        }
            
            
        };

        
      
      function updateBeerError() {
       // console.log("error");
      }
}

getRandom()