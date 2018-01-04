// @flow

import React from 'react'
import { Jumbotron, Grid, Row, Col, ListGroup, ListGroupItem, Panel, Button, FormControl } from 'react-bootstrap'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Redirect, Route, Switch } from 'react-router-dom'
import { LinkContainer } from 'react-router-bootstrap'
import Authenticator from '../util/Authenticator'
import * as userActions from '../actions/userActions'
import NewUserPanel from './NewUserPanel'
import UserPanel from './UserPanel'

import type { ApplicationState } from '../reducers'
import type { User } from '../util/Api'

type Props = {
  actions: any,
  users: Array<User>,
  match: any,
}
type State = {
  searchText: string
}

class UsersPage extends React.Component<Props, State> {
  state: State = {
    searchText: ''
  }

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
                <h1>Users</h1>
                <hr />
              </Col>
            </Row>
            <Row>
              <Col md={4}>
                <FormControl
                  type='text'
                  value={this.state.searchText}
                  placeholder='Search by name'
                  onChange={(e) => this.setState({ searchText: e.target.value })} />
                <ListGroup className='scrollableListGroup'>
                  {this._renderUserListItems()}
                </ListGroup>
              </Col>
              <Col md={8}>
                <Row>
                  <Col md={12}>
                    <Switch>
                      <Route exact path={this.props.match.url} render={this._renderDefaultPanel} />
                      <Route path={`${this.props.match.url}/new`} component={NewUserPanel} />
                      <Route path={`${this.props.match.url}/:userId`} component={UserPanel} />
                    </Switch>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Grid>
        </Jumbotron>
      </div>
    )
  }

  _renderUserListItems = () => {
    if (this.props.users.length < 1) {
      return (
        <ListGroupItem header='No Users'>
          Create a user in the panel to the right.
        </ListGroupItem>
      )
    }
    return this.props.users
    .filter(user => (user.firstName + user.lastName).toLowerCase().indexOf(this.state.searchText.toLowerCase()) !== -1)
    .map(user => (
      <LinkContainer to={`${this.props.match.url}/${user.id}`} key={user.id}>
        <ListGroupItem header={user.firstName + ' ' + user.lastName}>
          {user.email}
        </ListGroupItem>
      </LinkContainer>
    ))
  }

  _renderDefaultPanel = () => (
    <Panel header={<h3>No User Selected</h3>}>
      No user is selected. Select one from the menu on the left.
      {Authenticator.getLoginResponseX().user.level >= 2
      ? <div>
          <hr />
          <p>
            <LinkContainer to={`${this.props.match.url}/new`}>
              <Button bsStyle='primary'>Create A User</Button>
            </LinkContainer>
          </p>
        </div>
      : null}
    </Panel>
  )

  componentDidMount = () => {
    if (!Authenticator.isLoggedIn()) {
      return
    }
    this.props.actions.getUsers()
  }
}

function mapStateToProps(state: ApplicationState) {
  return {
    users: state.users.sort((a, b) => {
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
    actions: bindActionCreators(userActions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(UsersPage)
