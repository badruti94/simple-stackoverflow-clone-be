const express = require('express')
const { createComment, getComments, deleteComment, solveQuestion } = require('../controllers/comment')
const { isLogin } = require('../middleware/auth')
const router = express.Router()

router.post('/questions/:id/comments', isLogin, createComment)
router.get('/questions/:id/comments', getComments)
router.delete('/comments/:id', isLogin, deleteComment)
router.patch('/comments/:id/solve-question', isLogin, solveQuestion)

module.exports = router