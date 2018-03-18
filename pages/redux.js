import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { configureStore, nextConnect } from '../store/configureStore'
import withRedux from 'next-redux-wrapper'
import { setUser } from '../actions/user'
import { fetchEvents } from '../actions/event'
import { fetchQuestions } from '../actions/question'
import Link from 'next/link'

class Page extends React.Component {
  static async getInitialProps ({ store, req, query, isServer }) {
    if (req){
      const user = req && req.session ? req.session.decodedToken : null
      store.dispatch(setUser(user))
    }
    var { user } = store.getState()
    if (user){
      await store.dispatch(fetchEvents(user.uid))
      // await store.dispatch(fetchQuestions())
    }
    return { isServer }
  }

  render () {
    var { isServer, event, question } = this.props

    // console.log('PROPS', this.props);

    return (
      <div>
        <div>All events: {isServer}</div>
        {
          event.ids.map(id =>
            <div key={id}>
              <Link href={{pathname: '/reduk', query: { id: id }}}><a>{event.map[id].eventName}</a></Link>
            </div>
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
