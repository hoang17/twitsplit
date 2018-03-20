import { combineReducers } from 'redux'
import app from './app'
import events from './events'
import questions from './questions'

export const makeRootReducer = (asyncReducers) => {
  return combineReducers({
    app,
    events,
    questions,
    ...asyncReducers
  })
}

export const injectReducer = (store, { key, reducer }) => {
  if (Object.hasOwnProperty.call(store.asyncReducers, key)) return
  store.asyncReducers[key] = reducer
  store.replaceReducer(makeRootReducer(store.asyncReducers))
}

export default makeRootReducer
