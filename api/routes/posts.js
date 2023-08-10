const express = require("express");
const router = express.Router();

const PostsController = require("../controllers/posts");

router.get("/", PostsController.Index);
router.post("/", PostsController.Create);
router.get("/user/:userId", PostsController.GetPostsByUserId);
router.delete("/:id", PostsController.DeleteById);
router.patch("/:id", PostsController.UpdateById);
module.exports = router;