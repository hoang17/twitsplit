import Button from 'material-ui/Button'
import TextField from 'material-ui/TextField'
import DatePicker from 'react-datepicker'
import moment from 'moment'
import 'react-datepicker/dist/react-datepicker.css'

export default ({ event: { id, eventName, eventCode, startDate, endDate }, onCreate, onChange }) => {

  return (
    <div style={{width:'170px', margin:'0 auto'}}>
      <TextField
        label="Event Name"
        value={eventName}
        onChange={e => onChange({eventName: e.target.value})}
        margin="normal"
      />
      <br/>
      <TextField
        label="Event Code"
        value={eventCode}
        onChange={e => onChange({eventCode: e.target.value})}
        margin="normal"
      />
      <br/>
      <div style={{textAlign:'left'}}>Start date</div>
      <DatePicker
        selected={moment(startDate)}
        onChange={date => onChange({startDate: date.toDate()})}
      />
      <br/>
      <div style={{textAlign:'left'}}>End date</div>
      <DatePicker
        selected={moment(endDate)}
        onChange={date => onChange({endDate: date.toDate()})}
      />
      <p/>
      <Button variant="raised" color="secondary" onClick={onCreate}>Create Event</Button>
    </div>
  )
}
