import firebase from 'firebase'
import config from '../credentials/client'
import "firebase/firestore"
import 'isomorphic-unfetch'
import moment from 'moment'
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
      return s.size > 0 ? s.docs[0].data() : null
    },
    data: async id => {
      var s = await db.collection(name).doc(id).get()
      return s.data()
    },
    deleteWhere: async (field, cond, val) => {
      var ls = db.collection(name)
      var s = await ls.where(field,cond,val).get()
      for (var doc of s.docs)
        await ls.doc(doc.id).delete()
    }
  }
}

const fsEvents = fs('events')
const fsQuestions = fs('questions')

function init(){
  // Prevent firebase from initializing twice
  try { firebase.initializeApp(config) } catch (e) {}
  db = firebase.firestore()
}

init()

function auth(callback){
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

async function saveEvent({id, userId, eventName, eventCode, startDate, endDate}){

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
    throw new TypeError('Event code is not unique')

  return fsEvents.merge(event.id, event)
}

function saveQuestion({id, eventId, text, userId, userName}){
  var question = Question({id, eventId, text, userId, userName})
  return fsQuestions.merge(question.id, question)
}

async function validCode(eventCode){
  var doc = await fsEvents.ls().where('eventCode','==',eventCode).limit(1).get()
  if (doc.size > 0){
    var event = doc.docs[0].data()
    var startDate = moment(event.startDate)
    var endDate = moment(event.endDate)
    var today = moment().startOf('day')

    if (today.diff(startDate, 'days') >= 0 && today.diff(endDate, 'days') <= 0)
      return true
    else
      throw new TypeError('You can not join this event because time not matched')
  }
  else
    throw new TypeError('You can not join this event because event code not exists')
}

async function like({id, userIP, liked, likes}){
  if (!likes) likes = {}
  if (liked)
    likes[userIP] = liked
  else
    delete likes[userIP]
  await fsQuestions.update(id, { likes_count: Object.keys(likes).length, likes })
  return likes
}

async function highlight(id, mark, eventId){
  if (mark){
    var docs = await fsQuestions.ls().where('eventId','==',eventId).where('mark','==',true).get()
    if (docs.size > 2)
      throw new TypeError('Max 3 questions can be highlighted')
  }
  return fsQuestions.update(id, { mark })
}

export {
  firebase,
  FieldValue,
  auth,
  login,
  logout,
  like,
  highlight,
  saveEvent,
  saveQuestion,
  validCode,
  fsEvents,
  fsQuestions,
}
