var objectid = require('bson-objectid')

module.exports = (userId, eventName, eventCode, startDate, endDate) => {
  return {
    id: objectid().toString(),
    eventName,
    eventCode,
    startDate,
    endDate,
    userId,
  }
}
