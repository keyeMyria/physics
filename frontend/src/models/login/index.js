export default {
    
      namespace: 'login',
    
      state: {
      },
    
      subscriptions: {
        setup({ dispatch, history }) {  // eslint-disable-line
        },
      },
    
      effects: {
        *fetch({ payload }, { call, put }) {  // eslint-disable-line
          yield put({ type: 'save' });
        },
      },
    
      reducers: {
        save(state, action) {
          return { ...state, ...action.payload };
        },
        login(state,{payload:{auther}}) {
          // console.log("loginreducer",auther)
          return{...state,auther:auther}
        }
      }, 
};