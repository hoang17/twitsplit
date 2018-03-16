var objectid = require('bson-objectid')

module.exports = (eventId, text, userId) => {
  return {
    id: objectid().toString(),
    likes_count:0,
    eventId,
    text,
    userId,
  }
}
