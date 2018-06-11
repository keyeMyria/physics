//测试saga
import  {handleActions}  from 'redux-actions'

export default Test = handleActions({
    ['test/save'](state,action){
        return { ...state, ...action.payload }
    },
},{
    data:'test initial value'
})

//{storage:state['reduxPersist:storage']}