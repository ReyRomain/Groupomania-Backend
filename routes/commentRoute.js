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

const router = require('express').Router();

router.get("/post/:id", auth, commentCtrl.getAllComments);
router.post("/post/createComment", auth, multer, commentCtrl.createComment);
router.put("/post/modifyComment", auth, multer, commentCtrl.modifyComment);
router.delete("/post/deleteComment", auth, commentCtrl.deleteComment);

module.exports = router;