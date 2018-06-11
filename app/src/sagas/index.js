import { call, put, all, select, takeEvery, takeLatest, fork, take, cancel } from 'redux-saga/effects'

const sagaList = []

const model = (myEffect) => {
    const { effects, namespace } = myEffect
    sagaList = sagaList.concat(Object.keys(effects).map(item=>
        takeLatest(`${namespace}/${item}`,(action)=>effects[item](action,{ call, put, all, select, fork, take, cancel }))
    ))
}

function* mysagas() {
    model(require('./test').default)
    model(require('./user').default)
    model(require('./course').default)
    model(require('./posting').default)
    model(require('./care').default)
    model(require('./notice').default)
    yield all(sagaList)
}

export default function* rootSaga() {
    // combine all of our sagas that we create
    // and we want to provide all our Watchers sagas
    yield mysagas()

}
