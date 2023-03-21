const express = require('express')
const router = express.Router()
const controller = require('../controllers/user.controller')
const authMiddleware = require('../middleware/authMiddleware')


router.post('/create', controller.create)
router.post('/login' , controller.login)
router.get('/getAllUsers', [authMiddleware] , controller.get)
router.post('/forgetPassword' , controller.forgetPassword)
router.post('/resetPassword' , controller.resetPassword)


module.exports = router;