import { NavigationActions } from 'react-navigation'

import AppRouter from '../../router'

//start_screen
export default nav = (state = { index: 0, routes: [{ key: 'init', routeName: 'start_screen' }] }, action) => {//初始化登录页面
  let { type, payload } = action
  // console.log('nav', type, payload)
  switch (type) {
    case 'nav/push':
      if (payload.page === state.routes[state.routes.length - 1].routeName) {
        return state
      } else {
        return AppRouter.router.getStateForAction(
          NavigationActions.navigate({ routeName: payload.page, params: payload.data }),
          state
        )
      }

    case 'nav/pop':
      return AppRouter.router.getStateForAction(
        NavigationActions.back(),
        state
      )

    case 'nav/reset':
      return { index: 0, routes: [{ key: 'reset', routeName: payload.page }] }

    case 'nav/set_params':
      return AppRouter.router.getStateForAction(
        NavigationActions.setParams({
          params: payload,
          key: 'reset'
        }),
        state
      )

    default:
      return AppRouter.router.getStateForAction(action, state);
  }
}