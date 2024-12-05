/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import ImageGallery from "react-image-gallery";
import "react-image-gallery/styles/css/image-gallery.css";
import "./PokemonDetails.css";
import ArrowIcon from "./assets/arrow-right-solid.svg";

function PokemonDetails({ id }) {
    const [pokeData, setPokeData] = useState(null);
    const [galleryImages, setGalleryImages] = useState([]);
    const [imgUrlForTypes, setImgUrlForTypes] = useState([]);
    const [evolutionChain, setEvolutionChain] = useState([]);
    const [slangData, setSlangData] = useState([]);
    const [loading, setLoading] = useState(true); // New state for tracking loading

    if (!id) {
        id = 1;
    }

    // Fetch Pokémon data
    async function fetchPokeData() {
        try {
            const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
            const data = await response.json();
            setPokeData(data);
        } catch (error) {
            console.error("Failed to fetch Pokémon data:", error);
        }
    }

    // Fetch type-related data
    async function fetchType() {
        try {
            const allTypesResp = await fetch(`https://pokeapi.co/api/v2/type/`);
            const data = await allTypesResp.json();
            const allTypes = data.results;

            const types = pokeData.types;
            const imgUrls = await Promise.all(
                types.map(async (typeObj) => {
                    const typeName = typeObj.type.name;
                    const matchingType = allTypes.find((t) => t.name === typeName);

                    if (matchingType) {
                        const typeDetailsResp = await fetch(matchingType.url);
                        const typeDetails = await typeDetailsResp.json();
                        return typeDetails.sprites?.["generation-viii"]?.["sword-shield"];
                    } else {
                        console.warn(`No matching type found for: ${typeName}`);
                        return null;
                    }
                })
            );

            setImgUrlForTypes(imgUrls.filter(Boolean));
        } catch (err) {
            console.error("Error occurred:", err);
        }
    }

    // Fetch Pokémon slang data
    async function pokeSlangData() {
        const speciesResponse = await fetch(pokeData.species.url);
        const speciesData = await speciesResponse.json();

        const data = [];
        let ct=0
        for (let i = 0; i < speciesData.flavor_text_entries.length; i++) {
            if(speciesData.flavor_text_entries[i].language.name==="en"){
                data.push(speciesData.flavor_text_entries[i].flavor_text)
                ct++
            }
            if(ct===2)    break
        }
        setSlangData(data);
    }

    // Fetch evolution chain data
    async function evolutionChainFetch() {
        try {
            const speciesResponse = await fetch(pokeData.species.url);
            const speciesData = await speciesResponse.json();
    
            const evolutionChainResponse = await fetch(speciesData.evolution_chain.url);
            const evolutionChainData = await evolutionChainResponse.json();
    
            // Recursive function to traverse the evolution chain
            async function processEvolution(evolution) {
                const speciesName = evolution.species.name;
    
                // Fetch Pokémon data to get the image
                const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${speciesName}/`);
                const data = await response.json();
                const imgUrl = data?.sprites?.front_default || null;
    
                if (evolution.evolves_to.length === 0) {
                    // Base case: no further evolutions
                    return { name: speciesName, image: imgUrl };
                }
    
                // Recursive case: process further evolutions
                const evolvesTo = await Promise.all(
                    evolution.evolves_to.map(async (evo) => await processEvolution(evo))
                );
    
                // Return the structure: { name, image, evolvesTo }
                return { name: speciesName, image: imgUrl, evolvesTo };
            }
    
            // Process the base evolution chain
            const evolutionChain = await processEvolution(evolutionChainData.chain);
    
            // Set the nested evolution chain to state
            setEvolutionChain(evolutionChain);
            // console.log("Evolution Chain:", evolutionChain);
        } catch (error) {
            console.error("Error fetching evolution chain:", error);
        }
    }
    
    function EvolutionChainDisplay({ chain }) {
        if (!chain) return null;
    
        const isConditional = chain.evolvesTo && chain.evolvesTo.length > 1;
    
        return (
            <div
                style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "20px",
                }}
            >
                {/* Current Pokémon */}
                <div style={{ textAlign: "center" }}>
                    <img
                        src={chain.image}
                        alt={chain.name}
                        style={{
                            width: "100px",
                            height: "100px",
                            borderRadius: "50%",
                            border: "2px solid #ddd",
                            background: "#fff",
                            padding: "5px",
                        }}
                    />
                    <p style={{ marginTop: "10px", fontWeight: "bold", fontSize: "14px" }}>
                        {chain.name.toUpperCase()}
                    </p>
                </div>
    
                {/* Arrow */}
                {chain.evolvesTo && chain.evolvesTo.length > 0 && (
                    <div>
                        <img
                            src={ArrowIcon}
                            alt="Arrow"
                            style={{
                                width: "30px",
                                height: "30px",
                            }}
                        />
                    </div>
                )}
    
                {/* Render Evolutions */}
                <div
                    style={{
                        display: isConditional ? "flex" : "block",
                        flexDirection: isConditional ? "column" : "row",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "20px",
                    }}
                >
                    {chain.evolvesTo &&
                        chain.evolvesTo.map((evo, index) => (
                            <EvolutionChainDisplay key={index} chain={evo} />
                        ))}
                </div>
            </div>
        );
    }
    
    

    // UseEffect for fetching Pokémon data
    useEffect(() => {
        setLoading(true); // Start loading
        fetchPokeData();
    }, [id]);

    useEffect(() => {
        async function fetchAllData() {
            if (pokeData) {
                try {
                    const images = [
                        pokeData.sprites?.other?.dream_world?.front_default,
                        pokeData.sprites?.other?.["official-artwork"]?.front_default ||
                            pokeData.sprites?.other?.home?.front_default,
                        pokeData.sprites?.other?.["official-artwork"]?.front_shiny ||
                            pokeData.sprites?.other?.dream_world?.front_shiny,
                    ].filter((url) => url);

                    const galleryFormattedImages = images.map((img) => ({
                        original: img,
                        thumbnail: img,
                    }));

                    setGalleryImages(galleryFormattedImages);

                    await Promise.all([fetchType(), pokeSlangData(), evolutionChainFetch()]);
                } catch (error) {
                    console.error("Error fetching additional data:", error);
                } finally {
                    setLoading(false); // End loading
                }
            }
        }

        fetchAllData();
    }, [pokeData]);

    // If loading, show a loading spinner
    if (loading) {
        return <p>Loading Pokémon details...</p>;
    }

    // If no Pokémon data or gallery images, return a fallback
    if (!pokeData || galleryImages.length === 0) {
        return <p>No data available for this Pokémon.</p>;
    }

    // Render Pokémon details
    return (
        <div className="pokemon-details">
            <h2 className="name">{pokeData.name.toUpperCase()}</h2>
            <div className="image-part">
                <ImageGallery
                    items={galleryImages}
                    showThumbnails={false}
                    showPlayButton={true}
                    showFullscreenButton={false}
                    slideInterval={1000}
                />
            </div>
            <div>
                <h2>Some basic data about this Pokémon:</h2>
                <br />
                <h3 style={{ marginBottom: "25px" }}>{slangData[1]}</h3>
            </div>
            <div style={{ gap: "10px", width: "100%" }}>
                {imgUrlForTypes.map((url, index) => (
                    <img
                        key={index}
                        src={url.name_icon}
                        alt={`Type Icon ${index + 1}`}
                        style={{ width: "100%" }}
                    />
                ))}
            </div>
            <div className="evol-chain-div">
                <h3 className="evol-chain-heading">Evolution Chain</h3>
                <EvolutionChainDisplay chain={evolutionChain} />
            </div>
        </div>
    );
}

export default PokemonDetails;
