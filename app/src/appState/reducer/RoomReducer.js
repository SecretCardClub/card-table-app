import { initRoom } from '../stateValues'

const { RT } = initRoom;
const REDUCER_MSG = `Room Reducer`

export default function roomReducer(roomState, action, logReducer = false) {

  if (roomState) {
    roomState.RT = RT
  }
  const { type, payload } = action
  switch (type) {

    case RT.SET_ROOM_STATE:
      logReducer && console.log(`${REDUCER_MSG}  ACTION:  type:${type}   payload:`, payload)
      roomState = payload || initRoom;
      return roomState;

    case RT.UPDATE_ROOM_STATE:
      logReducer && console.log(`${REDUCER_MSG}  ACTION:  type:${type}   payload:`, payload)
      if(roomState.socket && !payload.socket) {
        payload.socket = roomState.socket || null
      }
      roomState = { ...roomState, ...payload } ;
      return roomState;

    case RT.UPDATE_TABLE:
      logReducer && console.log(`${REDUCER_MSG}  ACTION:  type:${type}   payload:`, payload)
      roomState.table = payload || roomState.table;
      return roomState;

    case RT.UPDATE_MOVABLE:
      logReducer && console.log(`${REDUCER_MSG}  ACTION:  type:${type}   payload:`, payload)
      if(!payload.delete) {
        roomState.table[payload.id] = payload;
      }
      else {
        delete roomState.table[payload.id]
      }
      return roomState;

    case RT.UPDATE_MOVABLES:
      logReducer && console.log(`${REDUCER_MSG}  ACTION:  type:${type}   payload:`, payload)
      const updatedMovables = Array.isArray(payload) ? payload : [ payload ]
      updatedMovables.forEach(updatedMovable => {
        if(!payload.delete) {
          roomState.table[payload.id] = payload;
        }
        else {
          delete roomState.table[payload.id]
        }
      })
      return roomState;

    case RT.ADD_CHAT:
      logReducer && console.log(`${REDUCER_MSG} type:${type}  payload:`, payload)
      roomState.chat = [ ...roomState.chat   , payload];
      return roomState;

    default:
      return roomState;
  }
}
