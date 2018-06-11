import { 
    createDisscuss, getDisscuss, createComment, getDisscussByID, createReply,
    deleteComment,deleteReplay
 } from '../../services'
import { message } from 'antd'

export default {
    
      namespace: 'disscuss',
    
      state: {
          data:[],
          dataMap:{},
      },
    
      subscriptions: {
        setup({ dispatch, history }) {  // eslint-disable-line
        },
      },
    
      effects: {
        *fetch({ payload }, { call, put }) {  // eslint-disable-line
          yield put({ type: 'save' });
        },

        *getData({ payload }, { call, put }) {
            // console.log('disscuss getdata', payload)
            const resp = yield call(getDisscuss, payload)
            if (resp.status) yield put({
                type:'save',
                payload:{
                    data:resp.data
                },
            }) 
            else message.error(''+resp.message)
        },

        *create({ payload },{ call, put }) {
            // console.log('disscuss model create', payload)
            const resp = yield call(createDisscuss, payload)
            if (resp.status){
                message.success("新增讨论问题成功")
                yield put({
                    type:'getData',
                    payload:{
                        course_id:payload.course_id
                    }
                })
                //重新获取数据
            } else message.error(''+resp.message)
        },

        *create_comment({ payload: { payload, disscuss_id } },{ call, put }) {
            console.log("payload create comment", payload)
            const resp = yield call(createComment, payload)
            yield put({
                type:'get_by_id',
                payload:{ disscuss_id }
            })
            if (!resp.status) message.error(''+resp.message)
        },

        *get_by_id({ payload },{ call, put, select }) {
            // console.log('get_by_id',payload)
            const resp = yield call(getDisscussByID, payload)
            const { dataMap } = yield select(state=>state.disscuss)
            // console.log('getttt',resp)
            if (resp.status){
                yield put({
                    type:'save',
                    payload:{
                        dataMap:{
                            ...dataMap,
                            [payload.disscuss_id]:resp.data,
                        }
                    }
                })
            }
        },

        *create_reply({ payload: { payload, disscuss_id } },{ call, put, select }) {
            // console.log('create reply', payload)
            const resp = yield call(createReply, payload)
            yield put({
                type:'get_by_id',
                payload:{ disscuss_id }
            })
            if (!resp.status) message.error(''+resp.message)
        },

        *delete_comment({ payload:{ id, disscuss_id } }, { call, put }){
            // console.log("删除评论",payload)
            const resp = yield call(deleteComment, { id })
            yield put({
                type:'get_by_id',
                payload:{ disscuss_id }
            })
            if (resp.status) message.success("删除评论成功")
            // console.log('resp',resp)
        },

        *delete_replay({ payload:{ id, disscuss_id } }, { call, put }){
            // console.log("删除回复",payload)
            const resp = yield call(deleteReplay, { id })
            yield put({
                type:'get_by_id',
                payload:{ disscuss_id }
            })
            if (resp.status) message.success("删除回复成功")
            // console.log('resp',resp)
        },
      },
    
      reducers: {
        save(state, action) {
          return { ...state, ...action.payload };
        },
      },
    
    };
    