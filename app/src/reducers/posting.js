import  { handleActions }  from 'redux-actions';

export default posting = handleActions({
    ['posting/set_data'](state, action){
        // console.log('storage/set_data',state,action)
        return {...state, ...action.payload}
    },
}, {
    list:[],
})
