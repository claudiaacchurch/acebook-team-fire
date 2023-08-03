const express = require("express");
const router = express.Router();
const tokenChecker = require("../middleware/tokenChecker")


const UsersController = require("../controllers/users");

router.post("/", UsersController.Create);
router.get("/:id", tokenChecker, UsersController.GetUserByID)

module.exports = router;
