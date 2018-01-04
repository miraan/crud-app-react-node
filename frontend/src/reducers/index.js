// @flow

import { combineReducers } from 'redux'
import session from './sessionReducer'
import trips from './tripReducer'
import users from './userReducer'
import error from './errorReducer'

import type { SessionState } from './sessionReducer'
import type { TripState } from './tripReducer'
import type { UserState } from './userReducer'
import type { ErrorState } from './errorReducer'

export type ApplicationState = {
  session: SessionState,
  trips: TripState,
  users: UserState,
  error: ErrorState,
}

const rootReducer = combineReducers({
  session,
  trips,
  users,
  error,
})

export default rootReducer
