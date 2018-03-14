import React, { Component } from 'react'
import Link from 'next/link'
import 'isomorphic-unfetch'

import DatePicker from 'react-datepicker'
import moment from 'moment'
import 'react-datepicker/dist/react-datepicker.css'

import { firebase, auth } from '../lib/auth'

export default class Index extends Component {

  static async getInitialProps ({req, query}) {
    const user = req && req.session ? req.session.decodedToken : null
    var events = []
    if (user) {
      var snapshot = await req.firebaseServer.firestore().collection("events").get()
      snapshot.forEach(doc => events.push(doc.data()))
    }
    return { user, events }
  }

  constructor (props) {
    super(props)
    this.state = {
      user: this.props.user,
      events: this.props.events,
      eventName: '',
      eventCode: '',
      startDate: moment(),
      endDate: moment(),
    }

    this.addDbListener = this.addDbListener.bind(this)
    this.createEvent = this.createEvent.bind(this)
  }

  componentDidMount () {
    // firebase.initializeApp(config)

    auth()

    this.db = firebase.firestore()

    if (this.state.user) this.addDbListener()

    // firebase.auth().onAuthStateChanged(user => {
    //   if (user) {
    //     this.setState({ user: user })
    //     return user.getIdToken()
    //       .then((token) => {
    //         return fetch('/api/login', {
    //           method: 'POST',
    //           headers: new Headers({ 'Content-Type': 'application/json' }),
    //           credentials: 'same-origin',
    //           body: JSON.stringify({ token })
    //         })
    //       }).then((res) => this.addDbListener())
    //   } else {
    //     this.setState({ user: null })
    //     fetch('/api/logout', {
    //       method: 'POST',
    //       credentials: 'same-origin'
    //     }).then(() => firebase.unsubscribe())
    //   }
    // })
  }

  addDbListener () {
    this.unsubscribe = this.db.collection('events').onSnapshot(snapshot => {
      var events = []
      snapshot.forEach(function(doc) {
        events.push(doc.data())
      })
      // snapshot.docChanges.forEach(function(change) {
      //   if (change.type === "added") {
      //   }
      //   if (change.type === "modified") {
      //   }
      //   if (change.type === "removed") {
      //   }
      // })
      if (events) this.setState({ events })
    })
  }

  createEvent (event) {
    event.preventDefault()
    const date = new Date().getTime()

    var event = {
      id: date,
      eventName: this.state.eventName,
      eventCode: this.state.eventCode,
      startDate: this.state.startDate.toDate(),
      endDate: this.state.startDate.toDate(),
    }

    this.db.collection("events").doc(event.id.toString()).set(event)

    this.setState({ eventName: '' })
  }

  handleLogin () {
    var provider = new firebase.auth.GoogleAuthProvider()
    firebase.auth().signInWithPopup(provider)
  }

  handleLogout () {
    firebase.auth().signOut()
  }

  render () {
    const { user, eventName, eventCode, events } = this.state

    return <div>
      {
        user
        ? <button onClick={this.handleLogout}>Logout</button>
        : <button onClick={this.handleLogin}>Login</button>
      }
      {
        user &&
        <div>
          <form>
            <div>Event Name</div>
            <input
              type={'text'}
              onChange={e => this.setState({eventName: e.target.value})}
              placeholder={'Event Name'}
              value={eventName}
            />
            <div>Start date</div>
            <DatePicker
              selected={this.state.startDate}
              onChange={date => this.setState({startDate: date})}
            />
            <div>End date</div>
            <DatePicker
              selected={this.state.endDate}
              onChange={date => this.setState({endDate: date})}
            />
            <div>Event Code</div>
            <input
              type={'text'}
              onChange={e => this.setState({eventCode: e.target.value})}
              placeholder={'Event Code'}
              value={eventCode}
            />
            <p/>
            <button onClick={this.createEvent}>Create Event</button>
          </form>
          <ul>
            {
              events &&
              events.map(event => <li key={event.id}>{event.eventName}</li>)
            }
          </ul>
        </div>
      }
    </div>
  }
}
