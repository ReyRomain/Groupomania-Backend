/**
 * Middleware controller
 */
const likeCtrl = require("../controllers/likeCtrl");

/**
 * Middleware auth
 */
const auth = require("../middlewares/auth");

const router = require('express').Router();

router.get("/post/:id", auth, likeCtrl.getAllLikes);
router.put("/post/:id/updateLikes", auth, likeCtrl.updateLikes);

module.exports = router;