// @flow

import express from 'express'
import morgan from 'morgan'
import bodyParser from 'body-parser'
import passport from 'passport'
import { Strategy } from 'passport-http-bearer'
import TokenStore from './stores/TokenStore'
import DataStore from './stores/DataStore'

import ProduceRouter from './routers/ProduceRouter'
import LoginRouter from './routers/LoginRouter'
import UserRouter from './routers/UserRouter'
import TripRouter from './routers/TripRouter'

import type { Debugger } from 'debug'

export default class Api {
  express: express$Application
  logger: Debugger
  tokenStore: TokenStore
  dataStore: DataStore

  constructor(logger: Debugger, tokenStore: TokenStore, dataStore: DataStore) {
    this.express = express()
    this.logger = logger
    this.tokenStore = tokenStore
    this.dataStore = dataStore
    this.initMiddleware()
    this.initPassport()
    this.initRoutes()
  }

  initMiddleware = () => {
    this.express.use(morgan('dev'))
    this.express.use(bodyParser.json())
    this.express.use(bodyParser.urlencoded({ extended: false }))
  }

  initPassport = () => {
    passport.use(new Strategy((token, cb) => {
      this.tokenStore.getUserId(token).then(userId => {
        if (!userId) {
          return cb(null, false)
        }
        return this.dataStore.getUser(userId)
      })
      .then(user => {
        if (!user) {
          return cb('Authentication Error: No user found for valid token.')
        }
        return cb(null, user)
      })
      .catch(error => {
        return cb('Authentication Error: ' + error)
      })
    }))
  }

  initRoutes = () => {
    const produceRouter = new ProduceRouter(this.logger)
    this.express.use(produceRouter.path, produceRouter.router)
    const loginRouter = new LoginRouter(this.tokenStore, this.logger)
    this.express.use(loginRouter.path, loginRouter.router)
    const userRouter = new UserRouter(this.logger)
    this.express.use(userRouter.path, userRouter.router)
    const tripRouter = new TripRouter(this.logger)
    this.express.use(tripRouter.path, tripRouter.router)
  }
}
