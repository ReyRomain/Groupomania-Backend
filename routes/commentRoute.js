const express = require('express');

/**
 * Middleware controller
 */
const commentCtrl = require("../controllers/commentCtrl");

/**
 * Middleware auth
 */
const auth = require("../middlewares/auth");

/**
 * Middleware multer
 */
const multer = require("../middlewares/multer-config");

const router = express.Router();

router.get("/", auth, commentCtrl.getAllComments);
router.post("/", auth, multer, commentCtrl.createComment);
router.put("/", auth, multer, commentCtrl.modifyComment);
router.delete("/", auth, commentCtrl.deleteComment);

module.exports = router;