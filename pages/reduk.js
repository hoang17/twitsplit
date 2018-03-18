import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { configureStore, nextConnect } from '../store/configureStore'
import withRedux from 'next-redux-wrapper'
import { setUser } from '../actions/user'
import { getEvent } from '../actions/event'
import { fetchQuestions } from '../actions/question'
import Link from 'next/link'

class Page extends React.Component {
  static async getInitialProps ({ store, req, query: { id }, isServer }) {
    if (req){
      const user = req && req.session ? req.session.decodedToken : null
      store.dispatch(setUser(user))
    }
    await store.dispatch(getEvent(id))
    await store.dispatch(fetchQuestions(id))
    return { isServer }
  }

  render () {
    var { isServer, question } = this.props

    // console.log('PROPS', this.props);

    return (
      <div>
        <Link href={{pathname: '/redux'}}>
          <a>Back Page</a>
        </Link>
        <div>All questions: {isServer}</div>
        {
          question.byId.map(id =>
            <div key={id}>{question.byHash[id].text}</div>
          )
        }
      </div>
    )
  }
}

const mapDispatchToProps = dispatch => {
  return {
    fetchQuestions: bindActionCreators(fetchQuestions, dispatch)
  }
}

export default withRedux(configureStore, (state) => state, mapDispatchToProps)(Page)
