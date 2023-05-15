const express = require("express");
const router = express.Router();
const controller = require("../controllers/chat.controller");
const authMiddleware = require("../middleware/authMiddleware");
const admin = require("../middleware/admin");

//ROUTES
router.get("/", controller.get);
router.get("/executive", controller.getExecutive);
router.get("/engineer", controller.getEngineer);

module.exports = router;
