import { SET_USER } from '../constants'

export function setUser(user) {
  return (dispatch, getState) => {
    return dispatch({ type: SET_USER, user })
  }
}
