// @flow

import { combineReducers } from 'redux'
import session from './sessionReducer'
import trips from './tripReducer'

import type { SessionState } from './sessionReducer'
import type { TripState } from './tripReducer'

export type ApplicationState = {
  session: SessionState,
  trips: TripState,
}

const rootReducer = combineReducers({
  session,
  trips,
})

export default rootReducer
