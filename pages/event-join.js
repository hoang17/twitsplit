import React, { Component } from 'react'
import Router from 'next/router'
import { validCode } from '../lib/datastore'
import withPage from '../lib/withPage'
import Link from 'next/link'
import Ty from 'material-ui/Typography'
import Button from 'material-ui/Button'
import TextField from 'material-ui/TextField'

class HomePage extends Component {

  static title = 'Twitsplit'

  state = {
    eventCode: ''
  }

  componentDidMount(){
    this.props.setVar({ 'CURRENT_PATH': this.props.app.path })
  }

  joinEvent = async e => {
    try {
      e.preventDefault()
      var { eventCode } = this.state
      if (!eventCode.trim()) return
      if (await validCode(eventCode))
        Router.push('/event-view?code='+eventCode)
    } catch (e) {
      this.props.openSnack(e.message)
    }
  }

  render() {
    const { eventCode } = this.state

    return <div>
      <Ty variant="display1" gutterBottom>Join Event</Ty>
      <Ty>Please enter event code</Ty>
      <form onSubmit={this.joinEvent}>
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
        <Link href="/event-list">
          <a>Admin</a>
        </Link>
      </Ty>
    </div>
  }
}

export default withPage(HomePage)
