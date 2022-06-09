
import request from './request';

const post = request.post



const postNew = (postData, type) => {
  return post('/new', {}, { ...postData, type })
}


post.review = ((data) => postNew(data, 'review'))
post.question = ((data) => postNew(data, 'question'))
post.answer = ((data) => postNew(data, 'answer'))




const postReport = (postData, type) => {
  return post('/report', {}, { ...postData, type })
}

const report = {
  review: ((data) => postReport(data, 'review')),
  question: ((data) => postReport(data, 'question')),
  answer: ((data) => postReport(data, 'answer')),
}



const postUpvote = (postData, type) => {
  return post('/upvote', {}, { ...postData, type })
}

const upvote = {
  review: ((data) => postUpvote(data, 'review')),
  question: ((data) => postUpvote(data, 'question')),
  answer: ((data) => postUpvote(data, 'answer')),
}


const postUser = (postQuery, postData) => {
  return post('users', postQuery, { ...postData })
}

const postRoom = (postQuery, postData) => {
  return post('rooms', postQuery, { ...postData })
}


post.user = postUser;
post.room = postRoom;

const methods = { post, report, upvote }

export default methods;




