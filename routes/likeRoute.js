const express = require('express');

/**
 * Middleware controller
 */
const likeCtrl = require("../controllers/likeCtrl");

/**
 * Middleware auth
 */
const auth = require("../middlewares/auth");

const router = express.Router();

router.get("/", auth, likeCtrl.getAllLikes);
router.put("/", auth, likeCtrl.updateLikes);

module.exports = router;