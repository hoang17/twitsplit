var objectid = require('bson-objectid')
var { FieldValue } = require('../lib/datastore')

module.exports = (eventId, text, userId) => {
  return {
    id: objectid().toString(),
    likes_count:0,
    eventId,
    text,
    userId,
    mark: false,
    created: FieldValue.serverTimestamp()
  }
}
