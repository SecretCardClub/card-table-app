import axios from 'axios';
import { API_URL } from '../../.config'



const buildGetOptions = (endpoint, params = {}, data = {}) => {
  return {
    method: 'get',
    params,
    url: endpoint,
    baseURL: API_URL,
  }
};

const buildPostOptions = (endpoint, params = {}, data = {}, method = 'POST') => {
  return {
    method,
    params,
    url: endpoint,
    baseURL: API_URL,
    data: {
      ...data
    },
  }
};


const getReqest = (endpoint, params) => {
  return axios(buildGetOptions(endpoint, params))
          .then(res => res.data)
};



const postRequest = (endpoint, params, data) => {
  return axios(buildPostOptions(endpoint, params, data, 'POST'))
          .then(res => res.data)
}

const putRequest = (endpoint, params, data) => {
  return axios(buildPostOptions(endpoint, params, data, 'PUT'))
          .then(res => res.data)
}


const request = {
  get: getReqest,
  post: postRequest,
  put: putRequest,
}



export default request;

