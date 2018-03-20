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

const reducer = (state = initialState, { type, path, user, snack, newEvent, userIP, newQuestion, sortField, obj }) => {
  switch (type) {
    case SET_VAR:
      return { ...state, ...obj }
    case SET_PATH:
      state.prevPath = state.path
      return { ...state, path }
    case SET_USER:
      return { ...state, user }
    case SET_USER_IP:
      return { ...state, userIP }
    case SET_SNACK:
      return { ...state, snack }
    case SET_SORT_FIELD:
      return { ...state, sortField }
    case SET_NEW_EVENT:
      if (!newEvent) newEvent = emptyEvent()
      state.newEvent = { ...state.newEvent, ...newEvent }
      return { ...state }
    case SET_NEW_QUESTION:
      state.newQuestion = { ...state.newQuestion, ...newQuestion }
      return { ...state }
    default:
      return state
  }
}

export default reducer
