// @flow

jest.mock('../src/stores/TokenStore')
jest.mock('../src/stores/DataStore')

import request from 'supertest'
import debug from 'debug'
import _ from 'lodash'
import Api from '../src/Api'
import TokenStore from '../src/stores/TokenStore'
import DataStore from '../src/stores/DataStore'

import type { Debugger } from 'debug'
import type { User } from '../src/util/types'

const mockUserData: Array<User> = [
  {
    id: 1,
    firstName: "John",
    lastName: "Smith",
    facebookId: "432432",
    facebookAccessToken: "x4234x3",
    email: "john@smith.com",
    level: 1,
  },
  {
    id: 2,
    firstName: "Joe",
    lastName: "Bloggs",
    facebookId: "34324",
    facebookAccessToken: "432d234s343",
    email: "joe@bloggs.com",
    level: 2,
  },
  {
    id: 3,
    firstName: "Miraan",
    lastName: "Tabrez",
    facebookId: "324354654354",
    facebookAccessToken: "4jh3k2h4jk32hj43243k2kkh432",
    email: "miraan@miraan.co.uk",
    level: 3,
  },
]

const mockTokenStoreData = {
  'token1': 1,
  'token2': 2,
  'token3': 3,
}

TokenStore.mockImplementation(() => {
  return {
    getUserId: jest.fn().mockImplementation(token => {
      return Promise.resolve(mockTokenStoreData[token])
    }),
  }
})

DataStore.mockImplementation(() => {
  return {
    getUsers: jest.fn().mockImplementation(() => {
      return Promise.resolve(mockUserData)
    }),
    getUserById: jest.fn().mockImplementation(userId => {
      return Promise.resolve(mockUserData.find(user => user.id === userId))
    }),
    createUser: jest.fn().mockImplementation(payload => {
      const newUserId = _.maxBy(mockUserData, user => user.id).id + 1
      const newUser: User = {
        id: newUserId,
        ...payload,
      }
      mockUserData.push(newUser)
      return Promise.resolve(newUser)
    }),
    updateUser: jest.fn().mockImplementation((userId, payload) => {
      const user: ?User = mockUserData.find(user => user.id === userId)
      if (!user) {
        return Promise.reject('No mock user with that ID.')
      }
      Object.assign(user, payload)
      return Promise.resolve(user)
    }),
    deleteUser: jest.fn().mockImplementation(userId => {
      const index: number = mockUserData.findIndex(user => user.id === userId)
      if (index === -1) {
        return Promise.reject('No mock user with that ID.')
      }
      const deletedUser = mockUserData.splice(index, 1)[0]
      return Promise.resolve(deletedUser)
    }),
  }
})

const logger: Debugger = debug('jest-logger:')
const tokenStore: TokenStore = new TokenStore(logger)
const dataStore: DataStore = new DataStore(logger)
const app = new Api(logger, tokenStore, dataStore).express

