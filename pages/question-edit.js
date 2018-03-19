import React, { Component } from 'react'
import TextareaAutosize from 'react-autosize-textarea'
import withPage from '../lib/withPage'
import Button from 'material-ui/Button'

import { fsQuestions, auth, login, logout } from '../lib/datastore'

class QuestionEdit extends Component {

  static title = 'Edit Question'

  static async getInitialProps ({ store, req, query: { id }}) {
    var { app } = store.getState()
    var question = {}
    if (app.user) {
      var doc = await req.fs.collection("questions").doc(id).get()
      question = doc.data()
    }
    return { id, ...question }
  }

  constructor (props) {
    super(props)
    this.state = { ...this.props, snack: false }
  }

  componentDidMount = async () => {
    auth(user => {
      this.setState({ user: user })
      if (user)
        this.addDbListener()
      else if (this.unsubscribe)
        this.unsubscribe()
    })
  }

  addDbListener () {
    var ft = true
    this.unsubscribe = fsQuestions.doc(this.state.id).onSnapshot(doc => {
      // Discard initial loading
      if (ft && this.state.text) { ft = false; return}

      var question = doc.data()
      this.setState({ ...question })
    })
  }

  saveQuestion = async () => {
    try {
      var { id, text } = this.state
      if (!text.trim()) {
        this.setState({ snack: true, msg: 'Question can not empty' })
        return
      }
      await fsQuestions.update(id, { text })
      this.setState({ snack: true, msg: 'Question has been saved successfully' })
    } catch (e) {
      this.setState({ snack: true, msg: e.message })
    }
  }

  render () {
    const { id, text } = this.state
    const { app } = this.props
    const { user } = app

    return <div>
      {
        !user && <Button variant="raised" color="secondary" onClick={login}>Login</Button>
      }
      {
        user &&
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
