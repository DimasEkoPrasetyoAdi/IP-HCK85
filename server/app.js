const dotenv = require('dotenv')

dotenv.config()

const SessionController = require('./controllers/sessionController')
const PublicController = require('./controllers/PublicController')
const AIController = require('./controllers/AIController')
const ParticipantController = require('./controllers/ParticipantController')
const AuthController = require('./controllers/AuthController')
const errorHandler = require('./middlewares/errorHandler')
const authentication = require('./middlewares/authentication')
const express = require('express')
const app = express()
const cors = require('cors')


app.use(cors())

app.use(express.json())
app.use(express.urlencoded({extended: false}))

app.post('/register', AuthController.register)
app.post('/login', AuthController.login)
app.get('/pub', PublicController.list)
app.post('/google-login', AuthController.googleLogin)

app.use(authentication)
app.get('/sports', SessionController.SportList)
app.post('/sessions', SessionController.create)
app.get('/sessions', SessionController.list)
app.get('/sessions/:id', SessionController.detail)
app.put('/sessions/:id', SessionController.update)
app.delete('/sessions/:id', SessionController.delete)
app.patch('/sessions/:sessionId/ai', AIController.generateRecommendation)
app.post('/participants', ParticipantController.join)
app.delete('/participants/:session_id', ParticipantController.leave)




app.use(errorHandler)

module.exports = app            