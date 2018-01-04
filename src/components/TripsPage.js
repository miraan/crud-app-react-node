// @flow

import React from 'react'
import { Jumbotron, Grid, Row, Col, ListGroup, ListGroupItem, Panel, Button } from 'react-bootstrap'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Redirect, Route, Switch } from 'react-router-dom'
import { LinkContainer } from 'react-router-bootstrap'
import Authenticator from '../util/Authenticator'
import * as tripActions from '../actions/tripActions'
import { dateToString, daysUntil } from '../util/dates'
import NewTripPanel from './NewTripPanel'
import TripPanel from './TripPanel'

import type { ApplicationState } from '../reducers'
import type { Trip } from '../util/Api'

type Props = {
  actions: any,
  trips: Array<Trip>,
  match: any,
}
type State = {}

class TripsPage extends React.Component<Props, State> {
  render = () => {
    if (!Authenticator.isLoggedIn()) {
      return (
        <Redirect to='/' />
      )
    }
    return (
      <div>
        <Jumbotron>
          <Grid>
            <Row>
              <Col md={12}>
                <hr />
                <h1>Trips</h1>
                <hr />
              </Col>
            </Row>
            <Row>
              <Col md={4}>
                <ListGroup className='scrollableListGroup'>
                  {this._renderTripListItems()}
                </ListGroup>
              </Col>
              <Col md={8}>
                <Row>
                  <Col md={12}>
                    <Switch>
                      <Route exact path={this.props.match.url} render={this._renderDefaultPanel} />
                      <Route path={`${this.props.match.url}/new`} component={NewTripPanel} />
                      <Route path={`${this.props.match.url}/:tripId`} component={TripPanel} />
                    </Switch>
                  </Col>
                  <Col md={12}>
                    <Button onClick={window.print}>Print Itinerary</Button>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Grid>
        </Jumbotron>
        {this._renderPrintContent()}
      </div>
    )
  }

  _renderTripListItems = () => {
    if (this.props.trips.length < 1) {
      return (
        <ListGroupItem header='No Trips'>
          Create a trip in the panel to the right.
        </ListGroupItem>
      )
    }
    return this.props.trips.map(trip => (
      <LinkContainer to={`${this.props.match.url}/${trip.id}`} key={trip.id}>
        <ListGroupItem header={trip.destination}>
          {dateToString(new Date(trip.startDate))} to {dateToString(new Date(trip.endDate))}
          <br />
          ({daysUntil(new Date(trip.startDate))}
          {daysUntil(new Date(trip.startDate)) > 0 ? ' Days Away' : ' Days Ago'})
        </ListGroupItem>
      </LinkContainer>
    ))
  }

  _renderDefaultPanel = () => (
    <Panel header={<h3>No Trip Selected</h3>}>
      No trip is selected. Select one from the menu on the left, or:
      <hr />
      <p>
        <LinkContainer to={`${this.props.match.url}/new`}>
          <Button bsStyle='primary'>Create A Trip</Button>
        </LinkContainer>
      </p>
    </Panel>
  )

  componentDidMount = () => (
    this.props.actions.getTrips()
  )

  _renderPrintContent = () => (
    <div id='printContent'>
      <Grid>
        <h2>Trip Itinerary</h2>
        <hr />
        {this.props.trips.map(trip => (
          <Row key={trip.id}>
            <Col md={12}>
              <p>
                {dateToString(new Date(trip.startDate))} to {dateToString(new Date(trip.endDate))}: {trip.destination}
                <br />
                Comment: {trip.comment}
              </p>
              <hr />
            </Col>
          </Row>
        ))}
      </Grid>
    </div>
  )
}

function mapStateToProps(state: ApplicationState) {
  return {
    trips: state.trips.sort((a, b) => {
      if (a.id < b.id) {
        return -1
      }
      if (b.id < a.id) {
        return 1
      }
      return 0
    })
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(tripActions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(TripsPage)
