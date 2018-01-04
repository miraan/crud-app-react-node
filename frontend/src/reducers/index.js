// @flow

import { combineReducers } from 'redux'
import session from './sessionReducer'
import trips from './tripReducer'
import users from './userReducer'

import type { SessionState } from './sessionReducer'
import type { TripState } from './tripReducer'
import type { UserState } from './userReducer'

export type ApplicationState = {
  session: SessionState,
  trips: TripState,
  users: UserState,
}

const rootReducer = combineReducers({
  session,
  trips,
  users,
})

export default rootReducer
