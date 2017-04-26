import React from 'react'
import firebase from 'APP/fire'

export default class extends React.Component {
  componentDidMount() {
    console.log(this.props.fireRef)
    this.listenTo(this.props.fireRef)
  }

  componentWillUnmount() {
    this.unsubscribe()
  }

  componentWillReceiveProps(incoming, outgoing) {
    this.listenTo(incoming.fireRef)
  }

  listenTo(fireRef) {
    if (this.unsubscribe) this.unsubscribe()
    const listener = fireRef.on('value', snapshot => this.setState({value: snapshot.val()}))
    this.unsubscribe = () => fireRef.off('value', listener)
  }

  write = (event) => this.props.fireRef &&
    this.props.fireRef.set(event.target.value)

  render() {
    const {value} = this.state || {}
    return (
      <textarea value={value} onChange={this.write}/>
    )
  }
}
