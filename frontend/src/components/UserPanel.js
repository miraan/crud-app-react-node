// @flow

import React from 'react'
import UserForm from './UserForm'
import { Panel, Grid, Row, Col, Button, ButtonGroup } from 'react-bootstrap'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as userActions from '../actions/userActions'
import * as sessionActions from '../actions/sessionActions'
import history from '../util/history'
import Authenticator from '../util/Authenticator'
import { truncateString } from '../util/strings'
import { Redirect } from 'react-router-dom'

import type { User, CreateUserPayload } from '../util/Api'
import type { ApplicationState } from '../reducers'
import type { FormGroupValidationState, UserPayloadKey } from './UserForm'

type Props = {
  match: any,
  actions: any,
  sessionActions: any,
  user: User,
}
type State = {
  isEditing: boolean,
  payload: CreateUserPayload,
}

class UserPanel extends React.Component<Props, State> {
  state: State = {
    isEditing: false,
    payload: {
      firstName: this.props.user ? this.props.user.firstName : '',
      lastName: this.props.user ? this.props.user.lastName : '',
      email: this.props.user ? this.props.user.email : '',
      facebookId: this.props.user ? this.props.user.facebookId : '',
      facebookAccessToken: this.props.user ? this.props.user.facebookAccessToken : '',
      level: this.props.user ? this.props.user.level : 1,
    }
  }

  render = () => {
    if (!this.props.user) {
      return (
        <Redirect to='/users' />
      )
    }
    return (
      this.state.isEditing ? this._renderEditPanel() : this._renderViewPanel()
    )
  }

  _renderViewPanel = () => (
    <Panel header={<h3>{this.props.user.firstName + ' ' + this.props.user.lastName}</h3>}>
      <Grid>
        {Authenticator.getLoginResponseX().user.level >= 2
        ? <Row>
            <Col md={4}>
              <p>User ID:</p>
            </Col>
            <Col md={8}>
              <p>{this.props.user.id}</p>
            </Col>
          </Row>
        : null}
        <Row>
          <Col md={4}>
            <p>First Name:</p>
          </Col>
          <Col md={8}>
            <p>{this.props.user.firstName}</p>
          </Col>
        </Row>
        <Row>
          <Col md={4}>
            <p>Last Name:</p>
          </Col>
          <Col md={8}>
            <p>{this.props.user.lastName}</p>
          </Col>
        </Row>
        <Row>
          <Col md={4}>
            <p>Email Address:</p>
          </Col>
          <Col md={8}>
            <p>{this.props.user.email}</p>
          </Col>
        </Row>
        <Row>
          <Col md={4}>
            <p>Facebook ID:</p>
          </Col>
          <Col md={8}>
            <p>{this.props.user.facebookId}</p>
          </Col>
        </Row>
        <Row>
          <Col md={4}>
            <p>Facebook Access Token:</p>
          </Col>
          <Col md={8}>
            <p>{truncateString(this.props.user.facebookAccessToken, 20)}</p>
          </Col>
        </Row>
        <Row>
          <Col md={4}>
            <p>Level:</p>
          </Col>
          <Col md={8}>
            <p>{this.props.user.level}</p>
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
                onClick={() => this._enableEditMode()}>
                Edit
              </Button>
              <Button
                onClick={() => {
                  if (this.props.user.id === Authenticator.getLoginResponseX().user.id) {
                    this.props.sessionActions.logOut()
                  }
                  this.props.actions.deleteUser(this.props.user.id)
                }}>
                Delete
              </Button>
              {Authenticator.getLoginResponseX().user.level >= 2
              ? <Button
                  onClick={() => history.push('/users/new')}>
                  Create New User
                </Button>
              : null}
            </ButtonGroup>
          </Col>
        </Row>
      </Grid>
    </Panel>
  )

  _renderEditPanel = () => (
    <UserForm
      validationStateForField={this._validationStateForField}
      payload={this.state.payload}
      handleChange={this._handleChange}
      onSubmitButtonClick={this._onSubmit}
      isSubmitButtonDisabled={!this._isPayloadValid()}
      maxLevel={Authenticator.getLoginResponseX().user.level}
      editing={true}
      onCancelButtonClick={() => this.setState({ isEditing: false })}
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
    this.props.actions.updateUser(this.props.user.id, this.state.payload)
    this.setState({ isEditing: false })
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

  _enableEditMode = () => {
    this.setState({
      isEditing: true,
      payload: {
        firstName: this.props.user.firstName,
        lastName: this.props.user.lastName,
        email: this.props.user.email,
        facebookId: this.props.user.facebookId,
        facebookAccessToken: this.props.user.facebookAccessToken,
        level: this.props.user.level,
      }
    })
  }

  componentWillReceiveProps = (nextProps: Props) => {
    this.setState({
      payload: {
        firstName: nextProps.user.firstName,
        lastName: nextProps.user.lastName,
        email: nextProps.user.email,
        facebookId: nextProps.user.facebookId,
        facebookAccessToken: nextProps.user.facebookAccessToken,
        level: nextProps.user.level,
      }
    })
  }
}

function mapStateToProps(state: ApplicationState, ownProps: Props) {
  if (!ownProps.match) {
    throw new Error('UserPanel mapStateToProps error: no match in ownProps')
  }
  const userId: string = ownProps.match.params.userId
  const user: ?User = state.users.find(user => user.id === userId)
  return {
    user: user
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(userActions, dispatch),
    sessionActions: bindActionCreators(sessionActions, dispatch),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(UserPanel)
