import { fsQuestions, saveQuestion } from '../lib/datastore'

import {
  FETCH_QUESTIONS,
  GET_QUESTION,
  CREATE_QUESTION,
  UPDATE_QUESTION,
  DELETE_QUESTION
} from '../constants'

export function fetchQuestions(eventId) {
  return async (dispatch, getState) => {
    var res = await fsQuestions.ls().where('eventId','==',eventId).get()
    var questions = res.docs.map(e => e.data())
    return dispatch({ type: FETCH_QUESTIONS, questions })
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
