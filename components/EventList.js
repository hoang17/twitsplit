import React, { Component } from 'react'
import moment from 'moment'
import Link from 'next/link'
import Button from 'material-ui/Button'
import TextField from 'material-ui/TextField'
import Table, { TableBody, TableCell, TableHead, TableRow } from 'material-ui/Table'
import Paper from 'material-ui/Paper'
import { withStyles } from 'material-ui/styles'

const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
    overflowX: 'auto',
  },
  table: {
    minWidth: 700,
  },
})

class EventList extends Component {

  render() {
    const { events, classes } = this.props

    return (
      <Paper className={classes.root}>
        <Table className={classes.table}>
          <TableHead>
            <TableRow>
              <TableCell>Event Name</TableCell>
              <TableCell numeric>Event Code</TableCell>
              <TableCell numeric>Start Date</TableCell>
              <TableCell numeric>End Date</TableCell>
              <TableCell numeric>___________</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {
              events.byId.map(id => {
                var n = events.byHash[id]
                return (
                  <TableRow key={id}>
                    <TableCell>
                      <Link href={{pathname: '/event-edit', query: { id: id }}}>
                        <a>{n.eventName}</a>
                      </Link>
                    </TableCell>
                    <TableCell numeric>{n.eventCode}</TableCell>
                    <TableCell numeric>{moment(n.startDate).format('L')}</TableCell>
                    <TableCell numeric>{moment(n.endDate).format('L')}</TableCell>
                  </TableRow>
                )
            })}
          </TableBody>
        </Table>
      </Paper>
    )
  }
}

export default withStyles(styles)(EventList)
