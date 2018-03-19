import { fsEvents, saveEvent } from '../lib/datastore'

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

export function fetchEvents(userId) {
  return async dispatch => {
    var res = await fsEvents.ls().where('userId','==',userId).get()
    var events = res.docs.map(e => e.data())
    return dispatch({ type: FETCH_EVENTS, events })
  }
}

export function obsEvents(userId) {
  return dispatch => {
    return fsEvents.ls().where('userId','==',userId).onSnapshot(snapshot => {
      snapshot.docChanges.forEach(change => {
        var event = change.doc.data()
        switch (change.type) {
          case 'added':
            dispatch({ type: CREATE_EVENT, event })
            break;
          case 'modified':
            dispatch({ type: UPDATE_EVENT, event })
            break;
          case 'removed':
            dispatch({ type: DELETE_EVENT, id: event.id })
            break;
          default:
        }
      })
      // var events = snapshot.docs.map(e => e.data())
      // dispatch({ type: OBSERVE_EVENTS, events })
    })
  }
}

export function getEventByCode(code) {
  return async dispatch => {
    var snapshot = await fsEvents.ls().where('eventCode','==',code).limit(1).get()
    var event = snapshot.docs[0].data()
    return dispatch({ type: GET_EVENT, event })
  }
}

export function getEvent(id) {
  return async (dispatch, getState) => {
    var state = getState()
    var event = state.events.byHash[id]
    if (!event)
      event = await fsEvents.data(id)
    return dispatch({ type: GET_EVENT, event })
  }
}

export function obsEvent(id) {
  return dispatch => {
    return fsEvents.doc(id).onSnapshot(doc => {
      var event = doc.data()
      dispatch({ type: OBSERVE_EVENT, event })
    })
  }
}

export function obsEventsByCode(code, callback) {
  return dispatch => {
    return fsEvents.ls().where('eventCode','==',code).limit(1).onSnapshot(snapshot => {
      var event = snapshot.docs[0].data()
      dispatch({ type: OBSERVE_EVENT, event })
      callback(event)
    })
  }
}

export function createEvent(event){
  return dispatch => {
    return saveEvent(event)
    // return dispatch({ type: CREATE_EVENT, event })
  }
}

export function updateEvent(event){
  return dispatch => {
    return saveEvent(event)
    // return dispatch({ type: UPDATE_EVENT, event })
  }
}

export function deleteEvent(id){
  return dispatch => {
    return fsEvents.delete(id)
    // return dispatch({ type: DELETE_EVENT, id })
  }
}

export function setEvent(event) {
  return dispatch => {
    return dispatch({ type: SET_EVENT, event })
  }
}
