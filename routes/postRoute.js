const express = require('express');

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

const router = express.Router();

router.get("/", auth, postCtrl.getAllPosts);
router.post("/", auth, multer, postCtrl.createPost);
router.put("/", auth, multer, postCtrl.modifyPost);
router.delete("/", auth, postCtrl.deletePost);

module.exports = router;