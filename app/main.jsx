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

import firebase from 'APP/fire'
import Scratchpad from 'APP/demos/scratchpad'

const auth = firebase.auth()
    , db = firebase.database()

auth.onAuthStateChanged(user => {
  console.log(user)
  user || auth.signInAnonymously()
})

const ExampleApp = ({children}) =>
  <div>
    <nav>
      {/* We pass in the firebase authentication object to WhoAmI */}
      <WhoAmI auth={auth}/>
    </nav>
    {children}
  </div>

render(
  <Provider store={store}>
    <Router history={browserHistory}>
      <Route path="/" component={ExampleApp}>
        <IndexRedirect to="scratchpad/welcome"/>
        <Route path="scratchpad/:title" component={Scratchpad}/>
      </Route>
      <Route path='*' component={NotFound}/>
    </Router>
  </Provider>,
  document.getElementById('main')
)
