import  { handleActions }  from 'redux-actions';

export default course = handleActions({
    ['course/set_data'](state, action){
        // console.log('storage/set_data',state,action)
        return {...state, ...action.payload}
    },
}, {
    begin_date:'2018-02-01',
    end_date:'2018-03-31',
    list:[],
    timing:-1,//答题倒计时
    discuss:[],//所有问题
    aDiscuss:{
        comments:[],//所有评论
        discuss:{},//该提问的具体信息
        replys:{}//相关回复
    },//讨论区页面的数据（一个问题）
})
