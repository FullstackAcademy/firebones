import { combineReducers } from 'redux'

const rootReducer = combineReducers({
  auth: require('./auth').default,  
})

export default rootReducer
