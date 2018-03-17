import React from 'react'
import PropTypes from 'prop-types'
import Button from 'material-ui/Button'
import Dialog, {
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from 'material-ui/Dialog'
import Typography from 'material-ui/Typography'
import { withStyles } from 'material-ui/styles'
import withRoot from '../lib/withRoot'

import AppBar from 'material-ui/AppBar'
import Toolbar from 'material-ui/Toolbar'
import IconButton from 'material-ui/IconButton'
import Switch from 'material-ui/Switch'
import { FormControlLabel, FormGroup } from 'material-ui/Form'
import Menu, { MenuItem } from 'material-ui/Menu'
import MenuIcon from 'material-ui-icons/Menu'
import AccountCircle from 'material-ui-icons/AccountCircle'

import classNames from 'classnames'
import Drawer from 'material-ui/Drawer'
import List from 'material-ui/List'
import TextField from 'material-ui/TextField'
import Divider from 'material-ui/Divider'
import ChevronLeftIcon from 'material-ui-icons/ChevronLeft'
import ChevronRightIcon from 'material-ui-icons/ChevronRight'
import { mailFolderListItems, otherMailFolderListItems } from '../lib/tileData'

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
    flexGrow: 1,
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing.unit * 3,
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
})

class Index extends React.Component {
  state = {
    left: false,
    dialogOpen: false,
    auth: true,
    anchorEl: null,
  }

  handleDialogClose = () => {
    this.setState({
      dialogOpen: false,
    })
  }

  handleButtonClick = () => {
    this.setState({
      dialogOpen: true,
    })
  }

  handleLoginChange = (event, checked) => {
    this.setState({ auth: checked })
  }

  handleMenu = event => {
    this.setState({ anchorEl: event.currentTarget })
  }

  handleMenuClose = () => {
    this.setState({ anchorEl: null })
  }

  toggleDrawer = (side, open) => () => {
    this.setState({
      [side]: open,
    })
  }

  render() {
    const { classes, theme } = this.props
    const { dialogOpen, auth, anchorEl } = this.state
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
                Title
              </Typography>

              {auth && (
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
                    <MenuItem onClick={this.handleMenuClose}>Profile</MenuItem>
                    <MenuItem onClick={this.handleMenuClose}>My account</MenuItem>
                  </Menu>
                </div>
              )}
            </Toolbar>
          </AppBar>

          <main className={classes.content}>
            <div className={classes.drawerHeader} />

            <Button onClick={this.toggleDrawer('left', true)}>Open Left</Button>

            <FormGroup>
              <FormControlLabel
                control={
                  <Switch checked={auth} onChange={this.handleLoginChange} aria-label="LoginSwitch" />
                }
                label={auth ? 'Logout' : 'Login'}
              />
            </FormGroup>

            <Dialog open={dialogOpen} onClose={this.handleDialogClose}>
              <DialogTitle>Super Secret Password</DialogTitle>
              <DialogContent>
                <DialogContentText>1-2-3-4-5</DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button color="primary" onClick={this.handleDialogClose}>
                  OK
                </Button>
              </DialogActions>
            </Dialog>
            <Typography variant="display1" gutterBottom>
              Material-UI
            </Typography>
            <Typography variant="subheading" gutterBottom>
              example project
            </Typography>
            <Button variant="raised" color="secondary" onClick={this.handleButtonClick}>
              Super Secret Password
            </Button>

          </main>
        </div>
      </div>
    )
  }
}

Index.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
}

export default withRoot(withStyles(styles, { withTheme: true })(Index))
