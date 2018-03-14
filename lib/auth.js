import firebase from 'firebase'
import config from '../credentials/client'
import "firebase/firestore"
import 'isomorphic-unfetch'

function auth(callback){

  firebase.initializeApp(config)

  firebase.auth().onAuthStateChanged(async user => {
    if (user) {
      var token = await user.getIdToken()
      fetch('/api/login', {
        method: 'POST',
        headers: new Headers({ 'Content-Type': 'application/json' }),
        credentials: 'same-origin',
        body: JSON.stringify({ token })
      })
    }
    else {
      fetch('/api/logout', {
        method: 'POST',
        credentials: 'same-origin'
      })
    }
    callback(user)
  })
}

function login() {
  var provider = new firebase.auth.GoogleAuthProvider()
  firebase.auth().signInWithPopup(provider)
}

function logout() {
  firebase.auth().signOut()
}

export {
  firebase,
  auth,
  login,
  logout,
}
