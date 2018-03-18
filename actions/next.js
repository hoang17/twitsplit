import { TICK, ADD } from '../constants'

export const setClock = () => dispatch => {
  return dispatch({ type: TICK, light: false, ts: Date.now() })
}

export const startClock = () => dispatch => {
  return setInterval(() => dispatch({ type: TICK, light: true, ts: Date.now() }), 1000)
}

export const addCount = () => dispatch => {
  return dispatch({ type: ADD })
}
