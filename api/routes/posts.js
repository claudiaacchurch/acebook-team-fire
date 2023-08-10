const express = require("express");
const router = express.Router();

const PostsController = require("../controllers/posts");

router.get("/", PostsController.Index);
router.post("/", PostsController.Create);
router.get("/user/:userId", PostsController.GetPostsByUserId);
router.patch("/:id", PostsController.UpdateById);
router.delete("/:id", PostsController.DeleteById);
module.exports = router;