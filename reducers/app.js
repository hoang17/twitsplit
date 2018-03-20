import { createActions, handleActions, combineActions } from 'redux-actions'

import {
  SET_USER,
  SET_SNACK,
  SET_USER_IP,
  SET_NEW_EVENT,
  SET_NEW_QUESTION,
  SET_SORT_FIELD,
  SET_PATH,
  SET_VAR
} from '../constants'

var emptyEvent = () => {
  return {
    eventName: '',
    eventCode: '',
    startDate: new Date(),
    endDate: new Date(),
  }
}

var emptyQuestion = () => {
  return {
    text: '',
    userName: ''
  }
}

var initialState = {
  path: null,
  prevPath: null,
  user: null,
  snack: {open:false, msg: null},
  newEvent: emptyEvent(),
  newQuestion: emptyQuestion(),
  sortField: 'likes_count'
}

const handlers = {
  [SET_VAR]: (state, action) => {
    return { ...state, ...action.var }
  },

  [SET_PATH]: (state, { path }) => {
    state.prevPath = state.path
    return { ...state, path }
  },

  [SET_USER]: (state, { user }) => {
    return { ...state, user }
  },

  [SET_USER_IP]: (state, { userIP }) => {
    return { ...state, userIP }
  },

  [SET_SNACK]: (state, { snack }) => {
    return { ...state, snack }
  },

  [SET_SORT_FIELD]: (state, { sortField }) => {
    return { ...state, sortField }
  },

  [SET_NEW_EVENT]: (state, { newEvent }) => {
    if (!newEvent) newEvent = emptyEvent()
    state.newEvent = { ...state.newEvent, ...newEvent }
    return { ...state }
  },

  [SET_NEW_QUESTION]: (state, { newQuestion }) => {
    state.newQuestion = { ...state.newQuestion, ...newQuestion }
    return { ...state }
  },
}

const reducer = handleActions(handlers, initialState)

export default reducer
