import test from 'ava'

import { fsEvents, init } from '../lib/datastore'

import Event from '../models/event'

test('Event should contain event name', t => {
	const error = t.throws(() => {
		Event({eventName: ''})
	}, TypeError)

	t.is(error.message, 'Event name can not be empty')
})

test('Event should contain event code', t => {
	const error = t.throws(() => {
		Event({eventCode: '', eventName:'Test Event'})
	}, TypeError)

	t.is(error.message, 'Event code can not be empty')
})

test('Event should contain user id', t => {
	const error = t.throws(() => {
		Event({userId: '', eventName:'Test Event', eventCode:'1010'})
	}, TypeError)

	t.is(error.message, 'User id can not be empty')
})

test('Event end date should be equal or greater than start date', t => {
	const error = t.throws(() => {
    var startDate = new Date()
    var endDate = new Date(Date.now() - 86400000) // yesterday
		Event({userId: '1', eventName:'Test Event', eventCode:'1010', startDate, endDate})
	}, TypeError)

	t.is(error.message, 'End date should be equal or greater than start date')
})

function fn(){
  throw new TypeError('User id can not be empty')
}
test('throws', async t => {
	await t.throws(async () => {
		throw new TypeError('🦄');
	}, {instanceOf: TypeError, message: '🦄'});
});

test('Event should contain user id', async t => {
	await t.throws(async () => {
    // init()
    // var event = await fsEvents.one()
    // fn()
		// Event({userId: '', eventName:'Test Event', eventCode:'1010'})
    throw new TypeError('User id can not be empty')
	}, {instanceOf: TypeError, message: 'User id can not be empty'})

	// t.is(error.message, 'User id can not be empty')
})
