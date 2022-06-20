import React, { useState, useEffect } from "react";

import Pile from "../classes/Pile"
import Card from "../classes/Card"

const SandboxContext = React.createContext({
  showPileMenu: false,
  setShowPileMenu: () => {},
  currentPile: null,
  setCurrentPile: () => {},
});

export const SandboxContextProvider = (props) => {
  const [showPileMenu, setShowPileMenu] = useState(false);
  const [currentPile, setCurrentPile] = useState(null);

  let timer;
  useEffect(() => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      setCurrentPile(null);
    }, 2500);
    return () => {
      clearTimeout(timer);
    }
  }, [currentPile]);

  return (
    <SandboxContext.Provider
      value={{
        showPileMenu,
        setShowPileMenu,
        currentPile,
        setCurrentPile,
      }}
    >
      {props.children}
    </SandboxContext.Provider>
  );
};

export default SandboxContext;
