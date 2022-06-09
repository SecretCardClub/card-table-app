import React, { useReducer } from 'react';
import { API_URL } from '../../.config'
import reducer from './reducer.js';
import { io } from "socket.io-client";


export const DispatchContext = React.createContext([null, () => {}]);
export const StateContext = React.createContext([{}]);


// const savedInLocal = localStorage.getItem('user');
// const localStoreUser = savedInLocal
//   ? JSON.parse(savedInLocal)
//   : { cart: [], outfit: [], theme: 'light', upVoted: [] , reviews: [], currentProduct: 37311 };

const newSocket = (endpoint, query = {}) => {
  return io(`${API_URL}/${endpoint}`, { query })
}

const logState = {
  mod: {
    main: false,
    details: false,
    related: false,
    QA: false,
    reviews: false
  }
}

const logRenders = {
  mod: {
    main: false,
    details: false,
    related: false,
    QA: false,
    reviews: false
  }
}

const initPageState = {
  socket: { create: newSocket },
  dev: { logs: false, renders: logRenders, state: logState, reducer: false },
  user: { theme: 'dark', name: null, rooms: [], },
  home: { socket: null, users: [], rooms: [] },
  room: { socket: null, name: ``  },
};

const AppContextProvider = ({ children, passedState }) => {
  const initState = passedState || initPageState;
  const [state, dispatch] = useReducer(reducer, initState);

  return (
    <DispatchContext.Provider value={[null, dispatch]}>
      <StateContext.Provider value={[state]}>
        {children}
      </StateContext.Provider>
    </DispatchContext.Provider>
  );
};

export default AppContextProvider;
