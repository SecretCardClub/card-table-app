import React, { useReducer } from 'react';
import { io } from "socket.io-client";
import { API_URL } from '../../.config'
import reducer from './reducer.js';


export const DispatchContext = React.createContext([null, () => {}]);
export const StateContext = React.createContext([{}]);



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
  room: { socket: null, name: ``, users: [], chat: [] },
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
