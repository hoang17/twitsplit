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

let id = 0
function createData(name, calories, fat, carbs, protein) {
  id += 1
  return { id, name, calories, fat, carbs, protein }
}

const data = [
  createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
  createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
  createData('Eclair', 262, 16.0, 24, 6.0),
  createData('Cupcake', 305, 3.7, 67, 4.3),
  createData('Gingerbread', 356, 16.0, 49, 3.9),
]


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

    this.addDbListener = this.addDbListener.bind(this)
    this.addEvent = this.addEvent.bind(this)
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

  addDbListener () {
    this.unsubscribe = fsEvents.ls().where('userId','==',this.state.user.uid).onSnapshot(snapshot => {
      var events = []
      snapshot.forEach(function(doc) {
        events.push(doc.data())
      })
      if (events) this.setState({ events })
    })
  }

  async addEvent() {
    try {
      var { user, eventName, eventCode, startDate, endDate } = this.state
      await saveEvent({userId: user.uid, eventName, eventCode, startDate, endDate})
      this.setState({ eventName: '', eventCode: '', startDate: new Date(), endDate: new Date() })
    } catch (e) {
      alert(e.message)
    }
  }

  render () {
    const { classes } = this.props
    const { user, eventName, eventCode, startDate, endDate, events } = this.state

    return <div>
      {
        // user
        // ? <Button variant="raised" color="secondary" onClick={logout}>Logout</Button>
        // : <Button variant="raised" color="secondary" onClick={login}>Login</Button>
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
          <div>
            {/* <Ty variant="display1" gutterBottom>Create Event</Ty> */}
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
            <div>Start date</div>
            <DatePicker
              selected={moment(startDate)}
              onChange={date => this.setState({startDate: date.toDate()})}
            />
            <br/>
            <div>End date</div>
            <DatePicker
              selected={moment(endDate)}
              onChange={date => this.setState({endDate: date.toDate()})}
            />
            <p/>
            <Button variant="raised" color="secondary" onClick={this.addEvent}>Create Event</Button>
          </div>
        </div>
      }
    </div>
  }
}

export default withPage(withStyles(styles)(EventList))
