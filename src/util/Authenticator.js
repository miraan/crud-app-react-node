// @flow

export default class Authenticator {
    static isLoggedIn() {
      return !!sessionStorage.token
    }

    static logOut() {
      sessionStorage.removeItem('token')
    }
}
