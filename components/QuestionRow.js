import React, { Component } from 'react'
import Link from 'next/link'

import { like, fsQuestions } from '../lib/datastore'

export default class QuestionRow extends Component {

  constructor (props) {
    super(props)
    this.state = { ...this.props }
    this.toggleLike = this.toggleLike.bind(this)
    this.deleteQuestion = this.deleteQuestion.bind(this)
    this.markQuestion = this.markQuestion.bind(this)
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

  deleteQuestion(){
    if (confirm('Are you sure to delete this question?'))
      fsQuestions.delete(this.state.id)
  }

  async markQuestion(){
    var { id, mark } = this.state
    mark = !mark
    if (mark){
      var docs = await fsQuestions.ls().where('mark','==', true).get()
      if (docs.size > 2){
        alert('Maximum highlight amount is 3')
        return
      }
    }
    this.setState({ mark })
    fsQuestions.update(id, { mark })
  }

  render () {
    const { id, text, likes_count, liked, mark } = this.state
    return (
      <li key={id}>
        <span className={mark ? 'highlight':''}> {text} </span>
        { !this.props.admin && 
          <button
            onClick={this.toggleLike}
            className={liked?'unlike':'like'}>
            {likes_count} {liked? 'unlike':'like'}</button>}
        <style jsx>{`
          .highlight{
            background-color:yellow;
          }
          button.like {
            color: white;
            background-color:blue;
          }
          button.unlike {
            color: white;
            background-color:red;
          }
        `}</style>
        { this.props.admin &&
          <span>
            <a href="#" onClick={this.markQuestion}>[ {mark?'Unmark':'Mark'} ]</a>
            <a href="#" onClick={this.deleteQuestion}>[ Delete ]</a>
            <Link href={{pathname: '/question-edit', query: { id: id }}}>
              <a>[ Edit ]</a>
            </Link>
          </span>
        }
      </li>
    )
  }
}
