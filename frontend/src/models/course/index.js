import { routerRedux } from 'dva/router'
import { message } from 'antd'
const dateFormat = 'YYYY-MM-DD'

import { saveCourse, updateCourse, getCourseByID, bindCourse, getAllCourse } from '../../services'

export default {
    
      namespace: 'course',
    
      state: {
        data:{
          targetKeys:[],
          teacher_list:[],
          questions:[],
        },
        list:[]
      },
    
      subscriptions: {
        setup({ dispatch, history }) {  // eslint-disable-line
        },
      },
    
      effects: {
        *fetch({ payload }, { call, put }) {  // eslint-disable-line
          yield put({ type: 'save' });
        },

        *getData({},{ call, put, select, all }){
          // console.log('?????? getdata',)
          const { fetched:f1 } = yield select( state=>state.topic )
          const { get_data:f2 } = yield select( state=>state.teacher )
          // console.log('f1f2',f1,f2)

          let calls = []
          calls.push(call(getAllCourse))

          //put的蜜汁bug，之后优化后端取数方式
          if (!f1) calls.push(yield dispatch({type:'topic/getData'}))
          if (!f2) calls.push(yield dispatch({type:'teacher/getTeacherData'}))
          
          // console.log('calls',calls)
          const resps = yield all(calls)
          // console.log('resps',resps)
          const { fromID:topicMap } = yield select(state=>state.topic)
          const { fromID:teacherMap } = yield select(state=>state.teacher)

          // console.log('respsssss',resps)

          if (resps[0].status){
            try{
              const resp = resps[0].data.map(item=>({
                ...item,
                auth:teacherMap[item.teacher_id].name,
                topic:topicMap[item.topic_id].name,
                cover:item.cover?JSON.parse(item.cover):{},
              }))
              // console.log('sagaaaaa',resp)
              yield put({
                type:'save',
                payload:{
                  list:resp
                }
              })
            } catch(e){
              message.error('数据错误',e)
            }
          }
        },

        *getDataByID({ payload },{ call, put }) {
          // console.log('getdatabyid',payload)
          const resp = yield call(getCourseByID,payload)
          if (resp.status && resp.data.length>0){
            const data = resp.data[0]
            // console.log('data',data)
            try{
              data.questions = JSON.parse(data.questions).map((item,index)=>({...item,key:'question_'+index}))
            } catch (e){
              data.questions = []
            }
            try{
              data.teacher_list = JSON.parse(data.teacher_list).map(item=>'teacher_key_'+item.auth_id)
            } catch (e){
              data.teacher_list = []
            }
            try{
              data.targetKeys = JSON.parse(data.student_list).map(item=>'student_key_'+item.student_id)  
            } catch (e){
              data.targetKeys = []
            }

            yield put({
              type:'save',
              payload:{
                data
              }
            })
          }
          else dispatch(routerRedux.push('/course'))
        },

        *saveData({ payload }, { call, put }) {
            payload.topic_id = parseInt(payload.topic_id.split('_')[2])

            payload.begin_date = payload.time_range[0].format(dateFormat)
            payload.end_date = payload.time_range[1].format(dateFormat)
            delete payload.time_range
            // console.log('新增课程',payload)
            let resp = yield call(saveCourse, payload)
            // let resp = {status:0}
            if (resp.status){ //跳转到编辑页面
                dispatch(routerRedux.push(`/course/course_detail/${resp.data}`))
                yield put({
                  type:'getDataByID',
                  payload:{
                    id:resp.data
                  }
                })
            }
        },

        *updateData({ payload }, { call, put, all }) {
            // 
            const { questions, targetKeys, teacher_list, new_student_list, new_teacher_list, id, time_range } = payload
            delete payload.questions
            delete payload.student_list
            delete payload.targetKeys
            delete payload.new_student_list
            delete payload.teacher_list
            delete payload.new_teacher_list
            delete payload.time_range
            delete payload.created_at

            const parseID = (e) => parseInt(e.split('_')[2])
            
            payload.topic_id = parseID(payload.topic_id)
            payload.questions =  JSON.stringify(questions)
            payload.begin_date = time_range[0].format(dateFormat)
            payload.end_date = time_range[1].format(dateFormat)

            // console.log('update course',payload)
            const resp = yield call(updateCourse,[payload])
            // console.log('respppp',resp)

            const binds = (oldList,newList,type) => {
              return [
                call(bindCourse,{
                  course_id:id,
                  type:'insert',
                  ts:type,
                  id_list:newList.filter(item=>oldList.indexOf(item)==-1).map(item=>parseID(item))
                }),
                call(bindCourse,{
                  course_id:id,
                  type:'delete',
                  ts:type,
                  id_list:oldList.filter(item=>newList.indexOf(item)==-1).map(item=>parseID(item))
                })
              ]
            }
            //新增部分
            let resps = yield all([
              ...binds(teacher_list,new_teacher_list,'teacher'),
              ...binds(targetKeys,new_student_list,'student')
            ])

            let flag = resp.status
            resps.forEach(item=>flag = (flag && item.status))
            if (flag) {
              message.success('保存成功！')
              yield put({
                type:'getDataByID',
                payload:{
                  id
                }
              })
            }
            else message.error('保存失败！')
            // console.log('resps',resps)
            // payload.questions = JSON.stringify(questions)

            // console.log('updateCourse', payload,student_list,teacher_list)
        }
      },
    
      reducers: {
        save(state, action) {
          return { ...state, ...action.payload };
        },
      },
    
    };
    