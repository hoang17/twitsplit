import test from 'ava'

import { getChunks } from '../lib/splitMessage'

test('Test message split', t => {
  var limit = 50
  var chunks = getChunks("I can't         \n   -                  believeeee\t- Tweeter now supports chunking  my messages, so I don't have  to do it myself..", limit)
  chunks.map(m => {
    t.true(m.length <= limit, 'message length should less than '+limit)
  })
  t.is(chunks.length, 3, 'chunks length should be correct')
})

test('Should check for a span of non-whitespace characters', t => {
  const err = t.throws(() => {
    var chunks = getChunks("I can't believeeee10\n\t- Tweeter now supports chunking  my messages, so I don't have  to do it myself..", 10)
	}, TypeError)
  t.is(err.message, 'Message contains a span of non-whitespace characters longer than 10 characters')
})

test('Should check for invalid message', t => {
  const err = t.throws(() => {
    var chunks = getChunks("", 10)
	}, TypeError)
  t.is(err.message, 'Invalid message')
})

test('Should check for invalid limit', t => {
  const err = t.throws(() => {
    var chunks = getChunks("I can't believeeee10\n\t- Tweeter now supports chunking  my messages, so I don't have  to do it myself..", 0)
	}, TypeError)
  t.is(err.message, 'Invalid limit')
})
