import React, { Component } from 'react'
import withPage from '../lib/withPage'
import withLogin from '../lib/withLogin'
import TextareaAutosize from 'react-autosize-textarea'
import Button from 'material-ui/Button'
import { getQuestion } from '../actions/questions'

class QuestionEdit extends Component {

  static title = 'Edit Question'

  static async getInitialProps ({ store, query: { id }}) {
    var { app } = store.getState()
    if (app.user){
      await store.dispatch(getQuestion(id))
    }
    return { id }
  }

  componentDidMount = async () => {
    if (!this.props.id) return
    this.unobs = this.props.obsQuestion(this.props.id)
  }

  componentWillUnmount() {
    this.unobs && this.unobs()
  }

  saveQuestion = async () => {
    try {
      var { id, app, questions, updateQuestion, openSnack } =  this.props
      var question = questions.byHash[id]
      await updateQuestion(question)
      openSnack('Question has been saved successfully')
    } catch (e) {
      openSnack(e.message)
    }
  }

  render () {
    const { id, setQuestion, questions } = this.props
    const question = questions.byHash[id]

    return <div>
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
}

export default withPage(withLogin(QuestionEdit))
