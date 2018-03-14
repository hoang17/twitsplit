import React, { Component } from 'react'
import Link from 'next/link'
import DatePicker from 'react-datepicker'
import moment from 'moment'
import 'react-datepicker/dist/react-datepicker.css'

import { fsEvents, auth, login, logout } from '../lib/firebase'

export default class EventList extends Component {

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
    this.saveEvent = this.saveEvent.bind(this)
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

  saveEvent() {
    const id = new Date().getTime().toString()

    var data = {
      id,
      eventName: this.state.eventName,
      eventCode: this.state.eventCode,
      startDate: this.state.startDate.toDate(),
      endDate: this.state.endDate.toDate(),
    }

    fsEvents.set(id, data)

    this.setState({ eventName: '', eventCode: '', startDate: moment(), endDate: moment() })
  }

  render () {
    const { user, eventName, eventCode, startDate, endDate, events } = this.state

    return <div>
      {
        user
        ? <button onClick={logout}>Logout</button>
        : <button onClick={login}>Login</button>
      }
      {
        user &&
        <div>
          <div>Event Name</div>
          <input
            type={'text'}
            onChange={e => this.setState({eventName: e.target.value})}
            placeholder={'Event Name'}
            value={eventName}
          />
          <div>Start date</div>
          <DatePicker
            selected={startDate}
            onChange={date => this.setState({startDate: date})}
          />
          <div>End date</div>
          <DatePicker
            selected={endDate}
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
          <button onClick={this.saveEvent}>Create Event</button>
          <ul>
            {
              events &&
              events.map(event =>
                <li key={event.id}>
                  <Link href={{pathname: '/event-edit', query: { id: event.id }}}>
                    <a>{event.eventName} - {event.eventCode} - {moment(event.startDate).format('L')} - {moment(event.endDate).format('L')}</a>
                  </Link>
                </li>
              )
            }
          </ul>
        </div>
      }
    </div>
  }
}
