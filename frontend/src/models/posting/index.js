import { getPosting, savePosting, updatePosting } from '../../services'
import { message } from 'antd'

export default {

    namespace: 'posting',
  
    state: {
      data:[],
    },
  
    subscriptions: {
      setup({ dispatch, history }) {  // eslint-disable-line
      },
    },
  
    effects: {
      *fetch({ payload }, { call, put }) {  // eslint-disable-line
        yield put({ type: 'save' });
      },

      *getData({  }, { call, put }) {
          const resp = yield call(getPosting)
          // console.log('getdata resp',resp)
          if (resp.status){
              const data = resp.data.map(item=>({
                ...item,
                materials:JSON.parse(item.materials),
                pics:JSON.parse(item.pics)
              }))

              yield put({
                type:'save',
                payload:{
                    data,
                    fetched:true,
                }
              })
          }
          else message.error(''+resp.message)
      },

      *mySave({ payload }, { call, put }){
        const body = {
          ...payload,
          pics:JSON.stringify(payload.pics),
          materials:JSON.stringify(payload.materials)
        }
        // console.log('save posting', body)
        const resp = yield call(savePosting, body)
        // console.log('save resp',resp)
        if (resp.status){
          message.success("保存技术贴成功")
          // put 重新获取数据
          yield put({
            type:'getData'
          })
        } else {
          message.error(''+status.message)
        }
      },

      *update({ payload }, { call, put }){
        const resp = yield call(updatePosting, payload)
        if (resp.status){
          message.success("更新技术贴成功")
          yield put({
            type:'getData'
          })
        }else{
          message.error(''+resp.message)
        }
      }
    },
  
    reducers: {
      save(state, action) {
        return { ...state, ...action.payload };
      },
    },
  
  };
  