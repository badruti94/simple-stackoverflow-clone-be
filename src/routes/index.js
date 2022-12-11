const express = require('express')
const router = express.Router()
const authRoute = require('../routes/auth')
const questionRoute = require('../routes/question')
const commentRoute = require('../routes/comment')

router.use('/auth', authRoute)
router.use('/questions', questionRoute)
router.use('/', commentRoute)

module.exports = router