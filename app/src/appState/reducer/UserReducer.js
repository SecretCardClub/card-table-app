import AsyncStorage from '@react-native-async-storage/async-storage';
import { initUser } from '../stateValues'

const storeData = async (value, key = 'User') => {
  try {
    const jsonValue = JSON.stringify(value)
    await AsyncStorage.setItem(key, jsonValue)
  } catch (e) {
    console.log('Async store err ', err.message)
  }
}




const { UT } = initUser;
const REDUCER_MSG = `User Reducer`

export default function userReducer(user, action, logReducer = false) {
  if (user) {
    user.UT = UT
  }
  const { type, payload } = action
  switch (type) {

    case UT.SET_USER:
      logReducer && console.log(`${REDUCER_MSG}  ACTION:  type:${type}   payload:`, payload)
      user = payload || user;
      storeData(user)
      return user;

    case UT.CLEAR_USER:
      logReducer && console.log(`${REDUCER_MSG}  ACTION:  type:${type}   payload:`, payload)
      user = initUser;
      return user;

    case UT.UPDATE_USER:
      logReducer && console.log(`${REDUCER_MSG}  ACTION:  type:${type}   payload:`, payload)
      user = { ...user, ...payload };
      storeData(user)
      return user;

    default:
      return user;
  }
}
