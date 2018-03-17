import React, { Component } from 'react'
import TextareaAutosize from 'react-autosize-textarea'
import withPage from '../lib/withPage'
import Button from 'material-ui/Button'

import { fsQuestions, auth, login, logout } from '../lib/datastore'

class QuestionEdit extends Component {

  static title = 'Edit Question'

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
        !user && <Button variant="raised" color="secondary" onClick={login}>Login</Button>
      }
      {
        user && text &&
        <div>
          <TextareaAutosize
            onChange={e => this.setState({text: e.target.value})}
            placeholder={'Enter question'}
            value={text}
            rows={5}
            maxRows={10}
            style={{width:'100%'}}
            />
          <p/>
          <Button variant="raised" color="secondary" onClick={this.saveQuestion}>Save Question</Button>
        </div>
      }
    </div>
  }
}

export default withPage(QuestionEdit)
