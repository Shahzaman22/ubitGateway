const express = require('express')
const router = express.Router()
const controller = require('../controllers/job-Application.controller')
const authMiddleware = require('../middleware/authMiddleware')
const admin =  require('../middleware/admin')

router.post('/application', controller.post);

module.exports = router;