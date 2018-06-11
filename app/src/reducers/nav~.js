//导航
import { NavigationActions } from 'react-navigation'

import AppRouter from '../../router'

const myNav = ( state = { index:0, routes:[{key: 'init', routeName: 'sign_in'}] }, action )=>{//初始化登录页面
  let { type, payload } = action
  switch (type){
    case 'nav_push':
      return AppRouter.router.getStateForAction(
        NavigationActions.navigate({ routeName: payload.page, params:payload.data }), 
        state
      );
    case 'nav_pop':
      return AppRouter.router.getStateForAction(
        NavigationActions.back(),
        state
      )
    case 'reset':
      return {index:0, routes:[{key:'reset',routeName:payload.page}]}

    case 'set_params':
    
      return AppRouter.router.getStateForAction(
        NavigationActions.setParams({
          params:payload,
          key:'reset'
        }),
        state
      )
    default:
      return AppRouter.router.getStateForAction(action, state);
  } 
}

export default myNav

//{storage:state['reduxPersist:storage']}