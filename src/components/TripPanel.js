// @flow

import React from 'react'
import { Panel, Grid, Row, Col } from 'react-bootstrap'
import { dateToString } from '../util/dates'
import { connect } from 'react-redux'

import type { Trip } from '../util/Api'
import type { ApplicationState } from '../reducers'

type Props = {
  match?: any,
  trip: Trip,
}
type State = {}

class TripPanel extends React.Component<Props, State> {
  render = () => (
    <Panel header={<h3>{this.props.trip.destination}</h3>}>
      <Grid>
        <Row>
          <Col md={4}>
            <p>Destination:</p>
          </Col>
          <Col md={8}>
            <p>{this.props.trip.destination}</p>
          </Col>
        </Row>
        <Row>
          <Col md={4}>
            <p>Start Date:</p>
          </Col>
          <Col md={8}>
            <p>{dateToString(new Date(this.props.trip.startDate))}</p>
          </Col>
        </Row>
        <Row>
          <Col md={4}>
            <p>End Date:</p>
          </Col>
          <Col md={8}>
            <p>{dateToString(new Date(this.props.trip.endDate))}</p>
          </Col>
        </Row>
        <Row>
          <Col md={4}>
            <p>Comment:</p>
          </Col>
          <Col md={8}>
            <p>{this.props.trip.comment}</p>
          </Col>
        </Row>
      </Grid>
    </Panel>
  )
}

function mapStateToProps(state: ApplicationState, ownProps: Props): Props {
  if (!ownProps.match) {
    throw new Error('TripPanel mapStateToProps error: no match in ownProps')
  }
  const tripId: string = ownProps.match.params.tripId
  const trip: ?Trip = state.trips.find(trip => trip.id === tripId)
  if (!trip) {
    throw new Error(`TripPanel mapStateToProps error: no trip with id ${tripId} found in state.`)
  }
  console.log(trip)
  return {
    trip: trip
  }
}

export default connect(mapStateToProps, null)(TripPanel)
