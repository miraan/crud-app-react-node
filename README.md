# React + Redux + Flow + React Router + React Bootstrap CRUD Frontend

This project is a frontend for a basic CRUD app with User and Trip entities.

You can log in / create an account via Facebook Login and then create, update and delete your own Trip records.

You can also update and delete your own user profile.

If you are a level 2 user, you can view all user records and CRUD all level 1 user records.

If you are a level 3 user, you can CRUD all user and trip records.

You can print your travel itinerary for the next month.

You can filter user / trip records by name / destination.

## Stack Used

React, Redux, Flow, React Router, React Bootstrap, Flow Typed, Redux Thunk

## Project Structure

```
flow-typed
public
src
- actions: Contains redux actions + describes Dispatcher
- components: Contains React components
- reducers: Contains redux reducers + describes Application State
- util: Contains utility methods and classes
```

## Usage

1. Clone the repo
2. Start the backend Node server (contained in this repo: https://github.com/miraan/node-flow-api-boilerplate)
3. `npm start` to start the development server for this frontend
4. Remember to run `flow-typed install` whenever you install an npm package
