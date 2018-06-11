import {routerRedux} from "dva/router";
import {message} from "antd"
import moment from 'moment'
import {topicBind, topicGetDataByID, updateCourse, updateTopic} from '../../services'


export default {

  namespace: 'topic_single',

  state: {
    topic_data: {},//topic单独ID数据展示
    topic_binds: [],
    topic_courses: [],
    teacher_data: [],//老师
    teacher_from_name: {},
  },


  effects: {
    * getData({payload}, {call, put, select, all}) {
      const {share_mode_map, share_mode_map_reverse} = yield select(state => state.topic)
      const {id} = payload
      const {fromID: frID} = yield select(state => state.teacher)
      const call_puts = []
      call_puts.push(yield call(topicGetDataByID, {id}))
      if (JSON.stringify(frID) === "{}") {
        call_puts.push(
          yield put({type: 'teacher/getTeacherData'})
        )
      }
      const [resp] = yield all(call_puts)
      const {status, message: resp_message, data: resp_data} = resp
      if (!status) {
        message.warning(resp_message);
        return null
      }
      const {data, fromID} = yield select(state => state.teacher)
      const teacher_data = [], teacher_from_name = {}, {binds, courses, topic} = resp_data
      const {teacher_id, share} = topic
      data.forEach(item => {
        const teacher_value = item.id + "_" + item.name
        const rows = {...item, teacher_value, disabled: item.id === teacher_id}
        teacher_data.push(rows)
        teacher_from_name[teacher_value] = rows
      })
      const topic_data = {
        ...topic,
        author: fromID[teacher_id].name,
        sharing_mode: share_mode_map_reverse[share]
      }, topic_binds = binds.map(item => item.teacher_id + "_" + fromID[item.teacher_id].name)
      const courses_data=courses.map((i,index)=>({key:index,...i}))//一个课题的开课记录
      yield put({
        type: 'save',
        payload: {teacher_data, teacher_from_name, topic_data: topic_data, topic_binds,courses_data}
      })
    },
    * submitData({payload}, {call, put, select, all}) {
      const {share_mode_map, share_mode_map_reverse} = yield select(state => state.topic)
      const {teacher_from_name, topic_data, topic_binds} = yield select(state => state.topic_single)
      const {values} = payload
      const {sharing_people, sharing_mode,file,guide_video,learn_video,cover} = values
      const change_ids = new Set(sharing_people.map(i => teacher_from_name[i].id))
      const topic_ids = new Set(topic_binds.map(i => teacher_from_name[i].id))
      const add_ids = [...change_ids].filter(i => !topic_ids.has(i))
      const del_ids = [...topic_ids].filter(i => !change_ids.has(i))
       // console.log("%c value","color:red",payload,change_ids,topic_ids,"add",add_ids,'del',del_ids)
      const val = {
        id: topic_data.id,
        name: values.name,
        description: values.topic_description,
        share: share_mode_map[sharing_mode],
        file,guide_video,learn_video,cover
      }
      const [bind_result, update_result] = yield all([
        yield call(topicBind, {topic_id: topic_data.id, add_list: add_ids, del_list: del_ids}),
        yield call(updateTopic, val)])
      const {status: bind_status} = bind_result
      const {status: update_status} = update_result
      if (!bind_status || !update_status) {
        message.warning('修改课题失败');
        return null
      }
      message.success("修改课题成功")
      yield put({
        type:"topic/getData"
      })
      yield put({
        type: "getData",
        payload: {id: topic_data.id}
      })
    },
    * deleteCourseData({payload},{call,put,select,all}){
      const {course,topic_data}=payload
      const {status}=yield call(updateCourse,[{id:course.course_id,is_valid:false}])
      if(status){
        yield put({
          type: "getData",
          payload: {id: topic_data.id}
        })
      }
    }
  },

  reducers: {
    save(state, action) {
      return {...state, ...action.payload};
    },
  },

}
