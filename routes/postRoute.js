const express = require('express');

/**
 * Middleware controller
 */
const userCtrl = require("../controllers/userCtrl");

/**
 * Middleware auth
 */
const auth = require("../middlewares/auth");

/**
 * Middleware multer
 */
const multer = require("../middlewares/multer-config");

const router = express.Router();