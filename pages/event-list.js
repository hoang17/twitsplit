import React, { Component } from 'react'
import withPage from '../lib/withPage'
import Button from 'material-ui/Button'
import Snackbar from '../components/Snack'
import EventCreate from '../components/EventCreate'
import EventList from '../components/EventList'
import { bindActionCreators } from 'redux'
import { configureStore } from '../store/configureStore'
import withRedux from 'next-redux-wrapper'
import { setUser } from '../actions/user'
import { fetchEvents, obsEvents } from '../actions/event'

import { fsEvents, saveEvent, auth, login } from '../lib/datastore'

class EventListPage extends Component {

  static title = 'Manage Events'

  static async getInitialProps ({ store, req, query, isServer }) {
    // const user = req && req.session ? req.session.decodedToken : null
    // var events = []
    // if (user) {
    //   var snapshot = await req.fs.collection("events").where('userId','==',user.uid).get()
    //   snapshot.forEach(doc => events.push(doc.data()))
    // }
    // return { user, events }

    if (req){
      const user = req && req.session ? req.session.decodedToken : null
      store.dispatch(setUser(user))
    }
    var { app } = store.getState()
    if (app.user){
      await store.dispatch(fetchEvents(app.user.uid))
    }
    return { isServer }
    // return { user, events }
  }

  // constructor (props) {
  //   super(props)
  //   this.state = {
  //     user: this.props.user,
  //     events: this.props.events,
  //     event: {
  //       eventName: '',
  //       eventCode: '',
  //       startDate: new Date(),
  //       endDate: new Date(),
  //     }
  //   }
  // }

  async componentDidMount () {
    auth(user => {
      // this.setState({ user: user })
      this.props.dispatch(setUser(user))
      if (user)
        this.props.obsEvents(user.uid)
        // this.addDbListener()
      // else if (this.unsubscribe)
      //   this.unsubscribe()
    })
  }

  // addDbListener = () => {
  //   var ft = true
  //   this.unsubscribe = fsEvents.ls().where('userId','==',this.state.user.uid).onSnapshot(snapshot => {
  //     // Discard initial loading
  //     if (ft && this.state.events.length > 0) { ft = false; return}
  //
  //     var events = []
  //     snapshot.forEach(function(doc) {
  //       events.push(doc.data())
  //     })
  //     if (events) this.setState({ events })
  //   })
  // }

  createEvent = async () => {
    try {
      var { app, event } = this.props
      var { newEvent } =  event
      // var { event } = this.state
      newEvent.userId = app.user.uid
      // await saveEvent(event)
      await this.props.createEvent(newEvent)
      this.setNewEvent()
      this.setSnack({ open: true, msg: 'Event has been created successfully' })
    } catch (e) {
      this.setSnack({ open: true, msg: e.message })
    }
  }

  render() {
    // const { user, event, events, snack, msg } = this.state
    const { app, events } = this.props
    const { user, snack, newEvent } = app

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
            onChange={e => this.setNewEvent(e)}
            onCreate={this.createEvent}
          />
          <Snackbar open={snack.open} msg={snack.msg} onClose={ ()=> this.setSnack({open: false}) } />
        </div>
      }
    </div>
  }
}

// export default withPage(EventListPage)
export default withRedux(configureStore, (state) => state, mapDispatchToProps)(withPage(EventListPage))
