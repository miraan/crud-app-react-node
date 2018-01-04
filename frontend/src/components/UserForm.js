// @flow

import React from 'react'
import { Panel, Button, ButtonGroup, FormGroup, FormControl, ControlLabel, HelpBlock } from 'react-bootstrap'

import type { CreateUserPayload } from '../util/Api'

export type FormGroupValidationState = 'success' | 'error'
export type UserPayloadKey = 'firstName' | 'lastName' | 'email' | 'facebookId' | 'facebookAccessToken' | 'level'

type Props = {
  validationStateForField: UserPayloadKey => FormGroupValidationState,
  payload: CreateUserPayload,
  handleChange: (UserPayloadKey, value: any) => void,
  onSubmitButtonClick: () => void,
  isSubmitButtonDisabled: boolean,
  maxLevel: number,
  editing: boolean,
  onCancelButtonClick: () => void,
}

const UserForm = ({
  validationStateForField,
  payload,
  handleChange,
  onSubmitButtonClick,
  isSubmitButtonDisabled,
  maxLevel,
  editing,
  onCancelButtonClick,
} : Props) => (
  <Panel header={<h3>{editing ? 'Edit User' : 'Create A User'}</h3>}>
    <form>
      <FormGroup
        controlId='formBasicText'
        validationState={validationStateForField('firstName')}>
        <ControlLabel>First Name</ControlLabel>
        <FormControl
          type='text'
          value={payload.firstName}
          placeholder='Enter first name'
          onChange={(e) => handleChange('firstName', e.target.value)} />
        <FormControl.Feedback />
        <HelpBlock>Enter at least one character.</HelpBlock>
      </FormGroup>
      <FormGroup
        controlId='formBasicText'
        validationState={validationStateForField('lastName')}>
        <ControlLabel>Last Name</ControlLabel>
        <FormControl
          type='text'
          value={payload.lastName}
          placeholder='Enter last name'
          onChange={(e) => handleChange('lastName', e.target.value)} />
        <FormControl.Feedback />
        <HelpBlock>Enter at least one character.</HelpBlock>
      </FormGroup>
      <FormGroup
        controlId='formBasicText'
        validationState={validationStateForField('email')}>
        <ControlLabel>Email Address</ControlLabel>
        <FormControl
          type='text'
          value={payload.email}
          placeholder='Enter email address'
          onChange={(e) => handleChange('email', e.target.value)} />
        <FormControl.Feedback />
        <HelpBlock>Enter at least one character.</HelpBlock>
      </FormGroup>
      <FormGroup
        controlId='formBasicText'
        validationState={validationStateForField('facebookId')}>
        <ControlLabel>Facebook User ID</ControlLabel>
        <FormControl
          type='text'
          value={payload.facebookId}
          placeholder='Enter facebook user ID'
          onChange={(e) => handleChange('facebookId', e.target.value)} />
        <FormControl.Feedback />
        <HelpBlock>Enter at least one character.</HelpBlock>
      </FormGroup>
      <FormGroup
        controlId='formBasicText'
        validationState={validationStateForField('facebookAccessToken')}>
        <ControlLabel>Facebook Access Token</ControlLabel>
        <FormControl
          type='text'
          value={payload.facebookAccessToken}
          placeholder='Enter Facebook access token'
          onChange={(e) => handleChange('facebookAccessToken', e.target.value)} />
        <FormControl.Feedback />
        <HelpBlock>Enter at least one character.</HelpBlock>
      </FormGroup>
      <FormGroup controlId='formControlsSelect'>
        <ControlLabel>Select</ControlLabel>
        <FormControl
          componentClass='select'
          placeholder='Level'
          onChange={(e) => handleChange('level', parseInt(e.target.value, 10))}>
          {[...Array(maxLevel).keys()].map(key => (
            <option
              value={key + 1}
              key={key}
              selected={key + 1 === payload.level}>
              Level {key + 1}
            </option>
          ))}
        </FormControl>
      </FormGroup>
    </form>
    <hr />
    <ButtonGroup bsSize='large'>
      <Button
        bsStyle='primary'
        onClick={onSubmitButtonClick}
        disabled={isSubmitButtonDisabled}>
        {editing ? 'Save' : 'Create'}
      </Button>
      {editing
      ? (<Button
          onClick={onCancelButtonClick}>
          Cancel
        </Button>)
      : null
      }
    </ButtonGroup>
  </Panel>
)

export default UserForm
