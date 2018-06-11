import { getPosting } from '../../api'
import { Toast } from 'antd-mobile'

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

export default {
    namespace: 'posting',

    effects: {
        *getData({ payload }, { call, select, put }) {
            const resp = yield call(getPosting)
            if (resp.status) {
                yield put({
                    type: 'posting/set_data',
                    payload: {
                        list: resp.data.map(item => ({
                            ...item,
                            materials: JSON.parse(item.materials),
                            pics: JSON.parse(item.pics)
                        }))
                    }
                })
                // console.log('posting saga getdata', resp)
            } else Toast.fail('' + resp.message)
        },
    }
}