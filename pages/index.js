import React, { Component } from 'react'
import Router from 'next/router'
import { fsEvents, init, validCode } from '../lib/datastore'
import moment from 'moment'
import jsCookie from 'js-cookie'

export default class JoinEvent extends Component {

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
      <p/>
      <a href="/event-list">Admin</a>
    </div>
  }
}
