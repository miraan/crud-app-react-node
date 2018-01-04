// @flow

import type { SessionAction } from './sessionActions'
import type { TripAction } from './tripActions'
import type { UserAction } from './userActions'

type Action = SessionAction | TripAction | UserAction

export type Dispatch = (action: Action | Promise<Action>) => Promise<*>
