import { combineReducers } from 'redux'
import user from './user'
import event from './event'
import question from './question'

export const makeRootReducer = (asyncReducers) => {
  return combineReducers({
    user,
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
