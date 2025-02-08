let pokemonCards = []


function init() {
    pushToArray()
    console.log(pokemonCards);
    
}


function renderPokemonCardsTemplate() {
    let contentRef = document.getElementById("content");
    contentRef.innerHTML = " ";
    for (let Index = 0; Index < pokemonCards.length; Index++) {
          
        contentRef.innerHTML += getPokemonCardsTemplate(Index);  
    };
  }