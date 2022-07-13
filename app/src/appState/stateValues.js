import 'fastestsmallesttextencoderdecoder'
import { WS_URL } from '../../.config'



// action types for the room reducer (RT === 'Room types)
export const ROOM_TYPES = Object.freeze({
  SET_ROOM_STATE: "SET_ROOM_STATE",
  UPDATE_ROOM_STATE: "UPDATE_ROOM_STATE",
  UPDATE_TABLE: "UPDATE_TABLE",
  UPDATE_MOVABLE: "UPDATE_MOVABLE",
  UPDATE_MOVABLES: "UPDATE_MOVABLES",
  ADD_CHAT: "ADD_CHAT",
  CLIENT_DISCONNECT_SOCKET: "CLIENT_DISCONNECT_SOCKET",
})

// action types for the user reducer (UT === 'user types)
export const USER_TYPES = Object.freeze({
  SET_USER: "SET_USER",
  CLEAR_USER: "CLEAR_USER",
  UPDATE_USER: "UPDATE_USER",
  UPDATE_ROOMS: "UPDATE_ROOMS",
})


// action types for the home reducer (HT === 'home types)
export const HOME_TYPES = Object.freeze({
  SET_HOME_STATE: "SET_HOME_STATE",
  UPDATE_HOME_STATE: "UPDATE_HOME_STATE",
  UPDATE_USERS: "UPDATE_USERS",
  UPDATE_ROOMS: "UPDATE_ROOMS",
})

export const logState = {
  Home: false,
  Room: false,
  Login: false,
  SignUp: false,
  Splash: false,
  all: false,
}

export const logReducers = {
  Home: false,
  Room: false,
  User: false,
  next: false,
  all: false,
}

export const logRenders = {
  Home: false,
  Room: false,
  Login: false,
  SignUp: false,
  Splash: false,
  all: false,
}

export const logs = {
  reducers: logReducers,
  states: logState,
  renders: logRenders,
}

export const initDev = { logs }


export const initUser =  {
  name: null,
  Rooms: [],
  UT: USER_TYPES,
  hand: {cards: []}
}


export const initHome = {
  socket: null,
  Users: [],
  Rooms: [],
  HT: HOME_TYPES,
}

export const initRoom = {
  name: '',
  socket: null,
  Users: [],
  chat: [],
  table: {},
  RT: ROOM_TYPES,
}

export const initSplash = {}
export const initLogin = {}
export const initSignUp = {}

export const initAppState = {
  socket: { create: null },
  dev:  initDev,
  User: initUser,
  Home: initHome,
  Room: initRoom,
  Login: initLogin,
  Splash: initSplash,
  SignUp: initSignUp,
};




const decoder = new TextDecoder('utf-8')
const encoder = new TextEncoder('utf-8')




const parseMessage = async (event) => {
  const { data } = event
  const dataConstrutor = data.constructor.name
  let msg;

  if( dataConstrutor ===  'ArrayBuffer') {
    msg = decoder.decode(data)
  }
  if( dataConstrutor ===  'Blob') {
    msg = await data.text()
  }
  return JSON.parse(msg)
}


const logEvents = false
const logMessages = false

export const getSocketCreator = (dispatch) => {


  const newSocket = (endpoint, query = {}, TYPE = 'Room', split = false) => {


    const TYPES = TYPE === 'Room' ? ROOM_TYPES : HOME_TYPES;
    endpoint = endpoint[0] === '/' ? endpoint : endpoint.length ? '/' + endpoint : '';
    const { User_id } = query;
    const URL = `${WS_URL}${endpoint}?User_id=${User_id}`
    logEvents && console.log(`ATTEMPTING ws connection of TYPE: ${TYPE} @ ${URL}`)
    let receiver = new WebSocket(URL)
    // let receiver, sender;
    // if (split) {
    //   receiver = new WebSocket(`${URL}&mode=receiver`)
    //   sender = new WebSocket(`${URL}&mode=emitter`)
    // }
    // else {
    //   receiver = new WebSocket(URL)
    //   // receiver = new WebSocket(`${URL}&mode=all`)
    //   sender = receiver;
    // }


    const encodeAndSend = (message) => {

      if(message.dispatch) {
        dispatch(message)
      }
      logMessages && console.log(`EMMITED `, { message, receiver })
      if (receiver.readyState === 1) {
        const encoded = encoder.encode(JSON.stringify(message))
        receiver.send(encoded)
      }
      else {
        console.log(`Socket not open so send lol`)
      }
    }
    receiver.emit = encodeAndSend

    receiver.open = async (event) => {
      if (logEvents) {
         console.log(`WS CONNECTED @ ${URL}`)
      }
      if ( TYPE === 'Room' ) {
        receiver.RT = ROOM_TYPES;
        dispatch({
          type: TYPES.UPDATE_ROOM_STATE,
          payload: { socket: receiver },
        })
      }
      else {
        receiver.HT = HOME_TYPES;
        dispatch({
          type: TYPES.UPDATE_HOME_STATE,
          payload: { socket: receiver },
        })
      }
    }

    receiver.close = async (event) => {
      if (logEvents) {
        console.log(`CLOSE at SOCKET: ${URL}`)
      }
      if ( TYPE === 'Room' ) {
        dispatch({
          type: TYPES.SET_ROOM_STATE,
          payload: null,
        })
      }
      else {
        dispatch({
          type: TYPES.UPDATE_HOME_STATE,
          payload: { socket: null },
        })
      }
    }

    receiver.onmessage = async (event) => {
      const msg = await parseMessage(event)
      logMessages && console.log(`RECEIVED `, { msg, receiver })
      if (logEvents) {
        console.log(`SOCKET url = ${URL}`)
      }
      dispatch(msg)
    }

    receiver.error = async (err) => {
      // console.log(`ERROR at SOCKET `, err)
      console.log(`ERROR @ SOCKET: ${URL}`)
      console.log(`ERROR code ${err.code}`)
      if ( TYPE === 'Room' ) {
        dispatch({
          type: TYPES.SET_ROOM_STATE,
          payload: null,
        })
      }
      else {
        dispatch({
          type: TYPES.UPDATE_HOME_STATE,
          payload: { socket: null },
        })
      }
    }


    receiver.addEventListener('open', function (event) {
      receiver.open(event)
    });
    receiver.addEventListener('close', function (event) {
      receiver.close(event)
    });
    receiver.addEventListener('message', function (event) {
      receiver.onmessage(event)
    });
    receiver.addEventListener('error', function (event) {
      receiver.error(event)
    });

    // return receiver;
  }

  return newSocket
}





const circleRef = (keys, state) => {
  keys.forEach((keyA) => {
    const ref = state[keyA];
    Object.entries(state).forEach((keyValues) => {
      const [keyB, values] = keyValues;
      if (keys.indexOf(keyB) === -1) {
        values[keyA] = ref;
      }
    });
  });
};
