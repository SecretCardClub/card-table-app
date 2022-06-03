import React, { useState } from "react";

const SandboxContext = React.createContext({
  playerHandDropZone: {},
  setPlayerHandDropZone: () => {},
});

export const SandboxContextProvider = (props) => {
  const [playerHandDropZone, setPlayerHandDropZone] = useState(0);

  return (
    <SandboxContext.Provider
      value={{
        playerHandDropZone,
        setPlayerHandDropZone,
      }}
    >
      {props.children}
    </SandboxContext.Provider>
  );
};

export default SandboxContext;
