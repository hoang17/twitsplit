import React, { Component } from 'react'
import withPage from '../lib/withPage'
import Ty from 'material-ui/Typography'
import QuestionSubmit from '../components/QuestionSubmit'
import QuestionList from '../components/QuestionList'
import { auth, login } from '../lib/datastore'
import { getEventByCode } from '../actions/events'
import { fetchOrderedQuestions } from '../actions/questions'

class EventView extends Component {

  static title = 'Questions'

  static async getInitialProps ({ store, query: { code } }) {
    if (code){
      var { event } = await store.dispatch(getEventByCode(code))
      var { id } = event
      await store.dispatch(fetchOrderedQuestions(id, 'likes_count'))
      return { code, id }
    }
    return { code }
  }

  constructor (props) {
    super(props)
    this.state = { ...props }
    var { app, setNewQuestion } =  props
    var { user, newQuestion } = app
    setNewQuestion({
      text:'',
      userName: user ? user.name : '',
    })
  }

  componentDidMount = async () => {
    var { app, code, obsEventByCode, obsOrderedQuestions } = this.props

    this.unobsEvent = obsEventByCode(code, event => {
      this.state.id = event.id
      this.unobs = obsOrderedQuestions(event.id, app.sortField)
    })
  }

  componentWillUnmount() {
    this.unobs && this.unobs()
    this.unobsEvent && this.unobsEvent()
  }

  handleSort = (sortField) => {
    var { setSortField, obsOrderedQuestions } = this.props
    setSortField(sortField)
    if (this.unobs) this.unobs()
    this.unobs = obsOrderedQuestions(this.state.id, sortField)
  }

  submitQuestion = async () => {
    try {
      var { app, updateQuestion, setNewQuestion, openSnack } =  this.props
      var { user, newQuestion } = app
      var userId = user ? user.uid : null
      setNewQuestion({text:''})
      await updateQuestion({eventId: this.state.id, ...newQuestion, userId})
      openSnack('Question has been sent successfully')
    } catch (e) {
      openSnack(e.message)
    }
  }

  render () {
    const { app, questions, events, setNewQuestion } = this.props
    const { newQuestion, sortField } = app
    const { userName, text } = newQuestion
    const eventName = events.byHash[this.state.id].eventName

    return <div>
      <Ty variant="display1" gutterBottom>{eventName}</Ty>
      <QuestionSubmit
        question={newQuestion}
        onSubmit={this.submitQuestion}
        onChange={setNewQuestion}
      />
      <p/>
      <QuestionList
        questions={questions}
        onSort={this.handleSort}
        sortField={sortField}
        sortMap={[
          { id:'likes_count', name:'popular' },
          { id:'created', name:'created time' }
        ]}
      />
    </div>
  }
}

export default withPage(EventView)
