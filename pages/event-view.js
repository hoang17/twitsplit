import React, { Component } from 'react'
import TextareaAutosize from 'react-autosize-textarea'


import { fsEvents, fsQuestions, init, login, logout } from '../lib/firebase'

export default class EventEdit extends Component {

  static async getInitialProps ({req, query: { code }}) {
    var snapshot = await req.fs.collection("events").where('eventCode','==',code).limit(1).get()
    var event = snapshot.docs[0].data()
    var snapshot = await req.fs.collection("questions").where('eventId','==',event.id).get()
    var questions = snapshot.docs.map(e => e.data())
    return { eventCode: code, ...event, questions }
  }

  constructor (props) {
    super(props)
    var { id, eventName, eventCode, startDate, endDate, questions } = this.props
    this.state = {
      id,
      eventName,
      eventCode,
      startDate,
      endDate,
      questions,
      question: '',
    }
    this.addDbListener = this.addDbListener.bind(this)
    this.saveQuestion = this.saveQuestion.bind(this)
  }

  async componentDidMount () {
    init()
    this.addDbListener()
  }

  unsubscribe(){
    this.unsubEvents()
    this.unsubQuestions()
  }

  addDbListener () {
    this.unsubEvents = fsEvents.ls().where('eventCode','==',this.state.eventCode).onSnapshot(snapshot => {
      event = snapshot.docs[0].data()
      if (event) this.setState({ ...event })
    })

    this.unsubQuestions = fsQuestions.ls().where('eventId','==',this.state.id).onSnapshot(snapshot => {
      var questions = []
      snapshot.forEach(function(doc) {
        questions.push(doc.data())
      })
      // snapshot.docChanges.forEach(function(change) {
      //   if (change.type === "added") {
      //   }
      //   if (change.type === "modified") {
      //   }
      //   if (change.type === "removed") {
      //   }
      // })
      if (questions) this.setState({ questions })
    })
  }

  saveQuestion() {
    const id = new Date().getTime()
    var data = {
      id,
      eventId: this.state.id,
      text: this.state.question,
    }

    fsQuestions.set(id, data)

    this.setState({ question: '' })
  }

  render () {
    const { id, eventName, eventCode, startDate, endDate, question, questions } = this.state

    return <div>
      <h1>{eventName} - {id}</h1>
      <div>Ask the speaker</div>
      <TextareaAutosize
        onChange={e => this.setState({question: e.target.value})}
        placeholder={'Type your question'}
        value={question}
        rows={5}
        maxRows={10}
        />
      <p/>
      <button onClick={this.saveQuestion}>Send Question</button>
      <ul>
        {
          questions &&
          questions.map(e =>
            <li key={e.id}>{e.text}</li>
          )
        }
      </ul>
    </div>
  }
}
