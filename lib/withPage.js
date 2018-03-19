import React from 'react'
import PropTypes from 'prop-types'
import Button from 'material-ui/Button'
import Typography from 'material-ui/Typography'
import { withStyles } from 'material-ui/styles'
import withRoot from '../lib/withRoot'

import AppBar from 'material-ui/AppBar'
import Toolbar from 'material-ui/Toolbar'
import IconButton from 'material-ui/IconButton'
import Menu, { MenuItem } from 'material-ui/Menu'
import MenuIcon from 'material-ui-icons/Menu'
import AccountCircle from 'material-ui-icons/AccountCircle'
import Snackbar from '../components/Snack'

import Drawer from 'material-ui/Drawer'
import List from 'material-ui/List'
import Divider from 'material-ui/Divider'
import { mailFolderListItems, otherMailFolderListItems } from '../lib/tileData'
import '../static/style.css'

import mapValues from 'lodash/mapValues'
import { auth, login, logout } from '../lib/datastore'
import { bindActionCreators as bac } from 'redux'
import { configureStore } from '../store/configureStore'
import withRedux from 'next-redux-wrapper'
import * as appActions from '../actions/app'
import * as evenActions from '../actions/event'
import * as questionActions from '../actions/question'
const { setUser, setUserIP } = appActions

import NProgress from 'nprogress'
import Router from 'next/router'

Router.onRouteChangeStart = (url) => {
  console.log(`Loading: ${url}`)
  NProgress.start()
}
Router.onRouteChangeComplete = () => NProgress.done()
Router.onRouteChangeError = () => NProgress.done()

const drawerWidth = 240

const styles = theme => ({
  root: {
    flexGrow: 1,
    textAlign: 'center',
    // paddingTop: theme.spacing.unit * 20,
  },
  flex: {
    flex: 1,
  },
  list: {
    width: 250,
  },
  fullList: {
    width: 'auto',
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20,
  },
  content: {
    'max-width': '650px',
    margin: '10px auto',
    flexGrow: 1,
    // backgroundColor: theme.palette.background.default,
    padding: theme.spacing.unit * 3,
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
})

function withPage(Page){

  class Index extends React.Component {

    static getInitialProps = async (context) => {
      var { store, req, isServer } = context
      if (req){
        const user = req && req.session ? req.session.decodedToken : null
        var userIP = req ? req.headers['x-forwarded-for'] || req.connection.remoteAddress : null
        store.dispatch(setUser(user))
        store.dispatch(setUserIP(userIP))
      }

      if (Page.getInitialProps)
        return await Page.getInitialProps(context)

      return { isServer }
    }

    constructor (props) {
      super(props)
      this.state = {
        left: false,
        anchorEl: null,
      }
    }

    componentDidMount () {
      auth(user => this.props.setUser(user))
    }

    handleButtonClick = () => {
      this.setState({
        dialogOpen: true,
      })
    }

    handleMenu = event => {
      this.setState({ anchorEl: event.currentTarget })
    }

    handleMenuClose = () => {
      this.setState({ anchorEl: null })
    }

    handleMenuLogout = () => {
      this.setState({ anchorEl: null })
      logout()
    }

    toggleDrawer = (side, open) => () => {
      this.setState({
        [side]: open,
      })
    }

    render() {
      const { classes, theme, app, setSnack } = this.props
      const { user, info } = app
      const { anchorEl } = this.state
      const openAnchor = Boolean(anchorEl)

      const sideList = (
        <div className={classes.list}>
          <List>{mailFolderListItems}</List>
          <Divider />
          <List>{otherMailFolderListItems}</List>
        </div>
      )
      const fullList = (
        <div className={classes.fullList}>
          <List>{mailFolderListItems}</List>
          <Divider />
          <List>{otherMailFolderListItems}</List>
        </div>
      )

      return (
        <div className={classes.root}>
          <Drawer open={this.state.left} onClose={this.toggleDrawer('left', false)}>
            <div
              tabIndex={0}
              role="button"
              onClick={this.toggleDrawer('left', false)}
              onKeyDown={this.toggleDrawer('left', false)}
            >
              {sideList}
            </div>
          </Drawer>
          <div className={classes.appFrame}>
            <AppBar position="static">
              <Toolbar>
                <IconButton
                  color="inherit"
                  aria-label="open drawer"
                  onClick={this.toggleDrawer('left', true)}
                  className={classes.menuButton}
                >
                  <MenuIcon />
                </IconButton>

                <Typography variant="title" color="inherit" className={classes.flex}>
                  { user ? Page.title : 'Login' }
                </Typography>

                {user ? (
                  <div>
                    <IconButton
                      aria-owns={openAnchor ? 'menu-appbar' : null}
                      aria-haspopup="true"
                      onClick={this.handleMenu}
                      color="inherit"
                    >
                      <AccountCircle />
                    </IconButton>
                    <Menu
                      id="menu-appbar"
                      anchorEl={anchorEl}
                      anchorOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                      }}
                      transformOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                      }}
                      open={openAnchor}
                      onClose={this.handleMenuClose}
                    >
                      <MenuItem onClick={this.handleMenuClose}>My account</MenuItem>
                      <MenuItem onClick={this.handleMenuLogout}>Logout</MenuItem>
                    </Menu>
                  </div>
                ) : (
                  <Button color="inherit" onClick={login}>Login</Button>
                )}
              </Toolbar>
            </AppBar>
            <main className={classes.content}>
              <Page {...this.props} />
            </main>
            <Snackbar open={info.open} msg={info.msg} onClose={()=> setSnack({open: false}) } />
          </div>
        </div>
      )
    }
  }

  Index.propTypes = {
    classes: PropTypes.object.isRequired,
    theme: PropTypes.object.isRequired,
  }

  const mapDispatchToProps = dispatch => {
    const bind = actions => mapValues(actions, f => bac(f, dispatch))
    return {
      ...bind(appActions),
      ...bind(evenActions),
      ...bind(questionActions),
    }
  }

  return withRedux(configureStore, state => state, mapDispatchToProps)(withRoot(withStyles(styles, { withTheme: true })(Index)))
}

export default withPage
