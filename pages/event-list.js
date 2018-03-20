import React, { Component } from 'react'
import withPage from '../lib/withPage'
import withLogin from '../lib/withLogin'
import EventCreate from '../components/EventCreate'
import EventList from '../components/EventList'
import { fetchEvents } from '../actions/events'

class EventListPage extends Component {

  static title = 'Manage Events'

  static async getInitialProps ({ store, query, isServer }) {
    var { app } = store.getState()
    if (app.user){
      await store.dispatch(fetchEvents(app.user.uid))
    }
    return { isServer }
  }

  async componentDidMount () {
    this.unobs = this.props.obsEvents(this.props.app.user.uid)
  }

  componentWillUnmount() {
    this.unobs && this.unobs()
  }

  createNewEvent = async () => {
    try {
      var { app, createEvent, setNewEvent, openSnack } = this.props
      var { newEvent } =  app
      newEvent.userId = app.user.uid
      await createEvent(newEvent)
      setNewEvent()
      openSnack('Event has been created successfully')
    } catch (e) {
      openSnack(e.message)
    }
  }

  render() {
    const { app, events, setNewEvent } = this.props
    const { newEvent } = app

    return <div>
      <EventList events={events} />
      <EventCreate
        event={newEvent}
        onChange={setNewEvent}
        onCreate={this.createNewEvent}
      />
    </div>
  }
}

export default withPage(withLogin(EventListPage))
