
import request from './request';

const post = request.post



const postUser = (postQuery = {}, postData = {}) => {
  return post('/users', postQuery, { ...postData })
}

const postRoom = (postQuery = {}, postData = {}) => {
  return post('/rooms', postQuery, { ...postData })
}


post.user = postUser;
post.room = postRoom;

const methods = { post }

export default methods;




