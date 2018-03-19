import React from 'react'
import { bindActionCreators } from 'redux'
import { configureStore } from '../store/configureStore'
import withRedux from 'next-redux-wrapper'
import { setUser } from '../actions/app'
import { fetchEvents, obsEvents } from '../actions/event'
import Link from 'next/link'

class Page extends React.Component {
  static async getInitialProps ({ store, req, query, isServer }) {
    if (req){
      const user = req && req.session ? req.session.decodedToken : null
      store.dispatch(setUser(user))
    }
    var { app } = store.getState()
    if (app.user){
      await store.dispatch(fetchEvents(app.user.uid))
    }
    return { isServer }
  }

  componentDidMount () {
    this.props.obsEvents(this.props.app.user.uid)
  }

  render () {
    var { isServer, events } = this.props

    return (
      <div>
        <div>All events: {isServer}</div>
        {
          events.byId.map(id =>
            <div key={id}>
              <Link href={{pathname: '/reduk', query: { id: id }}}><a>{events.byHash[id].eventName}</a></Link>
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
