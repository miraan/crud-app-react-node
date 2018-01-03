// @flow

import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import configureStore from './store/configureStore'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap/dist/css/bootstrap-theme.css'
import './index.css'
import App from './App'
import registerServiceWorker from './registerServiceWorker'

const store = configureStore()

const rootElement = document.querySelector('root')
if (!(rootElement instanceof Element)) {
  throw new Error('Invalid root element type')
}

ReactDOM.render(
  <App />,
  rootElement
)
registerServiceWorker()
