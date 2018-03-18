import { fsQuestions, saveQuestion } from '../lib/datastore'

import {
  FETCH_QUESTIONS,
  CREATE_QUESTION,
  UPDATE_QUESTION,
  DELETE_QUESTION
} from '../constants'

export function fetchQuestions() {
  return async (dispatch, getState) => {
    var res = await fsQuestions.ls().get()
    var questions = res.docs.map(e => e.data())
    return dispatch({ type: FETCH_QUESTIONS, questions })
  }
}
