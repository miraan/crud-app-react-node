# Node.JS RESTful CRUD API with Facebook User Authentication

This branch contains a Node.JS Express Server with Flow type-checking
exposing a RESTful API with CRUD examples and user authentication using the
Facebook Graph API to verify Facebook access tokens sent from clients. Data
storage is via MongoDB, and this project uses the mongoose npm package.

The CRUD examples are of Users and Trips.

User authentication is via the Facebook Graph API and Passport.

Log in is via `GET /api/v1/login/facebook?facebookAccessToken=xxx`

The client is responsible for getting a `facebookAccessToken` using a Facebook
Client SDK.

The server extends this token to a long lived token, gets the associated Facebook
profile and creates a User object with this data or updates the User object if
one already exists with the retrieved Facebook profile user ID.

Once this login process completes, the server generates an authentication token,
stores it in Redis with the User ID, and returns it as a token to the client to
use on future requests. This token is generated using a secret key from the user ID
so that we can easily manually expire tokens for specific users at will.

Future client requests can be authenticated if the client passes this token in the
`Authorization` header, e.g.

`Authorization: Bearer xxxxx`

Each user has an associated `level` which governs their permissions to perform
certain actions.

Level 1 users can only view and change their own user record and trip records.

Level 2 users can view all user records, change their own trip records and change
all user records for level 1 users.

Level 3 users can view and change all user and trip records.

Stack used: Node.JS, Express, Flow, Babel + ES Preset, Gulp,
Passport (Bearer Token Strategy), Facebook Node SDK (fb), Redis, MongoDB, mongoose,
Jest, supertest

## Login Routes

`GET /api/v1/login/facebook?facebookAccessToken=xxxxx`: Authenticates and returns a token.

## User Routes

`GET /api/v1/user/me`: Returns own profile.

`GET /api/v1/user/`: Returns all users.

`GET /api/v1/user/xxx`: Returns user with ID `xxx`

`POST /api/v1/user/`: Creates a user with JSON data in request body. All user fields
must be present.

`PUT /api/v1/user/xxx`: Updates user with ID `xxx` with JSON data in request body

`DELETE /api/v1/user/xxx`: Deletes a user with ID `xxx`

## Trip Routes

`GET /api/v1/trip/me`: Gets own trips.

`GET /api/v1/trip/`: Gets all trips.

`GET /api/v1/trip/xxx`: Gets trip with ID xxx.

`POST /api/v1/trip/`: Creates a trip with arbitrary user ID.

`POST /api/v1/trip/me`: Creates a trip with own user ID.

`PUT /api/v1/trip/xxx`: Updates trip with ID xxx.

`DELETE /api/v1/trip/xxx`: Deletes trip with ID xxx.

## Tests

Unit tests for the Express Routers and integration tests are written using Jest
and supertest. Tests can be found in the directory `__tests__`.

## Database

MongoDB is used to store records, and the mongoose npm package is used to
interface with the DB.

To install MongoDB, run: `brew install mongodb`

To start an instance of MongoDB, run:

`mongod --dbpath data --bind_ip 127.0.0.1 --port 27017 --auth`

To connect a shell client, run:

`mongo --port 27017 -u 'admin' -p 'password' --authenticationDatabase 'admin'`

You will need to configure the root user account and password for these commands
to work.

## Cache

Redis is used to store user tokens to persist authenticated sessions via the API.

To install Redis, run: `brew install redis`

To start a Redis server, run: `redis-server`

## Configuring the project

A `ServerConfiguration` object is exported from `src/configuration.js` which
can be edited to configure the app. The object has the following Flow type:

```
type ServerConfiguration = {
  defaultPort: number,
  loggerPrefix: string,
  tokenExpireTimeSeconds: number,
  redisServerHost: string,
  redisServerPort: number,
  facebookClientAppId: string,
  facebookClientAppSecret: string,
  testUserFacebookAccessToken: string,
  mongoDbHost: string,
  mongoDbPort: number,
  mongoDbDatabaseName: string,
  mongoDbAuthenticationDatabase: string,
  mongoDbUserName: string,
  mongoDbPassword: string,
}
```

## Prerequisites

1. `npm install -g gulp-cli`
2. `npm install -g flow-typed`
3. `brew install redis`
4. `brew install mongodb`

## Usage

Clone the repository

1. `npm install`
2. `flow-typed install`
3. `gulp` to watch files and automatically rebuild / flow type check
4. `redis-server` to start Redis Server
5. `mongod --dbpath data --bind_ip 127.0.0.1 --port 27017 --auth` to start MongoDB
4. `npm test` to run unit tests and integration tests
5. `npm start` to start the server
6. Develop and remember to run `flow-typed install` after adding a new
dependency with `npm install --save xxx`
