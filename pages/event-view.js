import React, { Component } from 'react'
import TextareaAutosize from 'react-autosize-textarea'
import QuestionRow from '../components/QuestionRow'
import Question from '../models/question'
import jsCookie from 'js-cookie'

import { fsLikes, fsEvents, fsQuestions, isLiked, auth, login, logout } from '../lib/datastore'

export default class EventEdit extends Component {

  static async getInitialProps ({req, query: { code }}) {
    if (req){
      var userIP = req ? req.headers['x-forwarded-for'] || req.connection.remoteAddress : null
      var snapshot = await req.fs.collection("events").where('eventCode','==',code).limit(1).get()
      var event = snapshot.docs[0].data()
      var snapshot = await req.fs.collection("questions").where('eventId','==',event.id).get()
      var questions = snapshot.docs.map(e => e.data())
      return { eventCode: code, ...event, questions, userIP }
    }
    var userIP = jsCookie.get('userIP')
    return { eventCode: code, questions: [], userIP }
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
    auth(user => {
      this.setState({ user: user })
    })

    this.addDbListener()
  }

  addDbListener () {
    this.unsubEvents = fsEvents.ls().where('eventCode','==',this.state.eventCode).onSnapshot(snapshot => {
      event = snapshot.docs[0].data()
      if (event) this.setState({ ...event })
      this.unsubQuestions = fsQuestions.ls().where('eventId','==',this.state.id).onSnapshot(snapshot => {
        var questions = []
        snapshot.forEach(async doc => {
          var data = doc.data()
          data.liked = await isLiked(this.state.userIP, data.id)
          questions.push(data)
          this.setState({ questions })
        })
      })
    })
  }

  saveQuestion() {
    var userId = this.state.user ? this.state.user.uid : null
    var question = Question(this.state.id, this.state.question, userId)
    fsQuestions.set(question.id, question)
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
