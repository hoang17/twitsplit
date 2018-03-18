import keyBy from 'lodash/keyBy'

import {
  FETCH_EVENTS,
  GET_EVENT,
  CREATE_EVENT,
  UPDATE_EVENT,
  DELETE_EVENT
} from '../constants'

const reducer = (state = { ids: [], map: {} }, { type, events, event }) => {
  switch (type) {
    case FETCH_EVENTS:
      var ids = events.map(e => e.id)
      var map = keyBy(events, 'id')
      return {
        ids: [ ...ids],
        map: map,
      }
    case GET_EVENT:
      if (state.map[event.id]) return state
      return {
        ids: [ ...state.ids, event.id],
        map: { ...state.map, [event.id]: event }
      }
    default:
      return state
  }
}

export default reducer
