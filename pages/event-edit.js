import React, { Component } from 'react'

export default class extends Component {
  static getInitialProps ({ query: { id } }) {
    return { id }
  }

  render () {
    return <div>
      <h1>Event #{this.props.id}</h1>
      <p>
      </p>
    </div>
  }
}
