var objectid = require('bson-objectid')
var moment = require('moment')

module.exports = (id, userId, eventName, eventCode, startDate, endDate) => {
  if (!eventName)
    throw 'Please enter event name'

  if (!eventCode)
    throw 'Please enter event code'

  start = moment(startDate).startOf('day')
  end = moment(endDate).startOf('day')

  if (start.diff(end, 'days') > 0)
    throw 'End date should be equal or greater than start date'

  id = id ? id : objectid().toString()

  return {
    id,
    eventName,
    eventCode,
    startDate,
    endDate,
    userId,
  }
}
