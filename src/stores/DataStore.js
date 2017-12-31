// @flow

import users from '../../data/users'
import trips from '../../data/trips'
import mongoose from 'mongoose'
import path from 'path'
import _ from 'lodash'
import { saveItems, genId } from '../util/save'
import UserModel from '../mongoose/UserModel'

import type { Debugger } from 'debug'
import type { User, CreateUserPayload, UpdateUserPayload, Trip,
  CreateTripPayload, UpdateTripPayload } from '../util/types'

export default class DataStore {
  logger: Debugger

  constructor(logger: Debugger) {
    this.logger = logger
    mongoose.connect('mongodb://127.0.0.1:27017/test?authSource=admin', {
      user: 'admin',
      pass: 'password',
    })
    const db = mongoose.connection
    db.on('error', error => this.logger('Mongoose Connection Error: ' + error))
    db.once('open', () => {
      this.logger('Mongoose Connected Successfully.')
      var testUser = new UserModel({
        firstName: 'Miraan',
        lastName: 'Tabrez',
        facebookId: 'fakefacebookid',
        facebookAccessToken: 'fakeaccesstoken',
        email: 'miraan@tabrez.com',
        level: 3,
      })
      testUser.save((error, savedUser) => {
        if (error) {
          console.log('Test user save error: ' + error)
          return
        }
        console.log('Test user saved')
        console.log(savedUser)
      })
    })
  }

  getUsers: () => Promise<Array<User>> = () => {
    return new Promise((resolve, reject) => {
      resolve(users)
    })
  }

  getUserById: string => Promise<?User> = (userId: string) => {
    return new Promise((resolve, reject) => {
      const user: ?User = users.find(user => user.id === userId)
      if (!user) {
        resolve(null)
        return
      }
      resolve(user)
    })
  }

  getUserByFacebookId: string => Promise<?User> = (facebookId: string) => {
    return new Promise((resolve, reject) => {
      const user: ?User = users.find(user => user.facebookId === facebookId)
      if (!user) {
        resolve(null)
        return
      }
      resolve(user)
    })
  }

  createUser: CreateUserPayload => Promise<User> = (payload: CreateUserPayload) => {
    return new Promise((resolve, reject) => {
      const user: User = {
        ...payload,
        id: genId(users),
      }
      users.push(user)
      this._saveUsers().then(writePath => {
        resolve(user)
      })
      .catch(error => {
        reject('DataStore createUser error: ' + error)
      })
    })
  }

  updateUser: (string, UpdateUserPayload) => Promise<User> =
  (userId: string, payload: UpdateUserPayload) => {
    return new Promise((resolve, reject) => {
      const user: ?User = users.find(user => user.id === userId)
      if (!user) {
        reject('DataStore updateUser error: No user found with given userId.')
        return
      }
      // $FlowFixMe
      Object.assign(user, payload)
      this._saveUsers().then(writePath => {
        resolve(user)
      })
      .catch(error => {
        reject('DataStore updateUser error: ' + error)
      })
    })
  }

  deleteUser: string => Promise<User> = (userId: string) => {
    return new Promise((resolve, reject) => {
      const index: number = users.findIndex(user => user.id === userId)
      if (index === -1) {
        reject('DataStore deleteUser error: No user found with given userId.')
        return
      }
      const deletedRecord = users.splice(index, 1)[0]
      this._saveUsers().then(writePath => {
        resolve(deletedRecord)
      })
      .catch(error => {
        reject('DataStore deleteUser error: ' + error)
      })
    })
  }

  getTrips: () => Promise<Array<Trip>> = () => {
    return new Promise((resolve, reject) => {
      resolve(trips)
    })
  }

  getTripsByUserId: string => Promise<Array<Trip>> = (userId: string) => {
    return new Promise((resolve, reject) => {
      const userTrips: Array<Trip> = _.filter(trips, trip => trip.userId === userId)
      resolve(userTrips)
    })
  }

  getTripById: string => Promise<?Trip> = (tripId: string) => {
    return new Promise((resolve, reject) => {
      const trip: ?Trip = trips.find(trip => trip.id === tripId)
      if (!trip) {
        resolve(null)
        return
      }
      resolve(trip)
    })
  }

  createTrip: (string, CreateTripPayload) => Promise<Trip> =
  (userId: string, payload: CreateTripPayload) => {
    return new Promise((resolve, reject) => {
      const trip: Trip = {
        ...payload,
        id: genId(trips),
        userId: userId,
      }
      trips.push(trip)
      this._saveTrips().then(writePath => {
        resolve(trip)
      })
      .catch(error => {
        reject('DataStore createTrip error: ' + error)
      })
    })
  }

  updateTrip: (string, UpdateTripPayload) => Promise<Trip> =
  (tripId: string, payload: UpdateTripPayload) => {
    return new Promise((resolve, reject) => {
      const trip: ?Trip = trips.find(trip => trip.id === tripId)
      if (!trip) {
        reject('DataStore updateTrip error: No trip found with given tripId.')
        return
      }
      // $FlowFixMe
      Object.assign(trip, payload)
      this._saveTrips().then(writePath => {
        resolve(trip)
      })
      .catch(error => {
        reject('DataStore updateTrip error: ' + error)
      })
    })
  }

  deleteTrip: string => Promise<Trip> = (tripId: string) => {
    return new Promise((resolve, reject) => {
      const index: number = trips.findIndex(trip => trip.id === tripId)
      if (index === -1) {
        reject('DataStore deleteTrip error: No trip found with given tripId.')
        return
      }
      const deletedRecord = trips.splice(index, 1)[0]
      this._saveTrips().then(writePath => {
        resolve(deletedRecord)
      })
      .catch(error => {
        reject('DataStore deleteTrip error: ' + error)
      })
    })
  }

  _saveUsers: () => Promise<string> = () => {
    return new Promise((resolve, reject) => {
      saveItems(users, 'users.json').then(writePath => {
        this.logger(`Users updated. Written to: ` +
          `${path.relative(path.join(__dirname, '..', '..'), writePath)}`)
        resolve(writePath)
      })
      .catch(error => {
        reject('DataStore _saveUsers error: ' + error)
      })
    })
  }

  _saveTrips: () => Promise<string> = () => {
    return new Promise((resolve, reject) => {
      saveItems(trips, 'trips.json').then(writePath => {
        this.logger(`Trips updated. Written to: ` +
          `${path.relative(path.join(__dirname, '..', '..'), writePath)}`)
        resolve(writePath)
      })
      .catch(error => {
        reject('DataStore _saveTrips error: ' + error)
      })
    })
  }
}
