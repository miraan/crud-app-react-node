// @flow

import Api from '../util/Api'

import type { Dispatch } from '.'
import type { Trip, CreateOwnTripPayload } from '../util/Api'

export type TripAction = GetOwnTripsSuccessAction | CreateTripSuccessAction

type GetOwnTripsSuccessAction = {
  type: GetOwnTripsSuccessActionType,
  trips: Array<Trip>,
}
type GetOwnTripsSuccessActionType = 'GET_OWN_TRIPS_SUCCESS'

type CreateTripSuccessAction = {
  type: CreateTripSuccessActionType,
  trip: Trip,
}
type CreateTripSuccessActionType = 'CREATE_TRIP_SUCCESS'

export function getOwnTripsSuccess(trips: Array<Trip>): GetOwnTripsSuccessAction {
  return {
    type: 'GET_OWN_TRIPS_SUCCESS',
    trips: trips
  }
}

export function createTripSuccess(trip: Trip): CreateTripSuccessAction {
  return {
    type: 'CREATE_TRIP_SUCCESS',
    trip: trip
  }
}

export function getOwnTrips() {
  return function(dispatch: Dispatch) {
    Api.getOwnTrips().then(getOwnTripsResponse => {
      console.log(getOwnTripsResponse)
      dispatch(getOwnTripsSuccess(getOwnTripsResponse.trips))
    })
    .catch(error => {
      // TODO: dispatch error action instead
      console.log('getOwnTrips action error: ' + error)
    })
  }
}

export function createOwnTrip(payload: CreateOwnTripPayload) {
  return function(dispatch: Dispatch) {
    Api.createOwnTrip(payload).then(createTripResponse => {
      console.log(createTripResponse)
      dispatch(createTripSuccess(createTripResponse.trip))
    })
    .catch(error => {
      // TODO: dispatch error action instead
      console.log('createOwnTrip action error: ' + error)
    })
  }
}
