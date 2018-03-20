import {
  SET_USER,
  SET_SNACK,
  SET_USER_IP,
  SET_NEW_EVENT,
  SET_NEW_QUESTION,
  SET_SORT_FIELD,
  SET_PATH,
  SET_VAR,
} from '../constants'

function makeActionCreator(type, ...argNames) {
  return function (...args) {
    let action = { type }
    argNames.forEach((arg, index) => {
      action[argNames[index]] = args[index]
    })
    // return action
    return dispatch => dispatch(action)
  }
}

export const setVar = makeActionCreator(SET_VAR, 'var')
export const setPath = makeActionCreator(SET_PATH, 'path')
export const setSnack = makeActionCreator(SET_SNACK, 'snack')
export const setUser = makeActionCreator(SET_USER, 'user')
export const setUserIP = makeActionCreator(SET_USER_IP, 'userIP')
export const setNewEvent = makeActionCreator(SET_NEW_EVENT, 'newEvent')
export const setNewQuestion = makeActionCreator(SET_NEW_QUESTION, 'newQuestion')
export const setSortField = makeActionCreator(SET_SORT_FIELD, 'sortField')

export function openSnack(msg) {
  return setSnack({ open:true, msg })
}
export function closeSnack() {
  return setSnack({ open:false })
}


// export function setPath(path) {
//   return dispatch => {
//     return dispatch({ type: SET_PATH, path })
//   }
// }
