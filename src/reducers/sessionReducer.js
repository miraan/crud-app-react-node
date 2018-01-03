// @flow

import history from '../util/history'
import Authenticator from '../util/Authenticator'

import type { SessionAction } from '../actions/sessionActions'

export type SessionState = boolean

const initialSessionState: SessionState = Authenticator.isLoggedIn()

export default function sessionReducer(
  state: SessionState = initialSessionState,
  action: SessionAction
) {
  switch (action.type) {
    case 'LOGIN_SUCCESS':
      history.push('/trips')
      return Authenticator.isLoggedIn()
    case 'LOG_OUT':
      history.push('/')
      return Authenticator.isLoggedIn()
    default:
      return state
  }
}
