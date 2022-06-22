
import UserReducer from './UserReducer'
import HomeReducer from './HomeReducer'
import RoomReducer from './RoomReducer'
import devReducer from './devReducer'


export default function reducer(state, action) {

  if (action.type === "SET_SOCKET_BUILDER") {
    state.socket.create = action.payload
    return state
  }

  const dev = devReducer(state.dev, action)
  const { reducers } = dev.logs;
  const User = UserReducer(state.User, action, reducers.all || reducers.User)
  const Home = HomeReducer(state.Home, action, reducers.all || reducers.Home)
  const Room = RoomReducer(state.Room, action, reducers.all || reducers.Room)
  const nextState = { ...state, User, Home, Room, dev }

  if(reducers.next) {
    console.log(`Reducer NEXT STATE for ACTION TYPE: ${action.type} `, nextState)
  }
  return nextState
}
