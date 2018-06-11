import {getTopic, createTopic, updateTopic} from '../../services'
import {routerRedux} from "dva/router";
import {message} from "antd"
import moment from 'moment'

export default {

  namespace: 'topic',

  state: {
    list: [],
    topic_data: [],//topic页面数据
    topic_show: [],//topic页面数据展示
    search_text: '',//搜索内容
    share_mode_map:{"all_people":"所有人可见","personal":"私有","special_people":"指定人可见"},
    share_mode_map_reverse:{"所有人可见":"all_people","私有":"personal","指定人可见":"special_people"}
  },

  // subscriptions: {
  //   setup({ dispatch, history }) {  // eslint-disable-line
  //   },
  // },

  effects: {
    * fetch({payload}, {call, put}) {  // eslint-disable-line
      yield put({type: 'save'});
    },

    * getData({}, {call, put, select, all}) {
      const {fromID: frID} = yield select(state => state.teacher)
      const call_puts = []
      call_puts.push(yield call(getTopic))
      if (JSON.stringify(frID) === "{}") {
        call_puts.push(
          yield put({type: 'teacher/getTeacherData'})
        )
      }
      const [resp] = yield all(call_puts)

      const {status} = resp
      const {fromID: teacher_fromID, school_from_id} = yield select(state => state.teacher)
     // console.log("teacher_from_ID", teacher_fromID, school_from_id)
      if (status) {
        let {data} = resp
        data = data === null ? [] : data
        // {
        //   id: 123,
        //     title: `课题${1}`,
        //   update_time: '2016-12-12',
        //   pic: `pic_${2}`,
        //   school: '控江中学',
        //   author: '张老师',
        //   counts: '101(次)',
        //   create_time: '2016-12-12'
        // }
        const fromID = {}, topic_data = [], list = [], default_format = "YYYY-MM-DD"
        data.forEach(item => {
          list.push({...item, key: 'topic_key_' + item.id})
          fromID[item.id] = item
          topic_data.push({
            ...item,
            title: item.name,
            author: teacher_fromID[item.teacher_id].name,
            school: school_from_id[teacher_fromID[item.teacher_id].school_id].name,
            create_time: moment(item.created_at).format(default_format),
            update_time: moment(item.updated_at).format(default_format),
            key: 'topic_key_' + item.id
          })
        })
        yield put({
          type: 'save',
          payload: {
            search_text:'',
            list,
            fromID,
            topic_data,
            topic_show: topic_data,
            fetched: true
          }
        })
      }
    },
    * dataChange({payload}) {
      const {topic_data,search_text} = payload
      const sortData = () => {
      }
      const searchData = (data) => {
        return data.filter(i=>i.name.indexOf(search_text)!==-1)
      }
      const data=searchData(topic_data)
      return {topic_show: data}
    },
    * sortData({payload}, {call, put, select, all}) {
      // console.log('payload',payload)
      const {topic_data, search_text} = yield select(state => state.topic)
      const [{topic_show}] = yield all([
        yield put({
          type: "dataChange",
          payload: {...payload, topic_data, search_text}
        })
      ])
      yield put({
        type: 'save',
        payload: {
          sort_require: payload,
          topic_show: topic_show,
        }
      })
    },
    * searchData({payload}, {put, call, select, all}) {
      const {topic_data, sort_require} = yield select(state => state.topic)
      const [{topic_show}] = yield all([
        yield put({
          type: "dataChange",
          payload: {search_text: payload, topic_data, sort_require}
        })
      ])
      yield put({
        type: 'save',
        payload: {
          search_text: payload,
          topic_show: topic_show,
        }
      })
    },
    // * getDataByID({payload}, {call, put, select}) {
    //   console.log('values', payload)
    //   const selectssss = yield select(state => state.topic)
    //   dispatch(routerRedux.push(`/topic/topic_detail/${1}`))
    // },
    * addTopicData({payload}, {call, put, select}) {
      const {share_mode_map}=yield select(state=>state.topic)
      const {name,sharing_mode}=payload
      // console.log("新增数据·", payload)
      const resp=yield call(createTopic,{share:share_mode_map[sharing_mode],name})
      const {status,data:id,message:resp_message}=resp
      if(!status) {message.warning(resp_message);return null}
      yield put({
        type:"getData"
      })
      dispatch(routerRedux.push(`/topic/topic_detail/${id}`))
    },
    * deleteTopicData({payload},{call,put,select}){
      const {id}=payload
      const {status}=yield call(updateTopic,{id,is_valid:false})
      if(status)
      yield put({
        type:"getData"
      })
    },
    * deleteTopicSingleData({payload},{call,put,select}){
      const {id}=payload
      const {status}=yield call(updateTopic,{id,is_valid:false})
      if(status)
        yield put({
          type:"getData"
        })
      dispatch(routerRedux.push(`/topic`))
    }
  },

  reducers: {
    save(state, action) {
      return {...state, ...action.payload};
    },
  },

}
