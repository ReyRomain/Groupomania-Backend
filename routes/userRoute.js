const express = require('express')

/**
 * Middleware controller
 */
const {login, signup} = require("../controllers/userCtrl");

/**
 * Middleware auth
 */
const auth = require("../middlewares/auth");

const router = express.Router();
 
router.post('/signup', signup);
router.post('/login', login);
 
module.exports = router;