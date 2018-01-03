// @flow

import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import configureStore from './util/configureStore'
import { Router, browserHistory } from 'react-router'
import routes from './routes'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap/dist/css/bootstrap-theme.css'
import './index.css'
import App from './components/App'
import registerServiceWorker from './registerServiceWorker'

const store = configureStore()

const rootElement = document.querySelector('root')
if (!(rootElement instanceof Element)) {
  throw new Error('Invalid root element type')
}

ReactDOM.render(
  <Provider store={store}>
    <Router history={browserHistory} routes={routes} />
  </Provider>,
  rootElement
)

registerServiceWorker()
