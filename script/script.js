let offset = 0;
const limit = 8;


function init() {
    fetchPokemon()
}


async function fetchPokemon(offset) {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`);
    const data = await response.json();
    
    renderPokemonCardsTemplate(data.results);
}


async function renderPokemonCardsTemplate(pokemonList) {
    let contentRef = document.getElementById("content");
    contentRef.innerHTML = " ";
    for (let Index = 0; Index < pokemonList.length; Index++) {
        let pokemon = pokemonList[Index];
        let response = await fetch(pokemon.url);
        let pokeData = await response.json();

        contentRef.innerHTML += getPokemonCardsTemplate(pokeData, Index);
    };
}


function loadPrev() {
    if (offset > 0) {
        offset -= limit;
        fetchPokemon(offset);
    }
}

function loadNext() {
    offset += limit;
    fetchPokemon(offset);
}