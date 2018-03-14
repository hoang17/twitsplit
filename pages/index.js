import React, { Component } from 'react'
import Router from 'next/router'

import { fsEvents } from '../lib/firebase'

export default class JoinEvent extends Component {

  constructor (props) {
    super(props)
    this.state = {
      id: null,
      eventName: null,
      eventCode: null,
      startDate: null,
      endDate: null
    }
    this.joinEvent = this.joinEvent.bind(this)
  }

  async componentDidMount () {
  }

  joinEvent() {
    Router.push('/event-view?code='+this.state.eventCode)
  }

  render() {
    const { id, eventName, eventCode, startDate, endDate } = this.state

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
