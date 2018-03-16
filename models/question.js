var objectid = require('bson-objectid')
var { FieldValue } = require('../lib/datastore')

module.exports = (eventId, text, userId, userName) => {
  return {
    id: objectid().toString(),
    likes_count:0,
    eventId,
    text,
    userId,
    userName,
    mark: false,
    created: FieldValue.serverTimestamp()
  }
}
