import React, { Component } from 'react'
import Router from 'next/router'
import withPage from '../lib/withPage'
import Button from 'material-ui/Button'
import EventEdit from '../components/EventEdit'
import QuestionList from '../components/QuestionList'
import { auth, login } from '../lib/datastore'
import { getEvent } from '../actions/event'
import { fetchQuestions } from '../actions/question'

class EventEditPage extends Component {

  static title = 'Edit Event'

  static async getInitialProps ({ store, req, query: { id } }) {
    var { app } = store.getState()
    if (app.user){
      var event = await store.dispatch(getEvent(id))
      await store.dispatch(fetchQuestions(id))
    }
    return { id }
  }

  componentDidMount = () => {
    if (!this.props.id) return

    auth(user => {
      if (user)
        this.observe()
      else if (this.unobsEvent)
        this.unobs()
    })
  }

  observe = () => {
    var { id, obsEvent, obsQuestions } = this.props
    this.unobsEvent = obsEvent(id)
    this.unobsQuestions = obsQuestions(id)
  }

  unobs = () => {
    this.unobsEvent()
    this.unobsQuestions()
  }

  saveEvent = async () =>  {
    try {
      var { app, events, updateEvent, setSnack } =  this.props
      var event = events.byHash[events.current]
      await updateEvent(event)
      setSnack({ open: true, msg: 'Event has been saved successfully' })
    } catch (e) {
      setSnack({ open: true, msg: e.message })
    }
  }

  removeEvent = async () =>  {
    if (confirm('Are you sure to delete this event?')){
      try {
        var { events, deleteEvent, setSnack } =  this.props
        await deleteEvent(events.current)
        Router.push('/event-list')
        setSnack({ open: true, msg: 'Event has been deleted' })
      } catch (e) {
        setSnack({ open: true, msg: e.message })
      }
    }
  }

  render() {
    const { id, app, events, questions, setEvent, setSnack } = this.props
    const { user } = app
    const event = events.byHash[events.current]

    return <div>
      {
        !user && <Button variant="raised" color="secondary" onClick={login}>Login</Button>
      }
      {
        user && event &&
        <div>
          <EventEdit
            event={event}
            onChange={e => setEvent({ ...event, ...e })}
            onSave={this.saveEvent}
            onDelete={this.removeEvent}
          />
          <p/>
          <QuestionList
            questions={questions}
            admin={true}
          />
        </div>
      }
    </div>
  }
}

export default withPage(EventEditPage)
