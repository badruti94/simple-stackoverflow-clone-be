const express = require('express')
const router = express.Router()
const {getAllQuestion, createQuestion, getQuestion, deleteQuestion} = require('../controllers/question')
const {isLogin} = require('../middleware/auth')

router.get('/', getAllQuestion)
router.post('/', isLogin, createQuestion)
router.get('/:id', getQuestion)
router.delete('/:id', isLogin, deleteQuestion)


module.exports = router