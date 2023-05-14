let express = require("express");
let router = express.Router();

router.use("/users", require("./user.routes"));
router.use("/auth", require("./auth.routes"));
router.use("/chat", require("./chat.routes"));

module.exports = router;
