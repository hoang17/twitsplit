const express = require('express')
var compression = require('compression')
var bodyParser = require('body-parser')
var morgan = require('morgan')
var { green } = require('chalk')
var errorHandler = require('errorhandler')
var lusca = require('lusca')
var dotenv = require('dotenv')
var path = require('path')
var helmet = require('helmet')

dotenv.load({ path: '.env' })

const app = express()

// Express configuration.
var port = process.env.PORT || 3000
app.set('port', port)
app.use(helmet())
app.use(compression())
app.use(morgan('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(errorHandler())
app.use(lusca.xframe('SAMEORIGIN'))
app.use(lusca.xssProtection(true))

const next = require('next')

const dev = process.env.NODE_ENV !== 'production'
const nx = next({ dev })
const handle = nx.getRequestHandler()

nx.prepare()
.then(() => {
  app.get('/posts/:id', (req, res) => {
    return nx.render(req, res, '/posts', { id: req.params.id })
  })

  app.get('*', (req, res) => {
    return handle(req, res)
  })

  app.listen(port, (err) => {
    if (err) throw err
    console.log('%s App is running at http://localhost:%d in %s mode', green('✓'), port, app.get('env'))
  })
})
