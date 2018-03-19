import React, { Component } from 'react'
import withPage from '../lib/withPage'
import Button from 'material-ui/Button'
import Snackbar from '../components/Snack'
import EventCreate from '../components/EventCreate'
import EventList from '../components/EventList'
import { bindActionCreators } from 'redux'
import { configureStore } from '../store/configureStore'
import withRedux from 'next-redux-wrapper'
import { auth, login } from '../lib/datastore'
import { setUser, setNewEvent, setSnack } from '../actions/app'
import { fetchEvents, obsEvents, createEvent } from '../actions/event'

class EventListPage extends Component {

  static title = 'Manage Events'

  static async getInitialProps ({ store, req, query, isServer }) {
    if (req){
      const user = req && req.session ? req.session.decodedToken : null
      store.dispatch(setUser(user))
    }
    var { app } = store.getState()
    if (app.user){
      await store.dispatch(fetchEvents(app.user.uid))
    }
    return { isServer }
  }

  async componentDidMount () {
    auth(user => {
      this.props.setUser(user)
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
    const { user, info, newEvent } = app

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
          <Snackbar open={info.open} msg={info.msg} onClose={ ()=>  setSnack({open: false}) } />
        </div>
      }
    </div>
  }
}

const mapDispatchToProps = dispatch => {
  return {
    obsEvents: bindActionCreators(obsEvents, dispatch),
    createEvent: bindActionCreators(createEvent, dispatch),
    setUser: bindActionCreators(setUser, dispatch),
    setNewEvent: bindActionCreators(setNewEvent, dispatch),
    setSnack: bindActionCreators(setSnack, dispatch),
  }
}

export default withRedux(configureStore, state => state, mapDispatchToProps)(withPage(EventListPage))
