// @flow

import Authenticator from './Authenticator'
import AppConfigurationObject from '../configuration'

type ToOptionalType = <V>(V) => ?V

type User = {
  id: string,
  firstName: string,
  lastName: string,
  email: string,
  facebookId: string,
  level: number,
}

export type Trip = {
  id: string,
  userId: string,
  destination: string,
  startDate: string,
  endDate: string,
  comment: string
}

export type CreateTripPayload = $Diff<Trip, {
  id: string,
}>

export type UpdateTripPayload = $Diff<Trip, {
  id: string,
  userId: string,
}>

export type LoginResponse = {
  token: string,
  user: User,
}

type GetOwnTripsResponse = {
  trips: Array<Trip>
}

type CreateTripResponse = {
  trip: Trip
}

type UpdateTripResponse = {
  trip: Trip
}

type DeleteTripResponse = {
  trip: Trip
}

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE'

export default class Api {

  static requestHeaders() {
    const cachedLoginResponse = Authenticator.getLoginResponse()
    return {
      'Authorization': `Bearer ${cachedLoginResponse ? cachedLoginResponse.token : ''}`,
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    }
  }

  static request(method: HttpMethod, path: string, payload: any): Promise<*> {
    const request = new Request(
      `${AppConfigurationObject.apiHost}/api/v1/${path}`,
      {
        headers: this.requestHeaders(),
        method: method,
        body: payload ? JSON.stringify(payload) : null,
      }
    )
    return fetch(request).then(response => {
      return response.json()
    })
    .then(parsed => {
      if (!parsed.success) {
        return Promise.reject('API Error: ' + parsed.errorMessage)
      }
      return parsed.content
    })
  }

  static getRequest(path: string): Promise<*> {
    return this.request('GET', path, null)
  }

  static postRequest(path: string, payload: any): Promise<*> {
    return this.request('POST', path, payload)
  }

  static putRequest(path: string, payload: any): Promise<*> {
    return this.request('PUT', path, payload)
  }

  static deleteRequest(path: string): Promise<*> {
    return this.request('DELETE', path, null)
  }

  static login(facebookAccessToken: string): Promise<LoginResponse> {
    const path = `login/facebook?facebookAccessToken=${facebookAccessToken}`
    return this.getRequest(path)
  }

  static getOwnTrips(): Promise<GetOwnTripsResponse> {
    const path = `trip/me`
    return this.getRequest(path)
  }

  static createTrip(payload: CreateTripPayload): Promise<CreateTripResponse> {
    const path = 'trip'
    return this.postRequest(path, payload)
  }

  static updateTrip(tripId: string, payload: UpdateTripPayload): Promise<UpdateTripResponse> {
    const path = 'trip/' + tripId
    return this.putRequest(path, payload)
  }

  static deleteTrip(tripId: string): Promise<DeleteTripResponse> {
    const path = 'trip/' + tripId
    return this.deleteRequest(path)
  }

}
