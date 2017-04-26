import React from 'react'
import firebase from 'APP/fire'
const auth = firebase.auth()

export const WhoAmI = ({ user }) => (
  <div className="whoami">
    <span className="whoami-user-name">{user && user.name}</span>
  </div>
)

import {logout} from 'APP/app/reducers/auth'
import {connect} from 'react-redux'

export default class extends React.Component {
  componentDidMount() {
    this.unsubscribe = auth.onAuthStateChanged(user => this.setState({user}))
  }
  componentWillUnmount() {
    this.unsubscribe()
  }
  render() {
    const {user} = this.state || {}
    return (
      <WhoAmI user={user}/>
    )
  }
}
