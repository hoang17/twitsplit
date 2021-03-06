var objectid = require('bson-objectid')
var moment = require('moment')

module.exports = ({id, userId, userName, eventName, eventCode, startDate, endDate}) => {
  if (!eventName || !eventName.trim())
    throw new TypeError('Event name can not be empty')

  if (!eventCode || !eventCode.trim())
    throw new TypeError('Event code can not be empty')

    if (!userId || !userId.trim())
      throw new TypeError('User id can not be empty')

  var start = moment(startDate).startOf('day')
  var end = moment(endDate).startOf('day')

  if (start.diff(end, 'days') > 0)
    throw new TypeError('End date should be equal or greater than start date')

  id = id ? id : objectid().toString()

  return {
    id,
    userId,
    userName,
    eventName,
    eventCode,
    startDate: start.toDate(),
    endDate: end.toDate(),
  }
}
