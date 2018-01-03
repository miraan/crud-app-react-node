// @flow

import React from 'react'
import { Panel, Button } from 'react-bootstrap'

type Props = {}
type State = {}

export default class NewTripPanel extends React.Component<Props, State> {
  render = () => (
    <Panel header={<h3>Create A Trip</h3>}>
      Create a trip
    </Panel>
  )
}
