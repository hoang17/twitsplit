import React, { Component } from 'react'
import Link from 'next/link'
import moment from 'moment'
import { withStyles } from 'material-ui/styles'
import withPage from '../lib/withPage'
import Ty from 'material-ui/Typography'
import Button from 'material-ui/Button'
import TextField from 'material-ui/TextField'
import Snackbar from '../components/Snack'
import EventCreate from '../components/EventCreate'

import Table, { TableBody, TableCell, TableHead, TableRow } from 'material-ui/Table'
import Paper from 'material-ui/Paper'

import { fsEvents, saveEvent, auth, login } from '../lib/datastore'

const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
    overflowX: 'auto',
  },
  table: {
    minWidth: 700,
  },
})

class EventList extends Component {

  static title = 'Manage Events'

  static async getInitialProps ({req, query}) {
    const user = req && req.session ? req.session.decodedToken : null
    var events = []
    if (user) {
      var snapshot = await req.fs.collection("events").where('userId','==',user.uid).get()
      snapshot.forEach(doc => events.push(doc.data()))
    }
    return { user, events }
  }

  constructor (props) {
    super(props)
    this.state = {
      user: this.props.user,
      events: this.props.events,
      event: {
        eventName: '',
        eventCode: '',
        startDate: new Date(),
        endDate: new Date(),
      }
    }
  }

  async componentDidMount () {
    auth(user => {
      this.setState({ user: user })
      if (user)
        this.addDbListener()
      else if (this.unsubscribe)
        this.unsubscribe()
    })
  }

  addDbListener = () => {
    var ft = true
    this.unsubscribe = fsEvents.ls().where('userId','==',this.state.user.uid).onSnapshot(snapshot => {
      // Discard initial loading
      if (ft && this.state.events.length > 0) { ft = false; return}

      var events = []
      snapshot.forEach(function(doc) {
        events.push(doc.data())
      })
      if (events) this.setState({ events })
    })
  }

  createEvent = async () => {
    try {
      var { user, event } = this.state
      event.userId = user.uid
      await saveEvent(event)
      this.setState({event: { eventName: '', eventCode: '', startDate: new Date(), endDate: new Date() }})
      this.setState({ snack: true, msg: 'Event has been created successfully' })
    } catch (e) {
      this.setState({ snack: true, msg: e.message })
    }
  }

  render() {
    const { classes } = this.props
    const { user, event, events, snack, msg } = this.state

    return <div>
      {
        !user && <Button variant="raised" color="secondary" onClick={login}>Login</Button>
      }
      {
        user &&
        <div>
          <Paper className={classes.root}>
            <Table className={classes.table}>
              <TableHead>
                <TableRow>
                  <TableCell>Event Name</TableCell>
                  <TableCell numeric>Event Code</TableCell>
                  <TableCell numeric>Start Date</TableCell>
                  <TableCell numeric>End Date</TableCell>
                  <TableCell numeric>___________</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {
                  events.map(n => {
                  return (
                    <TableRow key={n.id}>
                      <TableCell>
                        <Link href={{pathname: '/event-edit', query: { id: n.id }}}>
                          <a>{n.eventName}</a>
                        </Link>
                      </TableCell>
                      <TableCell numeric>{n.eventCode}</TableCell>
                      <TableCell numeric>{moment(n.startDate).format('L')}</TableCell>
                      <TableCell numeric>{moment(n.endDate).format('L')}</TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </Paper>
          <EventCreate
            event={event}
            onChange={e => this.setState({ event: { ...event, ...e }})}
            onCreate={this.createEvent}
          />
          <Snackbar open={snack} msg={msg} onClose={ ()=> this.setState({snack: false}) } />
        </div>
      }
    </div>
  }
}

export default withPage(withStyles(styles)(EventList))
