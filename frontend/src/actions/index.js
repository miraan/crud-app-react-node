// @flow

import type { SessionAction } from './sessionActions'
import type { TripAction } from './tripActions'
import type { UserAction } from './userActions'
import type { ErrorAction } from './errorActions'

type Action = SessionAction | TripAction | UserAction | ErrorAction

export type Dispatch = (action: Action | Promise<Action>) => Promise<*>
