import { sign_in, modifyPassword } from '../../api'
import { Toast } from 'antd-mobile'

const delay = timeout => new Promise(resolve => setTimeout(resolve, timeout))

export default {
    namespace: 'user',

    effects: {
        *sign_in({ payload }, { call, put }) {
            // console.warn('user saga payload',payload)
            const resp = yield call(sign_in, payload)
            // sign_in(payload).then(resp=>console.warn('sign in respond',resp))
            console.log('sign in respond', resp)
            if (resp.status) {//登陆成功之后直接到主页
                global.token = resp.data.token
                Toast.success("登录成功！", 1)
                yield put({
                    type: 'storage/set_data',
                    payload: {
                        user: {
                            ...resp.data.user,
                            avatar:JSON.parse(resp.data.user.avatar),
                        },
                        token: global.token,
                    }
                })
                yield put({
                    type: 'nav/push',
                    payload: {
                        page: 'home'
                    }
                })
            } else {
                Toast.fail('' + resp.message)
            }
        },

        *modify({ payload }, { call, put, select }) {
            // console.log('modify saga', payload)
            const resp = yield call(modifyPassword, payload)
            // console.log('resp', resp)
            if (resp.status) {
                Toast.success('修改密码成功')
                yield call(delay, 1000)
                yield put({ type: 'user/out' })
            } else {
                Toast.fail('' + resp.message)
            }
        },

        *out({ payload }, { put }) {
            // Toast.info('out')
            global.token = undefined
            yield put({
                type: "storage/set_data",
                payload: { user: {}, token: null }
            })
            yield put({
                type: 'nav/reset',
                payload: { page: 'sign_in' }
            })
        }
    }
}