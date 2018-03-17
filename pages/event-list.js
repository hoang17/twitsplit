import React, { Component } from 'react'
import Link from 'next/link'
import DatePicker from 'react-datepicker'
import moment from 'moment'
import 'react-datepicker/dist/react-datepicker.css'
import { withStyles } from 'material-ui/styles'
import withPage from '../lib/withPage'
import Ty from 'material-ui/Typography'
import Button from 'material-ui/Button'
import TextField from 'material-ui/TextField'
import Snackbar from '../components/Snack'

import Table, { TableBody, TableCell, TableHead, TableRow } from 'material-ui/Table'
import Paper from 'material-ui/Paper'

import { fsEvents, saveEvent, auth, login, logout } from '../lib/datastore'

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
      eventName: '',
      eventCode: '',
      startDate: new Date(),
      endDate: new Date(),
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

    if (this.state.user)
      this.addDbListener()
  }

  addDbListener = () => {
    this.unsubscribe = fsEvents.ls().where('userId','==',this.state.user.uid).onSnapshot(snapshot => {
      var events = []
      snapshot.forEach(function(doc) {
        events.push(doc.data())
      })
      if (events) this.setState({ events })
    })
  }

  addEvent = async () => {
    try {
      var { user, eventName, eventCode, startDate, endDate } = this.state
      await saveEvent({userId: user.uid, eventName, eventCode, startDate, endDate})
      this.setState({ eventName: '', eventCode: '', startDate: new Date(), endDate: new Date() })
      this.setState({ snack: true, msg: 'Event has been created successfully' })
    } catch (e) {
      this.setState({ snack: true, msg: e.message })
    }
  }

  render() {
    const { classes } = this.props
    const { user, eventName, eventCode, startDate, endDate, events, snack, msg } = this.state

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
                  <TableCell numeric>Protein (g)</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {
                  events &&
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
          <div style={{width:'170px', margin:'0 auto'}}>
            <TextField
              label="Event Name"
              value={eventName}
              onChange={e => this.setState({eventName: e.target.value})}
              margin="normal"
            />
            <br/>
            <TextField
              label="Event Code"
              value={eventCode}
              onChange={e => this.setState({eventCode: e.target.value})}
              margin="normal"
            />
            <br/>
            <div style={{textAlign:'left'}}>Start date</div>
            <DatePicker
              selected={moment(startDate)}
              onChange={date => this.setState({startDate: date.toDate()})}
            />
            <br/>
            <div style={{textAlign:'left'}}>End date</div>
            <DatePicker
              selected={moment(endDate)}
              onChange={date => this.setState({endDate: date.toDate()})}
            />
            <p/>
            <Button variant="raised" color="secondary" onClick={this.addEvent}>Create Event</Button>
          </div>
          <Snackbar open={snack} msg={msg} onClose={ ()=> this.setState({snack: false}) } />
        </div>
      }
    </div>
  }
}

export default withPage(withStyles(styles)(EventList))
