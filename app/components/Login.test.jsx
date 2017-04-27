import React from 'react'
import chai, {expect} from 'chai'
chai.use(require('chai-enzyme')())
import {shallow} from 'enzyme'
import {spy} from 'sinon'
chai.use(require('sinon-chai'))

import Login from './Login'

/* global describe it beforeEach */
describe('<Login />', () => {
  let root, fakeAuth
  beforeEach('render the root', () => {
    fakeAuth = {
      signInWithPopup: spy(),
      signInWithRedirect: spy(),
    }
    root = shallow(<Login auth={fakeAuth}/>)
  })

  it('logs in with google', () => {
    const button = root.find('button.google.login')
    expect(button).to.have.length(1)
    button.simulate('click')
    expect(fakeAuth.signInWithPopup).to.have.been.calledWithMatch({providerId: 'google.com'})
  })
})
