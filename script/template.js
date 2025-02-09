function getPokemonCardsTemplate(pokeData) {
    let firstType = pokeData.types[0].type.name;
    let secondType = null;

    if (pokeData.types.length > 1) {
        secondType = pokeData.types[1].type.name;
    }

    return `<div class="pokemon_card ${firstType}"> <h2>${pokeData.name}</h2> 
        <img class="pokemon_sprite" src="${pokeData.sprites.front_default}" alt="${pokeData.name}">
        <div class="type_container"><div> <img class="type_img" src="/assets/${firstType}.png" alt="${firstType}"></div>
    ${secondType ? `
        <div class="type_container"> 
            <img class="type_img" src="/assets/${secondType}.png" alt="${secondType}">
        </div>` : ""}
        </div>
    </div>`;
}

