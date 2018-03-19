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
    this.unsub = auth(user => {
      if (user) window.location.href = this.props.to
    })
  }

  componentWillUnmount(){
    this.unsub && this.unsub()
  }

  render() {
    return <Login login={login} />
  }
}

export default withPage(LoginPage)
