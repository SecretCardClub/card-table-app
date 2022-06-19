import { initDev } from '../stateValues'



const UPDATE_DEV = "UPDATE_DEV"
export default function devReducer(dev, action) {
  let reducer = false
  const { type, payload } = action
  switch (type) {

    case UPDATE_DEV:
      reducer && console.log(`${UPDATE_DEV}  ACTION:  type:${type}   payload:`, payload)
      dev = payload || dev;
      return dev;

    default:
      return dev;
  }
}