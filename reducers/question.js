import keyBy from 'lodash/keyBy'

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

const reducer = (state = { byId: [], byHash: {}, current: null }, { type, questions, question, id }) => {
  switch (type) {
    case FETCH_QUESTIONS:
    case OBSERVE_QUESTIONS:
      var byId = questions.map(e => e.id)
      var byHash = keyBy(questions, 'id')
      return {
        byId: [ ...byId],
        byHash: byHash,
        current: state.current,
      }
    case OBSERVE_QUESTION:
      if (!question) return state
    case GET_QUESTION:
    case CREATE_QUESTION:
      if (state.byHash[question.id]){
        state.byHash[question.id] = { ...state.byHash[question.id], ...question }
        return { ...state, current: question.id }
      }
      return {
        byId: [ ...state.byId, question.id],
        byHash: { ...state.byHash, [question.id]: question },
        current: question.id
      }
    case SET_QUESTION:
    case HIGHLIGHT_QUESTION:
    case LIKE_QUESTION:
    case UPDATE_QUESTION:
      state.byHash[question.id] = { ...state.byHash[question.id], ...question }
      return { ...state, current: question.id }
    case DELETE_QUESTION: {
      const prunedIds = state.byId.filter(item => item !== id)
      delete state.byHash[id]
      return {
        byId: prunedIds,
        byHash: state.byHash,
        current: null,
      }
    }
    default:
      return state
  }
}

export default reducer
