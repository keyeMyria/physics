import  { handleActions }  from 'redux-actions';

const storage = handleActions({
    ['storage/set_data'](state, action){
        // console.log('storage/set_data',state,action)
        return {...state, ...action.payload}
    },
    ['storage/clear'](state, action){
        return {}
    },
    ['storage/pushRecord'](state, action){
        const { payload } = action
        return{
            ...state,
            record:state.record.concat(payload)
        }
    }
}, {
    record:[],//学习记录
})

export default storage