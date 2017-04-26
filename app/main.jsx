'use strict'
import React from 'react'
import {Router, Route, IndexRedirect, browserHistory} from 'react-router'
import {render} from 'react-dom'
import {connect, Provider} from 'react-redux'

import store from './store'
import Jokes from './components/Jokes'
import Login from './components/Login'
import WhoAmI from './components/WhoAmI'
import NotFound from './components/NotFound'
import Scratchpad from './components/Scratchpad'
import firebase from 'APP/fire'
const auth = firebase.auth()
    , db = firebase.database()

auth.onAuthStateChanged(user => user || auth.signInAnonymously())

const ExampleApp = ({children}) =>
  <div>
    <nav>
      <WhoAmI/>
    </nav>
    {children}
  </div>

render(
  <Provider store={store}>
    <Router history={browserHistory}>
      <Route path="/" component={ExampleApp}>
        <IndexRedirect to="/scratchpad" />
        <Route path="/jokes" component={Jokes} />
        <Route path="/scratchpad" component={() => <Scratchpad fireRef={db.ref('scratchpad')} />} />
      </Route>
      <Route path='*' component={NotFound} />
    </Router>
  </Provider>,
  document.getElementById('main')
)
