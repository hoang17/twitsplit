var express = require('express')
var session = require('express-session')
var FileStore = require('session-file-store')(session)
var firebase = require('firebase-admin')
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

const firebaseServer = firebase.initializeApp({
  credential: firebase.credential.cert(require('./credentials/server')),
  databaseURL: "https://slido-7de82.firebaseio.com",
}, 'server')

const app = express()

// Express configuration.
var port = process.env.PORT || 3000
app.set('port', port)
app.use(session({
  secret: 'geheimnis',
  saveUninitialized: true,
  store: new FileStore({path: '/tmp/sessions', secret: 'geheimnis'}),
  resave: false,
  rolling: true,
  httpOnly: true,
  cookie: { maxAge: 604800000 } // week
}))
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
  app.use((req, res, next) => {
    req.firebaseServer = firebaseServer
    next()
  })

  app.post('/api/login', (req, res) => {
    if (!req.body) return res.sendStatus(400)

    const token = req.body.token
    firebaseServer.auth().verifyIdToken(token)
      .then((decodedToken) => {
        req.session.decodedToken = decodedToken
        return decodedToken
      })
      .then((decodedToken) => res.json({ status: true, decodedToken }))
      .catch((error) => res.json({ error }))
  })

  app.post('/api/logout', (req, res) => {
    req.session.decodedToken = null
    res.json({ status: true })
  })

  app.get('*', (req, res) => {
    return handle(req, res)
  })

  app.listen(port, (err) => {
    if (err) throw err
    console.log('%s App is running at http://localhost:%d in %s mode', green('✓'), port, app.get('env'))
  })
})
