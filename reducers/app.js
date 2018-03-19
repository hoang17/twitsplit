import {
  SET_USER,
  SET_SNACK,
  SET_USER_IP,
  SET_NEW_EVENT,
  SET_NEW_QUESTION,
  SET_SORT_FIELD,
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
  user: null,
  info: {open:false, msg: null},
  newEvent: emptyEvent(),
  newQuestion: emptyQuestion(),
  sortField: 'likes_count'
}

const reducer = (state = initialState, { type, user, info, newEvent, userIP, newQuestion, sortField }) => {
  switch (type) {
    case SET_USER:
      return { ...state, user }
    case SET_USER_IP:
      return { ...state, userIP }
    case SET_SNACK:
      return { ...state, info }
    case SET_SORT_FIELD:
      return { ...state, sortField }
    case SET_NEW_EVENT:
      if (!newEvent) newEvent = emptyEvent()
      state.newEvent = { ...state.newEvent, ...newEvent }
      return { ...state }
    case SET_NEW_QUESTION:
      // if (!newQuestion) newQuestion = emptyQuestion(state)
      state.newQuestion = { ...state.newQuestion, ...newQuestion }
      return { ...state }
    default:
      return state
  }
}

export default reducer