describe('User Routes', () => {

  describe('GET /api/v1/user/me - get own profile', () => {

    it('should return JSON', () => {
      return request(app).get('/api/v1/user/me')
        .expect('Content-Type', /json/)
        .then(res => expect(res.body).toBeInstanceOf(Object))
    })

    it('should return 401 if no token is used', () => {
      return request(app).get('/api/v1/user/me')
        .expect(401)
        .then(res => expect(res.body.success).toBe(false))
    })

    it('should return 401 if invalid token is used', () => {
      return request(app).get('/api/v1/user/me')
        .set('Authorization', 'Bearer invalidtoken')
        .expect(401)
        .then(res => expect(res.body.success).toBe(false))
    })

    it('should return user 1 if token 1 is used', () => {
      return request(app).get('/api/v1/user/me')
        .set('Authorization', 'Bearer token1')
        .expect(200)
        .then(res => {
          expect(res.body.success).toBe(true)
          expect(res.body.content.user).toEqual(mockUserData[0])
        })
    })

    it('should return user 2 if token 2 is used', () => {
      return request(app).get('/api/v1/user/me')
        .set('Authorization', 'Bearer token2')
        .expect(200)
        .then(res => {
          expect(res.body.success).toBe(true)
          expect(res.body.content.user).toEqual(mockUserData[1])
        })
    })

  })

  describe('GET /api/v1/user/ - get all users', () => {

    it('should return JSON', () => {
      return request(app).get('/api/v1/user/')
        .expect('Content-Type', /json/)
        .then(res => expect(res.body).toBeInstanceOf(Object))
    })

    it('should return 401 if no token is used', () => {
      return request(app).get('/api/v1/user/')
        .expect(401)
        .then(res => expect(res.body.success).toBe(false))
    })

    it('should return 401 if token 1 is used', () => {
      return request(app).get('/api/v1/user/')
        .set('Authorization', 'Bearer token1')
        .expect(401)
        .then(res => expect(res.body.success).toBe(false))
    })

    it('should return an array of all users if token 2 is used', () => {
      return request(app).get('/api/v1/user/')
        .set('Authorization', 'Bearer token2')
        .expect(200)
        .then(res => expect(res.body.content.users).toEqual(mockUserData))
    })

    it('should return an array of all users if token 3 is used', () => {
      return request(app).get('/api/v1/user/')
        .set('Authorization', 'Bearer token3')
        .expect(200)
        .then(res => expect(res.body.content.users).toEqual(mockUserData))
    })

  })

  describe('GET /api/v1/user/:id - get a user by ID', () => {

    it('should return JSON', () => {
      return request(app).get('/api/v1/user/1')
        .expect('Content-Type', /json/)
        .then(res => expect(res.body).toBeInstanceOf(Object))
    })

    it('should return user 1 if token 1 is used for ID 1', () => {
      return request(app).get('/api/v1/user/1')
        .set('Authorization', 'Bearer token1')
        .expect(200)
        .then(res => {
          expect(res.body.success).toBe(true)
          expect(res.body.content.user).toEqual(mockUserData[0])
        })
    })

    it('should return 401 if token 1 is used for ID 2', () => {
      return request(app).get('/api/v1/user/2')
        .set('Authorization', 'Bearer token1')
        .expect(401)
        .then(res => expect(res.body.success).toBe(false))
    })

    it('should return 401 if token 1 is used for ID 3', () => {
      return request(app).get('/api/v1/user/3')
        .set('Authorization', 'Bearer token1')
        .expect(401)
        .then(res => expect(res.body.success).toBe(false))
    })

    it('should return user 1 if token 2 is used for ID 1', () => {
      return request(app).get('/api/v1/user/1')
        .set('Authorization', 'Bearer token2')
        .expect(200)
        .then(res => {
          expect(res.body.success).toBe(true)
          expect(res.body.content.user).toEqual(mockUserData[0])
        })
    })

    it('should return user 1 if token 3 is used for ID 1', () => {
      return request(app).get('/api/v1/user/1')
        .set('Authorization', 'Bearer token3')
        .expect(200)
        .then(res => {
          expect(res.body.success).toBe(true)
          expect(res.body.content.user).toEqual(mockUserData[0])
        })
    })

    it('should return user 3 if token 2 is used for ID 3', () => {
      return request(app).get('/api/v1/user/3')
        .set('Authorization', 'Bearer token2')
        .expect(200)
        .then(res => {
          expect(res.body.success).toBe(true)
          expect(res.body.content.user).toEqual(mockUserData[2])
        })
    })

    it('should return 400 if token 3 is used with ID 99', () => {
      return request(app).get('/api/v1/user/99')
        .set('Authorization', 'Bearer token3')
        .expect(400)
        .then(res => expect(res.body.success).toBe(false))
    })

  })

  describe('POST /api/v1/user/ - create a new user', () => {

    it('should return JSON', () => {
      return request(app).post('/api/v1/user/')
        .expect('Content-Type', /json/)
        .then(res => expect(res.body).toBeInstanceOf(Object))
    })

    // it('should return 401 if token 1 is used', () => {
    //
    // })
    //
    // it('should return 400 if token 2 is used with incomplete payload', () => {
    //
    // })
    //
    // it('should return success if token 2 is used', () => {
    //
    // })
    //
    // it('should return success if token 3 is used', () => {
    //
    // })

  })

  describe('PUT /api/v1/user/:id - update a user', () => {

    it('should return JSON', () => {
      return request(app).put('/api/v1/user/1')
        .expect('Content-Type', /json/)
        .then(res => expect(res.body).toBeInstanceOf(Object))
    })

    // it('should return success if token 1 is used on ID 1', () => {
    //
    // })
    //
    // it('should return 401 if token 1 is used on ID 2', () => {
    //
    // })
    //
    // it('should return 401 if token 1 is used on ID 3', () => {
    //
    // })
    //
    // it('should return 401 if token 2 is used on ID 3', () => {
    //
    // })
    //
    // it('should return success if token 2 is used on ID 1', () => {
    //
    // })
    //
    // it('should return success if token 3 is used on ID 2', () => {
    //
    // })

  })

  describe('DELETE /api/v1/user/:id - delete a user', () => {

    it('should return JSON', () => {
      return request(app).delete('/api/v1/user/1')
        .expect('Content-Type', /json/)
        .then(res => expect(res.body).toBeInstanceOf(Object))
    })

    // it('should return success if token 1 is used on ID 1', () => {
    //
    // })
    //
    // it('should return 401 if token 1 is used on ID 2', () => {
    //
    // })
    //
    // it('should return 401 if token 1 is used on ID 3', () => {
    //
    // })
    //
    // it('should return 401 if token 2 is used on ID 3', () => {
    //
    // })
    //
    // it('should return success if token 2 is used on ID 1', () => {
    //
    // })
    //
    // it('should return success if token 3 is used on ID 2', () => {
    //
    // })

  })

})
