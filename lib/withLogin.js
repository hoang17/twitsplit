import React from 'react'
import { auth, login } from '../lib/datastore'
import Router, { withRouter } from 'next/router'
import Login from '../components/Login'

function withLogin(Component){

  class Index extends React.Component {

    static title = Component.title

    static getInitialProps = async context => {

      var { asPath, store, req, res, isServer } = context

      var { app } = store.getState()
      var { user } = app

      if (!user){
        if (res) {
          res.redirect(302, '/login?to='+asPath)
          res.end()
          res.finished = true
          return
        }
        else Router.replace('/login?to='+asPath)
      }

      if (Component.getInitialProps)
        return await Component.getInitialProps(context)

      return { isServer }
    }

    componentDidMount = () => {
      auth(user => {
        var { router } = this.props
        if (!user) Router.push('/login?to='+router.asPath)
      })
    }

    render() {
      const { app } = this.props
      const { user } = app
      return user ?
          <Component {...this.props} />
        : <Login login={login} />
    }
  }

  return withRouter(Index)
}

export default withLogin
