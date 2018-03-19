import React, { Component } from 'react'
import withPage from '../lib/withPage'
import Ty from 'material-ui/Typography'
import QuestionSubmit from '../components/QuestionSubmit'
import QuestionList from '../components/QuestionList'
import { auth, login } from '../lib/datastore'
import { getEventByCode } from '../actions/event'
import { fetchOrderedQuestions } from '../actions/question'

class EventView extends Component {

  static title = 'Questions'

  static async getInitialProps ({ store, req, query: { code } }) {
    if (code){
      var { event } = await store.dispatch(getEventByCode(code))
      await store.dispatch(fetchOrderedQuestions(event.id, 'likes_count'))
    }
    return { code }
  }

  constructor (props) {
    super(props)
    var { app, setNewQuestion } =  props
    var { user, newQuestion } = app
    setNewQuestion({
      text:'',
      userName: user ? user.name : '',
    })
  }

  componentDidMount = async () => {
    var { app, code, obsEventsByCode, obsOrderedQuestions } = this.props

    this.unobsE = obsEventsByCode(code, event => {
      this.unobsQ = obsOrderedQuestions(event.id, app.sortField)
    })
  }

  handleSort = (sortField) => {
    var { events, setSortField, obsOrderedQuestions } = this.props
    setSortField(sortField)
    if (this.unobsQ) this.unobsQ()
    this.unobsQ = obsOrderedQuestions(events.current, sortField)
  }

  submitQuestion = async () => {
    try {
      var { app, events, updateQuestion, setNewQuestion, setSnack } =  this.props
      var { user, newQuestion } = app
      var userId = user ? user.uid : null
      setNewQuestion({text:''})
      await updateQuestion({eventId: events.current, ...newQuestion, userId})
      setSnack({ open: true, msg: 'Question has been sent successfully' })
    } catch (e) {
      setSnack({ open: true, msg: e.message })
    }
  }

  render () {
    const { app, questions, events, setNewQuestion, setSnack } = this.props
    const { newQuestion, sortField } = app
    const { userName, text } = newQuestion
    const eventName = events.byHash[events.current].eventName

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
