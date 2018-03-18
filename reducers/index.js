import { combineReducers } from 'redux'

import runtime from './runtime'
import hello from './hello'
import jsonAPI from './jsonAPI'
import next from './next'
import todos from './todos'
import visibilityFilter from './visibilityFilter'

export const makeRootReducer = (asyncReducers) => {
  return combineReducers({
    runtime,
    jsonAPI,
    hello,
    next,
    todos,
    visibilityFilter,
    ...asyncReducers
  })
}

export const injectReducer = (store, { key, reducer }) => {
  if (Object.hasOwnProperty.call(store.asyncReducers, key)) return
  store.asyncReducers[key] = reducer
  store.replaceReducer(makeRootReducer(store.asyncReducers))
}

export default makeRootReducer
