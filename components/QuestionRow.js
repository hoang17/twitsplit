import React, { Component } from 'react'

import { like, fsQuestions } from '../lib/datastore'

export default class QuestionRow extends Component {

  constructor (props) {
    super(props)
    this.state = { ...this.props }
    this.toggleLike = this.toggleLike.bind(this)
  }

  componentWillReceiveProps(newProps){
    this.setState({ ...newProps })
  }

  toggleLike(){
    var { id, userIP, likes_count, liked } = this.state
    liked = !liked
    likes_count = likes_count + (liked ? 1 : -1)
    this.setState({ likes_count, liked })
    like(userIP, id, likes_count, liked)
    fsQuestions.update(id, { likes_count })
  }

  render () {
    const { id, text, likes_count, liked } = this.state

    return (
      <li key={id}>
        {text} <button
                  onClick={this.toggleLike}
                  className={liked?'unlike':'like'}>
                  {likes_count} {liked? 'unlike':'like'}</button>
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
