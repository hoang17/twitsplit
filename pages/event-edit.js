import React, { Component } from 'react'
import Router from 'next/router'
import withPage from '../lib/withPage'
import Button from 'material-ui/Button'
import Snackbar from '../components/Snack'
import EventEdit from '../components/EventEdit'
import QuestionList from '../components/QuestionList'
import { bindActionCreators } from 'redux'
import { configureStore } from '../store/configureStore'
import withRedux from 'next-redux-wrapper'
import { auth, login } from '../lib/datastore'
import { setUser, setSnack } from '../actions/app'
import { getEvent, obsEvent, updateEvent, setEvent, deleteEvent } from '../actions/event'
import { fetchQuestions, obsQuestions } from '../actions/question'

class EventEditPage extends Component {

  static title = 'Edit Event'

  static async getInitialProps ({ store, req, query: { id }, isServer }) {
    if (req){
      const user = req && req.session ? req.session.decodedToken : null
      store.dispatch(setUser(user))
    }
    var { app } = store.getState()
    if (app.user){
      var event = await store.dispatch(getEvent(id))
      await store.dispatch(fetchQuestions(id))
    }
    return { id, isServer }
  }

  componentDidMount = () => {
    if (!this.props.id) return

    auth(user => {
      this.props.setUser(user)
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
    const { user, info } = app
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
          <Snackbar open={info.open} msg={info.msg} onClose={ ()=> setSnack({open: false}) } />
        </div>
      }
    </div>
  }
}

const mapDispatchToProps = dispatch => {
  return {
    getEvent: bindActionCreators(getEvent, dispatch),
    obsEvent: bindActionCreators(obsEvent, dispatch),
    updateEvent: bindActionCreators(updateEvent, dispatch),
    setEvent: bindActionCreators(setEvent, dispatch),
    deleteEvent: bindActionCreators(deleteEvent, dispatch),
    fetchQuestions: bindActionCreators(fetchQuestions, dispatch),
    obsQuestions: bindActionCreators(obsQuestions, dispatch),
    setUser: bindActionCreators(setUser, dispatch),
    setSnack: bindActionCreators(setSnack, dispatch),
  }
}

export default withRedux(configureStore, state => state, mapDispatchToProps)(withPage(EventEditPage))
