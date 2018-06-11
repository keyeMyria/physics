import fetch from 'dva/fetch'

const check401 = (resp) =>{
  if (resp.status===401){
      console.warn('用户认证失败')
      window.token = undefined
      dispatch({
        type:'login/save',
        payload:{
          token:undefined,
          user:{}
        }
      })
  }
  if (resp.ok) return resp.json()
  return{
      status:0,
  }
}

const checkError = (error) => {
  console.warn('服务器错误')
  return{
      status:0
  }
}

/**
 * Requests a URL, returning a promise.
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "fetch"
 * @return {object}           An object containing either "data" or "err"
 */
export default {
  get: (url) => {
    const options = {
      method: 'GET',
      headers:{
        Authorization:'Bearer ' + window.token
      }
    }
    return fetch(url, options)
      .then(check401)
      .then((respJson)=>{
          return respJson
      })
      .catch(checkError);
  },
  post: (url, body) => {
    // console.log('post',url,body)
    const options = {
      body: JSON.stringify(body),
      method: 'POST',
      headers:{
        Authorization:'Bearer ' + window.token
      }
    }
    return fetch(url, options)
      .then(check401)
      .then((respJson)=>{
          return respJson
      })
      .catch(checkError);
  }
}