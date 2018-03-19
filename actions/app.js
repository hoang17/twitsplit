import {
  SET_USER,
  SET_SNACKBAR,
  SET_NEW_EVENT,
} from '../constants'

export function setSnack(info) {
  return dispatch => {
    return dispatch({ type: SET_SNACKBAR, info })
  }
}

export function setUser(user) {
  return (dispatch, getState) => {
    return dispatch({ type: SET_USER, user })
  }
}

export function setNewEvent(newEvent) {
  return dispatch => {
    return dispatch({ type: SET_NEW_EVENT, newEvent })
  }
}
