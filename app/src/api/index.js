
import get from './get.js'
import put from './put'
import methods from './post.js'
const { post } = methods


Promise.all.obj = (asyncObj) => {
  const promiseArray = []
  const indToKey = Object.keys(asyncObj).map((key, ind) => {
    promiseArray.push(asyncObj[key])
    return key
  })
  return Promise.all(promiseArray)
    .then(allRes => allRes.reduce((memo, result, ind) => {
        memo[indToKey[ind]] = result
        return memo
      }, {}))
    .catch(err => {
      console.log('Promise.all.obj err', err)
      console.log('input obj', asyncObj)
    })
}


const loadNewProduct = (productId, dispatch) => {
  get.allProductData(productId)
  .then((response) => {
    response.currentProduct = productId
    dispatch({
      type: 'PROD_INIT',
      payload: response,
    });
  })
  .catch((err) => {
    console.log('Data init fetch error: ', err)
    dispatch({ type: '' }) //sets state so that the app rerenders and trys again.
  })
}

const load = {
  newProduct: loadNewProduct
}

const search = (event, searchBy = 'category') => {
  const term = event.target.value;
  // console.log('seraching ', term)
  // console.log('seraching ', term.length)
  if(term.length) {
    return get('/products/search', { term, searchBy })
  } else {
    return new Promise((res, rej) => res([]))
  }
}

const api = { get, post, put, load, search };


export default api;



