// @flow

import React from 'react'
import TripForm from './TripForm'
import Authenticator from '../util/Authenticator'
import { dateByAddingDays, daysBetween } from '../util/dates'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as tripActions from '../actions/tripActions'

import type { CreateTripPayload } from '../util/Api'
import type { FormGroupValidationState, CreateTripPayloadKey } from './TripForm'

type Props = {
  actions: any,
}
type State = {
  payload: CreateTripPayload,
}

class NewTripPanel extends React.Component<Props, State> {
  state: State = {
    payload: {
      destination: '',
      startDate: new Date().toJSON(),
      endDate: dateByAddingDays(new Date(), 7).toJSON(),
      comment: '',
      userId: Authenticator.getLoginResponseX().user.id,
    }
  }

  render = () => (
    <TripForm
      validationStateForField={this._validationStateForField}
      payload={this.state.payload}
      handleChange={this._handleChange}
      onSubmitButtonClick={this._onSubmit}
      isSubmitButtonDisabled={!this._isPayloadValid()}
      creatingOwnTrip={Authenticator.getLoginResponseX().user.level < 3}
    />
  )

  _validationStateForField: CreateTripPayloadKey => FormGroupValidationState =
  (key: CreateTripPayloadKey) => {
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

  _handleChange = (key: CreateTripPayloadKey, value: string) => {
    const payload = this.state.payload
    payload[key] = value
    this.setState({ payload: payload })
  }

  _onSubmit = () => {
    if (!this._isPayloadValid) {
      return
    }
    this.props.actions.createTrip(this.state.payload)
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

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(tripActions, dispatch)
  }
}

export default connect(null, mapDispatchToProps)(NewTripPanel)
