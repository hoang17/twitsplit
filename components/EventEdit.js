import DatePicker from 'react-datepicker'
import moment from 'moment'

export default ({ event: { id, eventName, eventCode, startDate, endDate }, onSave, onDelete, onChange }) => {

  return (
    <div style={{textAlign:'left'}}>
      <div>Event Name</div>
      <input
        type={'text'}
        onChange={e => onChange({eventName: e.target.value})}
        placeholder={'Event Name'}
        value={eventName}
      />
      <br/>
      <div>Event Code</div>
      <input
        type={'text'}
        onChange={e => onChange({eventCode: e.target.value})}
        placeholder={'Event Code'}
        value={eventCode}
      />
      <br/>
      <div>Start date</div>
      <DatePicker
        selected={moment(startDate)}
        onChange={date => onChange({startDate: date.toDate()})}
      />
      <br/>
      <div>End date</div>
      <DatePicker
        selected={moment(endDate)}
        onChange={date => onChange({endDate: date.toDate()})}
      />
      <p/>
      <button onClick={onSave}>Save Event</button>
      <button onClick={onDelete}>Delete Event</button>
    </div>
  )
}
