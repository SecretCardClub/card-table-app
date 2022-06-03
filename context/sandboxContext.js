import React, { useState } from "react";

const SandboxContext = React.createContext({
  piles: [],
  addPile: () => {},
});

export const SandboxContextProvider = (props) => {
  const [piles, setPiles] = useState([]);

  const addPile = (pile) => {
    setPiles(piles => [...piles, pile]);
  };

  return (
    <SandboxContext.Provider
      value={{
        piles,
        addPile,
      }}
    >
      {props.children}
    </SandboxContext.Provider>
  );
};

export default SandboxContext;
