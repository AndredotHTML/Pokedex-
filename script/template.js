let currentPokeData = null;


function getPokemonCardsTemplate(pokeData) {
    let firstType = pokeData.types[0].type.name;
    let secondType = null;

    if (pokeData.types.length > 1) {
        secondType = pokeData.types[1].type.name;
    }

    return `<div class="pokemon_card ${firstType}" data-pokemon='${JSON.stringify(pokeData)}' onclick="handleCardClick(this), toggleOverlay()"> 
        <h2>${pokeData.name}</h2> 
        <div class="pokemon_card_container">
        <img class="pokemon_sprite" src="${pokeData.sprites.other["official-artwork"].front_default}" alt="${pokeData.name}">
        <div class="type_container"> <div> <img class="type_img" src="/assets/${firstType}.png" alt="${firstType}"></div>
    ${secondType ? `
        <div> 
            <img class="type_img" src="/assets/${secondType}.png" alt="${secondType}">
        </div>` : ""}
        </div>
        </div>
    </div>`;
}


function getDetailedCardTemplate(pokeData) {
    return `<div class="detailed_card">
            <div class="close-detailed-card"> <div class="close" onclick="closeDetailedCard()">&times;</div> </div>
            <div class="top_bar"><h2>${pokeData.name}</h2></div>
            <div class="pkm_img"><img class="detailed_pokemon_sprite" src="${pokeData.sprites.other["official-artwork"].front_default}" alt="${pokeData.name}"></div>
            <button class="nav-button left" onclick="showPreviousPokemon()">&#9665;</button>
            <button class="nav-button right" onclick="showNextPokemon()">&#9655;</button>
            <div class="tab-bar"> 
            <div class="tabs active" onclick="switchTabTemplate('stats', this)"><p>Stats</p></div> 
            <div class="tabs" id="details" onclick="switchTabTemplate('details', this)"><p>Details</p></div> 
            <div class="tabs" onclick="switchTabTemplate('shiny', this)"><p>Shiny</p></div></div>
            <div class="detailed_card_content" id="detailedContent">
        </div>
    `;
}


function switchTabTemplate(tab, element) {
    const contentRef = document.getElementById("detailedContent");
    let firstType = currentPokeData.types[0].type.name;
    let secondType = null;

    if (currentPokeData.types.length > 1) {
        secondType = currentPokeData.types[1].type.name;
    }

    if (!currentPokeData) return;

    document.querySelectorAll(".tabs").forEach(tab => tab.classList.remove("active"));

    element.classList.add("active");

    if (tab === "stats") {
        contentRef.innerHTML = `
            <div class="stats-container">
                ${currentPokeData.stats.map(stat => `
                    <div class="stat">
                        <div class="stat-name-container"><p class="stat-name">${stat.stat.name}:<p></div> <div class="stat-value"><p>${stat.base_stat}</p></div>
                        <div class="stat-bar">
                            <div class="stat-fill" style="width: ${stat.base_stat / 2}%; background-color: ${getStatColor(stat.stat.name)};"></div>
                        </div>
                    </div>
                `).join("")}
            </div>
        `;
    } else if (tab === "details") {
        contentRef.innerHTML = `
            <div class="details-container">
            <div class="details-content"> <p>Gewicht:</p> <p class="details-value">${(currentPokeData.weight / 10).toFixed(1)} kg</p> </div>
            <div class="details-content"> <p>Größe:</p> <p class="details-value">${(currentPokeData.height / 10).toFixed(1)} m</p> </div>
            <div class="details-content"> <p>Basis-Erfahrung:</p> <p class="details-value">${currentPokeData.base_experience} exp</p> </div>
            <div class="details-content"> <p>Type:</p> <div class="detail-types"> <p>${firstType} </p>
            ${secondType ? `<p>/${secondType}</p></div>` : ""}
            </div>
            </div>
        `;
    } else if (tab === "shiny") {
        contentRef.innerHTML = `
            <div class="shiny-container">
                <img class="shiny-pkmn-sprite" src="${currentPokeData.sprites.other["official-artwork"].front_shiny}" alt="${currentPokeData.name} shiny">
            </div>
        `;
    }
}

