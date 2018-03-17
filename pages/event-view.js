import React, { Component } from 'react'
import TextareaAutosize from 'react-autosize-textarea'
import QuestionRow from '../components/QuestionRow'
import Question from '../models/question'
import jsCookie from 'js-cookie'
import withPage from '../lib/withPage'
import Button from 'material-ui/Button'
import Typography from 'material-ui/Typography'
import TextField from 'material-ui/TextField'

import { fsEvents, fsQuestions, saveQuestion, isLiked, auth, login, logout } from '../lib/datastore'

class EventView extends Component {

  static title = 'Questions'

  static async getInitialProps ({req, query: { code }}) {
    if (req){
      var userIP = req ? req.headers['x-forwarded-for'] || req.connection.remoteAddress : null
      var snapshot = await req.fs.collection("events").where('eventCode','==',code).limit(1).get()
      var event = snapshot.docs[0].data()
      var questions = []
      var snapshot = await req.fs.collection("questions").where('eventId','==',event.id).orderBy('likes_count','desc').get()
      for (var doc of snapshot.docs) {
        var data = doc.data()
        data.liked = data.likes && data.likes[userIP]
        questions.push(data)
      }
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
      await saveQuestion({eventId: this.state.id, text: this.state.question, userId, userName})
      this.setState({ question: '' })
    } catch (e) {
      alert(e.message)
    }
  }

  render () {
    const { id, eventName, eventCode, startDate, endDate, question, questions, userIP, sortField } = this.state

    return <div>
      <Typography variant="display1" gutterBottom>{eventName}</Typography>
      <div>Ask the speaker</div>
      <p/>
      <TextareaAutosize
        onChange={e => this.setState({question: e.target.value})}
        placeholder={'Type your question'}
        value={question}
        rows={5}
        maxRows={10}
        style={{width:'100%'}}
        />
      <p/>
      <Button variant="raised" color="secondary" onClick={this.addQuestion}>Send Question</Button>
      <p/>
      <button className={sortField=='likes_count'?'active':''} onClick={e => this.sort('likes_count')}>popular</button>
      <button className={sortField=='created'?'active':''} onClick={e => this.sort('created')}>created time</button>
      <ul>
        {
          questions &&
          questions.map(question =>
            <QuestionRow key={question.id} userIP={userIP} {...question} />
          )
        }
      </ul>
      <style jsx>{`
        ul {
          padding:0;
          text-align: left;
        }
        button.active {
          color: white;
          background-color:green;
        }
      `}</style>
    </div>
  }
}

export default withPage(EventView)
