import 'fastestsmallesttextencoderdecoder'
import { WS_URL } from '../../.config'

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



const encodeAndSend = (socket, message) => {
  const encoded = encoder.encode(JSON.stringify(message))
  socket.send(encoded)
}

const parseMessage = async (event) => {
  const { data } = event
  const UTF = await data.text()
  return JSON.parse(UTF)
}


// export const WS_URL = `ws://localhost:3030`
// export const WS_URL = `http://eac1-2601-6c3-4001-8140-200c-c1c0-7206-eb34.ngrok.io:3030`
// export const WS_URL = `ws://127.0.0.1:3030`
// export const WS_URL = `ws://localhost:3030`
// export const WS_URL = `ws://eac1-2601-6c3-4001-8140-200c-c1c0-7206-eb34.ngrok.io`

const logEvents = true


export const getSocketCreator = (dispatch) => {


  const newSocket = (endpoint, query = {}) => {
    endpoint = endpoint[0] === '/' ? endpoint : endpoint.length ? '/' + endpoint : '';
    const { User_id } = query;
    const URL = `${WS_URL}${endpoint}?User_id=${User_id}`
    const newWS = new WebSocket(URL, ['http'])

    const encodeAndSend = (message) => {
      if (newWS.readyState === 1) {
        const encoded = encoder.encode(JSON.stringify(message))
        newWS.send(encoded)
      }
      else {
        console.log(`Socket not open so send lol`)
      }
    }
    newWS.emit = encodeAndSend

    newWS.open = async (event) => {
       if (logEvents) {
        console.log(`OPEN at SOCKET `, event)
        console.log(`SOCKET url = ${URL}`)
      }
    }

    newWS.close = async (event) => {
      if (logEvents) {
        console.log(`CLOSE at SOCKET `, event)
        console.log(`SOCKET url = ${URL}`)
      }
    }

    newWS.onmessage = async (event) => {
      const msg = await parseMessage(event)
      if (logEvents) {
        console.log(`MESSAGE at SOCKET `, msg)
        console.log(`SOCKET url = ${URL}`)
      }

      dispatch(msg)
    }

    newWS.error = async (err) => {
      console.log(`ERROR at SOCKET `, err)
      console.log(`SOCKET url = ${URL}`)
    }


    newWS.addEventListener('open', function (event) {
      newWS.open(event)
    });
    newWS.addEventListener('close', function (event) {
      newWS.close(event)
    });
    newWS.addEventListener('message', function (event) {
      newWS.onmessage(event)
    });
    newWS.addEventListener('error', function (event) {
      newWS.error(event)
    });

    return newWS;
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
