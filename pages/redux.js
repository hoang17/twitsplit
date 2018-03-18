import React from 'react'
// import store from '../store'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { configureStore, nextConnect } from '../store/configureStore'
import withRedux from 'next-redux-wrapper'
import { fetchEvents } from '../actions/event'
import { fetchQuestions } from '../actions/question'

class Page extends React.Component {
  static async getInitialProps ({ store, isServer }) {
    await store.dispatch(fetchEvents())
    await store.dispatch(fetchQuestions())
    return { isServer }
  }

  render () {
    var { isServer, event, question } = this.props

    console.log(this.props);

    return (
      <div>
        <div>All events: {isServer}</div>
        {
          event.events.map(e =>
            <div key={e.id}>{e.eventName}</div>
          )
        }
        {/* {
          question.questions.map(e =>
            <div>{e.text}</div>
          )
        } */}
      </div>
    )
  }
}

const mapDispatchToProps = dispatch => {
  return {
    fetchEvents: bindActionCreators(fetchEvents, dispatch),
    fetchQuestions: bindActionCreators(fetchQuestions, dispatch)
  }
}

export default withRedux(configureStore, (state) => state, mapDispatchToProps)(Page)

// export default nextConnect((state) => state)(Page)
