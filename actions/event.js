import { fsEvents, saveEvent } from '../lib/datastore'

import {
  FETCH_EVENTS,
  OBSERVE_EVENTS,
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

export function obsEvents(userId) {
  return (dispatch, getState) => {
    fsEvents.ls().where('userId','==',userId).onSnapshot(snapshot => {
      snapshot.docChanges.forEach(function(change) {
          switch (change.type) {
            case 'added':
              dispatch({ type: CREATE_EVENT, event: change.doc.data() })
              break;
            case 'modified':
              dispatch({ type: UPDATE_EVENT, event: change.doc.data() })
              break;
            case 'removed':
              dispatch({ type: DELETE_EVENT, event: change.doc.data() })
              break;
            default:
          }
      })
      // var events = snapshot.docs.map(e => e.data())
      // dispatch({ type: OBSERVE_EVENTS, events })
    })
  }
}

export function getEvent(id) {
  return async (dispatch, getState) => {
    var state = getState()
    var event = state.event.byHash[id]
    if (!event)
      event = await fsEvents.data(id)
    return dispatch({ type: GET_EVENT, event })
  }
}

export function createEvent(event){
  return dispatch => saveEvent(event)
}

export function updateEvent(event){
  return dispatch => saveEvent(event)
}

export function deleteEvent(id){
  return dispatch => fsEvents.delete(id)
}