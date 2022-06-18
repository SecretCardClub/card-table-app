import 'fastestsmallesttextencoderdecoder'
import { WS_URL } from '../../.config'
import { Dimensions, Platform } from "react-native";

console.log({ Platform })

export const Device = {
  OS: Platform.OS
}

export const Dims = Dimensions.get('screen');

Dimensions.addEventListener('change', (dimObject) => {
  const { screen } = dimObject
  console.log(`Dim change event `, screen, Dims)
  Dims.height = screen.height
  Dims.width = screen.width
  Dims.scale = screen.scale
})
const { height, width, scale } = Dims

Dims.pixelHeight = height * scale;
Dims.pixelWidth = width * scale;

Dims.percentToPixels =  (percent, dimension = 'width', integer = true) => {
  const maxPixelsForDim = dimension === 'width' ? Dims.pixelWidth : Dims.pixelHeight = height * scale;
  if(integer) {
    return Math.round(maxPixelsForDim * percent)
  }
  return maxPixelsForDim * percent
}

Dims.heightPercentToPixels = (percent, integer = true) => {
  return Dims.percentToPixels(percent, 'height', integer)
}
Dims.widthPercentToPixels = (percent, integer = true) => {
  return Dims.percentToPixels(percent, 'width', integer)
}

Dims.calcPosition = (x_per, y_per) => {
  if(!y_per) {
    y_per = x_per.y_per
    x_per = x_per.x_per
  }
    // let x = width * x_per - widthDiv - 50;
  // let y = height * y_per  - heightDiv - 35;
  const widthDiv = Dims.width / 2;
  const heightDivisor = Platform.OS === 'ios' ? 1 : 2;
  const heightDiv = Dims.height / heightDivisor;

  let x = Dims.width * x_per - widthDiv ;
  let y = Dims.height * y_per  - heightDiv;

  // let x = Dims.width * x_per;
  // let y = Dims.height * y_per;

  if ( x > widthDiv ) {
    x = widthDiv
  }
  if ( (0 - widthDiv) > x ) {
    x = (0 - widthDiv)
  }

  if ( y > heightDiv ) {
    y = heightDiv
  }
  if ( (0 - heightDiv) > y ) {
    y = (0 - heightDiv)
  }
  // console.log({ x_per, y_per, x, y })

  return { x, y }
}



// action types for the room reducer (RT === 'Room types)
export const ROOM_TYPES = Object.freeze({
  SET_ROOM_STATE: "SET_ROOM_STATE",
  UPDATE_ROOM_STATE: "UPDATE_ROOM_STATE",
  UPDATE_TABLE: "UPDATE_TABLE",
  UPDATE_MOVABLE: "UPDATE_MOVABLE",
  ADD_CHAT: "ADD_CHAT",
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
  states: logState,
  renders: logRenders,
  reducers: logReducers,
}



export const initUser =  {
  name: null,
  Rooms: [],
  UT: USER_TYPES,
  dev: {
    logs: {
      reducer: logs.reducers.all ? true : logs.reducers.User,
    },
  },
}


export const initHome = {
  socket: null,
  Users: [],
  Rooms: [],
  HT: HOME_TYPES,
  dev: {
    logs: {
      state: logs.states.all ? true : logs.states.Home,
      render: logs.renders.all ? true : logs.renders.Home,
      reducer: logs.reducers.all ? true : logs.reducers.Home,
    },
  },
}

export const initRoom = {
  name: '',
  socket: null,
  Users: [],
  chat: [],
  table: {},
  RT: ROOM_TYPES,
  dev: {
    logs: {
      state: logs.states.all ? true : logs.states.Room,
      render: logs.renders.all ? true : logs.renders.Room,
      reducer: logs.reducers.all ? true : logs.reducers.Room,
    }
  },
}

export const initSplash = {
  dev: {
    logs: {
      state: logs.states.all ? true : logs.states.Splash,
      render: logs.renders.all ? true : logs.renders.Splash,
    },
  },
}

export const initLogin = {
  dev: {
    logs: {
      state: logs.states.all ? true : logs.states.Login,
      render: logs.renders.all ? true : logs.renders.Login,
    },
  },
}

export const initSignUp = {
  dev: {
    logs: {
      state: logs.states.all ? true : logs.states.SignUp,
      render: logs.renders.all ? true : logs.renders.SignUp,
    },
  },
}

export const initAppState = {
  socket: { create: null },
  dev:  { logs },
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
        dispatch({
          type: TYPES.UPDATE_ROOM_STATE,
          payload: { socket: receiver },
        })
      }
      else {
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
          type: TYPES.UPDATE_ROOM_STATE,
          payload: { socket: null },
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
          type: TYPES.UPDATE_ROOM_STATE,
          payload: { socket: null },
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
