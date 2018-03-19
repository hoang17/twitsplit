import React from 'react'
import { auth, login } from '../lib/datastore'
import Button from 'material-ui/Button'

function withLogin(Component){

  class Index extends React.Component {

    static title = Component.title

    static getInitialProps = async ctx => {
      if (Component.getInitialProps) {
        return await Component.getInitialProps(ctx)
      }
      return {}
    }

    render() {
      const { app } = this.props
      const { user } = app
      return (
        <div>
          {
            !user && <Button variant="raised" color="secondary" onClick={login}>Login</Button>
          }
          {
            user &&
            <Component {...this.props} auth={auth} />
          }
        </div>
      )
    }
  }

  return Index
}

export default withLogin
