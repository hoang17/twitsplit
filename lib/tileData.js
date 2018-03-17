import React from 'react'
import { ListItem, ListItemIcon, ListItemText } from 'material-ui/List'
import InboxIcon from 'material-ui-icons/MoveToInbox'
import StarIcon from 'material-ui-icons/Star'
import MailIcon from 'material-ui-icons/Mail'
// import DraftsIcon from 'material-ui-icons/Drafts'
// import SendIcon from 'material-ui-icons/Send'
// import DeleteIcon from 'material-ui-icons/Delete'
// import ReportIcon from 'material-ui-icons/Report'

export const mailFolderListItems = (
  <div>
    <a href="/">
      <ListItem button>
        <ListItemIcon>
          <InboxIcon />
        </ListItemIcon>
        <ListItemText primary="Join Event" />
      </ListItem>
    </a>
    <a href="/event-list">
      <ListItem button>
          <ListItemIcon>
            <StarIcon />
          </ListItemIcon>
          <ListItemText primary="Manage Events" />
      </ListItem>
    </a>
    {/* <ListItem button>
      <ListItemIcon>
        <SendIcon />
      </ListItemIcon>
      <ListItemText primary="Send mail" />
    </ListItem>
    <ListItem button>
      <ListItemIcon>
        <DraftsIcon />
      </ListItemIcon>
      <ListItemText primary="Drafts" />
    </ListItem> */}
  </div>
)

export const otherMailFolderListItems = (
  <div>
    <ListItem button>
      <ListItemIcon>
        <MailIcon />
      </ListItemIcon>
      <ListItemText primary="Contact" />
    </ListItem>
    {/* <ListItem button>
      <ListItemIcon>
        <DeleteIcon />
      </ListItemIcon>
      <ListItemText primary="Trash" />
    </ListItem>
    <ListItem button>
      <ListItemIcon>
        <ReportIcon />
      </ListItemIcon>
      <ListItemText primary="Spam" />
    </ListItem> */}
  </div>
)
