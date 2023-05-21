const express = require('express')
const router = express.Router()
const controller = require('../controllers/job-Application.controller')
const authMiddleware = require('../middleware/authMiddleware')
const admin =  require('../middleware/admin')
const { upload } =  require('../utils/multerConfig')

router.post('/application', [authMiddleware], upload.single('resume'), controller.post);

module.exports = router;