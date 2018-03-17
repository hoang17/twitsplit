import React, { Component } from 'react'
import Router from 'next/router'
import Link from 'next/link'
import DatePicker from 'react-datepicker'
import QuestionRow from '../components/QuestionRow'
import moment from 'moment'
import 'react-datepicker/dist/react-datepicker.css'
import withPage from '../lib/withPage'

import { fsEvents, fsQuestions, saveEvent, auth, login, logout } from '../lib/datastore'

class EventEdit extends Component {

  static title = 'Edit Event'

  static async getInitialProps ({req, query: { id }}) {
    const user = req && req.session ? req.session.decodedToken : null
    var questions = []
    var event = {}
    if (user) {
      var doc = await req.fs.collection("events").doc(id).get()
      if (!doc.exists) return {}
      event = doc.data()
      if (event.userId != user.uid) return {}

      var snapshot = await req.fs.collection("questions").where('eventId','==',event.id).get()
      for (var doc of snapshot.docs) {
        var data = doc.data()
        questions.push(data)
      }
    }
    return { user, id, ...event, questions }
  }

  constructor (props) {
    super(props)
    this.state = { ...this.props }
    this.addDbListener = this.addDbListener.bind(this)
    this.updateEvent = this.updateEvent.bind(this)
    this.deleteEvent = this.deleteEvent.bind(this)
  }

  async componentDidMount () {

    if (!this.state.id) return

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
    })
    this.unsubQuestions = fsQuestions.ls().where('eventId','==',this.state.id).onSnapshot(async snapshot => {
      var questions = []
      for (var doc of snapshot.docs) {
        var data = doc.data()
        questions.push(data)
      }
      this.setState({ questions })
    })
  }

  async updateEvent() {
    try {
      await saveEvent(this.state)
    } catch (e) {
      alert(e.message)
    }
  }

  deleteEvent() {
    fsEvents.delete(this.state.id)
    Router.push('/event-list')
  }

  render () {
    const { user, id, eventName, eventCode, startDate, endDate, questions } = this.state

    return <div>
      {
        // user
        // ? <button onClick={logout}>Logout</button>
        // : <button onClick={login}>Login</button>
      }
      {
        user && id &&
        <div>
          <div style={{textAlign:'left'}}>
            <div>Event Name</div>
            <input
              type={'text'}
              onChange={e => this.setState({eventName: e.target.value})}
              placeholder={'Event Name'}
              value={eventName}
            />
            <br/>
            <div>Event Code</div>
            <input
              type={'text'}
              onChange={e => this.setState({eventCode: e.target.value})}
              placeholder={'Event Code'}
              value={eventCode}
            />
            <br/>
            <div>Start date</div>
            <DatePicker
              selected={moment(startDate)}
              onChange={date => this.setState({startDate: date.toDate()})}
            />
            <br/>
            <div>End date</div>
            <DatePicker
              selected={moment(endDate)}
              onChange={date => this.setState({endDate: date.toDate()})}
            />
            <p/>
            <button onClick={this.updateEvent}>Save Event</button>
            <button onClick={this.deleteEvent}>Delete Event</button>
          </div>
          <p/>
          <h2>Questions</h2>
          <ul>
            {
              questions.map(question =>
                <QuestionRow key={question.id} {...question} admin={true} />
              )
            }
          </ul>
          <style jsx>{`
            ul {
              padding:0;
              text-align: left;
            }
          `}</style>
        </div>
      }
    </div>
  }
}

export default withPage(EventEdit)
