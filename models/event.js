var objectid = require('bson-objectid')
var moment = require('moment')

module.exports = ({id, userId, eventName, eventCode, startDate, endDate}) => {
  if (!eventName)
    throw new TypeError('Event name can not be empty')

  if (!eventCode)
    throw 'Event code can not be empty'

    if (!userId)
      throw 'User id can not be empty'

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
