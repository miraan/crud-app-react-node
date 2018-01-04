// @flow

import Authenticator from '../util/Authenticator'
import Api from '../util/Api'
import * as errorActions from './errorActions'

import type { Dispatch } from '.'

export type SessionAction = LoginSuccessAction | LogOutAction

type LoginSuccessAction = {
  type: LoginSuccessActionType
}
type LoginSuccessActionType = 'LOGIN_SUCCESS'

type LogOutAction = {
  type: LogOutActionType
}
type LogOutActionType = 'LOG_OUT'

export function loginSuccess(): LoginSuccessAction {
  return { type: 'LOGIN_SUCCESS' }
}

export function logOut(): LogOutAction {
  return { type: 'LOG_OUT' }
}

export function login(facebookAccessToken: string) {
  return function(dispatch: Dispatch) {
    Api.login(facebookAccessToken).then(loginResponse => {
      Authenticator.logIn(loginResponse)
      dispatch(loginSuccess())
      dispatch(errorActions.clearError())
    })
    .catch(error => {
      dispatch(errorActions.displayError('Login Error: ' + error))
      console.log('login action error: ' + error)
    })
  }
}
