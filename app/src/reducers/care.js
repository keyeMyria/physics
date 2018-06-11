import  { handleActions }  from 'redux-actions';

export default care = handleActions({
    ['care/set_data'](state, action){
        // console.log('storage/set_data',state,action)
        return {...state, ...action.payload}
    },
}, {
    discuss:[],//所有问题
})
