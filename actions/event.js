import { fsEvents, saveEvent } from '../lib/datastore'

import {
  FETCH_EVENTS,
  GET_EVENT,
  CREATE_EVENT,
  UPDATE_EVENT,
  DELETE_EVENT
} from '../constants'

export function fetchEvents(userId) {
  return async (dispatch, getState) => {
    var res = await fsEvents.ls().where('userId','==',userId).get()
    var events = res.docs.map(e => e.data())
    return dispatch({ type: FETCH_EVENTS, events })
  }
}

export function getEvent(id) {
  return async (dispatch, getState) => {
    var state = getState()
    var event = state.event.map[id]
    if (!event)
      event = await fsEvents.data(id)
    return dispatch({ type: GET_EVENT, event })
  }
}
