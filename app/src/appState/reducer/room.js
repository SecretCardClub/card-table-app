import { initRoom } from '../stateValues'

const { RT, dev } = initRoom;
const { reducer } = dev.logs
const REDUCER_MSG = `Room Reducer`

export default function roomReducer(roomState, action) {

  if (roomState) {
    roomState.dev = dev
    roomState.RT = RT
  }
  const { type, payload } = action
  switch (type) {

    case RT.SET_ROOM_STATE:
      reducer && console.log(`${REDUCER_MSG}  ACTION:  type:${type}   payload:`, payload)
      roomState = payload || { ...initRoom, ...roomState };
      return roomState;

    case RT.UPDATE_ROOM_STATE:
      reducer && console.log(`${REDUCER_MSG}  ACTION:  type:${type}   payload:`, payload)
      roomState = { ...roomState, ...payload } ;
      return roomState;

    case RT.UPDATE_TABLE:
      reducer && console.log(`${REDUCER_MSG}  ACTION:  type:${type}   payload:`, payload)
      roomState.table = payload || roomState.table;
      return roomState;

    case RT.UPDATE_MOVABLE:
      reducer && console.log(`${REDUCER_MSG}  ACTION:  type:${type}   payload:`, payload)
      roomState.table[payload.id] = payload;
      return roomState;

    case RT.ADD_CHAT:
      reducer && console.log(`${REDUCER_MSG} type:${type}  payload:`, payload)
      roomState.chat = [ ...roomState.chat   , payload];
      return roomState;

    default:
      return roomState;
  }
}
