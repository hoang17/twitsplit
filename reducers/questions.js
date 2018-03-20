import keyBy from 'lodash/keyBy'

import {
  FETCH_QUESTIONS,
  OBSERVE_QUESTIONS,
  OBSERVE_QUESTION,
  GET_QUESTION,
  ADD_QUESTION,
  UPDATE_QUESTION,
  DELETE_QUESTION,
  HIGHLIGHT_QUESTION,
  LIKE_QUESTION,
  SET_QUESTION,
} from '../constants'

const reducer = (state = { byId: [], byHash: {} }, { type, questions, question, id }) => {
  switch (type) {
    case FETCH_QUESTIONS:
    case OBSERVE_QUESTIONS:
      var byId = questions.map(e => e.id)
      var byHash = keyBy(questions, 'id')
      return {
        byId: [ ...byId],
        byHash: byHash,
      }
    case OBSERVE_QUESTION:
      if (!question) return state
    case GET_QUESTION:
    case ADD_QUESTION:
    case SET_QUESTION:
    case LIKE_QUESTION:
    case UPDATE_QUESTION:
    case HIGHLIGHT_QUESTION:
      if (state.byHash[question.id]){
        state.byHash[question.id] = { ...state.byHash[question.id], ...question }
        return { ...state }
      }
      return {
        byId: [ ...state.byId, question.id],
        byHash: { ...state.byHash, [question.id]: question },
      }
    case DELETE_QUESTION: {
      delete state.byHash[id]
      return {
        byId: state.byId.filter(e => e !== id),
        byHash: state.byHash,
      }
    }
    default:
      return state
  }
}

export default reducer
