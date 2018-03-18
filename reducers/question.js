import keyBy from 'lodash/keyBy'

import {
  FETCH_QUESTIONS,
  OBSERVE_QUESTIONS,
  GET_QUESTION,
  CREATE_QUESTION,
  UPDATE_QUESTION,
  DELETE_QUESTION
} from '../constants'

const reducer = (state = { byId: [], byHash: {} }, { type, questions, question }) => {
  switch (type) {
    case FETCH_QUESTIONS:
    case OBSERVE_QUESTIONS:
      var byId = questions.map(e => e.id)
      var byHash = keyBy(questions, 'id')
      return {
        byId: [ ...byId],
        byHash: byHash,
      }
    case GET_QUESTION:
    case CREATE_QUESTION:
      if (state.byHash[question.id]) return state
      return {
        byId: [ ...state.byId, question.id],
        byHash: { ...state.byHash, [question.id]: question }
      }
    case UPDATE_QUESTION:
      state.byHash[question.id] = { ...state.byHash[question.id], ...question }
      return { ...state }
    case DELETE_QUESTION: {
      const prunedIds = state.byId.filter(item => item !== question.id)
      delete state.byHash[question.id]
      return {
        byId: prunedIds,
        byHash: state.byHash
      }
    }
    default:
      return state
  }
}

export default reducer
