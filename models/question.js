var objectid = require('bson-objectid')

module.exports = (id, eventId, text, userId, userName) => {

  if (!eventId)
    throw new TypeError('Event id can not empty')

  if (!text)
    throw new TypeError('Question can not empty')

  var { FieldValue } = require('../lib/datastore')

  return {
    id: id ? id : objectid().toString(),
    likes: {},
    likes_count:0,
    eventId,
    text,
    userId,
    userName,
    mark: false,
    created: FieldValue.serverTimestamp()
  }
}
