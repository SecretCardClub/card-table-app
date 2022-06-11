import { initHome } from '../stateValues'


const { HT, dev } = initHome;
const { reducer } = dev.logs
const REDUCER_MSG = `Home Reducer`

export default function homeReducer(homeState, action) {
  if (homeState) {
    homeState.dev = dev
    homeState.HT = HT
  }
  const { type, payload } = action

  switch (type) {

    case HT.SET_HOME_STATE:
      reducer && console.log(`${REDUCER_MSG}  ACTION:  type:${type}   payload:`, payload)
      homeState = payload || homeState;
      return homeState;

    case HT.UPDATE_HOME_STATE:
      reducer && console.log(`${REDUCER_MSG}  ACTION:  type:${type}   payload:`, payload)
      homeState = { ...homeState, ...payload };
      return homeState;

    case HT.UPDATE_ROOMS:
      reducer && console.log(`${REDUCER_MSG}  ACTION:  type:${type}   payload:`, payload)
      homeState.rooms = payload || homeState.rooms;
      return homeState;

    case HT.UPDATE_USERS:
      reducer && console.log(`${REDUCER_MSG}  ACTION:  type:${type}   payload:`, payload)
      homeState.users = payload || homeState.users;
      return homeState;

    default:
      return homeState;
  }
}
