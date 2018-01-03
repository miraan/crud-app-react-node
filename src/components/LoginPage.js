// @flow

import React from 'react'
import { Grid, Jumbotron } from 'react-bootstrap'
import AppConfigurationObject from '../configuration'
import FacebookLogin from 'react-facebook-login'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom'
import Authenticator from '../util/Authenticator'
import * as sessionActions from '../actions/sessionActions'

type Props = {
  actions: any
}
type State = {}

class LoginPage extends React.Component<Props, State> {
  render = () => {
    if (Authenticator.isLoggedIn()) {
      return (
        <Redirect to='/ownTrips' />
      )
    }
    return (
      <Jumbotron>
        <Grid>
          <h1>Welcome to Trip Planner</h1>
          <FacebookLogin
            appId={AppConfigurationObject.facebookAppId}
            autoLoad={true}
            fields={AppConfigurationObject.facebookProfileFields}
            callback={(response) => {
              const facebookAccessToken: string = response.accessToken
              if (!facebookAccessToken) {
                throw new Error('Facebook login failed, no access token returned.')
              }
              this.props.actions.login(facebookAccessToken)
            }}
          />
        </Grid>
      </Jumbotron>
    )
  }
}

function mapDispatchToProps(dispatch): Props {
  return {
    actions: bindActionCreators(sessionActions, dispatch)
  }
}

export default connect(null, mapDispatchToProps)(LoginPage)
