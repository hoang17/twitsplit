import firebase from 'firebase'
import config from '../credentials/client'
import "firebase/firestore"

function auth(){

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
    return user
  })
}

export default {
  firebase,
  auth
}
