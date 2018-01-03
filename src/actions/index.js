// @flow

import type { SessionAction } from './sessionActions'
import type { TripAction } from './tripActions'

type Action = SessionAction | TripAction

export type Dispatch = (action: Action | Promise<Action>) => Promise<*>
