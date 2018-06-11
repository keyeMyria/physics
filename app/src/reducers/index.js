import { combineReducers } from 'redux'

import myNav from './nav'
import storage from './storage'
import test from './test'
import course from './course'
import posting from './posting'
import care from './care'
import notice from './notice'

export default reducers = combineReducers({
    storage,
    nav:myNav,
    test,
    course,
    posting,
    care,
    notice
})
