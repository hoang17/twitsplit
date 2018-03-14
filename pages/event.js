import React, { Component } from 'react'

import DatePicker from 'react-datepicker'
import moment from 'moment'
import 'react-datepicker/dist/react-datepicker.css'

import { fsEvents, auth, login, logout } from '../lib/firebase'

export default class Index extends Component {

  static async getInitialProps ({req, query}) {
    const user = req && req.session ? req.session.decodedToken : null
    var events = []
    if (user) {
      var snapshot = await req.fs.collection("events").get()
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

  async componentDidMount () {
    auth(user => {
      this.setState({ user: user })
      if (user)
        this.addDbListener()
      else if (this.unsubscribe)
        this.unsubscribe()
    })

    if (this.state.user)
      this.addDbListener()
  }

  addDbListener () {
    this.unsubscribe = fsEvents.ls().onSnapshot(snapshot => {
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

  createEvent() {
    const id = new Date().getTime().toString()

    var data = {
      id,
      eventName: this.state.eventName,
      eventCode: this.state.eventCode,
      startDate: this.state.startDate.toDate(),
      endDate: this.state.startDate.toDate(),
    }

    fsEvents.set(id, data)

    this.setState({ eventName: '', eventCode: '', startDate: new Date(), endDate: new Date() })
  }

  render () {
    const { user, eventName, eventCode, events } = this.state

    return <div>
      {
        user
        ? <button onClick={logout}>Logout</button>
        : <button onClick={login}>Login</button>
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
