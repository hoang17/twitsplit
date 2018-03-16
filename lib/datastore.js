import firebase from 'firebase'
import config from '../credentials/client'
import "firebase/firestore"
import 'isomorphic-unfetch'
import Event from '../models/event'
import Question from '../models/question'

const FieldValue = firebase.firestore.FieldValue

var db

const fs_set = (name, id, data) => {
  return db.collection(name).doc(id).set(data)
}
const fs_update = (name, id, data) => {
  return db.collection(name).doc(id).update(data)
}
const fs_merge = (name, id, data) => {
  return db.collection(name).doc(id).set(data, { merge: true })
}
const fs = name => {
  return {
    ls: () =>  db.collection(name),
    set: (id, data) => fs_set(name, id, data),
    update: (id, data) => fs_update(name, id, data),
    merge: (id, data) => fs_merge(name, id, data),
    delete: id => db.collection(name).doc(id).delete(),
    get: id => db.collection(name).doc(id).get(),
    doc: id => db.collection(name).doc(id),
    one: async ls => {
      if (!ls) ls = db.collection(name)
      var s = await ls.limit(1).get()
      return docs.size > 0 ? s.docs[0] : null
    }
  }
}

const fsLikes = fs('likes')
const fsEvents = fs('events')
const fsQuestions = fs('questions')

function init(){
  // Prevent firebase from initializing twice
  try { firebase.initializeApp(config) } catch (e) {}
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

async function saveEvent(id, userId, eventName, eventCode, startDate, endDate){

  var event = Event({
    id,
    userId,
    eventName,
    eventCode,
    startDate,
    endDate
  })

  var doc = await fsEvents.ls().where('eventCode','==',eventCode).limit(1).get()
  if (doc.size > 0 && doc.docs[0].id != id)
    throw 'Event code is not unique. Please enter an unique code'

  fsEvents.merge(event.id, event)
}

function saveQuestion(id, eventId, text, userId, userName){
  var question = Question(id, eventId, text, userId, userName)
  fsQuestions.merge(question.id, question)
}

export {
  firebase,
  FieldValue,
  init,
  auth,
  login,
  logout,
  saveEvent,
  saveQuestion,
  fsLikes,
  fsEvents,
  fsQuestions,
}
