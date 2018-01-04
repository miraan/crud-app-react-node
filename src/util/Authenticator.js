// @flow

import type { LoginResponse } from './Api'

const loginResponseKey = 'loginResponse'

export default class Authenticator {
    static isLoggedIn() {
      return !!this.getLoginResponse()
    }

    static getLoginResponse(): ?LoginResponse {
      const jsonString = sessionStorage.getItem(loginResponseKey)
      if (!jsonString) {
        return null
      }
      return JSON.parse(jsonString)
    }

    static getLoginResponseX(): LoginResponse {
      const jsonString = sessionStorage.getItem(loginResponseKey)
      if (!jsonString) {
        throw new Error('getLoginResponseX error: no cached login response')
      }
      return JSON.parse(jsonString)
    }

    static logIn(loginResponse: LoginResponse) {
      sessionStorage.setItem(loginResponseKey, JSON.stringify(loginResponse))
    }

    static logOut() {
      sessionStorage.removeItem(loginResponseKey)
    }
}
