const defaultLimit = 50

function splitText(msg, limit){
  msg = msg.trim()
  if (msg.length <= limit)
    return { txt: msg }

  let txt = msg.slice(0, limit)
  let remain = msg.slice(limit)

  // Test if we break at whitespace
  if (/\s/.test(remain.charAt(0)))
    return { txt, remain }

  var index = txt.search(/ [^\s]*$/)
  if (index == -1) throw TypeError(`Message contains a span of non-whitespace characters longer than ${limit} characters`)
  txt = txt.slice(0, index)
  remain = msg.slice(index)
  return { txt, remain }
}

export function getChunks(msg, limit = defaultLimit){
  if (!msg || typeof msg !== 'string' || msg.trim().length == 0) throw TypeError('Invalid message')
  if (typeof limit !== 'number' || limit <= 0) throw TypeError('Invalid limit')

  msg = msg.trim()
  if (msg.length <= limit) return [msg]

  var chunks = []
  while(msg){
    var { txt, remain } = splitText(msg, limit)
    chunks.push(txt.trim())
    msg = remain
  }
  return chunks
}

export default function splitMessage(msg, limit = defaultLimit){
  var chunks = getChunks(msg, limit)
  var length = chunks.length
  return chunks.map((m, i) => `${i+1}/${length} ${m}`)
}

// var chunks = splitMessage("I can't         \n   -            believeqqq\t- Tweeter now supports chunking my messages, so I don't have to do it myself.")
// console.log(chunks)
