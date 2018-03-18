import apis from './api.js'

import { SET_API_DATA } from '../constants'

export const getJsonAPI = () => {
  return function (dispatch, getState) {
    return apis.getJsonAPI().then((res) => {
      dispatch({
        type: SET_API_DATA,
        products: res
      })
    })
  }
}
