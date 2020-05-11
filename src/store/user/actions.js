import * as types from './types'

export const signIn = ({ username }) => ({ type: types.SIGN_IN, payload: username })
