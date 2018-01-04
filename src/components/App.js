// @flow

import React from 'react'
import { Grid, Navbar, NavItem, Nav, Row, Col } from 'react-bootstrap'
import { Router, Route, Link } from 'react-router-dom'
import { LinkContainer } from 'react-router-bootstrap'
import Authenticator from '../util/Authenticator'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import history from '../util/history'
import LoginPage from './LoginPage'
import TripsPage from './TripsPage'
import * as sessionActions from '../actions/sessionActions'

import type { ApplicationState } from '../reducers'

type Props = {
  isLoggedIn: boolean,
  actions: any,
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
                <Nav>
                  <LinkContainer to='/'>
                    <NavItem eventKey={1}>Home</NavItem>
                  </LinkContainer>
                  <LinkContainer to='/trips'>
                    <NavItem eventKey={2}>Trips</NavItem>
                  </LinkContainer>
                  {this.props.isLoggedIn
                    ? <NavItem eventKey={3} onSelect={this._logOut}>
                        Log Out (Logged in as {Authenticator.getLoginResponseX().user.firstName})
                      </NavItem>
                    : null
                  }
                </Nav>
              </Col>
            </Row>
          </Grid>
        </Navbar>
        <Route exact path='/' component={LoginPage} />
        <Route path='/trips' component={TripsPage} />
      </div>
    </Router>
  )

  _logOut = () => {
    this.props.actions.logOut()
  }
}

function mapStateToProps(state: ApplicationState) {
  return {
    isLoggedIn: state.session
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(sessionActions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App)
