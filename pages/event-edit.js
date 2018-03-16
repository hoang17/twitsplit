import React, { Component } from 'react'
import Link from 'next/link'
import DatePicker from 'react-datepicker'
import QuestionRow from '../components/QuestionRow'
import moment from 'moment'
import jsCookie from 'js-cookie'
import 'react-datepicker/dist/react-datepicker.css'

import { fsEvents, fsQuestions, auth, login, logout } from '../lib/datastore'

export default class EventEdit extends Component {

  static async getInitialProps ({req, query: { id }}) {
    const user = req && req.session ? req.session.decodedToken : null
    var event = {}
    if (user) {
      var doc = await req.fs.collection("events").doc(id).get()
      event = doc.data()
      if (event.userId != user.uid) event = {}
    }
    var questions = []
    return { user, id, ...event, questions }
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
      if (event && event.userId == this.state.user.uid) this.setState({ ...event })
      this.unsubQuestions = fsQuestions.ls().where('eventId','==',this.state.id).onSnapshot(async snapshot => {
        var questions = []
        for (var doc of snapshot.docs) {
          var data = doc.data()
          questions.push(data)
        }
        this.setState({ questions })
      })
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
    const { user, id, eventName, eventCode, startDate, endDate, questions } = this.state

    return <div>
      {
        user
        ? <button onClick={logout}>Logout</button>
        : <button onClick={login}>Login</button>
      }
      {
        user && eventCode &&
        <div>
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
          <p/>
          <ul>
            {
              questions.map(question =>
                <QuestionRow key={question.id} {...question} admin={true} />
              )
            }
          </ul>
        </div>
      }
    </div>
  }
}
