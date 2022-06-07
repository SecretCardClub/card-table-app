import React from 'react';
import ReactDOM from 'react-dom'
import App from './src/App';
import AppContextProvider from './src/appState/index';

const Stack =(
<AppContextProvider>
  <App />
</AppContextProvider>
)

ReactDOM.render(Stack, document.getElementById('root'))
