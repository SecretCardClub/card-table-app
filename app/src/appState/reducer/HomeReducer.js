import { initHome } from '../stateValues'


const { HT } = initHome;
const REDUCER_MSG = `Home Reducer`

export default function homeReducer(homeState, action, logReducer = false) {
  if (homeState) {
    homeState.HT = HT
  }
  const { type, payload } = action

  switch (type) {

    case HT.SET_HOME_STATE:
      logReducer && console.log(`${REDUCER_MSG}  ACTION:  type:${type}   payload:`, payload)
      homeState = payload || homeState;
      return homeState;

    case HT.UPDATE_HOME_STATE:
      logReducer && console.log(`${REDUCER_MSG}  ACTION:  type:${type}   payload:`, payload)
      homeState = { ...homeState, ...payload };
      return homeState;

    case HT.UPDATE_ROOMS:
      logReducer && console.log(`${REDUCER_MSG}  ACTION:  type:${type}   payload:`, payload)
      homeState.rooms = payload || homeState.rooms;
      return homeState;

    case HT.UPDATE_USERS:
      logReducer && console.log(`${REDUCER_MSG}  ACTION:  type:${type}   payload:`, payload)
      homeState.users = payload || homeState.users;
      return homeState;

    default:
      return homeState;
  }
}
