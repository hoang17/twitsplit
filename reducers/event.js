import {
  FETCH_EVENTS,
  CREATE_EVENT,
  UPDATE_EVENT,
  DELETE_EVENT
} from '../constants'

const eventReducer = (state = {events: []}, { type, events }) => {
  switch (type) {
    case FETCH_EVENTS:
      return { ...state, events }
    default:
      return state
  }
}

export default eventReducer
