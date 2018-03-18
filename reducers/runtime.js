import { SET_RUNTIME_VARIABLE } from '../constants'

export default function runtime(state = {}, action) {
  switch (action.type) {
    case SET_RUNTIME_VARIABLE:
      return {
        ...state,
        [action.name]: action.value,
      }
    default:
      return state
  }
}
