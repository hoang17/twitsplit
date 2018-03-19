import {
  SET_USER,
  SET_SNACKBAR,
  SET_NEW_EVENT,
} from '../constants'

var emptyEvent = () => {
  return {
    eventName: '',
    eventCode: '',
    startDate: new Date(),
    endDate: new Date(),
  }
}

const reducer = (state = { user: null, info: null, newEvent: emptyEvent() }, { type, user, info, newEvent }) => {
  switch (type) {
    case SET_USER:
      return { ...state, user }
    case SET_SNACKBAR:
      return { ...state, info }
    case SET_NEW_EVENT:
      if (!newEvent) newEvent = emptyEvent()
      state.newEvent = { ...state.newEvent, ...newEvent }
      return { ...state }
    default:
      return state
  }
}

export default reducer
