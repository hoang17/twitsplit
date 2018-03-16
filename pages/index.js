import React, { Component } from 'react'
import Router from 'next/router'
import { fsEvents, init } from '../lib/datastore'
import moment from 'moment'
import jsCookie from 'js-cookie'

export default class JoinEvent extends Component {

  static async getInitialProps ({req, query}) {
    var userIP = req ? req.headers['x-forwarded-for'] || req.connection.remoteAddress : null
    return { userIP }
  }

  constructor (props) {
    super(props)
    jsCookie.set('userIP', props.userIP)
    this.state = {
      eventCode: '',
    }
    this.joinEvent = this.joinEvent.bind(this)
  }

  async componentDidMount () {
    init()
  }

  async joinEvent() {
    var { eventCode } = this.state
    var doc = await fsEvents.ls().where('eventCode','==',eventCode).limit(1).get()
    if (doc.size > 0){
      var event = doc.docs[0].data()
      var startDate = moment(event.startDate)
      var endDate = moment(event.endDate)
      var today = moment().startOf('day')

      if (today.diff(startDate, 'days') >= 0 && today.diff(endDate, 'days') <= 0){
        Router.push('/event-view?code='+eventCode)
      } else {
        alert('You can not join this event because time not matched')
      }
    } else {
      alert('You can not join this event because event code is not valid')
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
    </div>
  }
}
