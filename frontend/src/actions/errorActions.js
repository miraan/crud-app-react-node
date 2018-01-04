// @flow

import type { Dispatch } from '.'

export type ErrorAction = DisplayErrorAction | ClearErrorAction

export type DisplayErrorAction = {
  type: DisplayErrorActionType,
  message: string,
}
type DisplayErrorActionType = 'DISPLAY_ERROR'

export type ClearErrorAction = {
  type: ClearErrorActionType,
}
type ClearErrorActionType = 'CLEAR_ERROR'

export function displayError(message: string): DisplayErrorAction {
  return {
    type: 'DISPLAY_ERROR',
    message: message,
  }
}

export function clearError(): ClearErrorAction {
  return { type: 'CLEAR_ERROR' }
}
