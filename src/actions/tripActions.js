// @flow

import Api from '../util/Api'
import history from '../util/history'
import Authenticator from '../util/Authenticator'

import type { Dispatch } from '.'
import type { Trip, CreateTripPayload, UpdateTripPayload } from '../util/Api'


export type TripAction =
  GetTripsSuccessAction |
  CreateTripSuccessAction |
  UpdateTripSuccessAction |
  DeleteTripSuccessAction

type GetTripsSuccessAction = {
  type: GetTripsSuccessActionType,
  trips: Array<Trip>,
}
type GetTripsSuccessActionType = 'GET_TRIPS_SUCCESS'

type CreateTripSuccessAction = {
  type: CreateTripSuccessActionType,
  trip: Trip,
}
type CreateTripSuccessActionType = 'CREATE_TRIP_SUCCESS'

type UpdateTripSuccessAction = {
  type: UpdateTripSuccessActionType,
  trip: Trip,
}
type UpdateTripSuccessActionType = 'UPDATE_TRIP_SUCCESS'

type DeleteTripSuccessAction = {
  type: DeleteTripSuccessActionType,
  trip: Trip,
}
type DeleteTripSuccessActionType = 'DELETE_TRIP_SUCCESS'

export function getTripsSuccess(trips: Array<Trip>): GetTripsSuccessAction {
  return {
    type: 'GET_TRIPS_SUCCESS',
    trips: trips
  }
}

export function createTripSuccess(trip: Trip): CreateTripSuccessAction {
  return {
    type: 'CREATE_TRIP_SUCCESS',
    trip: trip
  }
}

export function updateTripSuccess(trip: Trip): UpdateTripSuccessAction {
  return {
    type: 'UPDATE_TRIP_SUCCESS',
    trip: trip
  }
}

export function deleteTripSuccess(trip: Trip): DeleteTripSuccessAction {
  return {
    type: 'DELETE_TRIP_SUCCESS',
    trip: trip
  }
}

export function getTrips() {
  return function(dispatch: Dispatch) {
    (Authenticator.getLoginResponseX().user.level >= 3
    ? Api.getOwnTrips() : Api.getAllTrips())
    .then(getTripsResponse => {
      dispatch(getTripsSuccess(getTripsResponse.trips))
    })
    .catch(error => {
      // TODO: dispatch error action instead
      console.log('getOwnTrips action error: ' + error)
    })
  }
}

export function createTrip(payload: CreateTripPayload) {
  return function(dispatch: Dispatch) {
    Api.createTrip(payload).then(createTripResponse => {
      dispatch(createTripSuccess(createTripResponse.trip))
      history.push('/trips/' + createTripResponse.trip.id)
    })
    .catch(error => {
      // TODO: dispatch error action instead
      console.log('createTrip action error: ' + error)
    })
  }
}

export function updateTrip(tripId: string, payload: CreateTripPayload) {
  const updatePayload: UpdateTripPayload = {
    destination: payload.destination,
    startDate: payload.startDate,
    endDate: payload.endDate,
    comment: payload.comment,
  }
  return function(dispatch: Dispatch) {
    Api.updateTrip(tripId, updatePayload).then(updateTripResponse => {
      console.log(updateTripResponse)
      dispatch(updateTripSuccess(updateTripResponse.trip))
    })
    .catch(error => {
      console.log('updateTrip action error: ' + error)
    })
  }
}

export function deleteTrip(tripId: string) {
  return function(dispatch: Dispatch) {
    Api.deleteTrip(tripId).then(deleteTripResponse => {
      console.log(deleteTripResponse)
      history.push('/trips')
      dispatch(deleteTripSuccess(deleteTripResponse.trip))
    })
    .catch(error => {
      console.log('deleteTrip action error' + error)
    })
  }
}
