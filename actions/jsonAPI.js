import {
  SET_API_DATA
} from '../constants'

import apis from './api.js'

const jsonAPIActionCreator = {
  getJsonAPI: () => {
    return function (dispatch, getState) {
      return apis.getJsonAPI().then((res) => {
        dispatch({
          type: SET_API_DATA,
          products: res
        })
      })
    }
  }
}
export default jsonAPIActionCreator
