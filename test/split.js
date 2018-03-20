import test from 'ava'

import splitMessage from '../lib/splitMessage'

test('Test split', async t => {
  var chunks = splitMessage(`I can't         \n   -            believeqqq\t- Tweeter now supports chunking my messages, so I don't have to do it myself.`)

  console.log(chunks)

  chunks.map(m => {
    t.true(m.length <= 50, 'message length should less than 50')
    console.log(m.length)
  })
})
