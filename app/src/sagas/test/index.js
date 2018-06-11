

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

export default {
    namespace: 'test',

    effects: {
        *mydelay({ payload }, { call, select }) {
            console.log('effect, delay', payload)
            const initValue = yield select(state => state.test)
            console.log('init', initValue)
            yield call(delay, 2000)
            console.log('effect, delay', payload)
        }
    }
}