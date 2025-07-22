if(process.env.NODE_ENV !== 'Production'){
    require("dotenv").config();
}
const SessionController = require('../controllers/SessionController');
const AIController = require('../controllers/AIController');
const ParticipantController = require('../controllers/ParticipantController');
const AuthController = require('../controllers/AuthController');
const errorHandler = require('./middlewares/errorHandler')
const authentication = require('./middlewares/authentication')
const express = require('express')
const app = express()



app.use(express.json())
app.use(express.urlencoded({extended: false}))

router.post('/register', AuthController.register);
router.post('/login', AuthController.login);


router.use(authentication);

router.post('/sessions', SessionController.create);
router.get('/sessions', SessionController.list);
router.get('/sessions/:id', SessionController.detail);
router.delete('/sessions/:id', SessionController.delete);

router.patch('/sessions/:sessionId/ai', AIController.generateRecommendation);

router.post('/participants', ParticipantController.join);
router.delete('/participants/:session_id', ParticipantController.leave);




app.use(errorHandler)

module.exports = app            