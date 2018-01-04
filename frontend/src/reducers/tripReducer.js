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
      case 'GET_TRIPS_SUCCESS':
        return action.trips
      case 'CREATE_TRIP_SUCCESS':
        return [
          ...state,
          action.trip
        ]
      case 'UPDATE_TRIP_SUCCESS':
        const updatedTrip: Trip = action.trip
        return [
          ...state.filter(trip => trip.id !== updatedTrip.id),
          action.trip
        ]
      case 'DELETE_TRIP_SUCCESS':
        const deletedTrip: Trip = action.trip
        return [
          ...state.filter(trip => trip.id !== deletedTrip.id)
        ]
      default:
        return state
    }
}
