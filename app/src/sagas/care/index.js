import { getCare } from '../../api'
import { Toast } from 'antd-mobile'

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

export default {
    namespace: 'care',

    effects: {
        *getData({ payload }, { call, select, put }) {
            const resp = yield call(getCare)
            // console.log('care get data', resp)
            if (resp.status) {
                yield put({
                    type: 'care/set_data',
                    payload: {
                        discuss: resp.data
                    }
                })
            } else Toast.fail('' + resp.message)
        }
    }
}