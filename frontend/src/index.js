import dva from 'dva';
import './index.css';
import createHistory from 'history/createBrowserHistory';
import { persistStore, autoRehydrate } from 'redux-persist';
import Promise from 'promise-polyfill'


// 1. Initialize
const app = dva({
    history:createHistory(),
    extraEnhancers: [autoRehydrate()],
});
//设置全局dispatch
window.dispatch = e => app._store.dispatch(e)

//IE兼容Promise
if(!window.Promise) {window.Promise=Promise}

// 2. Plugins
// app.use({});

// 3. Model
app.model(require('./models/login'))
app.model(require('./models/home/account/teacher'))
app.model(require('./models/home/account/student'))

app.model(require('./models/topic'))
app.model(require('./models/topic/topic_single'))
app.model(require('./models/course'))
app.model(require('./models/disscuss'))
app.model(require('./models/posting'))

// 4. Router
app.router(require('./router'));

// 5. Start
app.start('#root');

//数据持久化
persistStore(app._store,{
  whitelist:['login'],
});
