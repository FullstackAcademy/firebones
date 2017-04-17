import React from 'react'
import { Link } from 'react-router'

const NotFound = props => {
  const {pathname} = props.location || {pathname: '<< no path >>'}
  console.error('NotFound: %s not found (%o)', pathname, props)
  return (
    <div>
      <h1>Sorry, I couldn't find <pre>{pathname}</pre></h1>
      <p>The router gave me these props:</p>
      <pre>
        {JSON.stringify(props, null, 2)}
      </pre>
      <p>Lost? <Link to="/">Here's a way home.</Link></p>
      <cite>~ xoxo, bones.</cite>
    </div>
  )
}

export default NotFound
