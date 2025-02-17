let offset = 0;
const limit = 20;
let isLoading = false;
let searchTimeout;
let currentPokemonIndex = 0;  
let loadedPokemonList = []; 

function init() {
    fetchPokemon()
}


async function fetchPokemon(offset) {
    if (isLoading) return;
    isLoading = true;

    document.getElementById("loading-screen").style.display = "flex";
    document.getElementById("content").style.display = "none";
    document.getElementById("controls").style.display = "none";

    const response = await fetch(`https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`);
    const data = await response.json();

    await renderPokemonCardsTemplate(data.results);

    document.getElementById("loading-screen").style.display = "none";
    document.getElementById("content").style.display = "grid";
    document.getElementById("controls").style.display = "flex";

    isLoading = false;
}


async function renderPokemonCardsTemplate(pokemonList) {
    let contentRef = document.getElementById("content");
    contentRef.innerHTML = "";  // Leert den Inhalt
    loadedPokemonList = [];  // Setzt die Liste zurück

    for (let Index = 0; Index < pokemonList.length; Index++) {
        let pokemon = pokemonList[Index];
        let response = await fetch(pokemon.url);
        let pokeData = await response.json();
        loadedPokemonList.push(pokeData); // Speichert die Pokémon-Daten

        contentRef.innerHTML += getPokemonCardsTemplate(pokeData);
    }
}


async function renderDetailedCard(pokeData) {
    let contentRef = document.getElementById("detailed_content");
    currentPokeData = pokeData;
    
    // Finde den Index des aktuellen Pokémon in der geladenen Liste
    currentPokemonIndex = loadedPokemonList.findIndex(p => p.id === pokeData.id);

    contentRef.innerHTML = getDetailedCardTemplate(pokeData);
    
    // Setze standardmäßig den Tab auf "stats"
    switchTabTemplate("stats", document.querySelector(".tabs"));

    document.getElementById("detailed_content").classList.remove("d_none");
}


function handleCardClick(element) {
    let pokeData = JSON.parse(element.getAttribute("data-pokemon"));
    renderDetailedCard(pokeData);    
}


function loadPrev() {
    if (offset > 0 && !isLoading) {
        offset -= limit;
        fetchPokemon(offset);
    }
}


function loadNext() {
    if (!isLoading) {
        offset += limit;
        fetchPokemon(offset);
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
            .filter(pokemon => pokemon.name.includes(query))
            .slice(0, limit); 
        
        renderPokemonCardsTemplate(filteredPokemon);

        document.getElementById("loading-screen").style.display = "none";
        document.getElementById("content").style.display = "grid";
    }, 300); 
    
}


function showNextPokemon() {
    currentPokemonIndex++;

    // Wenn wir über das letzte Pokémon hinaus sind, springe zurück zum ersten
    if (currentPokemonIndex >= loadedPokemonList.length) {
        currentPokemonIndex = 0;
    }

    renderDetailedCard(loadedPokemonList[currentPokemonIndex]);
}


function showPreviousPokemon() {
    currentPokemonIndex--;

    // Wenn wir unter das erste Pokémon gehen, springe zum letzten
    if (currentPokemonIndex < 0) {
        currentPokemonIndex = loadedPokemonList.length - 1;
    }

    renderDetailedCard(loadedPokemonList[currentPokemonIndex]);
}