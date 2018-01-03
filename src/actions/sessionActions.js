// @flow

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
