import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { configureStore } from '../store/configureStore'
import withRedux from 'next-redux-wrapper'
import { setUser } from '../actions/user'
import { fetchEvents, obsEvents } from '../actions/event'
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

  componentDidMount () {
    this.props.obsEvents(this.props.user.uid)
  }

  render () {
    var { isServer, event, question } = this.props

    return (
      <div>
        <div>All events: {isServer}</div>
        {
          event.byId.map(id =>
            <div key={id}>
              <Link href={{pathname: '/reduk', query: { id: id }}}><a>{event.byHash[id].eventName}</a></Link>
            </div>
          )
        }
      </div>
    )
  }
}

const mapDispatchToProps = dispatch => {
  return {
    obsEvents: bindActionCreators(obsEvents, dispatch),
  }
}

export default withRedux(configureStore, (state) => state, mapDispatchToProps)(Page)
