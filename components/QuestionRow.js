import React, { Component } from 'react'
import Router from 'next/router'
import Link from 'next/link'
import moment from 'moment'
import IconButton from 'material-ui/IconButton'
import Menu, { MenuItem } from 'material-ui/Menu'
import MoreVertIcon from 'material-ui-icons/MoreVert'
import EditIcon from 'material-ui-icons/Edit'
import DeleteIcon from 'material-ui-icons/Delete'
import HighlightIcon from 'material-ui-icons/Highlight'
import { ListItemIcon, ListItemText } from 'material-ui/List'

import { like, highlight, fsQuestions } from '../lib/datastore'

export default class QuestionRow extends Component {

  constructor (props) {
    super(props)
    this.state = { ...this.props, anchorEl: null }
  }

  openMenu = (event) => {
    this.setState({ anchorEl: event.currentTarget })
  }

  closeMenu = () => {
    this.setState({ anchorEl: null })
  }

  componentWillReceiveProps(newProps){
    this.setState({ ...newProps })
  }

  toggleLike = () => {
    this.state.liked = !this.state.liked
    var likes = like(this.state)
    this.setState({ liked:this.state.liked, likes_count: Object.keys(likes).length, likes })
  }

  editQuestion = () => {
    Router.push('/question-edit?id='+this.state.id)
    this.closeMenu()
  }

  deleteQuestion = () => {
    if (confirm('Are you sure to delete this question?'))
      fsQuestions.delete(this.state.id)
    this.closeMenu()
  }

  markQuestion = async () => {
    this.closeMenu()
    var { id, mark, eventId } = this.state
    mark = !mark
    try {
      await highlight(id, mark, eventId)
      this.setState({ mark })
    } catch (e) {
      alert(e.message)
    }
  }

  render () {
    const { id, text, likes_count, liked, mark, userName, created, anchorEl } = this.state
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
            display: flex
            border-bottom: 1px solid grey
            align-items:center
            justify-content: space-between
            padding:10px
          }
          .question{
            width:90%
          }
          .user{
            font-weight:bold
          }
          .meta{
            font-size:80%
            color: #999
          }
          .txt{
            padding-top:10px
            white-space: pre-wrap
            word-wrap: break-word
            overflow:hidden
          }
          .highlight{
            background-color:yellow
          }
          button.like {
            color: white
            background-color:blue
          }
          button.unlike {
            color: white
            background-color:red
          }
        `}</style>
        { this.props.admin &&
          <span>
            <IconButton
              aria-label="More"
              aria-owns={anchorEl ? 'simple-menu' : null}
              aria-haspopup="true"
              onClick={this.openMenu}
            >
              <MoreVertIcon />
            </IconButton>
            <Menu
              id="simple-menu"
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={this.closeMenu}
            >
              <MenuItem onClick={this.editQuestion}>
                <ListItemIcon>
                  <EditIcon />
                </ListItemIcon>
                <ListItemText inset primary="Edit" />
              </MenuItem>
              <MenuItem onClick={this.markQuestion}>
                <ListItemIcon>
                  <HighlightIcon />
                </ListItemIcon>
                <ListItemText inset primary={mark?'Unmark':'Mark'} />
              </MenuItem>
              <MenuItem onClick={this.deleteQuestion}>
                <ListItemIcon>
                  <DeleteIcon />
                </ListItemIcon>
                <ListItemText inset primary="Delete" />
              </MenuItem>
            </Menu>
          </span>
        }
      </li>
    )
  }
}
