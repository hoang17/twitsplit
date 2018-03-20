
function splitText(msg, limit){
  msg = msg.trim()
  if (msg.length <= limit)
    return { txt: msg }

  let txt = msg.slice(0, limit)
  let remain = msg.slice(limit)

  // Test if we break at whitespace
  if (/\s/.test(remain.charAt(0)))
    return { txt, remain }

  var index = txt.search(/[^\s]*$/)
  if (index == -1) throw TypeError('Message contains a span of non-whitespace characters longer than '+limit+' characters')
  txt = txt.slice(0, index)
  remain = msg.slice(index)
  return { txt, remain }
}

export default function splitMessage(msg, limit = 50){

  if (!msg || typeof msg !== 'string' || msg.trim().length == 0) throw TypeError('Invalid message')
  if (typeof limit !== 'number' || limit <= 0) throw TypeError('Invalid limit')

  var chunks = []
  while(msg){
    var { txt, remain } = splitText(msg, limit)
    chunks.push(txt.trim())
    msg = remain
  }
  return chunks.map((m, i) => (i+1)+'/'+''+m)
}
