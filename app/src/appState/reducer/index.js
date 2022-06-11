
import userReducer from './user'
import homeReducer from './home'
import roomReducer from './room'


export default function reducer(state, action) {

  if (action.type === "SET_SOCKET_BUILDER") {
    state.socket.create = action.payload
    return state
  }

  const User = userReducer(state.User, action)
  const Home = homeReducer(state.Home, action)
  const Room = roomReducer(state.Room, action)

  const nextState = { ...state, User, Home, Room }
  if(state.dev.logs.reducers.next) {
    console.log(`Reducer NEXT STATE `, nextState)
  }
  return nextState
}
