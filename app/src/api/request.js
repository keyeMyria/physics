import { Toast } from 'antd-mobile'

export const service=`http://139.224.233.55:4040`


const check401 = (resp) =>{
  if (resp.status===401){
    //   console.warn('用户认证失败')
    // Toast.fail('')
    dispatch({
        type:'user/out',
    })

  }
  if (resp.ok) return resp.json()
  return{
      status:0,
      message:'用户认证失败'
  }
}

const checkError = (error) => {
  console.warn('服务器错误')
  return{
      status:0,
      message:'服务器错误'
  }
}

/**
 * Requests a URL, returning a promise.
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "fetch"
 * @return {object}           An object containing either "data" or "err"
 */

export const get = (url) => {
    const options = {
        method: 'GET',
        headers:{
            Authorization:'Bearer ' + global.token
        }
    }
    return fetch(`${service}${url}?version=app`, options)
        .then(check401)
        .then((respJson)=>{
            return respJson
        })
        .catch(checkError)
}

export const post = (url, body) => {
    // console.warn('post',url,body)
    // console.log('token', global.token)
    const options = {
        body: JSON.stringify(body),
        method: 'POST',
        headers:{
            Authorization:'Bearer ' + global.token
        }
    }
    return fetch(`${service}${url}?version=app`, options)
        .then(check401)
        .then((respJson)=>{
            return respJson
        })
        .catch(checkError)
}

export const image = (url, body) => {
    const options = {
        method: 'POST',
        headers:{
            'Content-Type':'multipart/form-data',
            Authorization:'Bearer ' + global.token,
        },
        body:body,
    }
    return fetch(`${service}${url}?version=app`, options)
        .then(check401)
        .then((respJson)=>{
            return respJson
        })
        .catch(checkError)
}