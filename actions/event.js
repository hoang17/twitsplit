import { fsEvents, saveEvent } from '../lib/datastore'

import {
  FETCH_EVENTS,
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
