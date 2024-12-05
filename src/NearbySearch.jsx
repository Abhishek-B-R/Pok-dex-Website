import pokeData from "../pokemon.json";
import Fuse from "fuse.js";

const regionMapping = [
    { name: "Kanto", start: 1, end: 151 },
    { name: "Johto", start: 152, end: 251 },
    { name: "Hoenn", start: 252, end: 386 },
    { name: "Sinnoh", start: 387, end: 494 },
    { name: "Unova", start: 495, end: 649 },
    { name: "Kalos", start: 650, end: 721 },
    { name: "Alola", start: 722, end: 809 },
    { name: "Galar", start: 810, end: 905 },
    { name: "Paldea", start: 906, end: 1025 },
    { name: "Others", start: 1026, end: 1305 },
];

const getRegionById = (id) => {
    const region = regionMapping.find((region) => id >= region.start && id <= region.end);
    return region ? region.name : "Unknown";
};

function NearbySearch({ start, end, search }) {
    const options = {
        keys: ["name"],
        threshold: 0.3,
        minMatchCharLength: 2,
    };

    const fuse = new Fuse(pokeData, options);

    const filteredPokemon = pokeData.filter(
        (pokemon) => pokemon.id >= start && pokemon.id <= end
    );

    const searchPokemon = (query) => {
        if (!query) return filteredPokemon; 
        return fuse.search(query).map((result) => result.item);
    };

    const query = search; 
    const results = searchPokemon(query);
    // console.log(results)

    if(search===null){
        return <></>
    }
    return (
        <div>
            {results.length===0?<h1>No such Pokémon</h1>:<h1>Nearby Pokémon Search Results:</h1>}
            <br/>
            {results.map((pokemon) => (
                <h2 key={pokemon.id} className="nearby-search" style={{textTransform:"capitalize"}}>
                    {pokemon.name} : ({getRegionById(pokemon.id)})
                </h2>
            ))}
        </div>
    );
}

export default NearbySearch;
