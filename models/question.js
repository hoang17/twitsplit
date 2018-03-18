var objectid = require('bson-objectid')

module.exports = ({id, eventId, text, userId, userName}) => {

  if (!eventId.trim())
    throw new TypeError('Event id can not empty')

  if (!text.trim())
    throw new TypeError('Question can not empty')

  var { FieldValue } = require('../lib/datastore')

  return {
    id: id ? id : objectid().toString(),
    text,
    eventId,
    likes: {},
    likes_count:0,
    mark: false,
    userId: userId ? userId : null,
    userName: userName ? userName : null,
    created: FieldValue.serverTimestamp()
  }
}
