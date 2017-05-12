import React from 'react'

// The Ignite higher order component takes a component and returns
// a new component whose value is bound to a firebase path via onChange
// and value.
//
// Example:
//
//   const Hello = ignite(({value}) => <span>{value}</span>)
//   <Hello fireRef={db.ref('/some/path')} />
//
// The inner component also receives a handy onChange handler, which receives
// an *event*, and sets the value at the reference. You can attach it directly
// to input controls:
//
//   const Editable = ignite(
//     ({value, onChange}) =>
//       <input value={value || ''} onChange={onChange} />
//   )
//   <Editable fireRef={db.ref('/some/path')}
//
// Also passed through are fireRef and snapshot. See the Chat component for a more thorough example.
const ignite = Component => class extends React.Component {
  componentDidMount() {
    // When the component mounts, start listening to the fireRef
    // we were given.
    this.listenTo(this.props.fireRef)
  }

  componentWillUnmount() {
    // When we unmount, stop listening.
    this.unsubscribe()
  }

  componentWillReceiveProps(incoming, outgoing) {
    // When the props sent to us by our parent component change,
    // start listening to the new firebase reference.
    this.listenTo(incoming.fireRef)
  }

  listenTo(fireRef) {
    // If we're already listening to a ref, stop listening there.
    if (this.unsubscribe) this.unsubscribe()

    // Whenever our ref's value changes, set {value} on our state.
    const listener = fireRef.on('value', snapshot =>
      this.setState({snapshot, value: snapshot.val()}))

    // Set unsubscribe to be a function that detaches the listener.
    this.unsubscribe = () => fireRef.off('value', listener)
  }

  onChange = event => this.props.fireRef &&
    this.props.fireRef.set(event.target.value)

  asEntries(snapshot) {
    const value = snapshot && snapshot.val && snapshot.val()
    return Object.keys(value || {}).map(key => ({
      key,
      value: value[key],
      fireRef: snapshot.ref.child(key)
    }))
  }

  render() {
    return (
      <Component
        {...this.props}
        {...this.state}
        onChange={this.onChange}
        asEntries={this.asEntries}/>
    )
  }
}

// The withAuth higher order component takes a Firebase auth object and gives us
// a user prop.
export const withAuth = Component => class extends React.Component {
  componentDidMount() {
    const {auth} = this.props
    this.unsubscribe = auth.onAuthStateChanged(user => this.setState({user}))
  }

  componentWillUnmount() {
    this.unsubscribe && this.unsubscribe()
  }

  render() {
    const {user} = this.state || {}
    return (
      <Component
        {...this.props}
        auth={this.props.auth}
        user={user} />
    )
  }
}

export const FireInput = ignite(({value, onChange}) => <input value={value || ''} onChange={onChange} />)
export default ignite
