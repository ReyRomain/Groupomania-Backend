const express = require('express');

/**
 * Middleware controller
 */
const userCtrl = require("../controllers/userCtrl");

/**
 * Middleware auth
 */
const auth = require("../middlewares/auth");

const router = express.Router();
 
router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login);
router.put('/modifyUser', auth, userCtrl.modifyUser);
router.delete('/deleteUser', auth, userCtrl.deleteUser);

module.exports = router;