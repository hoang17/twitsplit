import { SET_USER } from '../constants'

const userReducer = (state=null, { type, user }) => {
  switch (type) {
    case SET_USER:
      return user
    default:
      return state
  }
}

export default userReducer
