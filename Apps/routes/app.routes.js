let express = require("express");
let router = express.Router();

router.use('/users',require('./user.routes'))
router.use('/auth', require('./auth.routes'))
router.use('/job', require('./job-posting.routes'))


module.exports = router;