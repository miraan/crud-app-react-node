// @flow

const tokenKey = 'token'

export default class Authenticator {
    static isLoggedIn() {
      return !!sessionStorage.getItem(tokenKey)
    }

    static logOut() {
      sessionStorage.removeItem(tokenKey)
    }
}
