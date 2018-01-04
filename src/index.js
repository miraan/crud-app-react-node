// @flow

import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import configureStore from './util/configureStore'
import App from './components/App'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap/dist/css/bootstrap-theme.css'
import registerServiceWorker from './registerServiceWorker'
import './index.css'

const store = configureStore()

const rootElement = document.getElementById('root')
if (!(rootElement instanceof Element)) {
  throw new Error('Invalid root element type')
}

window.onload = () => {
  ReactDOM.render(
    <Provider store={store}>
      <App />
    </Provider>,
    rootElement
  )
}

registerServiceWorker()
