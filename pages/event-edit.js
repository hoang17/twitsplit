import React, { Component } from 'react'
import Router from 'next/router'
import withPage from '../lib/withPage'
import Button from 'material-ui/Button'
import Snackbar from '../components/Snack'
import EventEdit from '../components/EventEdit'
import QuestionList from '../components/QuestionList'

import { fsEvents, fsQuestions, saveEvent, auth, login } from '../lib/datastore'

class EventEditPage extends Component {

  static title = 'Edit Event'

  static async getInitialProps ({req, query: { id }}) {
    const user = req && req.session ? req.session.decodedToken : null
    var questions = []
    var event = null
    if (user) {
      var doc = await req.fs.collection("events").doc(id).get()
      if (!doc.exists) return {}
      event = doc.data()
      if (event.userId != user.uid) return {}

      var snapshot = await req.fs.collection("questions").where('eventId','==',id).get()
      for (var doc of snapshot.docs) {
        var data = doc.data()
        questions.push(data)
      }
    }
    return { user, id, event, questions }
  }

  constructor (props) {
    super(props)
    this.state = { ...this.props }
  }

  componentDidMount = () => {

    if (!this.state.id) return

    auth(user => {
      this.setState({ user: user })
      if (user)
        this.addDbListener()
      else if (this.unsubscribe)
        this.unsubscribe()
    })
  }

  addDbListener = () => {
    if (!this.state.user) return
    var ft = true
    this.unsubscribe = fsEvents.doc(this.state.id).onSnapshot(doc => {
      // Discard initial loading
      if (ft && this.state.event) { ft = false; return}

      var event = doc.data()
      if (event && event.userId == this.state.user.uid) this.setState({ event })
    })
    this.unsubQuestions = fsQuestions.ls().where('eventId','==',this.state.id).onSnapshot(async snapshot => {
      // Discard initial loading
      if (ft && this.state.questions.length >  0) { ft = false; return}

      var questions = []
      for (var doc of snapshot.docs) {
        var data = doc.data()
        questions.push(data)
      }
      this.setState({ questions })
    })
  }

  updateEvent = async () =>  {
    try {
      await saveEvent(this.state.event)
      this.setState({ snack: true, msg: 'Event has been saved successfully' })
    } catch (e) {
      this.setState({ snack: true, msg: e.message })
    }
  }

  deleteEvent = async () =>  {
    if (confirm('Are you sure to delete this event?')){
      try {
        await fsEvents.delete(this.state.id)
        Router.push('/event-list')
        this.setState({ snack: true, msg: 'Event has been deleted' })
      } catch (e) {
        this.setState({ snack: true, msg: e.message })
      }
    }
  }

  render() {
    const { user, event, questions, snack, msg } = this.state

    return <div>
      {
        !user && <Button variant="raised" color="secondary" onClick={login}>Login</Button>
      }
      {
        user && event &&
        <div>
          <EventEdit
            event={event}
            onChange={e => this.setState({ event: { ...event, ...e }})}
            onSave={this.updateEvent}
            onDelete={this.deleteEvent}
          />
          <p/>
          <QuestionList
            questions={questions}
            admin={true}
          />
          <Snackbar open={snack} msg={msg} onClose={ ()=> this.setState({snack: false}) } />
        </div>
      }
    </div>
  }
}

export default withPage(EventEditPage)
