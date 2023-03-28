const express = require('express')
const router = express.Router()
const controller = require('../controllers/user.controller')
const authMiddleware = require('../middleware/authMiddleware')


router.post('/create', controller.create)
router.post('/login' , controller.login)
router.get('/getAllUsers', [authMiddleware] , controller.get)
router.post('/forgetPassword' , controller.forgetPassword)
router.post('/resetPassword' , controller.resetPassword)
router.post('/verifyOtp' , controller.verifyOtp)
// router.put('/edit' , [authMiddleware] , controller.edit)
router.put('/edit' , [authMiddleware] , controller.edit)
router.delete('/delete' , [authMiddleware] , controller.delete)


module.exports = router;