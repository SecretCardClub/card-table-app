import React from "react";

import Sandbox from "./components/Sandbox";
import { SandboxContextProvider } from "./context/sandboxContext";

const App = () => {
  return (
    <SandboxContextProvider>
      <Sandbox />
    </SandboxContextProvider>
  );
};

export default App;
