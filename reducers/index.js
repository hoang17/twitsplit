import { combineReducers } from 'redux'

// import jsonAPI from './jsonAPI'

import event from './event'
import question from './question'

export const makeRootReducer = (asyncReducers) => {
  return combineReducers({
    // jsonAPI,
    event,
    question,
    ...asyncReducers
  })
}

export const injectReducer = (store, { key, reducer }) => {
  if (Object.hasOwnProperty.call(store.asyncReducers, key)) return
  store.asyncReducers[key] = reducer
  store.replaceReducer(makeRootReducer(store.asyncReducers))
}

export default makeRootReducer
