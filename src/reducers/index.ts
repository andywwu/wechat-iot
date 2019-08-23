import { combineReducers } from 'redux'
import counter from './counter'
import global from './global'
import wifi from './wifi'

export default combineReducers({
  counter,
  global,
  wifi
})
