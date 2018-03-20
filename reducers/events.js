import keyBy from 'lodash/keyBy'

import {
  FETCH_EVENTS,
  OBSERVE_EVENTS,
  OBSERVE_EVENT,
  GET_EVENT,
  ADD_EVENT,
  UPDATE_EVENT,
  DELETE_EVENT,
  SET_EVENT,
} from '../constants'

const reducer = (state = { byId: [], byHash: {} }, { type, events, event, id }) => {
  switch (type) {
    case FETCH_EVENTS:
    case OBSERVE_EVENTS:
      var byId = events.map(e => e.id)
      var byHash = keyBy(events, 'id')
      return {
        byId: [ ...byId],
        byHash: byHash,
      }
    case OBSERVE_EVENT:
      if (!event) return state
    case GET_EVENT:
    case ADD_EVENT:
    case SET_EVENT:
    case UPDATE_EVENT:
      if (state.byHash[event.id]){
        state.byHash[event.id] = { ...state.byHash[event.id], ...event }
        return { ...state }
      }
      return {
        byId: [ ...state.byId, event.id],
        byHash: { ...state.byHash, [event.id]: event },
      }
    case DELETE_EVENT: {
      delete state.byHash[id]
      return {
        byId: state.byId.filter(e => e !== id),
        byHash: state.byHash,
      }
    }
    default:
      return state
  }
}

export default reducer
