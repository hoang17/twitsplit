import React, { Component } from 'react'
import Router from 'next/router'
import { fsEvents, init, validCode } from '../lib/datastore'
import moment from 'moment'
import jsCookie from 'js-cookie'
import withPage from '../lib/withPage'
import Ty from 'material-ui/Typography'
import Button from 'material-ui/Button'
import TextField from 'material-ui/TextField'

class JoinEvent extends Component {

  static title = 'Join Event'

  static async getInitialProps ({req, query}) {
    if (req){
      var userIP = req ? req.headers['x-forwarded-for'] || req.connection.remoteAddress : null
      return { userIP }
    }
    return {}
  }

  constructor (props) {
    super(props)
    if (props.userIP) jsCookie.set('userIP', props.userIP)
    this.state = {
      eventCode: '',
    }
    this.joinEvent = this.joinEvent.bind(this)
  }

  async componentDidMount () {
    init()
  }

  async joinEvent() {
    try {
      var { eventCode } = this.state
      if (await validCode(eventCode))
        Router.push('/event-view?code='+eventCode)
    } catch (e) {
      alert(e.message)
    }
  }

  render() {
    const { eventCode } = this.state

    return <div>
      <Ty variant="display1" gutterBottom>Join Event</Ty>
      <Ty>Please enter event code</Ty>
      <TextField
        label="Event Code"
        value={eventCode}
        onChange={e => this.setState({eventCode: e.target.value})}
        margin="normal"
      />
      <p/>
      <Button variant="raised" color="secondary" onClick={this.joinEvent}>Join Event</Button>
      <p/>
      <Ty variant="subheading" gutterBottom>
        <a href="/event-list">Admin</a>
      </Ty>
    </div>
  }
}

export default withPage(JoinEvent)
