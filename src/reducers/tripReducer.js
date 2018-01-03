// @flow

import type { TripAction } from '../actions/tripActions'
import type { Trip } from '../util/Api'

export type TripState = Array<Trip>

const initialTripState: TripState = []

export default function tripReducer(
  state: TripState = initialTripState,
  action: TripAction
) {
    switch (action.type) {
      case 'GET_OWN_TRIPS_SUCCESS':
        return action.trips
      case 'CREATE_TRIP_SUCCESS':
        return [
          ...state,
          action.trip
        ]
      default:
        return state
    }
}
