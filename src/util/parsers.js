// @flow

import type { CreateUserPayload, UpdateUserPayload } from './types'
import _ from 'lodash'

export function parseProduce(input: any): boolean {
  const requirements = [
    { key: 'name', type: 'string' },
    { key: 'quantity', type: 'number' },
    { key: 'price', type: 'number' }
  ]
  return requirements.every(req =>
    input.hasOwnProperty(req.key) && typeof input[req.key] === req.type
  )
}

export function parseUpdate(input: any): any | null {
  const validKeys = ['name', 'quantity', 'price']
  const trimmed = Object.keys(input).reduce((obj, curr) => {
    if (obj && validKeys.indexOf(curr) !== -1) {
      obj[curr] = input[curr]
      return obj
    }
  }, {})
  return (trimmed && Object.keys(trimmed).length > 0) ? trimmed : null
}

export function parseId(input: any): number | boolean {
  if (input.hasOwnProperty('id'))
    return (typeof input.id === 'string') ? parseInt(input.id, 10) : input.id
  return false
}

export function parseCreateUserPayload(input: any): ?CreateUserPayload {
  const requiredKeys: CreateUserPayload = {
    firstName: 'firstName',
    lastName: 'lastName',
    facebookId: 'facebookId',
    facebookAccessToken: 'facebookAccessToken',
    level: 1,
    email: 'email'
  }
  console.log(input)
  if (_.difference(_.keys(requiredKeys), _.keys(input)).length > 0) {
    return null
  }
  return {
    firstName: input.firstName,
    lastName: input.lastName,
    facebookId: input.facebookId,
    facebookAccessToken: input.facebookAccessToken,
    level: input.level,
    email: input.email,
  }
}

export function parseUpdateUserPayload(input: any): ?UpdateUserPayload {
  let payload: UpdateUserPayload = {}
  const possibleKeys: CreateUserPayload = {
    firstName: 'firstName',
    lastName: 'lastName',
    facebookId: 'facebookId',
    facebookAccessToken: 'facebookAccessToken',
    level: 1,
    email: 'email'
  }
  _.keys(possibleKeys).forEach((key, index) => {
    if (input[key]) {
      payload[key] = input[key]
    }
  })
  if (_.keys(payload).length < 1) {
    return null
  }
  return payload
}
