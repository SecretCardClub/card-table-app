

import request from './request';


const get = request.get


const getAllObj = (allGetOptions) => {

  const Promisified = Object.keys(allGetOptions).reduce((memo, key) => {
    let getOptions = allGetOptions[key];
    let newPromise = Array.isArray(getOptions) ? get(...getOptions) : getAllObj(getOptions)
    memo[key] =  newPromise
    return memo
  }, {})

  return Promise.all.obj(Promisified)
    .catch(err => {
      console.log('GET getAllObj fetch err ', err)
      console.log('input obj ', allGetOptions)
    })
}

const getAllArray = (allGetOptions) => {
  const getPromises = allGetOptions.map((getOptions) => get(...getOptions))
  return Promise.all(getPromises)
    .catch(err => {
      console.log('GET getAllArray fetch err ', err)
      console.log('input array ', allGetOptions)
    })
}




const getAll = (allGetOptions) => {
  let getAllFunc = Array.isArray(allGetOptions) ? getAllArray : getAllObj
  return getAllFunc(allGetOptions)
    .catch(err => {
      console.log('GET all fetch err ', err)
      console.log('GET all input ', allGetOptions)
    })
}

const allEndpoints = ['details', 'reviews', 'QA', 'related'].join(';')
const getAllProductData = (productId) => {
  return get('/product/data', { productId, endpoints: allEndpoints })
}


const getUser = (user_name, session_id) => {

  const query = {};
  if (user_name) {
    query.user_name = user_name
  }
  if (session_id) {
    query.session_id = session_id
  }
  console.log('get user query ', query)
  return get('/users', query)
}







get.all = getAll
get.user = getUser

export default get;