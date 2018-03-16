import React, { Component } from 'react'
import Link from 'next/link'
import DatePicker from 'react-datepicker'
import moment from 'moment'
import 'react-datepicker/dist/react-datepicker.css'

import { fsEvents, saveEvent, auth, login, logout } from '../lib/datastore'

export default class EventList extends Component {

  static async getInitialProps ({req, query}) {
    const user = req && req.session ? req.session.decodedToken : null
    var events = []
    if (user) {
      var snapshot = await req.fs.collection("events").where('userId','==',user.uid).get()
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
      startDate: this.today(),
      endDate: this.today(),
    }

    this.addDbListener = this.addDbListener.bind(this)
    this.addEvent = this.addEvent.bind(this)
  }

  today(){
    return moment().startOf('day')
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
    this.unsubscribe = fsEvents.ls().where('userId','==',this.state.user.uid).onSnapshot(snapshot => {
      var events = []
      snapshot.forEach(function(doc) {
        events.push(doc.data())
      })
      if (events) this.setState({ events })
    })
  }

  async addEvent() {
    try {
      var { user, eventName, eventCode, startDate, endDate } = this.state
      await saveEvent(null, user.uid, eventName, eventCode, startDate, endDate)
      this.setState({ eventName: '', eventCode: '', startDate: this.today(), endDate: this.today() })
    } catch (e) {
      alert(e)
    }
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
          <button onClick={this.addEvent}>Create Event</button>
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
