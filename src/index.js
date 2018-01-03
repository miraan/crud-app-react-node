// @flow

import React from 'react'
import ReactDOM from 'react-dom'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap/dist/css/bootstrap-theme.css'
import './index.css'
import App from './App'
import registerServiceWorker from './registerServiceWorker'

const rootElement = document.querySelector('root')
if (!(rootElement instanceof Element)) {
  throw new Error('Invalid root element type')
}

ReactDOM.render(<App />, rootElement)
registerServiceWorker()
