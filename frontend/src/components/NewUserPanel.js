// @flow

import React from 'react'
import UserForm from './UserForm'
import Authenticator from '../util/Authenticator'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as userActions from '../actions/userActions'

import type { CreateUserPayload } from '../util/Api'
import type { FormGroupValidationState, UserPayloadKey } from './UserForm'

type Props = {
  actions: any,
}
type State = {
  payload: CreateUserPayload,
}

class NewUserPanel extends React.Component<Props, State> {
  state: State = {
    payload: {
      firstName: '',
      lastName: '',
      email: '',
      facebookId: '',
      facebookAccessToken: '',
      level: 1,
    }
  }

  render = () => (
    <UserForm
      validationStateForField={this._validationStateForField}
      payload={this.state.payload}
      handleChange={this._handleChange}
      onSubmitButtonClick={this._onSubmit}
      isSubmitButtonDisabled={!this._isPayloadValid()}
      maxLevel={Authenticator.getLoginResponseX().user.level}
      editing={false}
      onCancelButtonClick={() => {}}
    />
  )

  _validationStateForField: UserPayloadKey => FormGroupValidationState =
  (key: UserPayloadKey) => {
    switch (key) {
      case 'firstName':
      case 'lastName':
      case 'email':
      case 'facebookId':
      case 'facebookAccessToken':
        return this._validationState(this._normalValidator, this.state.payload[key])
      case 'level':
        return this._validationState(this._levelValidator, this.state.payload[key])
      default:
        return 'success'
    }
  }

  _handleChange = (key: UserPayloadKey, value: any) => {
    const payload = this.state.payload
    payload[key] = value
    this.setState({ payload: payload })
  }

  _onSubmit = () => {
    if (!this._isPayloadValid) {
      return
    }
    this.props.actions.createUser(this.state.payload)
  }

  _isPayloadValid: () => boolean = () => {
    const payload: CreateUserPayload = this.state.payload
    return this._normalValidator(payload.firstName) &&
      this._normalValidator(payload.lastName) &&
      this._normalValidator(payload.email) &&
      this._normalValidator(payload.facebookId) &&
      this._normalValidator(payload.facebookAccessToken) &&
      this._levelValidator(payload.level)
  }

  _validationState: ((any => boolean), any) => FormGroupValidationState =
  (validator: (any => boolean), value: any) =>
    validator(value) ? 'success' : 'error'

  // $FlowFixMe
  _normalValidator: (string => boolean) = (value: string) => value && value.length > 0

  _levelValidator: (number => boolean) = (value: number) =>
    value <= Authenticator.getLoginResponseX().user.level
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(userActions, dispatch)
  }
}

export default connect(null, mapDispatchToProps)(NewUserPanel)
