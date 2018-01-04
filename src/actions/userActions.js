// @flow

import Api from '../util/Api'
import history from '../util/history'
import Authenticator from '../util/Authenticator'

import type { Dispatch } from '.'
import type { User, CreateUserPayload } from '../util/Api'


export type UserAction =
  GetUsersSuccessAction |
  CreateUserSuccessAction |
  UpdateUserSuccessAction |
  DeleteUserSuccessAction

type GetUsersSuccessAction = {
  type: GetUsersSuccessActionType,
  users: Array<User>,
}
type GetUsersSuccessActionType = 'GET_USERS_SUCCESS'

type CreateUserSuccessAction = {
  type: CreateUserSuccessActionType,
  user: User,
}
type CreateUserSuccessActionType = 'CREATE_USER_SUCCESS'

type UpdateUserSuccessAction = {
  type: UpdateUserSuccessActionType,
  user: User,
}
type UpdateUserSuccessActionType = 'UPDATE_USER_SUCCESS'

type DeleteUserSuccessAction = {
  type: DeleteUserSuccessActionType,
  user: User,
}
type DeleteUserSuccessActionType = 'DELETE_USER_SUCCESS'

export function getUsersSuccess(users: Array<User>): GetUsersSuccessAction {
  return {
    type: 'GET_USERS_SUCCESS',
    users: users
  }
}

export function createUserSuccess(user: User): CreateUserSuccessAction {
  return {
    type: 'CREATE_USER_SUCCESS',
    user: user
  }
}

export function updateUserSuccess(user: User): UpdateUserSuccessAction {
  return {
    type: 'UPDATE_USER_SUCCESS',
    user: user
  }
}

export function deleteUserSuccess(user: User): DeleteUserSuccessAction {
  return {
    type: 'DELETE_USER_SUCCESS',
    user: user
  }
}

export function getUsers() {
  return function(dispatch: Dispatch) {
    (Authenticator.getLoginResponseX().user.level < 2
    ? Api.getOwnProfile() : Api.getAllUsers())
    .then(getUsersResponse => {
      dispatch(getUsersSuccess(getUsersResponse.users))
    })
    .catch(error => {
      // TODO: dispatch error action instead
      console.log('getUsers action error: ' + error)
    })
  }
}

export function createUser(payload: CreateUserPayload) {
  return function(dispatch: Dispatch) {
    Api.createUser(payload).then(createUserResponse => {
      dispatch(createUserSuccess(createUserResponse.user))
      history.push('/users/' + createUserResponse.user.id)
    })
    .catch(error => {
      // TODO: dispatch error action instead
      console.log('createUser action error: ' + error)
    })
  }
}

export function updateUser(userId: string, payload: CreateUserPayload) {
  return function(dispatch: Dispatch) {
    Api.updateUser(userId, payload).then(updateUserResponse => {
      dispatch(updateUserSuccess(updateUserResponse.user))
    })
    .catch(error => {
      console.log('updateUser action error: ' + error)
    })
  }
}

export function deleteUser(userId: string) {
  return function(dispatch: Dispatch) {
    Api.deleteUser(userId).then(deleteUserResponse => {
      history.push('/users')
      dispatch(deleteUserSuccess(deleteUserResponse.user))
    })
    .catch(error => {
      console.log('deleteUser action error' + error)
    })
  }
}
