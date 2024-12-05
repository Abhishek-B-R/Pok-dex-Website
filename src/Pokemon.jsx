/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect,  useState } from "react";
import PokemonCards from "./PokemonCards";
import "./index.css";
import NearbySearch from "./NearbySearch";
import ToggleSwitch from "./stylings/ToggleSwitch";
import PokemonDetails from "./PokemonDetails";

function Pokemon() {
    const [pokemon, setPokemon] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [search, setSearch] = useState("");
    const [region, setRegion] = useState("kanto");
    const [limit, setLimit] = useState(151);
    const [offset, setOffset] = useState(0);
    const [isChecked, setIsChecked] = useState(false);
    const [renderInfo, setRenderInfo] = useState(false);
    const [selectedPokemon,setSelectedPokemon]=useState(null)

    const API = `https://pokeapi.co/api/v2/pokemon?limit=${limit}&&offset=${offset}`;

    async function fetchPokemon() {
        try {
            const res = await fetch(API);
            const data = await res.json();

            const detailedPokemonData = data.results.map(async (curPokemon) => {
                const res = await fetch(curPokemon.url);
                const data = await res.json();
                return data;
            });

            const detailedResponses = await Promise.all(detailedPokemonData);
            setPokemon(detailedResponses);
            setLoading(false);
        } catch (error) {
            console.log(error);
            setError(error);
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchPokemon();
    }, [API]);

    useEffect(()=>{
        console.log(selectedPokemon)
    },[selectedPokemon])

    const searchData = pokemon.filter((curPokemon) =>
        curPokemon.name.toLowerCase().includes(search.toLowerCase())
    );

    if (loading) {
        return (
            <div>
                <h1 style={{ marginTop: "40rem" }}>loading...</h1>
            </div>
        );
    }

    if (error) {
        return (
            <div>
                <h1>Error: {error.message}</h1>
            </div>
        );
    }

    function regionSettingFunc(r) {
        if (r === region) return;
        setPokemon([]);
        setLoading(true);
        setRegion(r);
        switch (r) {
            case "kanto":
                setLimit(151);
                setOffset(0);
                break;
            case "jhoto":
                setLimit(100);
                setOffset(151);
                break;
            case "hoenn":
                setLimit(135);
                setOffset(251);
                break;
            case "sinnoh":
                setLimit(108);
                setOffset(386);
                break;
            case "unova":
                setLimit(155);
                setOffset(494);
                break;
            case "kalos":
                setLimit(72);
                setOffset(649);
                break;
            case "alola":
                setLimit(88);
                setOffset(721);
                break;
            case "galar":
                setLimit(96);
                setOffset(809);
                break;
            case "paldea":
                setLimit(120);
                setOffset(905);
                break;
            case "others":
                setLimit(280);
                setOffset(1025);
                break;
            default:
                break;
        }
    }

    return (
        <>
            <section className="container">
                {renderInfo && (
                    <div className="pokemon-overlay">
                        <div className="pokemon-card-2">
                            {/* Add the close button directly on the card */}
                            <button
                                className="close-btn"
                                onClick={() => setRenderInfo(false)}
                            >
                                &times;
                            </button>
                            <PokemonDetails id={selectedPokemon} />
                        </div>
                    </div>
                )}
                <header>
                    <h1>Let&apos;s catch Pokémon !!!</h1>
                    <div className="regions">
                        {[
                            "kanto",
                            "jhoto",
                            "hoenn",
                            "sinnoh",
                            "unova",
                            "kalos",
                            "alola",
                            "galar",
                            "paldea",
                            "others",
                        ].map((r) => (
                            <button
                                key={r}
                                onClick={() => regionSettingFunc(r)}
                                className={region === r ? "active-region" : ""}
                            >
                                {r.charAt(0).toUpperCase() + r.slice(1)}
                            </button>
                        ))}
                    </div>
                </header>
                <div className="pokemon-search">
                    <input
                        type="text"
                        placeholder="Search Pokémon"
                        value={search}
                        className="search-bar"
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <ToggleSwitch
                        label="Nearby Searching"
                        isChecked={isChecked}
                        setIsChecked={setIsChecked}
                    />
                </div>
                <div className="pokemon-rendered">
                    <ul className="cards">
                        {searchData.map((curPokemon) => (
                            <PokemonCards
                                key={curPokemon.id}
                                pokemonData={curPokemon}
                                onClick={() => {
                                    console.log("Clicked on:", curPokemon.id);
                                    setRenderInfo(true);
                                    setSelectedPokemon(curPokemon.id);
                                }}
                            />
                        ))}
                    </ul>
                </div>
                {isChecked ? (
                    <NearbySearch
                        start={offset}
                        end={offset + limit}
                        search={search}
                        region={region}
                    />
                ) : null}
            </section>
        </>
    );        
}

export default Pokemon;
