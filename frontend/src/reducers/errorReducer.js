// @flow

import type { ErrorAction } from '../actions/errorActions'

export type ErrorState = ?string

const initialErrorState: ErrorState = null

export default function errorReducer(
  state: ErrorState = initialErrorState,
  action: ErrorAction
) {
  switch (action.type) {
    case 'DISPLAY_ERROR':
      return action.message
    case 'CLEAR_ERROR':
      return null
    default:
      return state
  }
}
