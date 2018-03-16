import test from 'ava'

import { fsEvents, fsQuestions, saveEvent, saveQuestion, validCode, like, highlight, init } from '../lib/datastore'

import Event from '../models/event'
import Question from '../models/question'

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

test('Event should be created and updated', async t => {
  var eventCode = '121121'
  await fsEvents.deleteWhere('eventCode','==',eventCode)
  var startDate = new Date()
  var endDate = new Date()
  var event = Event({userId: '111', eventName:'Test Event', eventCode, startDate, endDate})
  await saveEvent(event)
  var savedEvent = await fsEvents.data(event.id)
  t.deepEqual(event, savedEvent)

  event.eventName = 'New Event Name'

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
  await fsEvents.deleteWhere('eventCode','==',eventCode)
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

test('Question event id should not empty', t => {
	const error = t.throws(() => {
		Question({eventId: ''})
	}, {instanceOf: TypeError, message: 'Event id can not empty'})
})

test('Question should not empty', t => {
	const error = t.throws(() => {
    Question({eventId: '111', text:''})
	}, {instanceOf: TypeError, message: 'Question can not empty'})
})

test('Question should be created', async t => {
  var eventId = '3331'
  var question = Question({eventId, text:'This is a test question'})
  await saveQuestion(question)
  var savedQuestion = await fsQuestions.data(question.id)
  t.deepEqual(question.text, savedQuestion.text)
  fsQuestions.delete(question.id)
})

test('Question should have correct likes', async t => {
  var eventId = '3332'
  var question = Question({eventId, text:'This is a test question'})
  await saveQuestion(question)
  var savedQuestion = await fsQuestions.data(question.id)
  t.deepEqual(question.text, savedQuestion.text, 'question created')

  for (var i = 1; i <= 10; i++) {
    var likes = await like({ ...question, liked: true, userIP: 'IP_TEST_'+i })
    question = { ...question, likes, likes_count: Object.keys(likes).length }
  }

  for (var i = 1; i <= 5; i++) {
    var likes = await like({ ...question, liked: false, userIP: 'IP_TEST_'+i })
    question = { ...question, likes, likes_count: Object.keys(likes).length }
  }

  var savedQuestion = await fsQuestions.data(question.id)
  t.is(question.likes_count, savedQuestion.likes_count, 'likes_count should be 5')
  t.deepEqual(question.likes, savedQuestion.likes, 'likes should be correct')
  fsQuestions.delete(question.id)
})

test('Question can only be liked once for each user IP', async t => {
  var eventId = '3333'
  var question = Question({eventId, text:'This is a test question'})
  await saveQuestion(question)
  var savedQuestion = await fsQuestions.data(question.id)
  t.deepEqual(question.text, savedQuestion.text, 'question created')

  for (var i = 0; i < 5; i++) {
    var likes = await like({ ...question, liked: true, userIP: 'IP_TEST' })
    question = { ...question, likes, likes_count: Object.keys(likes).length }
  }
  var savedQuestion = await fsQuestions.data(question.id)
  t.is(question.likes_count, 1, 'Like count equal 1')
  t.is(question.likes_count, savedQuestion.likes_count, 'Saved likes_count is 1')
  t.deepEqual(question.likes, savedQuestion.likes, 'Saved likes is correct')
  fsQuestions.delete(question.id)
})

test('Max 3 questions can be highlighted', async t => {
  var eventId = '3334'
  var questions = []

  for (var i = 1; i <= 4; i++) {
    var question = Question({eventId, text:'This is a test question ' + i})
    await saveQuestion(question)
    var savedQuestion = await fsQuestions.data(question.id)
    t.deepEqual(question.text, savedQuestion.text, `Question ${i} created`)
    questions.push(savedQuestion)
  }

  for (var i = 0; i < 3; i++) {
    var question = questions[i]
    await highlight(question.id, true, question.eventId)
  }

  var err = await t.throws(async () => {
    var question = questions[3]
    await highlight(question.id, true, question.eventId)
	}, TypeError)

  t.is(err.message, 'Max 3 questions can be highlighted')

  for (var question of questions) {
    fsQuestions.delete(question.id)
  }
})
