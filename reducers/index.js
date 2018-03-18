import { combineReducers } from 'redux'

// import runtime from './runtime'
// import hello from './hello'
// import jsonAPI from './jsonAPI'
// import next from './next'
// import todos from './todos'
// import visibilityFilter from './visibilityFilter'

import event from './event'
import question from './question'

export const makeRootReducer = (asyncReducers) => {
  return combineReducers({
    // runtime,
    // jsonAPI,
    // hello,
    // next,
    // todos,
    // visibilityFilter,
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
