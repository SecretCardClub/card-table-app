import axios from 'axios';
import { API_URL } from '../../.config'



const buildGetOptions = (endpoint, params = {}, data = {}) => {
  // console.log('GET params ', params)
  return {
    method: 'get',
    params,
    url: endpoint,
    baseURL: API_URL,
  }
};

const buildPostOptions = (endpoint, params = {}, reqData = {}, method = 'POST') => {
  console.log('POST data ', { params, endpoint })
  return {
    method,
    params,
    url: endpoint,
    baseURL: API_URL,
    data: JSON.stringify(reqData),
  }
};


const getReqest = (endpoint, params) => {
  return axios(buildGetOptions(endpoint, params))
    .then(res => {
      // console.log({ res })
      return res.data
    })
};



const postRequest = (endpoint, params, data) => {
  return axios(buildPostOptions(endpoint, params, data, 'POST'))
    .then(res => {
      // console.log({ res })
      return res.data
    })
}

const putRequest = (endpoint, params, data) => {
  return axios(buildPostOptions(endpoint, params, data, 'PUT'))
    .then(res => {
      // console.log({ res })
      return res.data
    })
}


const request = {
  get: getReqest,
  post: postRequest,
  put: putRequest,
}



export default request;

