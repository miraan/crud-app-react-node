// @flow

import React from 'react'
import { Grid, Navbar, NavItem, Nav } from 'react-bootstrap'
import { Router, Route } from 'react-router-dom'
import { LinkContainer } from 'react-router-bootstrap'
import history from '../util/history'
import { connect } from 'react-redux'
import LoginPage from './LoginPage'
import OwnTripsPage from './OwnTripsPage'

import type { ApplicationState } from '../reducers'

type Props = {
  isLoggedIn: boolean,
  match?: any,
}
type State = {}

class App extends React.Component<Props, State> {
  render = () => (
    <Router history={history}>
      <div>
        <Navbar inverse fixedTop>
          <Grid>
            <Navbar.Header>
              <Navbar.Brand>
                Trip Planner
              </Navbar.Brand>
              <Navbar.Toggle />
            </Navbar.Header>
            <Nav>
              <LinkContainer to='/'>
                <NavItem eventKey={1}>Home</NavItem>
              </LinkContainer>
              <LinkContainer to='/ownTrips'>
                <NavItem eventKey={2}>Own Trips</NavItem>
              </LinkContainer>
            </Nav>
          </Grid>
        </Navbar>
        <Route exact path='/' component={LoginPage} />
        <Route path='/ownTrips' component={OwnTripsPage} />
      </div>
    </Router>
  )
}

function mapStateToProps(state: ApplicationState): Props {
  return { isLoggedIn: state.session }
}

export default connect(mapStateToProps, null)(App)
