var objectid = require('bson-objectid')

module.exports = (id, eventId, text, userId, userName) => {

  if (!eventId)
    throw 'Event id can not empty'

  if (!text)
    throw 'Question can not empty'

  var { FieldValue } = require('../lib/datastore')

  return {
    id: id ? id : objectid().toString(),
    likes_count:0,
    eventId,
    text,
    userId,
    userName,
    mark: false,
    created: FieldValue.serverTimestamp()
  }
}
