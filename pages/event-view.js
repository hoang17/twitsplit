import React, { Component } from 'react'
import TextareaAutosize from 'react-autosize-textarea'
import QuestionRow from '../components/QuestionRow'
import Question from '../models/question'
import jsCookie from 'js-cookie'

import { fsEvents, fsQuestions, saveQuestion, isLiked, auth, login, logout } from '../lib/datastore'

export default class EventView extends Component {

  static async getInitialProps ({req, query: { code }}) {
    if (req){
      var userIP = req ? req.headers['x-forwarded-for'] || req.connection.remoteAddress : null
      var snapshot = await req.fs.collection("events").where('eventCode','==',code).limit(1).get()
      var event = snapshot.docs[0].data()
      var questions = []
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
      sortField: 'likes_count',
    }
    this.addDbListener = this.addDbListener.bind(this)
    this.addQuestion = this.addQuestion.bind(this)
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
      this.unsubQuestions = fsQuestions.ls().where('eventId','==',this.state.id).orderBy('likes_count','desc').onSnapshot(async snapshot => {
        var questions = []
        for (var doc of snapshot.docs) {
          var data = doc.data()
          data.liked = data.likes && data.likes[this.state.userIP]
          questions.push(data)
        }
        this.setState({ questions })
      })
    })
  }

  sort(sortField){
    this.setState({sortField})
    if (this.unsubQuestions) this.unsubQuestions()
    this.unsubQuestions = fsQuestions.ls().where('eventId','==',this.state.id).orderBy(sortField,'desc').onSnapshot(async snapshot => {
      var questions = []
      for (var doc of snapshot.docs) {
        var data = doc.data()
        data.liked = data.likes && data.likes[this.state.userIP]
        questions.push(data)
      }
      this.setState({ questions })
    })
  }

  async addQuestion() {
    try {
      var userId = this.state.user ? this.state.user.uid : null
      var userName = this.state.user ? this.state.user.displayName : null
      await saveQuestion(null, this.state.id, this.state.question, userId, userName)
      this.setState({ question: '' })
    } catch (e) {
      alert(e)
    }
  }

  render () {
    const { id, eventName, eventCode, startDate, endDate, question, questions, userIP, sortField } = this.state

    return <div>
      <h1>{eventName}</h1>
      <div>Ask the speaker</div>
      <TextareaAutosize
        onChange={e => this.setState({question: e.target.value})}
        placeholder={'Type your question'}
        value={question}
        rows={5}
        maxRows={10}
        />
      <p/>
      <button onClick={this.addQuestion}>Send Question</button>
      <p/>
      <h2>Questions</h2>
      Order by
      <button className={sortField=='likes_count'?'active':''} onClick={e => this.sort('likes_count')}>popular</button>
      <button className={sortField=='created'?'active':''} onClick={e => this.sort('created')}>created time</button>
      <ul>
        {
          questions.map(question =>
            <QuestionRow key={question.id} userIP={userIP} {...question} />
          )
        }
      </ul>
      <style jsx>{`
        button.active {
          color: white;
          background-color:green;
        }
      `}</style>
    </div>
  }
}
