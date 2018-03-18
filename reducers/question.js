import {
  FETCH_QUESTIONS,
  CREATE_QUESTION,
  UPDATE_QUESTION,
  DELETE_QUESTION
} from '../constants'

const reducer = (state = {questions: []}, { type, questions }) => {
  switch (type) {
    case FETCH_QUESTIONS:
      return { ...state, questions }
    default:
      return state
  }
}

export default reducer
