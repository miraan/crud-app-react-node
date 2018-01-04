// @flow

import type { UserAction } from '../actions/userActions'
import type { User } from '../util/Api'

export type UserState = Array<User>

const initialUserState: UserState = []

export default function userReducer(
  state: UserState = initialUserState,
  action: UserAction
) {
    switch (action.type) {
      case 'GET_USERS_SUCCESS':
        return action.users
      case 'CREATE_USER_SUCCESS':
        return [
          ...state,
          action.user
        ]
      case 'UPDATE_USER_SUCCESS':
        const updatedUser: User = action.user
        return [
          ...state.filter(user => user.id !== updatedUser.id),
          action.user
        ]
      case 'DELETE_USER_SUCCESS':
        const deletedUser: User = action.user
        return [
          ...state.filter(user => user.id !== deletedUser.id)
        ]
      default:
        return state
    }
}
