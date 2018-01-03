// @flow

import React from 'react'
import { Route, IndexRoute } from 'react-router'
import App from './components/App'
import Authenticator from './util/Authenticator'

export default (
  <Route path='/' component={App}>
  </Route>
)

function requireAuthentication(nextState, replace) {
  if (!Authenticator.isLoggedIn()) {
    replace({
      pathname: '/login',
      state: { nextPathname: nextState.location.pathname }
    })
  }
}
