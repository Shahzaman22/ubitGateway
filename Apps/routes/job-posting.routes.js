const express = require('express')
const router = express.Router()
const controller = require('../controllers/job-posting.controller')
const authMiddleware = require('../middleware/authMiddleware')
const admin =  require('../middleware/admin')


router.post('/posting', controller.jobPost);
router.get('/getPosts', controller.getJobPosts);
router.get('/getPost', controller.getJobPost);

module.exports = router;