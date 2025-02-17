let offset = 0;
const limit = 20;
let isLoading = false;
let searchTimeout;
let currentPokemonIndex = 0;  
let loadedPokemonList = []; 
let cachedPokemon = {};


function init() {
    fetchPokemon()
}


async function getPokemonData(pokemonName, pokemonUrl = null) {
    if (cachedPokemon[pokemonName]) {
        return cachedPokemon[pokemonName];
    }

    if (!pokemonUrl) {
        pokemonUrl = `https://pokeapi.co/api/v2/pokemon/${pokemonName}`;
    }

    const response = await fetch(pokemonUrl);
    const pokeData = await response.json();
    cachedPokemon[pokemonName] = pokeData; 
    
    
    return pokeData;
}


async function fetchPokemon(offset) {
    if (isLoading) return;
    isLoading = true;

    document.getElementById("loading-screen").style.display = "flex";
    document.getElementById("content").style.display = "none";
    document.getElementById("controls").style.display = "none";

    const response = await fetch(`https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`);
    const data = await response.json();

    const pokemonDetails = await Promise.all(
        data.results.map(pokemon => getPokemonData(pokemon.name, pokemon.url))
    );

    loadedPokemonList = pokemonDetails;
    await renderPokemonCardsTemplate(pokemonDetails);

    document.getElementById("loading-screen").style.display = "none";
    document.getElementById("content").style.display = "grid";
    document.getElementById("controls").style.display = "flex";

    isLoading = false;

}


async function renderPokemonCardsTemplate(pokemonList) {
    let contentRef = document.getElementById("content");
    contentRef.innerHTML = ""; 


    const pokemonDetails = await Promise.all(
        pokemonList.map(async (pokemon) => await getPokemonData(pokemon.name))
    );

    pokemonDetails.forEach(pokeData => {
        contentRef.innerHTML += getPokemonCardsTemplate(pokeData);
    });
}

async function renderDetailedCard(pokemonName) {
    let pokeData = await getPokemonData(pokemonName);

    let contentRef = document.getElementById("detailed_content");
    currentPokeData = pokeData;
    contentRef.innerHTML = getDetailedCardTemplate(pokeData);
    switchTabTemplate("stats", document.querySelector(".tabs"));
    
}


function handleCardClick(element) {
    let pokemonName = element.getAttribute("data-pokemon");
    renderDetailedCard(pokemonName);    
    document.getElementById("detailed_content").classList.toggle("d_none");
}


function loadPrev() {
    if (offset > 0 && !isLoading) {
        offset -= limit;
        fetchPokemon(offset);
    } else {
        offset = 1005;
        fetchPokemon(offset);
    }

}


function loadNext() {
    if (!isLoading && offset < 1005) {
        offset += limit;
        fetchPokemon(offset);
    } else {
        offset = 0 
        fetchPokemon(offset)
    }
}


function closeDetailedCard() {
    let refOverlay = document.getElementById('overlay');

    document.getElementById("detailed_content").classList.toggle("d_none")
    refOverlay.classList.toggle('d_none')
}


function toggleOverlay() {
    let refOverlay = document.getElementById('overlay');

    refOverlay.classList.toggle('d_none')
}


function getStatColor(statName) {
    const colors = {
        "hp": "#ff5959",
        "attack": "#f08030",
        "defense": "#f8d030",
        "special-attack": "#6890f0",
        "special-defense": "#78c850",
        "speed": "#f85888"
    };
    return colors[statName] || "#aaa";
}


function handleSearch() {
    clearTimeout(searchTimeout);
    const query = document.getElementById("search-bar").value.toLowerCase();

    if (query.length < 3) { 
        fetchPokemon(offset); 
        return; 
    }

    document.getElementById("loading-screen").style.display = "flex";
    document.getElementById("content").style.display = "none";

    searchTimeout = setTimeout(async () => {
        const response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=1025");
        const data = await response.json();
        const filteredPokemon = data.results
            .filter(pokemon => pokemon.name.startsWith(query))
            .slice(0, 8); 
        
        renderPokemonCardsTemplate(filteredPokemon);

        document.getElementById("loading-screen").style.display = "none";
        document.getElementById("content").style.display = "grid";
    }, 300); 
    
}


function showNextPokemon() {
    currentPokemonIndex++;

    if (currentPokemonIndex >= loadedPokemonList.length) {
        currentPokemonIndex = 0;
    }

    renderDetailedCard(loadedPokemonList[currentPokemonIndex].name);
}


function showPreviousPokemon() {
    currentPokemonIndex--;

    if (currentPokemonIndex < 0) {
        currentPokemonIndex = loadedPokemonList.length - 1;
    }
    console.log(loadedPokemonList[currentPokemonIndex].name);
    
    renderDetailedCard(loadedPokemonList[currentPokemonIndex].name);
}