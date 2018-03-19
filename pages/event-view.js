import React, { Component } from 'react'
import jsCookie from 'js-cookie'
import withPage from '../lib/withPage'
import Ty from 'material-ui/Typography'
import Snackbar from '../components/Snack'
import QuestionSubmit from '../components/QuestionSubmit'
import QuestionList from '../components/QuestionList'
import { bindActionCreators } from 'redux'
import { configureStore } from '../store/configureStore'
import withRedux from 'next-redux-wrapper'
import { auth, login } from '../lib/datastore'
import { setUser, setUserIP, setNewQuestion, setSnack, setSortField } from '../actions/app'
import { getEventByCode, obsEventsByCode } from '../actions/event'
import { fetchOrderedQuestions, obsOrderedQuestions, updateQuestion } from '../actions/question'

class EventView extends Component {

  static title = 'Questions'

  static async getInitialProps ({ store, req, query: { code }, isServer }) {
    // var questions = []
    // if (req){
    //   var user = req && req.session ? req.session.decodedToken : null
    //   var userIP = req ? req.headers['x-forwarded-for'] || req.connection.remoteAddress : null
    //   var snapshot = await req.fs.collection("events").where('eventCode','==',code).limit(1).get()
    //   var event = snapshot.docs[0].data()
    //   var snapshot = await req.fs.collection("questions").where('eventId','==',event.id).orderBy('likes_count','desc').get()
    //   for (var doc of snapshot.docs) {
    //     var data = doc.data()
    //     data.liked = data.likes && data.likes[userIP]
    //     questions.push(data)
    //   }
    //   return { eventCode: code, ...event, questions, userIP, user }
    // }
    // var userIP = jsCookie.get('userIP')
    // return { eventCode: code, questions, userIP }

    if (req){
      const user = req && req.session ? req.session.decodedToken : null
      var userIP = req ? req.headers['x-forwarded-for'] || req.connection.remoteAddress : null
      store.dispatch(setUser(user))
      store.dispatch(setUserIP(userIP))
      var { event } = await store.dispatch(getEventByCode(code))
      await store.dispatch(fetchOrderedQuestions(event.id, 'likes_count'))
    }
    return { code, isServer }
  }

  // constructor (props) {
  //   super(props)
  //   this.state = {
  //     ...this.props,
  //     question: '',
  //     userName: this.props.user ? this.props.user.displayName : '',
  //     sortField: 'likes_count',
  //   }
  // }

  componentDidMount = async () => {
    var { code, setUser, obsEventsByCode, obsOrderedQuestions } = this.props
    auth(user => {
      setUser(user)
    })

    this.unobsE = obsEventsByCode(code, event => {
      this.unobsQ = obsOrderedQuestions(event.id, 'likes_count')
    })

    // this.addDbListener()
  }

  // addDbListener = () => {
  //   var ft = true
  //   this.unsubEvents = fsEvents.ls().where('eventCode','==',this.state.eventCode).onSnapshot(snapshot => {
  //     // Discard initial loading
  //     if (ft && this.state.eventName) { ft = false; return}
  //
  //     event = snapshot.docs[0].data()
  //     if (event) this.setState({ ...event })
  //     this.unsubQuestions = fsQuestions.ls().where('eventId','==',this.state.id).orderBy('likes_count','desc').onSnapshot(async snapshot => {
  //       var questions = []
  //       for (var doc of snapshot.docs) {
  //         var data = doc.data()
  //         data.liked = data.likes && data.likes[this.state.userIP]
  //         questions.push(data)
  //       }
  //       this.setState({ questions })
  //     })
  //   })
  // }

  handleSort = (sortField) => {
    var { events, setSortField, obsOrderedQuestions } = this.props
    setSortField(sortField)
    if (this.unobsQ) this.unobsQ()
    this.unobsQ = obsOrderedQuestions(events.current, sortField)
    // this.unobsQ = fsQuestions.ls().where('eventId','==',this.state.id).orderBy(sortField,'desc').onSnapshot(async snapshot => {
    //   var questions = []
    //   for (var doc of snapshot.docs) {
    //     var data = doc.data()
    //     data.liked = data.likes && data.likes[this.state.userIP]
    //     questions.push(data)
    //   }
    //   this.setState({ questions })
    // })
  }

  submitQuestion = async () => {
    try {
      var { app, events, updateQuestion, setNewQuestion, setSnack } =  this.props
      var { user, newQuestion } = app
      var userId = user ? user.uid : null
      await updateQuestion({eventId: events.current, ...newQuestion, userId})
      setNewQuestion()
      setSnack({ open: true, msg: 'Question has been sent successfully' })
    } catch (e) {
      setSnack({ open: true, msg: e.message })
    }
  }

  render () {
    const { app, questions, events, setNewQuestion, setSnack } = this.props
    const { newQuestion, info, sortField } = app
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
      <Snackbar open={info.open} msg={info.msg} onClose={ ()=> setSnack({open: false}) } />
    </div>
  }
}

const mapDispatchToProps = dispatch => {
  return {
    getEventByCode: bindActionCreators(getEventByCode, dispatch),
    obsEventsByCode: bindActionCreators(obsEventsByCode, dispatch),
    fetchOrderedQuestions: bindActionCreators(fetchOrderedQuestions, dispatch),
    obsOrderedQuestions: bindActionCreators(obsOrderedQuestions, dispatch),
    updateQuestion: bindActionCreators(updateQuestion, dispatch),
    setNewQuestion: bindActionCreators(setNewQuestion, dispatch),
    setSortField: bindActionCreators(setSortField, dispatch),
    setUser: bindActionCreators(setUser, dispatch),
    setUserIP: bindActionCreators(setUserIP, dispatch),
    setSnack: bindActionCreators(setSnack, dispatch),
  }
}

// export default withPage(EventView)
export default withRedux(configureStore, state => state, mapDispatchToProps)(withPage(EventView))
