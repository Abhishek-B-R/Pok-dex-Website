function EvolutionChainDisplay({ chain, isBranch = false }) {
    // Base case: render a single image
    if (!Array.isArray(chain)) {
        return (
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <img
                    src={chain}
                    alt="Evolution stage"
                    style={{ width: "100px", height: "100px" }}
                />
            </div>
        );
    }

    // Recursive case: render the current stage and further evolutions
    return (
        <div
            style={{
                display: "flex",
                flexDirection: isBranch ? "column" : "row",
                alignItems: "center",
                gap: "10px",
            }}
        >
            {/* Current stage */}
            <div style={{ display: "flex", alignItems: "center" }}>
                <img
                    src={chain[0]}
                    alt="Current evolution"
                    style={{ width: "100px", height: "100px" }}
                />
                <span style={{ fontSize: "24px", margin: "0 10px" }}>→</span>
            </div>

            {/* Render next stages */}
            <div
                style={{
                    display: "flex",
                    flexDirection: chain.slice(1).length > 1 ? "column" : "row",
                    alignItems: "center",
                    gap: "10px",
                }}
            >
                {chain.slice(1).map((subChain, index) => (
                    <EvolutionChainDisplay key={index} chain={subChain} isBranch={chain.slice(1).length > 1} />
                ))}
            </div>
        </div>
    );
}

export default function EvolutionChainContainer({ evolutionChain }) {
    return (
        <div style={{ textAlign: "center", marginTop: "20px" }}>
            {evolutionChain ? (
                <EvolutionChainDisplay chain={evolutionChain} />
            ) : (
                <p>Loading evolution chain...</p>
            )}
        </div>
    );
}
