import { HELLO_WORLD, SET_MESSAGE } from '../constants'

const helloWorld = (state = { message: 'Hello' }, action) => {
  switch (action.type) {
    case HELLO_WORLD:
      return { ...state, message: 'Hello, World!' }
    case SET_MESSAGE:
      return { ...state, message: action.message }
    default:
      return state
  }
}

export default helloWorld
