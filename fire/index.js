const firebase = require('firebase')

// Initialize Firebase
const config = {
  apiKey: 'AIzaSyBzz-Wq2dzMgM7E8cdSYnYoX5fbVUT-XQo',
  authDomain: 'firebones-6bc2a.firebaseapp.com',
  databaseURL: 'https://firebones-6bc2a.firebaseio.com',
  projectId: 'firebones-6bc2a',
  storageBucket: 'firebones-6bc2a.appspot.com',
  messagingSenderId: '1030378391678'
}

module.exports = firebase.__bonesApp || (firebase.__bonesApp = firebase.initializeApp(config))
