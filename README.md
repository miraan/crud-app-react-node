# Trip Planner CRUD App

## Backend

The backend is a Node.JS Express server exposing routes that make up a RESTful API.

The code is type-checked with Flow and there are unit and integration tests written in Jest.

For more details, see the README in the `backend` directory.

## Frontend

The frontend is a React Web app using React Bootstrap for design and React Router for navigation.

State and actions are managed via Redux and Redux Thunk for async actions.

The code is type checked with Flow.

For more details, see the README in the `frontend` directory.

## Usage and Deployment

1. Install MongoDB, create a root user, create a DB
2. Install Redis Server
3. Install Node.JS
4. Get an HTTPS key and certificate
5. `cd {REPO_ROOT}/backend`
6. Put your HTTPS key and certificate here
7. Update `{REPO_ROOT}/backend/src/configuration.js` with desired parameters
8. `npm install && flow-typed install && gulp`
9. Exit gulp and `npm start`
10. `cd {REPO_ROOT}/frontend`
11. `npm install`
12. Update `{REPO_ROOT}/frontend/src/configuration.js` with desired parameters
13. `npm build`
14. Go to https://{HOST:PORT} and the app should be running
