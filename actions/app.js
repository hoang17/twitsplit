import {
  SET_USER,
  SET_SNACK,
  SET_USER_IP,
  SET_NEW_EVENT,
  SET_NEW_QUESTION,
  SET_SORT_FIELD,
} from '../constants'

export function setSnack(info) {
  return dispatch => {
    return dispatch({ type: SET_SNACK, info })
  }
}

export function setUser(user) {
  return dispatch => {
    return dispatch({ type: SET_USER, user })
  }
}

export function setUserIP(userIP) {
  return dispatch => {
    return dispatch({ type: SET_USER_IP, userIP })
  }
}

export function setNewEvent(newEvent) {
  return dispatch => {
    return dispatch({ type: SET_NEW_EVENT, newEvent })
  }
}

export function setNewQuestion(newQuestion) {
  return dispatch => {
    return dispatch({ type: SET_NEW_QUESTION, newQuestion })
  }
}

export function setSortField(sortField) {
  return dispatch => {
    return dispatch({ type: SET_SORT_FIELD, sortField })
  }
}
