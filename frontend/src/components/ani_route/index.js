//带动画的导航切换
import TweenOne, { TweenOneGroup } from 'rc-tween-one';
import { Route } from 'dva/router'

const AniRoute = (props) => (
    <TweenOne
      animation={{opacity:0, y:30, type:'from'}}
      component={Route}
    >
        <Route {...props} />
    </TweenOne> 
)

export default AniRoute