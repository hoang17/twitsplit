import React, { Component } from 'react'
import { auth, login } from '../lib/datastore'
import Router from 'next/router'
import withPage from '../lib/withPage'
import Login from '../components/Login'

class LoginPage extends Component {

  static title = 'Login'

  static async getInitialProps ({ query: { to } }) {
    return { to }
  }

  componentDidMount = () => {
    auth(user => {
      if (user) Router.push(this.props.to)
    })
  }

  render() {
    return <Login login={login} />
  }
}

export default withPage(LoginPage)
