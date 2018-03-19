import React, { Component } from 'react'
import TextareaAutosize from 'react-autosize-textarea'
import withPage from '../lib/withPage'
import Button from 'material-ui/Button'
import { getQuestion } from '../actions/question'
import { auth, login } from '../lib/datastore'

class QuestionEdit extends Component {

  static title = 'Edit Question'

  static async getInitialProps ({ store, req, query: { id }}) {
    var { app } = store.getState()
    if (app.user){
      var question = await store.dispatch(getQuestion(id))
    }
    return { id }
  }

  componentDidMount = async () => {
    if (!this.props.id) return

    auth(user => {
      if (user)
        this.unobs = this.props.obsQuestion(this.props.id)
      else if (this.unobs)
        this.unobs()
    })
  }

  saveQuestion = async () => {
    try {
      var { id, app, questions, updateQuestion, openSnack } =  this.props
      var question = questions.byHash[id]
      console.log(questions.byHash);
      await updateQuestion(question)
      openSnack('Question has been saved successfully')
    } catch (e) {
      openSnack(e.message)
    }
  }

  render () {
    const { id, app, setQuestion, questions } = this.props
    const { user } = app
    const question = questions.byHash[id]

    return <div>
      {
        !user && <Button variant="raised" color="secondary" onClick={login}>Login</Button>
      }
      {
        user &&
        <div>
          <TextareaAutosize
            onChange={e => setQuestion({ ...question, text: e.target.value})}
            placeholder={'Enter question'}
            value={question.text}
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
