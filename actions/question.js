import { fsQuestions, saveQuestion, updateLike, updateHighlight } from '../lib/datastore'

import {
  FETCH_QUESTIONS,
  OBSERVE_QUESTIONS,
  OBSERVE_QUESTION,
  GET_QUESTION,
  CREATE_QUESTION,
  UPDATE_QUESTION,
  DELETE_QUESTION,
  HIGHLIGHT_QUESTION,
  LIKE_QUESTION,
  SET_QUESTION,
} from '../constants'

export function fetchQuestions(eventId) {
  return async (dispatch, getState) => {
    var res = await fsQuestions.ls().where('eventId','==',eventId).get()
    var questions = res.docs.map(e => e.data())
    return dispatch({ type: FETCH_QUESTIONS, questions })
  }
}

export function fetchOrderedQuestions(eventId, field, order = 'desc') {
  return async (dispatch, getState) => {
    var snapshot = await fsQuestions.ls().where('eventId','==',eventId).orderBy(field, order).get()
    var { app } = getState()
    var questions = snapshot.docs.map(e => {
      var question = e.data()
      question.liked = question.likes && question.likes[app.userIP]
      return question
    })
    return dispatch({ type: FETCH_QUESTIONS, questions })
  }
}

export function obsQuestions(eventId) {
  return (dispatch, getState) => {
    return fsQuestions.ls().where('eventId','==',eventId).onSnapshot(snapshot => {
      snapshot.docChanges.forEach(change => {
        var question = change.doc.data()
        switch (change.type) {
          case 'added':
            dispatch({ type: CREATE_QUESTION, question })
            break;
          case 'modified':
            dispatch({ type: UPDATE_QUESTION, question })
            break;
          case 'removed':
            dispatch({ type: DELETE_QUESTION, question })
            break;
          default:
        }
      })
    })
  }
}

export function obsOrderedQuestions(eventId, field, order = 'desc') {
  return (dispatch, getState) => {
    return fsQuestions.ls().where('eventId','==',eventId).orderBy(field, order).onSnapshot(snapshot => {
      var { app } = getState()
      var questions = snapshot.docs.map(e => {
        var question = e.data()
        question.liked = question.likes && question.likes[app.userIP]
        return question
      })
      dispatch({ type: OBSERVE_QUESTIONS, questions })
    })
  }
}

export function obsQuestion(id) {
  return dispatch => {
    return fsQuestions.doc(id).onSnapshot(doc => {
      var question = doc.data()
      dispatch({ type: OBSERVE_QUESTION, question })
    })
  }
}

export function getQuestion(id) {
  return async (dispatch, getState) => {
    var state = getState()
    var question = state.questions.byHash[id]
    if (!question)
      question = await fsQuestions.data(id)
    return dispatch({ type: GET_QUESTION, question })
  }
}

export function createQuestion(question){
  return dispatch => {
    return saveQuestion(question)
    // return dispatch({ type: CREATE_QUESTION, question })
  }
}

export function updateQuestion(question){
  return dispatch => {
    return saveQuestion(question)
    // return dispatch({ type: UPDATE_QUESTION, question })
  }
}

export function deleteQuestion(id){
  return dispatch => {
    return fsQuestions.delete(id)
    // return dispatch({ type: DELETE_QUESTION, id })
  }
}

export function highlightQuestion(id){
  return async (dispatch, getState) => {
    var { questions } = getState()
    var { id, mark, eventId } = questions.byHash[id]
    mark = !mark
    var question = { id, mark, eventId }
    return updateHighlight(question)
    return dispatch({ type: HIGHLIGHT_QUESTION, question })
  }
}

export function likeQuestion(id){
  return async (dispatch, getState) => {
    var { app, questions } = getState()

    var { userIP } = app
    var { liked, likes } = questions.byHash[id]

    liked = !liked

    if (!likes) likes = {}

    if (liked)
      likes[userIP] = liked
    else
      delete likes[userIP]

    var question = {
      id,
      likes,
      likes_count: Object.keys(likes).length
    }

    await updateLike(question)
    return dispatch({ type: LIKE_QUESTION, question })
  }
}

export function setQuestion(question) {
  return dispatch => {
    return dispatch({ type: SET_QUESTION, question })
  }
}
