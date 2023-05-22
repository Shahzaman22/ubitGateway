const express = require('express')
const router = express.Router()
const controller = require('../controllers/user.controller')
const authMiddleware = require('../middleware/authMiddleware')
const admin =  require('../middleware/admin')
const { upload } = require('../utils/multerConfig')


//ROUTES
router.post('/create',upload.single('img'), controller.create)
router.post('/login' , controller.login)
router.get('/getAllUsers', [authMiddleware] , [admin], controller.get)
router.get('/getSingleUser', [authMiddleware] , [ admin ], controller.getSingleUser)
router.post('/forgetPassword' , controller.forgetPassword)
router.post('/resetPassword' , controller.resetPassword)
router.post('/verifyOtp' , controller.verifyOtp)
router.post('/verification' , controller.verification)
router.put('/edit' , [authMiddleware] , controller.edit)
router.delete('/delete' , [authMiddleware] , [admin], controller.delete)
router.post('/experience' , [authMiddleware] ,  controller.experience)
router.post('/education' , [authMiddleware] ,  controller.education)
router.post('/personalDetails' , [authMiddleware] ,upload.single('picture'),  controller.personalDetails)





module.exports = router;