// @flow

import React from 'react'
import { Grid, Navbar, NavItem, Nav, Row, Col } from 'react-bootstrap'
import { Router, Route, Link } from 'react-router-dom'
import { LinkContainer } from 'react-router-bootstrap'
import Authenticator from '../util/Authenticator'
import history from '../util/history'
import LoginPage from './LoginPage'
import TripsPage from './TripsPage'

type Props = {}
type State = {}

export default class App extends React.Component<Props, State> {
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
                  <NavItem eventKey={3} onSelect={this._logOut}>Log Out</NavItem>
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
    Authenticator.logOut()
    history.push('/')
  }
}
