// @flow

import React from 'react'
import { Grid, Navbar, NavItem, Nav, Row, Col, Panel } from 'react-bootstrap'
import { Router, Route, Link } from 'react-router-dom'
import { LinkContainer } from 'react-router-bootstrap'
import Authenticator from '../util/Authenticator'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import history from '../util/history'
import LoginPage from './LoginPage'
import TripsPage from './TripsPage'
import UsersPage from './UsersPage'
import * as sessionActions from '../actions/sessionActions'

import type { ApplicationState } from '../reducers'

type Props = {
  isLoggedIn: boolean,
  actions: any,
  errorMessage: ?string,
}
type State = {}

class App extends React.Component<Props, State> {
  render = () => (
    <Router history={history}>
      <div>
        <Navbar inverse fixedTop>
          <Grid>
            <Row>
              <Col md={12}>
                <Navbar.Header>
                  <Navbar.Brand>
                    <Link to='/'>Trip Planner</Link>
                  </Navbar.Brand>
                  <Navbar.Toggle />
                </Navbar.Header>
                {this.props.isLoggedIn
                ? <Nav>
                    <LinkContainer to='/trips'>
                      <NavItem eventKey={2}>Trips</NavItem>
                    </LinkContainer>
                    <LinkContainer to='/users'>
                      <NavItem eventKey={3}>Users</NavItem>
                    </LinkContainer>
                    <NavItem eventKey={4} onSelect={this._logOut}>
                      Log Out (Logged in as {Authenticator.getLoginResponseX().user.firstName})
                    </NavItem>
                  </Nav>
                : null}
              </Col>
            </Row>
          </Grid>
        </Navbar>
        {this._renderErrorMessage()}
        <Route exact path='/' component={LoginPage} />
        <Route path='/trips' component={TripsPage} />
        <Route path='/users' component={UsersPage} />
      </div>
    </Router>
  )

  _logOut = () => {
    this.props.actions.logOut()
  }

  _renderErrorMessage = () => this.props.errorMessage
    ? <div id='errorMessage'>
        <Panel header={'An Error Occurred'} bsStyle="danger">
          {this.props.errorMessage}
        </Panel>
      </div>
    : null
}

function mapStateToProps(state: ApplicationState) {
  return {
    isLoggedIn: state.session,
    errorMessage: state.error,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(sessionActions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App)
