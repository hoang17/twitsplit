import React, { Component } from 'react'
import { auth, login } from '../lib/datastore'
import Router from 'next/router'
import withPage from '../lib/withPage'
import Link from 'next/link'
import Button from 'material-ui/Button'
import Ty from 'material-ui/Typography'

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
    return <div>
      <Ty variant="display1" gutterBottom>Please Login</Ty>
      <p/>
      <Button variant="raised" color="secondary" onClick={login}>Login</Button>
      <p/>
      <Ty variant="subheading" gutterBottom>
        <Link href="/">
          <a>Home</a>
        </Link>
      </Ty>
    </div>
  }
}

export default withPage(LoginPage)
