import React from 'react'
import chai, {expect} from 'chai'                                                   
chai.use(require('chai-enzyme'))
import {shallow} from 'enzyme'

import {Login} from './Login'

describe('<Login />', () => {
  let root
  beforeEach('render the root', () =>
    root = shallow(<Login/>)
  )

  it('shows a login form', () => {
    expect(root.find('input[name="username"]')).to.have.length(1)
    expect(root.find('input[name="password"]')).to.have.length(1)
  })

  it('shows a password field', () => {
    expect(root.find('input[type="password"]')).to.have.length(1)
  })

  it('has a login button', () => {
    const submit = root.find('input[type="submit"]')
    expect(submit).to.have.length(1)
  })
})