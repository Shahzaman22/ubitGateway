let express = require("express");
let router = express.Router();

router.use('/users',require('./user.routes'))

module.exports = router;