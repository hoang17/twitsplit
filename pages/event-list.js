import React, { Component } from 'react'
import withPage from '../lib/withPage'
import Button from 'material-ui/Button'
import EventCreate from '../components/EventCreate'
import EventList from '../components/EventList'
import { auth, login } from '../lib/datastore'
import { fetchEvents } from '../actions/event'

class EventListPage extends Component {

  static title = 'Manage Events'

  static async getInitialProps ({ store, req, query, isServer }) {
    var { app } = store.getState()
    if (app.user){
      await store.dispatch(fetchEvents(app.user.uid))
    }
    return { isServer }
  }

  async componentDidMount () {
    auth(user => {
      if (user)
        this.unobs = this.props.obsEvents(user.uid)
      else if (this.unobs)
        this.unobs()
    })
  }

  createNewEvent = async () => {
    try {
      var { app, createEvent, setNewEvent, setSnack } = this.props
      var { newEvent } =  app
      newEvent.userId = app.user.uid
      await createEvent(newEvent)
      setNewEvent()
      setSnack({ open: true, msg: 'Event has been created successfully' })
    } catch (e) {
      setSnack({ open: true, msg: e.message })
    }
  }

  render() {
    const { app, events, setNewEvent, setSnack } = this.props
    const { user, newEvent } = app

    return <div>
      {
        !user && <Button variant="raised" color="secondary" onClick={login}>Login</Button>
      }
      {
        user &&
        <div>
          <EventList events={events} />
          <EventCreate
            event={newEvent}
            onChange={e => setNewEvent(e)}
            onCreate={this.createNewEvent}
          />
        </div>
      }
    </div>
  }
}

export default withPage(EventListPage)
