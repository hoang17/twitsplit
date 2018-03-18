import keyBy from 'lodash/keyBy'

import {
  FETCH_EVENTS,
  OBSERVE_EVENTS,
  GET_EVENT,
  CREATE_EVENT,
  UPDATE_EVENT,
  DELETE_EVENT
} from '../constants'

const reducer = (state = { byId: [], byHash: {} }, { type, events, event }) => {
  switch (type) {
    case FETCH_EVENTS:
    case OBSERVE_EVENTS:
      var byId = events.map(e => e.id)
      var byHash = keyBy(events, 'id')
      return {
        byId: [ ...byId],
        byHash: byHash,
      }
    case GET_EVENT:
    case CREATE_EVENT:
      if (state.byHash[event.id]) return state
      return {
        byId: [ ...state.byId, event.id],
        byHash: { ...state.byHash, [event.id]: event }
      }
    case UPDATE_EVENT:
      state.byHash[event.id] = { ...state.byHash[event.id], ...event }
      return { ...state }
    case DELETE_EVENT: {
      const prunedIds = state.byId.filter(item => item !== event.id)
      delete state.byHash[event.id]
      return {
        byId: prunedIds,
        byHash: state.byHash
      }
    }
    default:
      return state
  }
}

export default reducer
