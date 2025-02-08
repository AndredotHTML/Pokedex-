const BASE_URL = "https://pokeapi.co/api/v2/pokemon"


async function pushToArray() {
    
    let apiResponse = await getPokemonIds("")

    let apiKeysArray = Object.keys(apiResponse)

    for (let index = 0; index < apiKeysArray.length; index++) {
        pokemonCards.push(
            {
                id : apiKeysArray[index],
                value : apiResponse[apiKeysArray[index]],
            }
        )
        
    }
}


async function getPokemonIds(path) {
    let response = await fetch(BASE_URL + path);

    return responseToJson = await response.json()
}