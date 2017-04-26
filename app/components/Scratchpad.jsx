import React from 'react'
import firebase from 'APP/fire'

export default class extends React.Component {
  componentDidMount() {
    this.unsubscribe = firebase.database().ref('scratchpad').on('value', snapshot => this.setState({value: snapshot.val()}))
  }

  componentWillUnmount() {
    this.unsubscribe()
  }

  write = (event) => firebase.database().ref('scratchpad')
    .set(event.target.value)

  render() {
    const {value} = this.state || {}
    return (
      <textarea value={value} onChange={this.write}/>
    )
  }
}
