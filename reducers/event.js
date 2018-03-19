import keyBy from 'lodash/keyBy'

import {
  FETCH_EVENTS,
  OBSERVE_EVENTS,
  GET_EVENT,
  CREATE_EVENT,
  UPDATE_EVENT,
  DELETE_EVENT,
  SET_EVENT,
  OBSERVE_EVENT,
} from '../constants'

const reducer = (state = { byId: [], byHash: {}, current: null }, { type, events, event, id }) => {
  switch (type) {
    case FETCH_EVENTS:
    case OBSERVE_EVENTS:
      var byId = events.map(e => e.id)
      var byHash = keyBy(events, 'id')
      return {
        byId: [ ...byId],
        byHash: byHash,
        current: state.current,
      }
    case OBSERVE_EVENT:
      if (!event) return state
    case GET_EVENT:
    case CREATE_EVENT:
      if (state.byHash[event.id]){
        state.byHash[event.id] = { ...state.byHash[event.id], ...event }
        return { ...state, current: event.id }
      }
      return {
        byId: [ ...state.byId, event.id],
        byHash: { ...state.byHash, [event.id]: event },
        current: event.id
      }
    case SET_EVENT:
    case UPDATE_EVENT:
      state.byHash[event.id] = { ...state.byHash[event.id], ...event }
      return { ...state, current: event.id }
    case DELETE_EVENT: {
      const prunedIds = state.byId.filter(item => item !== event.id)
      delete state.byHash[event.id]
      return {
        byId: prunedIds,
        byHash: state.byHash,
        current: null,
      }
    }
    default:
      return state
  }
}

export default reducer
