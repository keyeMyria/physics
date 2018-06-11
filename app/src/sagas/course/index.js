import { getCourse, getDiscuss, createDiscuss, getDiscussByID, studentTest, careDisscuss } from '../../api'
import { Toast } from 'antd-mobile'

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

export default {
    namespace: 'course',

    effects: {
        *getData({ payload }, { call, select, put }) {
            const { begin_date, end_date } = yield select(state => state.course)
            // console.log('course saga get data', begin_date, end_date)
            const resp = yield call(getCourse, { begin_date, end_date })
            // console.log('resp', resp)
            if (resp.status) {
                yield put({
                    type: 'course/set_data',
                    payload: {
                        list: resp.data.map(item => ({
                            ...item,
                            cover: JSON.parse(item.cover),
                            guide_video: JSON.parse(item.guide_video),
                            learn_video: JSON.parse(item.learn_video),
                            file: JSON.parse(item.file),
                            questions: JSON.parse(item.questions),
                            test: JSON.parse(item.test),
                            homework:JSON.parse(item.homework),
                        }))
                    }
                })
            } else {
                Toast.fail('' + resp.message)
            }
        },

        *timing({ payload }, { put, call, fork, take, cancel }) {
            function* count(over) {
                while (over > 0) {
                    yield put({ type: 'course/set_data', payload: { timing: over-- } })
                    // console.log('timing',over)
                    yield call(delay, 1000)
                }
            }
            // let over = payload.timing
            const task = yield fork(count, payload.timing)
            const { payload: { answer, flag, course_id } } = yield take('course/stop')
            // console.log('stopppppppp',answer,flag)
            const resp = yield call(studentTest, {
                course_id,
                test: answer.map(item => ({ list: item })),
                index: flag,
            })
            // console.log('test resp', resp)
            if (resp.status) {
                Toast.success(`第${flag + 1}次答题完成`)
                yield put({ //更新数据
                    type: 'course/getData'
                })
                yield put({
                    type:'storage/pushRecord',
                    payload:{
                        title:`讨论组：${course_id}`,
                        description:`完成第${flag+1}次答题`
                    }
                })
            } else Toast.fail('' + resp.message)

            yield cancel(task)
        },

        *getDis({ payload }, { call, put }) {
            const resp = yield call(getDiscuss, payload)
            // console.log('get dis resp',resp)
            if (resp.status) {
                yield put({
                    type: 'course/set_data',
                    payload: {
                        discuss: resp.data
                    }
                })
            } else Toast.fail('' + resp.message)
        },

        *createDis({ payload }, { call, put }) {
            const resp = yield call(createDiscuss, payload)
            if (resp.status) {
                Toast.success("提问成功")
                yield call(delay, 1000)
                yield put({ //重新取一次数
                    type: 'course/getDis',
                    payload: {
                        course_id: payload.course_id
                    }
                })
                yield put({ //返回上一个页面
                    type: 'nav/pop'
                })
            } else Toast.fail('' + resp.message)
        },

        *getADis({ payload }, { call, put }) {
            const resp = yield call(getDiscussByID, payload)
            // console.log('respsssss',resp)
            if (resp.status) {
                yield put({
                    type: 'course/set_data',
                    payload: {
                        aDiscuss: resp.data
                    }
                })
            } else Toast.fail('' + resp.message)
        },

        *care({ payload }, { call, put }) {
            const resp = yield call(careDisscuss, payload)
            // console.log('care', resp)
            if (resp.status){
                Toast.success(payload.care?'关注成功':'取消关注')
                yield put({
                    type:'course/getADis',
                    payload:{
                        disscuss_id:payload.disscuss_id,
                    }
                })
                yield put({
                    type:'storage/pushRecord',
                    payload:{
                        title:`问题${payload.disscuss_id}`,
                        description:payload.care?'关注成功':'取消关注'
                    }
                })
            } else Toast.fail(''+resp.message)
        }
    }
}