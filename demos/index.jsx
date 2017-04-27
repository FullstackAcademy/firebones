import React from 'react'
import {Route} from 'react-router'

import Scratchpad from './scratchpad'
import Whiteboard from './whiteboard'

export default <Route path="/demos" component={({children}) => children}>
  <IndexRedirect to="scratchpad/welcome"/>
  <Route path="scratchpad/:title" component={Scratchpad}/>
  <Route path="whiteboard/:title" component={Whiteboard}/>
</Route>

