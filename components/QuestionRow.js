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
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { likeQuestion, highlightQuestion, deleteQuestion } from '../actions/question'
import { setSnack } from '../actions/app'

class QuestionRow extends Component {

  state = {
    anchorEl: null
  }

  openMenu = (event) => {
    this.setState({ anchorEl: event.currentTarget })
  }

  closeMenu = () => {
    this.setState({ anchorEl: null })
  }

  toggleLike = () => {
    this.props.likeQuestion(this.props.id)
  }

  editQuestion = () => {
    Router.push('/question-edit?id='+this.props.id)
    this.closeMenu()
  }

  deleteQuestion = () => {
    if (confirm('Are you sure to delete this question?'))
      this.props.deleteQuestion(this.props.id)
    this.closeMenu()
  }

  markQuestion = async () => {
    this.closeMenu()
    try {
      await this.props.highlightQuestion(this.props.id)
    } catch (e) {
      this.props.setSnack({ open: true, msg: e.message })
    }
  }

  render () {
    const { anchorEl } = this.state
    const { id, text, likes_count, liked, mark, userName, created } = this.props

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
            {likes_count} like</button>
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
            width: 50px;
            height: 44px;
          }
          button.unlike {
            color: white
            background-color:green
            width: 50px;
            height: 44px;
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

const mapDispatchToProps = (dispatch) => {
  return {
    likeQuestion: bindActionCreators(likeQuestion, dispatch),
    highlightQuestion: bindActionCreators(highlightQuestion, dispatch),
    deleteQuestion: bindActionCreators(deleteQuestion, dispatch),
    setSnack: bindActionCreators(setSnack, dispatch),
  }
}

export default connect(state => state, mapDispatchToProps)(QuestionRow)
