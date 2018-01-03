// @flow

import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import configureStore from './util/configureStore'
import { Router, Route } from 'react-router-dom'
import history from './util/history'
import App from './components/App'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap/dist/css/bootstrap-theme.css'
import './index.css'
import registerServiceWorker from './registerServiceWorker'

const store = configureStore()

const rootElement = document.getElementById('root')
if (!(rootElement instanceof Element)) {
  throw new Error('Invalid root element type')
}

window.onload = () => {
  ReactDOM.render(
    <Provider store={store}>
      <Router history={history}>
        <Route exact path='/' component={App} />
      </Router>
    </Provider>,
    rootElement
  )
}

registerServiceWorker()
