const firebase = require('firebase')

// -- // -- // -- // Firebase Config // -- // -- // -- //
const config = {
  apiKey: 'AIzaSyBzz-Wq2dzMgM7E8cdSYnYoX5fbVUT-XQo',
  authDomain: 'firebones-6bc2a.firebaseapp.com',
  databaseURL: 'https://firebones-6bc2a.firebaseio.com',
  projectId: 'firebones-6bc2a',
  storageBucket: 'firebones-6bc2a.appspot.com',
  messagingSenderId: '1030378391678'
}
// -- // -- // -- // -- // -- // -- // -- // -- // -- //

// Initialize the app, but make sure to do it only once.
//   (We need this for the tests. The test runner busts the require
//   cache when in watch mode; this will cause us to evaluate this
//   file multiple times. Without this protection, we would try to
//   initialize the app again, which causes Firebase to throw.
//
//   This is why global state makes a sad panda.)
firebase.__bonesApp || (firebase.__bonesApp = firebase.initializeApp(config))

module.exports = firebase
