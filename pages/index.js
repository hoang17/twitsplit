import React, { Component } from 'react'
import Router from 'next/router'

import { fsEvents } from '../lib/datastore'

export default class JoinEvent extends Component {

  constructor (props) {
    super(props)
    this.state = {
      eventCode: '',
    }
    this.joinEvent = this.joinEvent.bind(this)
  }

  joinEvent() {
    Router.push('/event-view?code='+this.state.eventCode)
  }

  render() {
    const { eventCode } = this.state

    return <div>
      <div>Join Event</div>
      <div>Please enter event code</div>
      <input
        type={'text'}
        onChange={e => this.setState({eventCode: e.target.value})}
        placeholder={'Event Code'}
        value={eventCode}
      />
      <p/>
      <button onClick={this.joinEvent}>Join Event</button>
    </div>
  }
}
