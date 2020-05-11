import * as types from './types'

const defaultState = {
  username: ""
}

const reducerActions = {
  [types.SIGN_IN](state, action) {
    return {
      ...state,
      username: action.payload
    }
  }
}

const reducer = (state = defaultState, action) => {
  return reducerActions[action.type] ? reducerActions[action.type](state, action) : state
}

export default reducer