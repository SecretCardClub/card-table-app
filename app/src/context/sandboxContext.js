import React, { useState } from "react";

const SandboxContext = React.createContext({
  piles: [],
  addPile: () => {},
  updatePileDz: () => {},
});

export const SandboxContextProvider = (props) => {
  const [piles, setPiles] = useState({});

  const addPile = (pile) => {
    setPiles(currentPiles => {
      return { ...currentPiles, [pile.id]: pile};
    });
  };

  const updatePileDz = (pan, pileId) => {
    if (piles[pileId]) {
      const updatedPile = piles[pileId].updateDz(pan)
      setPiles({...piles, [pileId]: updatedPile});
    }
  };

  return (
    <SandboxContext.Provider
      value={{
        piles,
        addPile,
        updatePileDz,
      }}
    >
      {props.children}
    </SandboxContext.Provider>
  );
};

export default SandboxContext;
