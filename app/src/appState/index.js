import React, { useReducer } from 'react';
import { API_URL } from '../../.config'
import reducer from './reducer/index';
import { initAppState, getSocketCreator } from './stateValues'

export const DispatchContext = React.createContext([null, () => {}]);
export const StateContext = React.createContext([{}]);



const AppContextProvider = ({ children, passedState }) => {
  const initState = passedState || initAppState;
  const [state, dispatch] = useReducer(reducer, initState);
  state.socket.create = getSocketCreator(dispatch)

  return (
    <DispatchContext.Provider value={[null, dispatch]}>
      <StateContext.Provider value={[state]}>
        {children}
      </StateContext.Provider>
    </DispatchContext.Provider>
  );
};

export default AppContextProvider;

