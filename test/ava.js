import test from 'ava'

import { fsEvents, saveEvent, validCode, init } from '../lib/datastore'

import Event from '../models/event'

test.before(t => {
	init()
});

test('Event should contain event name', t => {
	const error = t.throws(() => {
		Event({eventName: ''})
	}, {instanceOf: TypeError, message: 'Event name can not be empty'})
})

test('Event should contain event code', t => {
	const error = t.throws(() => {
		Event({eventCode: '', eventName:'Test Event'})
	}, {instanceOf: TypeError, message: 'Event code can not be empty'})
})

test('Event should contain user id', t => {
	const error = t.throws(() => {
		Event({userId: '', eventName:'Test Event', eventCode:'1010'})
	}, {instanceOf: TypeError, message: 'User id can not be empty'})
})

test('Event end date should be equal or greater than start date', t => {
	const error = t.throws(() => {
    var startDate = new Date()
    var endDate = new Date(Date.now() - 86400000) // yesterday
		Event({userId: '1', eventName:'Test Event', eventCode:'1010', startDate, endDate})
	}, {instanceOf: TypeError, message: 'End date should be equal or greater than start date'})
})

test('Event code should be unique', async t => {
	await t.throws(async () => {
    var event = await fsEvents.one()
    event.id = '1'
    await saveEvent(event)
	}, {instanceOf: TypeError, message: 'Event code is not unique'})
})

test('Event should be created', async t => {
  var startDate = new Date()
  var endDate = new Date()
  var event = Event({userId: '111', eventName:'Test Event', eventCode:'1010', startDate, endDate})
  await saveEvent(event)
  var savedEvent = await fsEvents.data(event.id)
  fsEvents.delete(event.id)
  t.deepEqual(event, savedEvent)
})

test('Event code should not exists', async t => {
  await t.throws(async () => {
    await validCode('2e31fg4')
	}, {instanceOf: TypeError, message: 'You can not join this event because event code not exists'})
})

test('Event code should be invalid because time not matched', async t => {
  var eventCode = '121212'
  var yesterday = new Date(Date.now() - 86400000)
  var startDate = yesterday
  var endDate = yesterday
  var event = Event({userId: '111', eventName:'Test Event', eventCode, startDate, endDate})
  await saveEvent(event)

  var err = await t.throws(async () => {
    await validCode(event.eventCode)
	}, TypeError)

  fsEvents.delete(event.id)
  t.is(err.message, 'You can not join this event because time not matched')
})
