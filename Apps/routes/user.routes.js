const express = require('express')
const router = express.Router()
const controller = require('../controllers/user.controller')
const authMiddleware = require('../middleware/authMiddleware')
const admin =  require('../middleware/admin')
const multer = require('multer');
const path = require('path');



const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads');
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  },
});


const upload = multer({ storage: storage });


router.post('/create',upload.single('img'), controller.create)
router.post('/login' , controller.login)
router.get('/getAllUsers', [authMiddleware] , [admin], controller.get)
router.get('/getSingleUser', [authMiddleware] , [ admin ], controller.getSingleUser)
router.post('/forgetPassword' , controller.forgetPassword)
router.post('/resetPassword' , controller.resetPassword)
router.post('/verifyOtp' , controller.verifyOtp)
router.put('/edit' , [authMiddleware] , controller.edit)
router.delete('/delete' , [authMiddleware] , [admin], controller.delete)





module.exports = router;