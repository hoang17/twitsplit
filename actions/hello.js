import { HELLO_WORLD, SET_MESSAGE } from '../constants'

export const helloWorld = () => {
  return (dispatch, getState) => {
    return dispatch({ type: HELLO_WORLD })
  }
}

export const setMessage = (message) => {
  return (dispatch, getState) => {
    return dispatch({ type: SET_MESSAGE, message })
  }
}
