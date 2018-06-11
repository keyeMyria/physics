import { getNotice, clearNotive } from '../../api'
import { Toast } from 'antd-mobile'

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

export default {
    namespace: 'notice',

    effects: {
        *getData({ payload }, { call, select, put }) {
            const resp = yield call(getNotice)
            if (resp.status) {
                yield put({
                    type: 'notice/set_data',
                    payload: {
                        discuss: resp.data
                    }
                })
            } else Toast.fail('' + resp.message)
        },

        *clear({ payload }, { call, put }) {
            const resp = yield call(clearNotive, payload)
            // console.log('clear', resp)
            if (resp.status) {
                yield put({ //重新获取notice
                    type: 'notice/getData',
                })
            } else Toast.fail('' + resp.message)
        }
    }
}