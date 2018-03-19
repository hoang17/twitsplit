import React, { Component } from 'react'
import Router from 'next/router'
import withPage from '../lib/withPage'
import withLogin from '../lib/withLogin'
import EventEdit from '../components/EventEdit'
import QuestionList from '../components/QuestionList'
import { getEvent } from '../actions/event'
import { fetchQuestions } from '../actions/question'

class EventEditPage extends Component {

  static title = 'Edit Event'

  static async getInitialProps ({ store, query: { id } }) {
    var { app } = store.getState()
    if (app.user){
      var event = await store.dispatch(getEvent(id))
      await store.dispatch(fetchQuestions(id))
    }
    return { id }
  }

  componentDidMount = () => {
    if (!this.props.id) return

    this.props.auth(user => {
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
      var { id, app, events, updateEvent, openSnack } =  this.props
      var event = events.byHash[id]
      await updateEvent(event)
      openSnack('Event has been saved successfully')
    } catch (e) {
      openSnack(e.message)
    }
  }

  removeEvent = async () =>  {
    if (confirm('Are you sure to delete this event?')){
      try {
        var { id, events, deleteEvent, openSnack } =  this.props
        deleteEvent(id)
        Router.push('/event-list')
        openSnack('Event has been deleted')
      } catch (e) {
        openSnack(e.message)
      }
    }
  }

  render() {
    const { id, events, questions, setEvent } = this.props
    const event = events.byHash[id]

    return ( event &&
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
    )
  }
}

export default withPage(withLogin(EventEditPage))
