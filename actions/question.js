import { fsQuestions, saveQuestion, like, highlight } from '../lib/datastore'

import {
  FETCH_QUESTIONS,
  OBSERVE_QUESTIONS,
  GET_QUESTION,
  CREATE_QUESTION,
  UPDATE_QUESTION,
  DELETE_QUESTION,
  HIGHLIGHT_QUESTION,
  LIKE_QUESTION,
} from '../constants'

export function fetchQuestions(eventId) {
  return async (dispatch, getState) => {
    var res = await fsQuestions.ls().where('eventId','==',eventId).get()
    var questions = res.docs.map(e => e.data())
    return dispatch({ type: FETCH_QUESTIONS, questions })
  }
}

export function obsQuestions(eventId) {
  return (dispatch, getState) => {
    fsQuestions.ls().where('eventId','==',eventId).onSnapshot(snapshot => {
      snapshot.docChanges.forEach(function(change) {
          switch (change.type) {
            case 'added':
              dispatch({ type: CREATE_QUESTION, question: change.doc.data() })
              break;
            case 'modified':
              dispatch({ type: UPDATE_QUESTION, question: change.doc.data() })
              break;
            case 'removed':
              dispatch({ type: DELETE_QUESTION, question: change.doc.data() })
              break;
            default:
          }
      })
    })
  }
}

export function getQuestion(id) {
  return async (dispatch, getState) => {
    var state = getState()
    var question = state.question.map[id]
    if (!question)
      question = await fsQuestions.data(id)
    return dispatch({ type: GET_QUESTION, question })
  }
}

export function createQuestion(question){
  return dispatch => saveQuestion(question)
}

export function updateQuestion(question){
  return dispatch => saveQuestion(question)
}

export function deleteQuestion(id){
  return dispatch => fsQuestions.delete(id)
}

export function highlightQuestion({id, mark, eventId}){
  return dispatch => highlight(id, mark, eventId)
}

export function likeQuestion({id, userIP, liked, likes}){
  return dispatch => like({id, userIP, liked, likes})
}
