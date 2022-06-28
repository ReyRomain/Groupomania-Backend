/**
 * Middleware controller
 */
const postCtrl = require("../controllers/postCtrl");

/**
 * Middleware auth
 */
const auth = require("../middlewares/auth");

/**
 * Middleware multer
 */
const multer = require("../middlewares/multer-config");

const router = require('express').Router();

router.get("/getAllPosts", auth, postCtrl.getAllPosts);
router.get("/post/:id", auth, postCtrl.getAllLikes);
router.post("/createPost", auth, multer, postCtrl.createPost);
router.put("/modifyPost", auth, multer, postCtrl.modifyPost);
router.put("/post/:id/updateLikes", auth, postCtrl.updateLikes);
router.delete("/deletePost", auth, postCtrl.deletePost);

module.exports = router;