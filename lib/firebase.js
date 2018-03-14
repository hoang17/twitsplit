import firebase from 'firebase'
import config from '../credentials/client'
import "firebase/firestore"
import 'isomorphic-unfetch'
const FieldValue = firebase.firestore.FieldValue
var db

const fs_set = (name, id, data) => {
  data.updated = FieldValue.serverTimestamp()
  return db.collection(name).doc(id).set(data)
}
const fs_update = (name, id, data) => {
  data.updated = FieldValue.serverTimestamp()
  return db.collection(name).doc(id).update(data)
}
const fs_merge = (name, id, data) => {
  data.updated = FieldValue.serverTimestamp()
  return db.collection(name).doc(id).set(data, { merge: true })
}
const fs = name => {
  return {
    ls: () =>  db.collection(name),
    set: (id, data) => fs_set(name, id.toString(), data),
    update: (id, data) => fs_update(name, id.toString(), data),
    merge: (id, data) => fs_merge(name, id.toString(), data),
    delete: id => db.collection(name).doc(id.toString()).delete(),
    get: id => db.collection(name).doc(id.toString()).get(),
    doc: id => db.collection(name).doc(id.toString()),
  }
}

function init(){
  try {
    firebase.initializeApp(config)
  } catch (e) {
    // console.log(e.message)
  }
  db = firebase.firestore()
}

function auth(callback){
  init()
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

var fsUsers = fs('users')
var fsEvents = fs('events')
var fsQuestions = fs('questions')

export {
  firebase,
  init,
  auth,
  login,
  logout,
  fsEvents,
  fsQuestions,
}
