import { TICK, ADD } from '../constants'

export const serverRenderClock = (isServer) => dispatch => {
  return dispatch({ type: TICK, light: !isServer, ts: Date.now() })
}

export const startClock = () => dispatch => {
  return setInterval(() => dispatch({ type: TICK, light: true, ts: Date.now() }), 1000)
}

export const addCount = () => dispatch => {
  return dispatch({ type: ADD })
}

export const initStore = (initialState = exampleInitialState) => {
  return createStore(reducer, initialState, composeWithDevTools(applyMiddleware(thunkMiddleware)))
}
