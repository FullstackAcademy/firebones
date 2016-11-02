import React from 'react'

export const WhoAmI = ({ user, logout }) => (
  <div className="whoami">
    <span className="whoami-user-name">{user && user.name}</span>
    <button className="logout" value="Logout" onClick={logout} />
  </div>
)

// import {login} from 'APP/app/reducers/auth'
import {connect} from 'react-redux'

export default connect (
  ({ auth }) => ({ user: auth })
//  {logout},
) (WhoAmI)