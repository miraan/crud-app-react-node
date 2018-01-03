// @flow

import React from 'react'
import { Panel, Button, ButtonGroup, FormGroup, FormControl, ControlLabel, HelpBlock } from 'react-bootstrap'
import DatePicker from 'react-bootstrap-date-picker'

import type { CreateTripPayload } from '../util/Api'

export type FormGroupValidationState = 'success' | 'error'
export type TripPayloadKey = 'destination' | 'startDate' | 'endDate' | 'comment' | 'userId'

type Props = {
  validationStateForField: TripPayloadKey => FormGroupValidationState,
  payload: CreateTripPayload,
  handleChange: (TripPayloadKey, value: string) => void,
  onSubmitButtonClick: () => void,
  isSubmitButtonDisabled: boolean,
  showUserIdField: boolean,
  editing: boolean,
  onCancelButtonClick: () => void,
}

const TripForm = ({
  validationStateForField,
  payload,
  handleChange,
  onSubmitButtonClick,
  isSubmitButtonDisabled,
  showUserIdField,
  editing,
  onCancelButtonClick,
} : Props) => (
  <Panel header={<h3>{editing ? 'Edit Trip' : 'Create A Trip'}</h3>}>
    <form>
      {showUserIdField
        ? (<FormGroup
            controlId='formBasicText'
            validationState={validationStateForField('userId')}>
            <ControlLabel>User ID</ControlLabel>
            <FormControl
              type='text'
              value={payload.userId}
              placeholder='Enter user ID'
              onChange={(e) => handleChange('userId', e.target.value)} />
            <FormControl.Feedback />
            <HelpBlock>Enter the ID of the user who will own this new trip.</HelpBlock>
          </FormGroup>)
        : null
      }
      <FormGroup
        controlId='formBasicText'
        validationState={validationStateForField('destination')}>
        <ControlLabel>Destination of Trip</ControlLabel>
        <FormControl
          type='text'
          value={payload.destination}
          placeholder='Enter destination'
          onChange={(e) => handleChange('destination', e.target.value)} />
        <FormControl.Feedback />
        <HelpBlock>Enter at least one character.</HelpBlock>
      </FormGroup>
      <FormGroup
        validationState={validationStateForField('startDate')}>
        <ControlLabel>Start Date of Trip</ControlLabel>
        <DatePicker
          value={payload.startDate}
          onChange={(value, formatted) => handleChange('startDate', value)} />
        <FormControl.Feedback />
        <HelpBlock>Choose a date using the date picker.</HelpBlock>
      </FormGroup>
      <FormGroup
        validationState={validationStateForField('endDate')}>
        <ControlLabel>End Date of Trip</ControlLabel>
        <DatePicker
          value={payload.endDate}
          onChange={(value, formatted) => handleChange('endDate', value)} />
        <FormControl.Feedback />
        <HelpBlock>Choose a date on or after the start date.</HelpBlock>
      </FormGroup>
      <FormGroup
        controlId='formBasicText'
        validationState={validationStateForField('comment')}>
        <ControlLabel>Comment for Trip</ControlLabel>
        <FormControl
          type='text'
          value={payload.comment}
          placeholder='Enter comment'
          onChange={(e) => handleChange('comment', e.target.value)} />
        <FormControl.Feedback />
        <HelpBlock>Enter at least one character.</HelpBlock>
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

export default TripForm
