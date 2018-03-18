import { SET_USER } from '../constants'

const reducer = (state=null, { type, user }) => {
  switch (type) {
    case SET_USER:
      return user
    default:
      return state
  }
}

export default reducer
