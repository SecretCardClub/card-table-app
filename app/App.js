import React from "react";
import AppContextProvider from './src/appState/index'
import Navigation from './src/navigation/index';


const App = () => {
  return (
    <AppContextProvider>
      <Navigation />
    </AppContextProvider>
  );
};


export default App;
