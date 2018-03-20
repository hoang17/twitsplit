import firebase from 'firebase'
import config from '../credentials/client'
import "firebase/firestore"
import 'isomorphic-unfetch'
import moment from 'moment'
import Event from '../models/event'
import Question from '../models/question'
import splitMessage from './splitMessage'

const FieldValue = firebase.firestore.FieldValue

function initFirebase(){
  // Prevent firebase from initializing twice
  try { firebase.initializeApp(config) } catch (e) {
    // we skip the "already exists" message which is
    // not an actual error when we're hot-reloading
    if (!/already exists/.test(e.message)) {
      console.error('Firebase initialization error', e.stack)
    }
  }
}

initFirebase()

const fs = name => {
  var db = firebase.firestore()
  var ls = () => db.collection(name)
  var doc = id => ls().doc(id)
  var where = (field, con, val) => ls().where(field,con,val)
  var data = async id => {
    var s = await doc(id).get()
    return s.data()
  }
  var one = async (field, con, val) => {
    var query = !field ? ls() : where(field, con, val)
    var s = await query.limit(1).get()
    return s.size > 0 ? s.docs[0].data() : null
  }
  var deleteWhere = async (field, con, val) => {
    var s = await where(field,con,val).get()
    for (var e of s.docs)
      await doc(e.id).delete()
  }
  return {
    ls, doc, where, data, one, deleteWhere,
    get: id => doc(id).get(),
    set: (id, data) => doc(id).set(data),
    update: (id, data) => doc(id).update(data),
    merge: (id, data) => doc(id).set(data, { merge: true }),
    delete: id => doc(id).delete(),
  }
}

const fsEvents = fs('events')
const fsQuestions = fs('questions')

authAPI()

function authAPI(){
  // return if run in server
  if (typeof window === 'undefined') return

  return firebase.auth().onAuthStateChanged(async user => {
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
  })
}

function auth(callback){
  return firebase.auth().onAuthStateChanged(callback)
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

  var data = await fsEvents.one('eventCode','==',eventCode)
  if (data && data.id != id)
    throw new TypeError('Event code is not unique')

  return fsEvents.merge(event.id, event)
}

async function addQuestion({ eventId, text, userId, userName}){
  var chunks = splitMessage(text, 50)
  for (var msg of chunks) {
    var question = Question({ eventId, text: msg, userId, userName})
    await fsQuestions.set(question.id, question)
  }
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

async function updateLike({id, likes, likes_count}){
  return await fsQuestions.update(id, { likes, likes_count })
}

async function updateHighlight({id, mark, eventId}){
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
  updateLike,
  updateHighlight,
  saveEvent,
  addQuestion,
  saveQuestion,
  validCode,
  fsEvents,
  fsQuestions,
}
