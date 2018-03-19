import React, { Component } from 'react'
import Router from 'next/router'
import { validCode } from '../lib/datastore'
import withPage from '../lib/withPage'
import Ty from 'material-ui/Typography'
import Button from 'material-ui/Button'
import TextField from 'material-ui/TextField'

class JoinEvent extends Component {

  static title = 'Slido'

  state = {
    eventCode: ''
  }

  joinEvent = async (e) => {
    try {
      var { eventCode } = this.state
      if (!eventCode.trim()) return
      if (await validCode(eventCode))
        Router.push('/event-view?code='+eventCode)
    } catch (e) {
      this.props.setSnack({ open: true, msg: e.message })
    }
  }

  render() {
    const { eventCode } = this.state

    return <div>
      <Ty variant="display1" gutterBottom>Join Event</Ty>
      <Ty>Please enter event code</Ty>
      <form onSubmit={(e)=>{e.preventDefault();this.joinEvent()}}>
        <TextField
          label="Event Code"
          value={eventCode}
          onChange={e => this.setState({eventCode: e.target.value})}
          margin="normal"
        />
        <p/>
        <Button variant="raised" color="secondary" onClick={this.joinEvent}>Join Event</Button>
      </form>
      <p/>
      <Ty variant="subheading" gutterBottom>
        <a href="/event-list">Admin</a>
      </Ty>
    </div>
  }
}

export default withPage(JoinEvent)
