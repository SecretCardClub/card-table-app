
import request from './request';

const put = request.put



const putUser = (putQuery, putData) => {
  return put('/users', putQuery, { ...putData })
}

const putRoom = (putQuery, putData) => {
  return put('/rooms', putQuery, { ...putData })
}


put.user = putUser;
put.room = putRoom;


export default put;