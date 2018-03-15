import React, { Component } from 'react'
import Link from 'next/link'
import DatePicker from 'react-datepicker'
import moment from 'moment'
import 'react-datepicker/dist/react-datepicker.css'

import { fsEvents, auth, login, logout } from '../lib/datastore'

export default class EventEdit extends Component {

  static async getInitialProps ({req, query: { id }}) {
    const user = req && req.session ? req.session.decodedToken : null
    var event = {}
    if (user) {
      var doc = await req.fs.collection("events").doc(id).get()
      event = doc.data()
    }
    return { user, id, ...event }
  }

  constructor (props) {
    super(props)
    this.state = { ...this.props }    
    this.addDbListener = this.addDbListener.bind(this)
    this.saveEvent = this.saveEvent.bind(this)
    this.deleteEvent = this.deleteEvent.bind(this)
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
    this.unsubscribe = fsEvents.doc(this.state.id).onSnapshot(doc => {
      var event = doc.data()
      if (event) this.setState({ ...event })
    })
  }

  saveEvent() {
    var { id, eventName, eventCode, startDate, endDate } = this.state
    fsEvents.update(id, { id, eventName, eventCode, startDate, endDate })
  }

  deleteEvent() {
    fsEvents.delete(this.state.id)
  }

  render () {
    const { user, id, eventName, eventCode, startDate, endDate } = this.state

    return <div>
      {
        user
        ? <button onClick={logout}>Logout</button>
        : <button onClick={login}>Login</button>
      }
      {
        user && id &&
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
            selected={moment(startDate)}
            onChange={date => this.setState({startDate: date.toDate()})}
          />
          <div>End date</div>
          <DatePicker
            selected={moment(endDate)}
            onChange={date => this.setState({endDate: date.toDate()})}
          />
          <div>Event Code</div>
          <input
            type={'text'}
            onChange={e => this.setState({eventCode: e.target.value})}
            placeholder={'Event Code'}
            value={eventCode}
          />
          <p/>
          <button onClick={this.saveEvent}>Save Event</button>
          <button onClick={this.deleteEvent}>Delete Event</button>
        </div>
      }
    </div>
  }
}
