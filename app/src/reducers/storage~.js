//asyncstorage=>redux

const storage = ( state = {
    token:null,//没有token，
    user:null,//没有用户信息,
    welcome:false,//没有阅读欢迎页面，
}, action )=>{//初始化登录页面
    let { type, payload } = action
    switch (type){
        case 'set_storage':
            return {...state,...payload}
        default:
            return state
    }
}

export default storage