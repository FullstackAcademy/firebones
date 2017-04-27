import React from 'react'

import {createStore, applyMiddleware} from 'redux'
import {composeWithDevTools} from 'redux-devtools-extension'
import {Provider} from 'react-redux'

import createLogger from 'redux-logger'
import thunkMiddleware from 'redux-thunk'

import Canvas from './Canvas'
import reducer from './reducers'

export default class extends React.Component {
  componentDidMount() {
    this.mountStoreAtRef(this.props.fireRef)
  }

  componentWillReceiveProps(incoming, outgoing) {
    this.mountStoreAtRef(incoming.fireRef)
  }

  componentWillUnmount() {
    this.unsubscribe && this.unsubscribe()
  }

  mountStoreAtRef(ref) {
    if (this.state && this.state.store) {
      // If we already have a store, let's destroy it.

      // First, unsubscribe our firebase listener.
      this.unsubscribe && this.unsubscribe()
      this.unsubscribe = null

      // Then, do this annoying thing.
      //
      // If we don't do this, React does what React does, determines that
      // our render tree still has a <Provider>, and it should just send
      // that Provider new props. Unfortunately, <Provider> doesn't support
      // changing store on the fly. 😡
      //
      // So, here's a hack. We set the store to null. This forces a re-render
      // during which we return null, unmounting our Provider and everything
      // under it. Then, in the next tick, we actually mount a new <Provider>
      // with our new store.
      //
      // The lag is imperceptible.
      this.setState({store: null})
      return process.nextTick(() => this.mountStoreAtRef(ref))
    }

    const store = createStore(
      reducer,
      composeWithDevTools(
        applyMiddleware(
          createLogger({collapsed: true}),
          thunkMiddleware,
          // We're defining our own middleware! Inline! Oh god! This middleware is going to
          // sync our actions to Firebase.
          //
          // The signature for Redux middleware is:
          //
          //   (store: Redux Store) -> (next: Next Dispatch Function) -> New Dispatch Function
          //
          // Or, as I like to remember it, store => next => action. Notice that ultimately,
          // the middleware returns a new dispatch function. That's how you should think of
          // Redux middleware—it gets the old dispatch function (perhaps the store's base dispatch,
          // which calls the reducer and updates the state, or the dispatch function returned
          // by the middleware next in the applyMiddleware chain)—and returns a new dispatch
          // function. (So function. Wow. 🐶)
          //
          // This lets us manipulate the behavior of redux at various points.
          store => next => {
            // Whenever an action is pushed into Firebase, dispatch it
            // to the reducer (or the next middleware).
            const listener = ref.on('child_added', snapshot => next(snapshot.val()))
            this.unsubscribe = () => ref.off('child_added', listener)

            // Our new dispatch function is super simple—it pushes actions to Firebase,
            // unless they have a truthy doNotSync property.
            //
            // "But what if our connection to Firebase is down?" Firebase handles this.
            // It will still call your local listeners, then eventually sync the data
            // with the server.
            return action => {
              if (action.doNotSync) { return next(action) }
              return ref.push(action)
            }
          }
        )
      )
    )
    this.setState({store})
  }

  clear = () => {
    // Blow away the journal
    this.props.fireRef.set(null)
    // Reload the store
    this.mountStoreAtRef(this.props.fireRef)
  }

  render() {
    const {store} = this.state || {}
        , {children} = this.props
    if (!store) return null
    // So, this is unexpected.
    //
    // We're used to seeing <Provider> at the top of an App. But there's no rule
    // that has to be the case. In a Firebase app, it makes more sense for the app's
    // "shell" state to be managed with Firebase (and React Router). The shell
    // figures out what fireRef to give us based on where the user is in the app,
    // then we create a <Provider> pointing at a store whose actions are synced to
    // that Firebase ref.
    //
    // If our fireRef changes, we'll throw this store state away and create a new one.
    // That's fine!
    return <Provider store={store}>
      <div>
        <button onClick={this.clear}>clear</button>
        <Canvas/>
      </div>
    </Provider>
  }
}
