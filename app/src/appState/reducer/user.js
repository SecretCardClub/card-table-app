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




const { dev, UT } = initUser;
const { reducer } = dev.logs
const REDUCER_MSG = `User Reducer`

export default function userReducer(user, action) {
  if (user) {
    user.dev = dev
    user.UT = UT
  }
  const { type, payload } = action
  switch (type) {

    case UT.SET_USER:
      reducer && console.log(`${REDUCER_MSG}  ACTION:  type:${type}   payload:`, payload)
      user = payload || user;
      storeData(user)
      return user;

    case UT.CLEAR_USER:
      reducer && console.log(`${REDUCER_MSG}  ACTION:  type:${type}   payload:`, payload)
      user = initUser;
      return user;

    case UT.UPDATE_USER:
      reducer && console.log(`${REDUCER_MSG}  ACTION:  type:${type}   payload:`, payload)
      user = { ...user, ...payload };
      storeData(user)
      return user;

    default:
      return user;
  }
}
