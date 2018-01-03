// @flow

import React from 'react'
import TripForm from './TripForm'
import { daysBetween } from '../util/dates'
import { Panel, Grid, Row, Col, Button, ButtonGroup } from 'react-bootstrap'
import { dateToString } from '../util/dates'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as tripActions from '../actions/tripActions'
import history from '../util/history'

import type { Trip, CreateTripPayload } from '../util/Api'
import type { ApplicationState } from '../reducers'
import type { FormGroupValidationState, TripPayloadKey } from './TripForm'

type Props = {
  match: any,
  actions: any,
  trip: Trip,
}
type State = {
  isEditing: boolean,
  payload: CreateTripPayload,
}

class TripPanel extends React.Component<Props, State> {
  state: State = {
    isEditing: false,
    payload: {
      destination: this.props.trip.destination,
      startDate: this.props.trip.startDate,
      endDate: this.props.trip.endDate,
      comment: this.props.trip.comment,
      userId: this.props.trip.userId,
    }
  }

  render = () => (
    this.state.isEditing ? this._renderEditPanel() : this._renderViewPanel()
  )

  _renderViewPanel = () => (
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
        <Row>
          <Col md={12}>
            <hr />
          </Col>
        </Row>
        <Row>
          <Col md={12}>
            <ButtonGroup bsSize='large'>
              <Button
                onClick={() => this.setState({ isEditing: true })}>
                Edit
              </Button>
              <Button
                onClick={() => this.props.actions.deleteTrip(this.props.trip.id)}>
                Delete
              </Button>
              <Button
                onClick={() => history.push('/ownTrips/new')}>
                Create New Trip
              </Button>
            </ButtonGroup>
          </Col>
        </Row>
      </Grid>
    </Panel>
  )

  _renderEditPanel = () => (
    <TripForm
      validationStateForField={this._validationStateForField}
      payload={this.state.payload}
      handleChange={this._handleChange}
      onSubmitButtonClick={this._onSubmit}
      isSubmitButtonDisabled={!this._isPayloadValid()}
      showUserIdField={false}
      editing={true}
      onCancelButtonClick={() => this.setState({ isEditing: false })}
    />
  )

  _validationStateForField: TripPayloadKey => FormGroupValidationState =
  (key: TripPayloadKey) => {
    switch (key) {
      case 'destination':
      case 'startDate':
      case 'comment':
      case 'userId':
        return this._validationState(this._normalValidator, this.state.payload[key])
      case 'endDate':
        return this._validationState(this._endDateValidator, this.state.payload[key])
      default:
        return 'success'
    }
  }

  _handleChange = (key: TripPayloadKey, value: string) => {
    const payload: CreateTripPayload = this.state.payload
    payload[key] = value
    this.setState({ payload: payload })
  }

  _onSubmit = () => {
    if (!this._isPayloadValid) {
      return
    }
    this.props.actions.updateTrip(this.props.trip.id, this.state.payload)
    this.setState({ isEditing: false })
  }

  _isPayloadValid: () => boolean = () => {
    const payload: CreateTripPayload = this.state.payload
    return this._normalValidator(payload.destination) &&
      this._normalValidator(payload.startDate) &&
      this._endDateValidator(payload.endDate) &&
      this._normalValidator(payload.comment)
  }

  _validationState: ((string => boolean), string) => FormGroupValidationState =
  (validator: (string => boolean), value: string) =>
    validator(value) ? 'success' : 'error'

  // $FlowFixMe
  _normalValidator: (string => boolean) = (value: string) => value && value.length > 0

  _endDateValidator = (value: string) =>
    daysBetween(
      new Date(this.state.payload.startDate),
      new Date(this.state.payload.endDate)) >= 0
}

function mapStateToProps(state: ApplicationState, ownProps: Props) {
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

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(tripActions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(TripPanel)
