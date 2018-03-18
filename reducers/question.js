import keyBy from 'lodash/keyBy'

import {
  FETCH_QUESTIONS,
  GET_QUESTION,
  CREATE_QUESTION,
  UPDATE_QUESTION,
  DELETE_QUESTION
} from '../constants'

const reducer = (state = { ids: [], map: {} }, { type, questions, question }) => {
  switch (type) {
    case FETCH_QUESTIONS:
      var ids = questions.map(e => e.id)
      var map = keyBy(questions, 'id')
      return {
        ids: [ ...ids],
        map: map,
      }
    case GET_QUESTION:
      if (state.map[question.id]) return state
      return {
        ids: [ ...state.ids, question.id],
        map: { ...state.map, [question.id]: question }
      }
    default:
      return state
  }
}

export default reducer
