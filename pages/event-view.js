import React, { Component } from 'react'
import TextareaAutosize from 'react-autosize-textarea'
import QuestionRow from '../components/QuestionRow'

import { fsLikes, fsEvents, fsQuestions, isLiked, init, login, logout } from '../lib/datastore'

export default class EventEdit extends Component {

  static async getInitialProps ({req, query: { code }}) {
    var userIP = req.headers['x-forwarded-for'] || req.connection.remoteAddress
    var snapshot = await req.fs.collection("events").where('eventCode','==',code).limit(1).get()
    var event = snapshot.docs[0].data()
    var snapshot = await req.fs.collection("questions").where('eventId','==',event.id).get()
    var questions = snapshot.docs.map(e => e.data())
    return { eventCode: code, ...event, questions, userIP }
  }

  constructor (props) {
    super(props)
    this.state = {
      ...this.props,
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
      snapshot.forEach(async doc => {
        var data = doc.data()
        data.liked = await isLiked(this.state.userIP, data.id)
        questions.push(data)
        this.setState({ questions })
      })
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
    const { id, eventName, eventCode, startDate, endDate, question, questions, userIP } = this.state

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
          questions.map(question =>
            <QuestionRow key={question.id} userIP={userIP} {...question} />
          )
        }
      </ul>
    </div>
  }
}
