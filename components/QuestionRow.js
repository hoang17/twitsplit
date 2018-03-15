import React, { Component } from 'react'

import { fsLikes } from '../lib/firebase'

export default class QuestionRow extends Component {

  constructor (props) {
    super(props)
    this.state = { ...this.props }
    this.likeClick = this.likeClick.bind(this)
    this.unlikeClick = this.unlikeClick.bind(this)
  }

  componentWillReceiveProps(newProps){
    this.setState({ ...newProps })
  }

  likeClick(){
    var userIP = this.state.userIP
    var questionId = this.state.id
    var id = userIP.replace(/\./g,'_') + '_' + questionId
    console.log(id);
    fsLikes.set(id, {id, userIP, questionId})
    this.setState({likes_count: this.state.likes_count+1})
  }

  unlikeClick(){
    var userIP = this.state.userIP
    var questionId = this.state.id
    var id = userIP.replace(/\./g,'_') + '_' + questionId
    fsLikes.delete(id)
    this.setState({likes_count: this.state.likes_count-1})
  }

  render () {
    const { id, text, likes_count } = this.state

    return (
      <li key={id}>
        {text}
        <button
          onClick={this.likeClick}
          className={likes_count?'like':''}>
          {likes_count} like
        </button>
        <button
          onClick={this.unlikeClick}
          className={likes_count?'unlike':''}>
          unlike
        </button>
        <style jsx>{`
          button.like {
            color: white;
            background-color:blue;
          }
          button.unlike {
            color: white;
            background-color:red;
          }
        `}</style>
      </li>
    )
  }
}
