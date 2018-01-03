// @flow

import Authenticator from './Authenticator'
import AppConfigurationObject from '../configuration'

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

export type CreateOwnTripPayload = $Diff<Trip, {
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

export default class Api {

  static requestHeaders() {
    const cachedLoginResponse = Authenticator.getLoginResponse()
    return { 'Authorization': `Bearer ${cachedLoginResponse ? cachedLoginResponse.token : ''}` }
  }

  static getRequest(path: string): Promise<*> {
    const request = new Request(
      `${AppConfigurationObject.apiHost}/api/v1/${path}`,
      {
        headers: this.requestHeaders(),
        method: 'GET',
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

  static postRequest(path: string, payload: any): Promise<*> {
    const data = new FormData()
    data.append('json', JSON.stringify(payload))
    const request = new Request(
      `${AppConfigurationObject.apiHost}/api/v1/${path}`,
      {
        headers: this.requestHeaders(),
        method: 'POST',
        body: data
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

  static login(facebookAccessToken: string): Promise<LoginResponse> {
    const path = `login/facebook?facebookAccessToken=${facebookAccessToken}`
    return this.getRequest(path)
  }

  static getOwnTrips(): Promise<GetOwnTripsResponse> {
    const path = `trip/me`
    return this.getRequest(path)
  }

  static createOwnTrip(payload: CreateOwnTripPayload): Promise<CreateTripResponse> {
    const path = 'trip/me'
    return this.postRequest(path, payload)
  }

}
