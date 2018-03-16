import React, { Component } from 'react'
import Link from 'next/link'
import moment from 'moment'

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
    var { id, userIP, likes_count, liked, likes } = this.state
    liked = !liked
    likes_count = likes_count + (liked ? 1 : -1)
    if (!likes) likes = {}
    if (liked)
      likes[userIP] = liked
    else
      delete likes[userIP]
    this.setState({ liked, likes_count, likes })
    fsQuestions.update(id, { likes_count, likes })
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
    const { id, text, likes_count, liked, mark, userName, created } = this.state
    return (
      <li key={id} className={mark ? 'highlight':''}>
        <div className='question'>
          <div className='user'>{userName?userName:'Anonymous'}</div>
          <div className='meta'>{moment(created).fromNow()} - {likes_count} likes</div>
          <div className='txt'>{text}</div>
        </div>
        {
          !this.props.admin &&
          <button
            onClick={this.toggleLike}
            className={liked?'unlike':'like'}>
            {likes_count} {liked? 'unlike':'like'}</button>
        }
        <style jsx>{`
          li{
            display: flex;
            border-bottom: 1px solid grey;
            width:500px;
            align-items:center;
            padding:10px;
          }
          .question{
            width:400px;
          }
          .user{
            font-weight:bold;
          }
          .meta{
            font-size:80%;
            color: #999
          }
          .txt{
            padding-top:10px
            white-space: pre-wrap;
            word-wrap: break-word;
            white-space: pre;
          }
          .highlight .txt{
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
            <a href="#" onClick={this.deleteQuestion}>[Delete]</a>
            <Link href={{pathname: '/question-edit', query: { id: id }}}>
              <a>[Edit]</a>
            </Link>
            <a href="#" onClick={this.markQuestion}>[{mark?'Unmark':'Mark'}]</a>
          </span>
        }
      </li>
    )
  }
}
