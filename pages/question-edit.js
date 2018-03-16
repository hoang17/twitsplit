import React, { Component } from 'react'
import TextareaAutosize from 'react-autosize-textarea'

import { fsQuestions, auth, login, logout } from '../lib/datastore'

export default class QuestionEdit extends Component {

  static async getInitialProps ({req, query: { id }}) {
    const user = req && req.session ? req.session.decodedToken : null
    var question = {}
    if (user) {
      var doc = await req.fs.collection("questions").doc(id).get()
      question = doc.data()
      if (question.userId != user.uid) question = {}
    }
    return { user, id, ...question }
  }

  constructor (props) {
    super(props)
    this.state = { ...this.props }
    this.addDbListener = this.addDbListener.bind(this)
    this.saveQuestion = this.saveQuestion.bind(this)
  }

  async componentDidMount () {
    auth(user => {
      this.setState({ user: user })
      if (user)
        this.addDbListener()
      else if (this.unsubscribe)
        this.unsubscribe()
    })

    if (this.state.user)
      this.addDbListener()
  }

  addDbListener () {
    this.unsubscribe = fsQuestions.doc(this.state.id).onSnapshot(doc => {
      var question = doc.data()
      if (question && question.userId == this.state.user.uid) this.setState({ ...question })
    })
  }

  saveQuestion() {
    var { id, text } = this.state
    if (!text) alert('Question can not empty')
    fsQuestions.update(id, { text })
  }

  render () {
    const { user, id, text } = this.state

    return <div>
      {
        user
        ? <button onClick={logout}>Logout</button>
        : <button onClick={login}>Login</button>
      }
      {
        user && text &&
        <div>
          <div>
            <div>Question</div>
            <TextareaAutosize
              onChange={e => this.setState({text: e.target.value})}
              placeholder={'Enter question'}
              value={text}
              rows={5}
              maxRows={10}
              />
            <p/>
            <button onClick={this.saveQuestion}>Save Question</button>
          </div>
        </div>
      }
    </div>
  }
}
