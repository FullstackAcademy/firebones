import React from 'react'
import { Link } from 'react-router'

const NotFound = props => {
  console.log(props);
  return (
    <div>
      <h1>Not Found</h1>
      <pre>{ props.location.pathname }</pre>
      <p>is not a valid front-end route. <Link to="/">Click here</Link> to return to the home page.</p>
    </div>
  );
}

export default NotFound
